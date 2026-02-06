# Quick Start: Deploy to Vercel

## Fastest Way to Deploy (3 steps)

### Step 1: Ensure your code is on GitHub
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push
```

### Step 2: Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "Add New" → "Project"
4. Select this repository

### Step 3: Deploy
Click "Deploy" - Vercel handles the rest!

Your app will be live at: `https://your-project.vercel.app`

## What Happens Automatically

✅ Vercel detects it's a Vite project  
✅ Installs dependencies  
✅ Runs `npm run build`  
✅ Deploys the `dist` folder  
✅ Configures routing for React Router  
✅ Provides HTTPS certificate  
✅ Sets up continuous deployment

## Testing Before Deploy

```bash
# Build the project
npm run build

# Test the production build locally
npm run preview
```

Visit `http://localhost:4173` to verify everything works.

## Need Help?

- 📖 [Full Deployment Guide](./DEPLOYMENT.md)
- 🌐 [Vercel Documentation](https://vercel.com/docs)
- ❓ [Troubleshooting](#troubleshooting)

## Common Issues

**Build fails?**  
→ Run `npm run build` locally to debug

**Routes not working?**  
→ Already fixed! The `vercel.json` handles SPA routing

**Need a custom domain?**  
→ Add it in Vercel dashboard → Settings → Domains

---

**Ready to deploy?** [Start here →](https://vercel.com/new)
