# 🎥 Enhanced Media Structure - Images + Videos

## 📱 New Structure Overview

```
public/assets/
├── media-manifest.json          # Master manifest (images + videos)
├── images/
│   ├── baras_binurong-point_01.jpg
│   ├── baras_binurong-point_02.jpg
│   ├── virac_museo-de-catanduanes_01.jpg
│   └── ...
├── videos/
│   ├── baras_binurong-point_01.mp4
│   ├── baras_binurong-point_01_720p.mp4  (optional quality variants)
│   ├── virac_puraran-beach_01.mp4
│   └── ...
└── thumbnails/  (optional - for video thumbnails)
    ├── baras_binurong-point_01_thumb.jpg
    └── ...
```

## 🎯 Why `public/` Instead of `src/`?

### ✅ **Advantages for Raspberry Pi:**

1. **No Build Processing**
   - Videos/images served directly without Vite bundling
   - Faster development and deployment
   - No memory spike during build

2. **Better Performance**
   - Direct file serving = faster load times
   - No webpack/Vite overhead
   - Ideal for large video files (50MB+)

3. **Easier Management**
   - Add/remove media without rebuilding
   - Simple file operations
   - Works great with SD cards

4. **CDN-Ready**
   - Easy to move to external storage later
   - Can use Cloudflare/CDN without code changes
   - Just update manifest paths

### ❌ **Why NOT `src/`:**

- Vite will try to optimize/bundle large files
- Increases build time significantly
- RPi may run out of memory during build
- Unnecessary processing for already-optimized media

---

## 📝 Naming Convention

### Images:
```
{municipality}_{spot-slug}_{number}.{ext}

Examples:
- baras_binurong-point_01.jpg
- baras_binurong-point_02.png
- virac_museo-de-catanduanes_01.webp
```

### Videos:
```
{municipality}_{spot-slug}_{number}[_quality].{ext}

Examples:
- baras_binurong-point_01.mp4          (default quality)
- baras_binurong-point_01_720p.mp4    (HD quality)
- baras_binurong-point_01_480p.mp4    (SD quality)
- pandan_hinik-hinik-falls_01.mp4
```

---

## 🚀 Usage Examples

### 1. Using the Enhanced Hook

```jsx
import useSpotMedia from './hooks/useSpotMedia';

function TouristSpotDetail({ municipality, spotName }) {
  const { 
    images, 
    videos, 
    thumbnail, 
    hasVideo, 
    mediaCount, 
    loading 
  } = useSpotMedia(municipality, spotName);

  if (loading) return <div>Loading media...</div>;

  return (
    <div>
      <h2>{spotName}</h2>
      
      {/* Show thumbnail */}
      {thumbnail && <img src={thumbnail} alt={spotName} />}
      
      {/* Media counts */}
      <p>{mediaCount.images} photos, {mediaCount.videos} videos</p>
      
      {/* Display images */}
      <div className="gallery">
        {images.map((img, i) => (
          <img key={i} src={img} alt={`${spotName} ${i+1}`} />
        ))}
      </div>
      
      {/* Display videos */}
      {hasVideo && (
        <div className="videos">
          {videos.map((vid, i) => (
            <video key={i} controls src={vid} />
          ))}
        </div>
      )}
    </div>
  );
}
```

### 2. Using the Gallery Component

```jsx
import SpotMediaGallery from './components/SpotMediaGallery';

function SpotPage() {
  return (
    <div>
      {/* Automatically shows images and videos with tabs */}
      <SpotMediaGallery 
        municipality="BARAS" 
        spotName="Binurong Point" 
      />
    </div>
  );
}
```

### 3. Getting Spots with Videos

```jsx
import { getSpotsWithVideos } from './hooks/useSpotMedia';

const spotsWithVideos = await getSpotsWithVideos('BARAS');
console.log(spotsWithVideos);
// [
//   { municipality: 'BARAS', name: 'Binurong Point', videoCount: 2 },
//   { municipality: 'BARAS', name: 'Puraran Beach', videoCount: 1 }
// ]
```

---

## 📊 Manifest Structure

```json
{
  "version": "1.0.0",
  "config": {
    "imagePath": "/assets/images",
    "videoPath": "/assets/videos",
    "thumbnailPath": "/assets/thumbnails",
    "supportedImageFormats": ["jpg", "jpeg", "png", "webp"],
    "supportedVideoFormats": ["mp4", "webm"],
    "videoQuality": {
      "1080p": "_1080p",
      "720p": "_720p",
      "480p": "_480p"
    }
  },
  "spots": {
    "BARAS": {
      "Binurong Point": {
        "media": {
          "images": [
            "baras_binurong-point_01.jpg",
            "baras_binurong-point_02.jpg"
          ],
          "videos": [
            "baras_binurong-point_01.mp4"
          ],
          "thumbnail": "baras_binurong-point_01.jpg",
          "featured": "baras_binurong-point_01.jpg"
        },
        "categories": ["VIEWPOINT", "NATURE"],
        "hasVideo": true,
        "mediaCount": {
          "images": 2,
          "videos": 1,
          "total": 3
        }
      }
    }
  },
  "statistics": {
    "totalMunicipalities": 1,
    "totalSpots": 16,
    "spotsWithMedia": 1,
    "totalImages": 2,
    "totalVideos": 1,
    "totalMediaFiles": 3
  }
}
```

---

## ➕ Adding New Media

### Adding Images:

```bash
# 1. Add image with proper naming
cp ~/my-photo.jpg public/assets/images/baras_new-spot_01.jpg

# 2. Update media-manifest.json
# Add to "images" array in the spot's media object

# 3. Commit
git add public/assets/
git commit -m "Added images for New Spot"
```

### Adding Videos:

```bash
# 1. Add video with proper naming
cp ~/my-video.mp4 public/assets/videos/baras_new-spot_01.mp4

# 2. (Optional) Add different quality versions
cp ~/my-video-720p.mp4 public/assets/videos/baras_new-spot_01_720p.mp4

# 3. Update media-manifest.json
{
  "media": {
    "videos": ["baras_new-spot_01.mp4"],
    ...
  },
  "hasVideo": true,
  "mediaCount": { "videos": 1, ... }
}

# 4. Commit
git add public/assets/
git commit -m "Added video for New Spot"
```

---

## 🎬 Video Optimization for Raspberry Pi

### Recommended Video Specs:

```
Resolution: 720p (1280x720) - Best balance for RPi
Codec: H.264 (MP4)
Bitrate: 2-3 Mbps
Frame rate: 30fps
Audio: AAC, 128kbps
```

### Converting Videos (FFmpeg):

```bash
# Convert to RPi-optimized format
ffmpeg -i input.mp4 \
  -vf scale=1280:720 \
  -c:v libx264 \
  -b:v 2M \
  -c:a aac \
  -b:a 128k \
  -movflags +faststart \
  baras_binurong-point_01.mp4

# Create 480p version for slower connections
ffmpeg -i input.mp4 \
  -vf scale=854:480 \
  -c:v libx264 \
  -b:v 1M \
  -c:a aac \
  -b:a 128k \
  -movflags +faststart \
  baras_binurong-point_01_480p.mp4
```

---

## 🛠️ Performance Tips

### 1. Lazy Load Videos
```jsx
<video preload="metadata" ...>  {/* Don't use preload="auto" */}
```

### 2. Use Video Thumbnails
```jsx
<video poster={thumbnail} ...>  {/* Shows image until play */}
```

### 3. Implement Quality Selection
```jsx
import { getVideoQuality } from './hooks/useSpotMedia';

const video720p = await getVideoQuality('baras_binurong-point_01.mp4', '720p');
const video480p = await getVideoQuality('baras_binurong-point_01.mp4', '480p');
```

### 4. Compress Images
```bash
# Use WebP format for smaller file sizes
cwebp -q 80 input.jpg -o baras_binurong-point_01.webp
```

---

## 📊 Performance Comparison

| Media Type | File Size | Load Time (RPi 4) | Notes |
|------------|-----------|-------------------|-------|
| JPG (1920x1080) | ~500KB | 0.3s | Good |
| WebP (1920x1080) | ~200KB | 0.15s | Better |
| MP4 720p (30s) | ~15MB | 1.5s | Acceptable |
| MP4 1080p (30s) | ~35MB | 3.5s | Slow on RPi |

**Recommendation:** Use 720p videos and WebP images for best RPi performance.

---

## 🔄 Migration Checklist

- [ ] Pull latest changes: `git pull origin main`
- [ ] Create directories:
  ```bash
  mkdir -p public/assets/images
  mkdir -p public/assets/videos
  mkdir -p public/assets/thumbnails
  ```
- [ ] Move Binurong Point images to new structure
- [ ] Update manifest with your media
- [ ] Test with `SpotMediaGallery` component
- [ ] Optimize videos with FFmpeg
- [ ] Delete old `src/assets/{municipality}` folders
- [ ] Commit and push changes

---

## 📚 Related Files

- **Master Manifest**: [`public/assets/media-manifest.json`](./public/assets/media-manifest.json)
- **Enhanced Hook**: [`src/hooks/useSpotMedia.js`](./src/hooks/useSpotMedia.js)
- **Gallery Component**: [`src/components/SpotMediaGallery.jsx`](./src/components/SpotMediaGallery.jsx)
- **Old Image Hook**: [`src/hooks/useSpotImages.js`](./src/hooks/useSpotImages.js) (deprecated)

---

## ❓ FAQ

**Q: Can I still use images in `src/assets`?**  
A: Not recommended. Use `public/assets/` for all media files.

**Q: What video formats are supported?**  
A: MP4 (H.264) and WebM. MP4 has best browser support.

**Q: How do I generate video thumbnails?**  
A: Use FFmpeg:
```bash
ffmpeg -i video.mp4 -ss 00:00:01 -vframes 1 thumbnail.jpg
```

**Q: Can I host videos externally (YouTube, Vimeo)?**  
A: Yes! Just add the URL in the manifest and handle it in your component.

---

**Ready to migrate?** Follow the checklist above and you're all set! 🚀
