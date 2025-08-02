# 🚀 AI English Tutor Avatar - Deployment Guide

This guide covers deploying the AI English Tutor Avatar application to various hosting platforms.

## 📋 Pre-Deployment Checklist

- [x] React application builds successfully (`npm run build`)
- [x] HeyGen avatar integration working
- [x] Speech recognition and TTS functionality implemented
- [x] CheckpointEnglish.com integration configured
- [x] Responsive design tested
- [x] Demo and features page completed

## 🌐 Deployment Options

### 1. Netlify (Recommended)

**Quick Deploy:**
1. Push your code to GitHub repository
2. Connect your repository to Netlify
3. Build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
   - Node version: 18

**Manual Deploy:**
```bash
# Build the project
npm run build

# Install Netlify CLI
npm install -g netlify-cli

# Deploy to Netlify
netlify deploy --prod --dir=build
```

### 2. Vercel

**GitHub Integration:**
1. Push code to GitHub
2. Import project on Vercel
3. Vercel auto-detects React settings

**CLI Deploy:**
```bash
# Install Vercel CLI
npm install -g vercel

# Build and deploy
npm run build
vercel --prod
```

### 3. GitHub Pages

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json scripts:
"homepage": "https://yourusername.github.io/ai-english-tutor",
"predeploy": "npm run build",
"deploy": "gh-pages -d build"

# Deploy
npm run deploy
```

### 4. Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and init
firebase login
firebase init hosting

# Build and deploy
npm run build
firebase deploy
```

### 5. Amazon S3 + CloudFront

```bash
# Build the project
npm run build

# Sync to S3 bucket
aws s3 sync build/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## ⚙️ Environment Configuration

### Environment Variables

Create `.env` file for local development:
```env
REACT_APP_HEYGEN_AVATAR_ID=Thaddeus_ProfessionalLook2_public
REACT_APP_CHECKPOINT_URL=https://checkpointenglish.com
REACT_APP_API_BASE_URL=https://api.checkpointenglish.com
```

### Production Environment Variables

For production deployment, set these variables in your hosting platform:

**Netlify:**
- Go to Site Settings → Environment Variables
- Add the environment variables

**Vercel:**
- Go to Project Settings → Environment Variables
- Add the variables for Production environment

**Heroku:**
```bash
heroku config:set REACT_APP_HEYGEN_AVATAR_ID=Thaddeus_ProfessionalLook2_public
heroku config:set REACT_APP_CHECKPOINT_URL=https://checkpointenglish.com
```

## 🔧 Build Optimization

### Performance Optimizations

1. **Bundle Analysis:**
```bash
npm install --save-dev webpack-bundle-analyzer
npm run build
npx webpack-bundle-analyzer build/static/js/*.js
```

2. **Code Splitting:**
```javascript
// Lazy load components
const DemoPage = React.lazy(() => import('./components/DemoPage'));

// Wrap in Suspense
<Suspense fallback={<div>Loading...</div>}>
  <DemoPage />
</Suspense>
```

3. **Image Optimization:**
- Use WebP format for images
- Implement lazy loading for images
- Compress images before deployment

### Caching Strategy

Add to `public/_headers` (Netlify) or equivalent:
```
/*
  Cache-Control: public, max-age=31536000
  
/static/js/*
  Cache-Control: public, max-age=31536000, immutable
  
/static/css/*
  Cache-Control: public, max-age=31536000, immutable
  
/*.html
  Cache-Control: public, max-age=0, must-revalidate
```

## 🔐 Security Considerations

### Content Security Policy

Add to `public/index.html`:
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://labs.heygen.com;
  frame-src 'self' https://labs.heygen.com;
  connect-src 'self' https://labs.heygen.com https://checkpointenglish.com;
  img-src 'self' data: https:;
  style-src 'self' 'unsafe-inline';
  font-src 'self' data:;
">
```

### HTTPS Enforcement

Ensure your hosting platform serves content over HTTPS:
- Netlify: Automatic HTTPS
- Vercel: Automatic HTTPS
- Custom domains: Configure SSL certificates

## 📊 Monitoring & Analytics

### Error Tracking

Add Sentry for error tracking:
```bash
npm install @sentry/react

# In src/index.js
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: process.env.NODE_ENV,
});
```

### Performance Monitoring

Add Google Analytics:
```html
<!-- In public/index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🚨 Troubleshooting

### Common Issues

**1. HeyGen Avatar Not Loading:**
- Check CORS settings
- Verify avatar ID is correct
- Ensure HTTPS is enabled

**2. Speech Recognition Not Working:**
- Verify HTTPS (required for microphone access)
- Check browser compatibility
- Test microphone permissions

**3. Build Failures:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Update dependencies
npm update
```

**4. Routing Issues (SPA):**
Add `_redirects` file to `public/` directory:
```
/* /index.html 200
```

### Browser Support

**Supported Browsers:**
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

**Speech Recognition Support:**
- Chrome: Full support
- Firefox: Limited support
- Safari: Partial support
- Edge: Full support

## 📱 Mobile Testing

Test on various devices:
```bash
# Use Chrome DevTools
# Test on actual devices
# Use BrowserStack for comprehensive testing
```

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test -- --coverage --watchAll=false
    
    - name: Build
      run: npm run build
      env:
        REACT_APP_HEYGEN_AVATAR_ID: ${{ secrets.HEYGEN_AVATAR_ID }}
        REACT_APP_CHECKPOINT_URL: ${{ secrets.CHECKPOINT_URL }}
    
    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v1.2
      with:
        publish-dir: './build'
        production-branch: main
        github-token: ${{ secrets.GITHUB_TOKEN }}
        deploy-message: "Deploy from GitHub Actions"
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 📋 Post-Deployment Tasks

1. **Test all functionality:**
   - HeyGen avatar interaction
   - Speech recognition
   - Voice synthesis
   - CheckpointEnglish integration
   - Mobile responsiveness

2. **Monitor performance:**
   - Page load times
   - Core Web Vitals
   - Error rates
   - User engagement

3. **Update documentation:**
   - Share deployment URL
   - Update README with live demo link
   - Document any configuration changes

## 🌟 Production URLs

Once deployed, update these URLs in your documentation:

- **Live Demo:** `https://your-app-url.com`
- **CheckpointEnglish Integration:** `https://checkpointenglish.com`
- **HeyGen Avatar:** `https://labs.heygen.com/interactive-avatar/share?share=...`

---

## 📞 Support

For deployment issues:
1. Check the troubleshooting section above
2. Review hosting platform documentation
3. Check browser console for errors
4. Test in different browsers and devices

**Happy Deploying! 🚀**