#!/bin/bash

# Comprehensive theme fix for all pages
cd /c/Users/pppgg/Desktop/hash/frontend/src/pages

echo "Applying comprehensive theme fixes..."

# Fix all remaining color issues across all pages
for file in FAQ.jsx SizeGuide.jsx Business.jsx Shipping.jsx Returns.jsx; do
    echo "Fixing $file..."
    
    # Border fixes
    sed -i 's/border-gray-200/border-border/g' "$file"
    sed -i 's/border-gray-300/border-border/g' "$file"
    sed -i 's/border-gray-100/border-border/g' "$file"
    
    # Background fixes  
    sed -i 's/bg-gray-50/bg-card/g' "$file"
    sed -i 's/bg-gray-100/bg-card/g' "$file"
    sed -i 's/hover:bg-gray-50/hover:bg-card/g' "$file"
    sed -i 's/hover:bg-gray-100/hover:bg-card/g' "$file"
    sed -i 's/hover:bg-gray-800/hover:bg-muted/g' "$file"
    
    # Text color fixes
    sed -i 's/text-black/text-foreground/g' "$file"
    sed -i 's/text-gray-500/text-muted-foreground/g' "$file"
    sed -i 's/text-gray-600/text-muted-foreground/g' "$file"
    sed -i 's/text-gray-700/text-foreground/g' "$file"
    sed -i 's/text-gray-800/text-foreground/g' "$file"
    sed -i 's/text-gray-900/text-foreground/g' "$file"
    
    # Button fixes
    sed -i 's/border-black text-black hover:bg-black hover:text-white/border-border text-foreground hover:bg-card/g' "$file"
    sed -i 's/bg-black hover:bg-gray-800/bg-hash-purple hover:bg-hash-purple\/90/g' "$file"
    
    echo "$file fixed!"
done

echo "All theme fixes completed!"
