#!/bin/bash
# Automated script to fix marker styling in MapView.jsx
# Run this from the root of Pathfinder-new repository

set -e

echo "Applying marker styling fixes to MapView.jsx..."

# Navigate to repository root
cd "$(git rev-parse --show-toplevel)"

# Ensure we're on the fix branch
git checkout fix/marker-styling-black-white

# Apply all 5 fixes using sed
sed -i 's/border-radius: 16px; overflow: hidden; background-color: white; border: 3px solid white;/border-radius: 50%; overflow: hidden; background-color: #000000; border: 3px solid #000000; min-width: 60px; min-height: 60px; max-width: 60px; max-height: 60px;/g' src/components/MapView.jsx

sed -i 's/background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: 3px solid white;/background-color: #000000; border: 3px solid #000000; min-width: 60px; min-height: 60px; max-width: 60px; max-height: 60px;/g' src/components/MapView.jsx

sed -i 's/font-size: 32px; color: white;/font-size: 28px; color: #ffffff;/g' src/components/MapView.jsx

sed -i 's/background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex;/background-color: #000000; min-width: 24px; min-height: 24px; max-width: 24px; max-height: 24px; display: flex;/g' src/components/MapView.jsx

sed -i 's/font-size: 12px; color: white;/font-size: 12px; color: #ffffff;/g' src/components/MapView.jsx

echo "✅ All 5 marker styling fixes applied!"
echo ""
echo "Changes made:"
echo "  • Black backgrounds (#000000) for all markers"
echo "  • White icons (#ffffff) for better contrast"
echo "  • Perfect circles (border-radius: 50%)"
echo "  • Fixed sizes to prevent zoom scaling"
echo "  • Optimized icon size (28px)"
echo ""
echo "Committing changes..."
git add src/components/MapView.jsx
git commit -m "Fix marker styling: black background, white icons, fixed zoom size"

echo "✅ Changes committed!"
echo ""
echo "Pushing to remote..."
git push origin fix/marker-styling-black-white

echo "✅ Pushed to remote!"
echo ""
echo "Merging to main..."
git checkout main
git merge fix/marker-styling-black-white -m "Merge marker styling fixes: black/white theme with fixed zoom size"
git push origin main

echo ""
echo "✅ ALL DONE! Marker fixes merged to main branch."
echo ""
echo "You can now delete the fix branch:"
echo "  git branch -d fix/marker-styling-black-white"
echo "  git push origin --delete fix/marker-styling-black-white"
