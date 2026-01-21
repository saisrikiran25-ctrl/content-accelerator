# Deployment Guide for GitHub Pages

## Prerequisites
All code changes have been committed and pushed to the repository.

## Steps to Deploy

### 1. Merge This PR
Merge the `copilot/remove-analytics-tab` branch into your `main` branch.

### 2. Configure GitHub Repository Secrets
Go to your GitHub repository: `Settings` → `Secrets and variables` → `Actions` → `New repository secret`

Add the following secrets (get values from your `.env` file):
- **VITE_SUPABASE_URL**: Your Supabase project URL
- **VITE_SUPABASE_PUBLISHABLE_KEY**: Your Supabase publishable/anon key  
- **VITE_SUPABASE_PROJECT_ID**: Your Supabase project ID

### 3. Enable GitHub Pages
1. Go to repository `Settings` → `Pages`
2. Under "Build and deployment":
   - **Source**: Select "GitHub Actions"
3. Save the settings

### 4. Trigger Deployment
The deployment will automatically trigger when you:
- Push to the `main` branch
- Or manually trigger via `Actions` tab → `Deploy to GitHub Pages` → `Run workflow`

### 5. Access Your Site
After successful deployment (takes 2-5 minutes), your site will be available at:
```
https://saisrikiran25-ctrl.github.io/content-accelerator/
```

## Troubleshooting

### Build Fails
- Check that all secrets are correctly set in repository settings
- Verify `.env` file values are correct
- Check the Actions tab for detailed error logs

### Site Shows 404
- Ensure GitHub Pages is enabled with "GitHub Actions" as source
- Wait 5-10 minutes after first deployment
- Check that `base` path in `vite.config.ts` matches repository name

### Supabase Connection Issues
- Verify all three Supabase secrets are set correctly
- Ensure Supabase project is active and accessible
- Check Supabase dashboard for any API restrictions

## Local Testing
To test the production build locally:
```bash
npm run build
npm run preview
```

## Notes
- The site will redeploy automatically on every push to `main` branch
- Build artifacts are stored in the `dist` folder (excluded from git)
- All environment variables must be prefixed with `VITE_` to be accessible in the browser
