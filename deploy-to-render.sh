#!/bin/bash

# Deployment script for Render
echo "🚀 Starting Render deployment..."

# Replace API key placeholder in index.html
echo "🔑 Setting up API key..."
sed -i 's/\[API_KEY_TO_BE_REPLACED\]/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/g' index.html

# Build the project
echo "🔨 Building project..."
npm run build

echo "✅ Deployment ready!"