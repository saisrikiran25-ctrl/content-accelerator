# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

### Option 1: Deploy with Lovable
Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

### Option 2: Deploy to GitHub Pages (Free) ✅ CONFIGURED

**Good news!** This repository is already configured for automatic GitHub Pages deployment with embedded environment variables. No secrets configuration required!

#### How it works:
1. **Automatic Deployment**: Every push to `main` branch triggers a deployment
2. **Environment Variables**: The workflow embeds the Supabase credentials during build (these are public anon keys, safe to expose)
3. **Error Handling**: The app includes error boundaries to show helpful messages if anything goes wrong

#### To deploy:
1. **Enable GitHub Pages**:
   - Go to **Settings** → **Pages**
   - Set **Source** to **GitHub Actions**

2. **Push changes or trigger manually**:
   - Push to `main` branch, or
   - Go to **Actions** tab → **Deploy to GitHub Pages** → **Run workflow**

3. **Access your site**:
   - Your site will be live at: `https://saisrikiran25-ctrl.github.io/content-accelerator/`

#### Alternative: Using GitHub Secrets (Optional)
If you want to use different Supabase credentials or keep them in secrets:
1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add these secrets:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `VITE_SUPABASE_PROJECT_ID`
3. Update `.github/workflows/deploy.yml` to use `${{ secrets.VARIABLE_NAME }}` instead of inline values

📖 **[See detailed deployment guide →](./DEPLOYMENT.md)**

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
