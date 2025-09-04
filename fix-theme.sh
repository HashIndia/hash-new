#!/bin/bash

# Fix dark theme issues in all pages
cd /c/Users/pppgg/Desktop/hash/frontend/src/pages

echo "Fixing FAQ.jsx..."
sed -i 's/bg-white/bg-background/g' FAQ.jsx
sed -i 's/bg-black text-white/bg-gradient-to-br from-hash-dark via-background to-card text-foreground border-b border-border/g' FAQ.jsx
sed -i 's/text-gray-300/text-muted-foreground/g' FAQ.jsx
sed -i 's/text-gray-400/text-muted-foreground/g' FAQ.jsx

echo "Fixing SizeGuide.jsx..."
sed -i 's/bg-white/bg-background/g' SizeGuide.jsx
sed -i 's/bg-black text-white/bg-gradient-to-br from-hash-dark via-background to-card text-foreground border-b border-border/g' SizeGuide.jsx
sed -i 's/text-gray-300/text-muted-foreground/g' SizeGuide.jsx
sed -i 's/text-gray-400/text-muted-foreground/g' SizeGuide.jsx

echo "Fixing Business.jsx..."
sed -i 's/bg-white/bg-background/g' Business.jsx
sed -i 's/bg-black text-white/bg-gradient-to-br from-hash-dark via-background to-card text-foreground border-b border-border/g' Business.jsx
sed -i 's/text-gray-300/text-muted-foreground/g' Business.jsx
sed -i 's/text-gray-400/text-muted-foreground/g' Business.jsx

echo "Fixing Shipping.jsx..."
sed -i 's/bg-white/bg-background/g' Shipping.jsx
sed -i 's/bg-black text-white/bg-gradient-to-br from-hash-dark via-background to-card text-foreground border-b border-border/g' Shipping.jsx
sed -i 's/text-gray-300/text-muted-foreground/g' Shipping.jsx
sed -i 's/text-gray-400/text-muted-foreground/g' Shipping.jsx

echo "Fixing Returns.jsx..."
sed -i 's/bg-white/bg-background/g' Returns.jsx
sed -i 's/bg-black text-white/bg-gradient-to-br from-hash-dark via-background to-card text-foreground border-b border-border/g' Returns.jsx
sed -i 's/text-gray-300/text-muted-foreground/g' Returns.jsx
sed -i 's/text-gray-400/text-muted-foreground/g' Returns.jsx

echo "Theme fixes completed!"
