#!/usr/bin/env python3
"""
Migration script to convert nested folder structure to flat image structure.
Run this locally in your repository.

Usage:
    python scripts/migrate_to_flat_structure.py
"""

import os
import shutil
import json
from pathlib import Path
import re

# Configuration
OLD_ASSETS_DIR = "src/assets"
NEW_ASSETS_DIR = "public/assets/images"
MANIFEST_PATH = "public/assets/images/manifest.json"

def slugify(text):
    """Convert text to URL-friendly slug."""
    text = text.lower()
    text = re.sub(r'[^a-z0-9]+', '-', text)
    text = text.strip('-')
    return text

def load_geojson_spots():
    """Load all tourist spots from GeoJSON files."""
    geojson_dir = Path("public/data")
    spots = {}
    
    for geojson_file in geojson_dir.glob("*.geojson"):
        municipality = geojson_file.stem.upper()
        
        with open(geojson_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        spots[municipality] = {}
        
        for feature in data.get('features', []):
            props = feature['properties']
            spot_name = props['name']
            categories = props.get('categories', [])
            
            spots[municipality][spot_name] = {
                "images": [],
                "thumbnail": None,
                "categories": categories
            }
    
    return spots

def migrate_images():
    """Migrate images from nested folders to flat structure."""
    old_dir = Path(OLD_ASSETS_DIR)
    new_dir = Path(NEW_ASSETS_DIR)
    
    # Create new directory
    new_dir.mkdir(parents=True, exist_ok=True)
    
    migrated_files = {}
    
    # Iterate through municipality folders
    for municipality_dir in old_dir.iterdir():
        if not municipality_dir.is_dir() or municipality_dir.name == 'images':
            continue
            
        municipality = municipality_dir.name.replace(' ', '_').upper()
        
        # Iterate through spot folders
        for spot_dir in municipality_dir.iterdir():
            if not spot_dir.is_dir():
                continue
                
            spot_name = spot_dir.name.replace('_', ' ')
            spot_slug = slugify(spot_name)
            municipality_slug = slugify(municipality)
            
            spot_images = []
            
            # Copy all image files
            image_count = 1
            for image_file in spot_dir.iterdir():
                if image_file.suffix.lower() in ['.jpg', '.jpeg', '.png', '.webp', '.gif']:
                    # Generate new filename
                    ext = image_file.suffix
                    new_filename = f"{municipality_slug}_{spot_slug}_{image_count:02d}{ext}"
                    new_path = new_dir / new_filename
                    
                    # Copy file
                    shutil.copy2(image_file, new_path)
                    print(f"Copied: {image_file} -> {new_path}")
                    
                    spot_images.append(new_filename)
                    image_count += 1
            
            if spot_images:
                if municipality not in migrated_files:
                    migrated_files[municipality] = {}
                migrated_files[municipality][spot_name] = spot_images
    
    return migrated_files

def generate_manifest(migrated_files, spots_from_geojson):
    """Generate manifest.json."""
    manifest = {
        "version": "1.0.0",
        "lastUpdated": "2026-01-03T14:41:00Z",
        "description": "Image manifest for HapiHub tourist spots in Catanduanes",
        "spots": {}
    }
    
    # Merge data from GeoJSON and migrated images
    for municipality, spots in spots_from_geojson.items():
        manifest["spots"][municipality] = {}
        
        for spot_name, spot_data in spots.items():
            # Check if we have images for this spot
            images = []
            thumbnail = None
            
            if municipality in migrated_files and spot_name in migrated_files[municipality]:
                images = migrated_files[municipality][spot_name]
                thumbnail = images[0] if images else None
            
            manifest["spots"][municipality][spot_name] = {
                "images": images,
                "thumbnail": thumbnail,
                "categories": spot_data["categories"]
            }
    
    return manifest

def main():
    print("=" * 60)
    print("Image Structure Migration Tool")
    print("=" * 60)
    print()
    
    # Step 1: Load spots from GeoJSON
    print("[1/4] Loading tourist spots from GeoJSON files...")
    spots_from_geojson = load_geojson_spots()
    total_spots = sum(len(spots) for spots in spots_from_geojson.values())
    print(f"      Loaded {total_spots} spots from {len(spots_from_geojson)} municipalities")
    print()
    
    # Step 2: Migrate images
    print("[2/4] Migrating images to flat structure...")
    migrated_files = migrate_images()
    total_images = sum(len(images) for municipality in migrated_files.values() for images in municipality.values())
    print(f"      Migrated {total_images} images")
    print()
    
    # Step 3: Generate manifest
    print("[3/4] Generating manifest.json...")
    manifest = generate_manifest(migrated_files, spots_from_geojson)
    
    manifest_path = Path(MANIFEST_PATH)
    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    
    with open(manifest_path, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)
    
    print(f"      Manifest saved to: {manifest_path}")
    print()
    
    # Step 4: Summary
    print("[4/4] Migration Summary:")
    print(f"      Total municipalities: {len(manifest['spots'])}")
    print(f"      Total tourist spots: {total_spots}")
    print(f"      Spots with images: {len([s for m in migrated_files.values() for s in m.keys()])}")
    print(f"      Total images: {total_images}")
    print()
    print("✓ Migration completed successfully!")
    print()
    print("Next steps:")
    print("  1. Review the migrated images in: public/assets/images/")
    print("  2. Delete old folders: rm -rf src/assets/Baras src/assets/Virac ...")
    print("  3. Commit changes: git add . && git commit -m 'Migrated to flat structure'")
    print()

if __name__ == "__main__":
    main()
