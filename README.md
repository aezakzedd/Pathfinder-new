# Vite + React + Tailwind CSS

This project uses the **latest** versions of:
- Vite
- React
- Tailwind CSS (with @tailwindcss/postcss plugin)
- Lucide React (for icons)

## Setup
```bash
npm install
npm run dev
```

## Structure
- `/src/pages/Explore` - Explore page with black background
- `/src/components/FloatingCard` - Reusable floating card component with:
  - 90% viewport size (90vw x 90vh)
  - White border (1px)
  - Rounded corners (24px)
  - Transparent background
  - Accepts children and custom props

## Notes
- `.gitignore` is included and ready for GitHub upload
- `node_modules` and build outputs are excluded
- Tailwind CSS is configured with PostCSS
