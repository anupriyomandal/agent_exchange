const express = require('express');
const { PrismaClient } = require('@prisma/client');
const multer = require('multer');
const slugify = require('slugify');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Use memory storage so we can convert to base64
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    const allowed = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PNG, JPG, and SVG files are allowed'));
    }
  },
});

// All admin routes require auth
router.use(authMiddleware);

function generateSlug(name) {
  return slugify(name, { lower: true, strict: true });
}

// GET /api/admin/agents
router.get('/agents', async (req, res) => {
  try {
    const agents = await prisma.agent.findMany({
      orderBy: { created_at: 'desc' },
      include: {
        reviews: { select: { rating: true } },
      },
    });

    const result = agents.map((a) => ({
      ...a,
      avg_rating:
        a.reviews.length > 0
          ? parseFloat((a.reviews.reduce((sum, r) => sum + r.rating, 0) / a.reviews.length).toFixed(1))
          : null,
      review_count: a.reviews.length,
      reviews: undefined,
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/admin/agents
router.post('/agents', upload.single('icon'), async (req, res) => {
  const { name, short_description, long_description, category, channels, channel_links, status } = req.body;

  if (!name || !short_description || !long_description || !category) {
    return res.status(400).json({ error: 'name, short_description, long_description, and category are required' });
  }

  try {
    let slug = generateSlug(name);
    // Ensure unique slug
    const existing = await prisma.agent.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    let icon_url = null;
    if (req.file) {
      icon_url = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    }

    const parsedChannels = typeof channels === 'string' ? JSON.parse(channels) : channels || [];
    const parsedChannelLinks = typeof channel_links === 'string' ? JSON.parse(channel_links) : channel_links || {};

    const agent = await prisma.agent.create({
      data: {
        name,
        slug,
        short_description,
        long_description,
        icon_url,
        category,
        channels: parsedChannels,
        channel_links: parsedChannelLinks,
        status: status || 'draft',
        created_by: req.user.id,
      },
    });

    res.status(201).json(agent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/admin/agents/:id
router.put('/agents/:id', upload.single('icon'), async (req, res) => {
  const { name, short_description, long_description, category, channels, channel_links, status } = req.body;

  try {
    const existing = await prisma.agent.findUnique({ where: { id: req.params.id } });
    if (!existing) return res.status(404).json({ error: 'Agent not found' });

    let icon_url = existing.icon_url;
    if (req.file) {
      icon_url = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    }

    const parsedChannels = channels
      ? typeof channels === 'string'
        ? JSON.parse(channels)
        : channels
      : existing.channels;

    const parsedChannelLinks = channel_links
      ? typeof channel_links === 'string'
        ? JSON.parse(channel_links)
        : channel_links
      : existing.channel_links;

    const agent = await prisma.agent.update({
      where: { id: req.params.id },
      data: {
        ...(name ? { name } : {}),
        ...(short_description ? { short_description } : {}),
        ...(long_description ? { long_description } : {}),
        ...(category ? { category } : {}),
        icon_url,
        channels: parsedChannels,
        channel_links: parsedChannelLinks,
        ...(status ? { status } : {}),
      },
    });

    res.json(agent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/admin/agents/:id
router.delete('/agents/:id', async (req, res) => {
  try {
    await prisma.agent.delete({ where: { id: req.params.id } });
    res.json({ message: 'Agent deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// PATCH /api/admin/agents/:id/status
router.patch('/agents/:id/status', async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['draft', 'pending_review', 'published', 'archived'];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Valid status required: draft, pending_review, published, archived' });
  }

  try {
    const agent = await prisma.agent.update({
      where: { id: req.params.id },
      data: { status },
    });
    res.json(agent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/admin/reviews
router.get('/reviews', async (req, res) => {
  const { agent_id } = req.query;
  try {
    const reviews = await prisma.review.findMany({
      where: agent_id ? { agent_id } : {},
      orderBy: { created_at: 'desc' },
      include: {
        agent: { select: { id: true, name: true, slug: true } },
      },
    });
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/admin/reviews/:id
router.delete('/reviews/:id', async (req, res) => {
  try {
    await prisma.review.delete({ where: { id: req.params.id } });
    res.json({ message: 'Review deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
