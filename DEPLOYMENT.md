# GitHub Pages Deployment Guide

This guide will help you deploy your Content Accelerator app to GitHub Pages.

## 📋 Overview

Your repository is already configured with:
- ✅ GitHub Actions workflow (`.github/workflows/deploy.yml`)
- ✅ Vite configuration with correct base path
- ✅ Build scripts in `package.json`

You just need to configure GitHub repository settings and secrets!

## 🚀 Quick Start (5 Minutes)

### Step 1: Configure GitHub Repository Secrets

1. Go to your GitHub repository at: `https://github.com/saisrikiran25-ctrl/content-accelerator`
2. Click on **Settings** (top menu)
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret** button
5. Add the following three secrets one by one:

   **Secret 1:**
   - Name: `VITE_SUPABASE_URL`
   - Value: `https://qharssnwpweoiderjylv.supabase.co`

   **Secret 2:**
   - Name: `VITE_SUPABASE_PUBLISHABLE_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFoYXJzc253cHdlb2lkZXJqeWx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg5NTU2NjcsImV4cCI6MjA4NDUzMTY2N30.EZ3ybieLZcH94QQtNvBHJZeQNeTiL6eXfbpghp6U7Ok`

   **Secret 3:**
   - Name: `VITE_SUPABASE_PROJECT_ID`
   - Value: `qharssnwpweoiderjylv`

### Step 2: Enable GitHub Pages

1. In your repository, go to **Settings** → **Pages** (left sidebar)
2. Under **Build and deployment**:
   - **Source**: Select **GitHub Actions** (from the dropdown)
3. Click **Save** (if button appears)

### Step 3: Deploy Your Site

You have two options:

**Option A: Automatic Deployment (Recommended)**
1. Merge this pull request or push any changes to the `main` branch
2. GitHub Actions will automatically build and deploy your site

**Option B: Manual Deployment**
1. Go to the **Actions** tab in your repository
2. Click on **Deploy to GitHub Pages** workflow (left sidebar)
3. Click **Run workflow** button (on the right)
4. Select the `main` branch
5. Click the green **Run workflow** button

### Step 4: Access Your Live Site

After deployment completes (usually 2-5 minutes):
- Your site will be live at: **https://saisrikiran25-ctrl.github.io/content-accelerator/**
- You'll see a green checkmark ✓ in the Actions tab when deployment succeeds

## 📊 Monitoring Deployments

### Check Deployment Status
1. Go to **Actions** tab in your repository
2. Click on the most recent workflow run
3. View build logs and deployment progress

### Deployment States
- 🟡 **Yellow dot**: Deployment in progress
- ✅ **Green checkmark**: Deployment successful
- ❌ **Red X**: Deployment failed (check logs)

## 🔧 Troubleshooting

### Build Fails
**Problem**: Build fails in GitHub Actions
**Solution**:
1. Check the Actions tab for detailed error logs
2. Verify all three secrets are correctly set in Settings → Secrets
3. Ensure secret values don't have extra spaces or quotes
4. Try running `npm run build` locally to identify issues

### 404 Error After Deployment
**Problem**: Site shows 404 or blank page
**Solution**:
1. Verify GitHub Pages is set to **GitHub Actions** source
2. Wait 5-10 minutes after first deployment
3. Check that the deployment workflow completed successfully
4. Clear your browser cache and try again

### Supabase Connection Issues
**Problem**: App loads but data doesn't work
**Solution**:
1. Verify all three Supabase secrets are set correctly
2. Check your Supabase project dashboard for any API restrictions
3. Ensure your Supabase project is active (not paused)

### Assets Not Loading (CSS/JS)
**Problem**: Site loads but looks broken
**Solution**:
1. Verify `vite.config.ts` has `base: "/content-accelerator/"` for production
2. Check browser console for 404 errors on assets
3. Redeploy the site

## 🧪 Local Testing

Test your production build locally before deploying:

```bash
# Build the production version
npm run build

# Preview the production build
npm run preview
```

Then visit `http://localhost:4173` to see how it will look when deployed.

## 🔄 Continuous Deployment

After initial setup:
- Every push to `main` branch automatically triggers a new deployment
- Pull requests can be previewed by manually triggering the workflow
- Deployment typically takes 2-3 minutes

## 📝 Important Notes

### Environment Variables
- All environment variables must be prefixed with `VITE_` to work in the browser
- Secrets are stored securely and not exposed in the code
- Never commit the `.env` file to the repository

### Build Artifacts
- Build artifacts are in the `dist/` folder
- This folder is git-ignored and automatically generated
- GitHub Actions creates a fresh build each deployment

### Custom Domain (Optional)
If you want to use a custom domain instead of `*.github.io`:
1. Go to Settings → Pages
2. Enter your custom domain in the "Custom domain" field
3. Follow GitHub's instructions to configure DNS

## 🎉 Success Checklist

- [ ] Repository secrets configured (3 secrets)
- [ ] GitHub Pages enabled with "GitHub Actions" source
- [ ] Workflow run completed successfully
- [ ] Site accessible at https://saisrikiran25-ctrl.github.io/content-accelerator/
- [ ] All features working (test login, data loading, etc.)

## 📞 Getting Help

If you encounter issues:
1. Check the Actions tab for detailed logs
2. Review this troubleshooting guide
3. Check the [GitHub Pages documentation](https://docs.github.com/en/pages)
4. Verify your Supabase project is active

---

**Next Steps**: After deployment, share your live site with others! 🚀
