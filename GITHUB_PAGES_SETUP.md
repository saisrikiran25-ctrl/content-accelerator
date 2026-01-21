# 🚀 GitHub Pages Setup - Quick Start

Follow these 3 simple steps to deploy your app to GitHub Pages!

## ⚡ Step 1: Add Secrets (2 minutes)

1. Go to your repository: https://github.com/saisrikiran25-ctrl/content-accelerator
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret** and add each of these (values from your `.env` file):

```
Name: VITE_SUPABASE_URL
Value: https://qharssnwpweoiderjylv.supabase.co
```

```
Name: VITE_SUPABASE_PUBLISHABLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoYXJzc253cHdlb2lkZXJqeWx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5NTU2NjcsImV4cCI6MjA4NDUzMTY2N30.EZ3ybieLZcH94QQtNvBHJZeQNeTiL6eXfbpghp6U7Ok
```

```
Name: VITE_SUPABASE_PROJECT_ID
Value: qharssnwpweoiderjylv
```

> 💡 **Note**: These are your project's Supabase credentials. The publishable key is safe to use in client-side code.

## 🌐 Step 2: Enable GitHub Pages (1 minute)

1. Go to **Settings** → **Pages**
2. Under **Build and deployment**, set **Source** to: **GitHub Actions**
3. Click **Save**

## 🎯 Step 3: Deploy (1 minute)

Choose one option:

**Option A - Automatic:**
- Merge this PR or push to `main` branch
- Deployment happens automatically

**Option B - Manual:**
1. Go to **Actions** tab
2. Click **Deploy to GitHub Pages** (left sidebar)
3. Click **Run workflow** → Select `main` → Click **Run workflow**

## ✅ Done!

Your site will be live in 2-5 minutes at:
### 🌍 https://saisrikiran25-ctrl.github.io/content-accelerator/

---

**Need help?** See the [detailed deployment guide](./DEPLOYMENT.md) for troubleshooting.
