# Marker Styling Fix Instructions

## Apply these 5 find-and-replace operations in `src/components/MapView.jsx`:

### Fix 1: Popular markers with images
**Find:**
```
border-radius: 16px; overflow: hidden; background-color: white; border: 3px solid white;
```
**Replace with:**
```
border-radius: 50%; overflow: hidden; background-color: #000000; border: 3px solid #000000; min-width: 60px; min-height: 60px; max-width: 60px; max-height: 60px;
```

### Fix 2: Popular markers without images
**Find:**
```
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border: 3px solid white;
```
**Replace with:**
```
background-color: #000000; border: 3px solid #000000; min-width: 60px; min-height: 60px; max-width: 60px; max-height: 60px;
```

### Fix 3: Icon size for popular markers
**Find:**
```
font-size: 32px; color: white;
```
**Replace with:**
```
font-size: 28px; color: #ffffff;
```

### Fix 4: Simple markers
**Find:**
```
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex;
```
**Replace with:**
```
background-color: #000000; min-width: 24px; min-height: 24px; max-width: 24px; max-height: 24px; display: flex;
```

### Fix 5: Simple marker icon color
**Find:**
```
font-size: 12px; color: white;
```
**Replace with:**
```
font-size: 12px; color: #ffffff;
```

## Result
- ✅ Black backgrounds (#000000)
- ✅ White icons (#ffffff)
- ✅ Perfect circles (border-radius: 50%)
- ✅ Fixed sizes (prevent zoom scaling)
- ✅ Smaller icon (28px) fits better
