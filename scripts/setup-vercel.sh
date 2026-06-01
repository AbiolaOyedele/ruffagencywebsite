#!/bin/bash
# ─────────────────────────────────────────────────────────────
# setup-vercel.sh
# Links this project to Vercel and pushes all environment
# variables automatically. Run once after `vercel login`.
# ─────────────────────────────────────────────────────────────

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

echo ""
echo "🔗  Linking project to Vercel..."
vercel link --yes

echo ""
echo "🔑  Adding environment variables..."

add_env() {
  local key="$1"
  local value="$2"
  local env="$3"  # production, preview, development
  echo "    → $key ($env)"
  echo "$value" | vercel env add "$key" "$env" --force 2>/dev/null || \
  vercel env rm "$key" "$env" --yes 2>/dev/null; echo "$value" | vercel env add "$key" "$env"
}

# ── Supabase ──────────────────────────────────────────────────
SUPABASE_URL="https://ajpzbntxooowpnwgkhcu.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqcHpibnR4b29vd3Bud2draGN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5MDAxNzMsImV4cCI6MjA5MTQ3NjE3M30.d7C8T_SLQ5s83dT1OTSAlseMAWZsy8PxvHDfJZW-aRM"
SUPABASE_SERVICE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqcHpibnR4b29vd3Bud2draGN1Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTkwMDE3MywiZXhwIjoyMDkxNDc2MTczfQ.ag3F59OeLrkIm1OwKQw114lXwEkGrMsibmNEB7x8amU"

for env in production preview development; do
  echo "$SUPABASE_URL"        | vercel env add NEXT_PUBLIC_SUPABASE_URL        "$env" --force
  echo "$SUPABASE_ANON_KEY"   | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY   "$env" --force
  echo "$SUPABASE_SERVICE_KEY"| vercel env add SUPABASE_SERVICE_ROLE_KEY       "$env" --force
done

# ── Cloudinary ────────────────────────────────────────────────
CLOUDINARY_NAME="diud4qb2x"
CLOUDINARY_PRESET="ruff_admin"
CLOUDINARY_API_KEY="517682552775962"
CLOUDINARY_API_SECRET="zKnB4H2ZY-5AFWh2KESQAnZ0Pzk"

for env in production preview development; do
  echo "$CLOUDINARY_NAME"      | vercel env add NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME    "$env" --force
  echo "$CLOUDINARY_PRESET"    | vercel env add NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET "$env" --force
  echo "$CLOUDINARY_API_KEY"   | vercel env add CLOUDINARY_API_KEY                   "$env" --force
  echo "$CLOUDINARY_API_SECRET"| vercel env add CLOUDINARY_API_SECRET                "$env" --force
done

# ── Revalidation ─────────────────────────────────────────────
REVALIDATE_SECRET="ruff-revalidate-secret-2026"

for env in production preview development; do
  echo "$REVALIDATE_SECRET" | vercel env add REVALIDATE_SECRET          "$env" --force
  echo "$REVALIDATE_SECRET" | vercel env add WEBSITE_REVALIDATE_SECRET  "$env" --force
done

# WEBSITE_URL — set to production URL, update after first deploy
echo "https://ruffagencywebsite.vercel.app" | vercel env add WEBSITE_URL production --force
echo "https://ruffagencywebsite.vercel.app" | vercel env add WEBSITE_URL preview    --force
echo "http://localhost:3001"                | vercel env add WEBSITE_URL development --force

echo ""
echo "✅  All environment variables added."
echo ""
echo "🚀  Deploying to Vercel..."
vercel --prod

echo ""
echo "🎉  Done! Your site is live."
echo "    Update WEBSITE_URL in Vercel settings to your actual domain once confirmed."
