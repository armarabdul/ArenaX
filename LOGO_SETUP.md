# Logo Setup Instructions

## 📸 Adding Your Logo

### Step 1: Add Logo File
1. Place your logo image in: `frontend/public/logo.png`
   - Supported formats: `.png`, `.jpg`, `.jpeg`, `.svg`, `.webp`
   - Recommended: PNG with transparent background
   - Recommended size: 800x200px or larger (will be scaled down)

### Step 2: File Naming
The code expects the logo at: `frontend/public/logo.png`

If your logo has a different name or format, update these files:
- `frontend/src/components/Shared/Navbar.js` (line ~31)
- `frontend/src/components/Public/PublicHome.js` (line ~18)

Change `/logo.png` to your filename (e.g., `/arenax-logo.png`)

### Step 3: Verify
1. Start the frontend: `cd frontend && npm start`
2. Check the homepage - logo should appear
3. Check the navbar - logo should appear

---

## 🎨 Logo Specifications

### Recommended Dimensions
- **Navbar**: 200-300px width, 40-60px height
- **Homepage**: 600-800px width, 150-200px height
- **Format**: PNG with transparent background (best quality)

### File Location
```
frontend/
  public/
    logo.png  ← Place your logo here
```

### Alternative Formats
If using different format, update the `src` attribute:
- SVG: `/logo.svg`
- JPG: `/logo.jpg`
- WebP: `/logo.webp`

---

## 🔧 Customization

### Navbar Logo Size
Edit `frontend/src/components/Shared/Navbar.js`:
```jsx
className="h-10 md:h-12 w-auto object-contain"
// Change h-10 and h-12 to adjust height
```

### Homepage Logo Size
Edit `frontend/src/components/Public/PublicHome.js`:
```jsx
className="h-32 md:h-48 lg:h-64 w-auto mx-auto object-contain"
// Change h-32, h-48, h-64 to adjust height
```

### Add Hover Effects
Add to className:
```jsx
className="h-10 md:h-12 w-auto object-contain hover:opacity-80 transition-opacity"
```

---

## ✅ Current Implementation

The logo is now configured to:
- ✅ Display in navbar (responsive sizing)
- ✅ Display on homepage (large, centered)
- ✅ Fallback to "ARENAX" text if image not found
- ✅ Maintain aspect ratio
- ✅ Work on all screen sizes

---

## 🐛 Troubleshooting

### Logo Not Showing
1. Check file is in `frontend/public/` folder
2. Verify filename matches (case-sensitive)
3. Check browser console for 404 errors
4. Clear browser cache (Ctrl+F5)

### Logo Too Big/Small
- Adjust height classes in the components
- Use `max-w-` classes to limit width

### Logo Looks Blurry
- Use higher resolution image
- Use SVG format for crisp scaling
- Ensure image is at least 2x the display size

---

**After adding your logo file, restart the frontend server to see changes!**

