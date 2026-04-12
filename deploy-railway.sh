#!/bin/bash
set -e

echo "🚀 Agent Exchange — Railway deployment setup"
echo "============================================"

# ── 1. Install Railway CLI if missing ────────────────────────────────────────
if ! command -v railway &> /dev/null; then
  echo "📦 Installing Railway CLI..."
  npm install -g @railway/cli
else
  echo "✅ Railway CLI already installed ($(railway --version))"
fi

# ── 2. Login ─────────────────────────────────────────────────────────────────
echo ""
echo "🔐 Logging into Railway (a browser window will open)..."
railway login

# ── 3. Create project ────────────────────────────────────────────────────────
echo ""
echo "📁 Creating Railway project..."
railway init --name "agent-exchange"

# ── 4. Add PostgreSQL database ───────────────────────────────────────────────
echo ""
echo "🐘 Adding PostgreSQL database..."
railway add --database postgres

echo "⏳ Waiting for database to provision..."
sleep 5

# ── 5. Set environment variables ─────────────────────────────────────────────
echo ""
echo "🔧 Setting environment variables..."

JWT_SECRET=$(openssl rand -hex 32)
railway variables --set "JWT_SECRET=$JWT_SECRET"
railway variables --set "FRONTEND_URL=https://placeholder.vercel.app"

echo "✅ JWT_SECRET set (auto-generated)"
echo "ℹ️  FRONTEND_URL is set to a placeholder — update it after Vercel deploy"

# ── 6. Link to GitHub repo and deploy ────────────────────────────────────────
echo ""
echo "🔗 Linking to GitHub repo and deploying..."
railway link --repo "anupriyomandal/agent_exchange" --branch main

echo ""
echo "🚢 Deploying (this may take 2-3 minutes)..."
railway up --service agent-exchange --detach

# ── 7. Print backend URL ─────────────────────────────────────────────────────
echo ""
echo "✅ Deployment kicked off!"
echo ""
echo "📋 Next steps:"
echo "   1. Run: railway open    — to watch the deploy logs in your browser"
echo "   2. Once deployed, get your backend URL with: railway domain"
echo "   3. Use that URL as VITE_API_URL when deploying the frontend to Vercel"
echo ""
echo "To update FRONTEND_URL after Vercel deploy, run:"
echo "   railway variables --set \"FRONTEND_URL=https://your-app.vercel.app\""
