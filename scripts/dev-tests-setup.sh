#!/bin/bash
echo "Generating templates..."
node scripts/generate-templates.js
echo "Creating testing widget..."
npx create-react-widget test-widget -y
cd test-widget
echo "Running vite"
npm run dev &