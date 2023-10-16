#!/bin/bash
node scripts/generate-templates.js
npx create-react-widget test-widget -y
cd test-widget
npm run dev