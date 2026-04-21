const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Last-known-good cache for the agents list, keyed by query string.
// Serves stale data when the DB is transiently unreachable so the catalog
// doesn't go blank on brief Railway internal-network blips.
const listCache = new Map();

// GET /api/agents
router.get('/', async (req, res) => {
  const { category, search, sort } = req.query;
  const cacheKey = JSON.stringify({ category: category || '', search: search || '', sort: sort || '' });

  try {
    const where = {
      status: 'published',
      ...(category && category !== 'all' ? { category } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { short_description: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const orderBy =
      sort === 'newest'
        ? { created_at: 'desc' }
        : sort === 'likes'
        ? { likes_count: 'desc' }
        : { created_at: 'desc' };

    const agents = await prisma.agent.findMany({
      where,
      orderBy,
      select: {
        id: true,
        slug: true,
        name: true,
        category: true,
        icon_url: true,
        short_description: true,
        likes_count: true,
        channels: true,
        created_at: true,
        reviews: { select: { rating: true } },
      },
    });

    const result = agents.map((a) => {
      const { reviews, ...rest } = a;
      return {
        ...rest,
        avg_rating:
          reviews.length > 0
            ? parseFloat((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1))
            : null,
        review_count: reviews.length,
      };
    });

    listCache.set(cacheKey, { data: result, cachedAt: Date.now() });
    res.json(result);
  } catch (err) {
    console.error('GET /api/agents failed:', err.code || err.message);
    const cached = listCache.get(cacheKey);
    if (cached) {
      res.set('X-Cache', 'stale');
      res.set('X-Cached-At', new Date(cached.cachedAt).toISOString());
      return res.json(cached.data);
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/agents/:slug
router.get('/:slug', async (req, res) => {
  try {
    const agent = await prisma.agent.findUnique({
      where: { slug: req.params.slug },
      include: {
        reviews: { orderBy: { created_at: 'desc' } },
        admin: { select: { name: true } },
      },
    });

    if (!agent || agent.status !== 'published') {
      return res.status(404).json({ error: 'Agent not found' });
    }

    const avg_rating =
      agent.reviews.length > 0
        ? parseFloat((agent.reviews.reduce((sum, r) => sum + r.rating, 0) / agent.reviews.length).toFixed(1))
        : null;

    res.json({
      ...agent,
      avg_rating,
      review_count: agent.reviews.length,
      created_by_name: agent.creator_name || agent.admin?.name || null,
      admin: undefined,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/agents/:slug/like
router.post('/:slug/like', async (req, res) => {
  try {
    const agent = await prisma.agent.findUnique({ where: { slug: req.params.slug } });
    if (!agent || agent.status !== 'published') {
      return res.status(404).json({ error: 'Agent not found' });
    }

    const updated = await prisma.agent.update({
      where: { slug: req.params.slug },
      data: { likes_count: { increment: 1 } },
    });

    res.json({ likes_count: updated.likes_count });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/agents/:slug/reviews
router.post('/:slug/reviews', async (req, res) => {
  const { reviewer_name, rating, comment } = req.body;

  if (!reviewer_name || !rating || !comment) {
    return res.status(400).json({ error: 'reviewer_name, rating, and comment are required' });
  }

  const ratingNum = parseInt(rating);
  if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }

  try {
    const agent = await prisma.agent.findUnique({ where: { slug: req.params.slug } });
    if (!agent || agent.status !== 'published') {
      return res.status(404).json({ error: 'Agent not found' });
    }

    const review = await prisma.review.create({
      data: {
        agent_id: agent.id,
        reviewer_name,
        rating: ratingNum,
        comment,
      },
    });

    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
