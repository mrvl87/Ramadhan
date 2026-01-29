#!/usr/bin/env python3
"""
Generate emotional images for Gift Ideas feature using fal.ai
Uses nano-banana model for fast, high-quality generation
"""

import os
import fal_client
from supabase import create_client, Client
from datetime import datetime
import requests
from typing import Dict, List
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env.local
env_path = Path(__file__).parent.parent / '.env.local'
load_dotenv(dotenv_path=env_path)

# Configuration
SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
FAL_KEY = os.getenv("FAL_KEY")

# Initialize clients
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Image generation prompts based on emotional design spec
EMOTIONAL_PROMPTS = {
    # Hero images
    "hero_background": {
        "prompt": "Warm Indonesian family gathering during Ramadan, soft golden hour lighting, beautiful Islamic patterns in background, warm gold and cream color palette, gentle and loving atmosphere, photorealistic, 16:9 aspect ratio, high quality",
        "title": "Hero Background - Family Warmth"
    },
    
    "hero_moment_joy": {
        "prompt": "Indonesian Muslim mother opening a gift with tears of joy, warm embrace with adult child, Ramadan decorations in background, emotional and heartwarming, soft lighting, photorealistic, warm tones",
        "title": "Emotional Moment - Mother's Joy"
    },
    
    # Recipient type illustrations
    "recipient_parent": {
        "prompt": "Elderly Indonesian Muslim parents sitting together, warm smile, reading Al-Quran, traditional Indonesian home setting, respectful and loving atmosphere, warm lighting, photorealistic, soft focus",
        "title": "Wizard - Parents Recipient",
        "recipient_type": "parent"
    },
    
    "recipient_spouse": {
        "prompt": "Indonesian Muslim couple holding hands, warm and loving gaze, traditional but modern clothing, Ramadan crescent moon in background, romantic but respectful, soft pink and gold tones, photorealistic",
        "title": "Wizard - Spouse Recipient",
        "recipient_type": "spouse"
    },
    
    "recipient_child": {
        "prompt": "Indonesian Muslim child smiling joyfully, holding a beautifully wrapped gift, Eid decorations in background, pure happiness and innocence, bright and warm colors, photorealistic",
        "title": "Wizard - Child Recipient",
        "recipient_type": "child"
    },
    
    "recipient_sibling": {
        "prompt": "Indonesian Muslim siblings laughing together, warm bond and friendship, modern Indonesian home, playful but respectful, warm natural lighting, photorealistic",
        "title": "Wizard - Sibling Recipient",
        "recipient_type": "sibling"
    },
    
    "recipient_friend": {
        "prompt": "Indonesian Muslim friends sharing moment together, respectful distance, warm smiles, modern casual setting, friendly and comfortable atmosphere, natural lighting, photorealistic",
        "title": "Wizard - Friend Recipient",
        "recipient_type": "friend"
    },
    
    "recipient_colleague": {
        "prompt": "Indonesian Muslim professionals in respectful workplace interaction, warm handshake, modern office with Islamic elements, professional but friendly, natural lighting, photorealistic",
        "title": "Wizard - Colleague Recipient",
        "recipient_type": "colleague"
    },
    
    "recipient_religious_leader": {
        "prompt": "Respectful Indonesian Muslim ustadz or imam, wise and kind expression, mosque setting, traditional Islamic attire, serene and spiritual atmosphere, warm lighting, photorealistic",
        "title": "Wizard - Religious Leader",
        "recipient_type": "religious_leader"
    },
    
    # Emotional moments
    "joy_unwrapping": {
        "prompt": "Indonesian Muslim family member unwrapping gift with genuine surprise and joy, hands opening beautiful wrapping paper, emotional facial expression, warm indoor lighting, close-up shot, photorealistic",
        "title": "Joy Moment - Unwrapping"
    },
    
    "joy_embrace": {
        "prompt": "Warm embrace between Indonesian Muslim family members after gift exchange, tears of happiness, Ramadan decorations, emotional and touching moment, soft warm lighting, photorealistic",
        "title": "Joy Moment - Grateful Embrace"
    },
    
    # Ramadan spiritual imagery
    "ramadan_prayer": {
        "prompt": "Indonesian Muslim person praying on beautiful sajadah during Ramadan, peaceful and spiritual atmosphere, soft natural light through window, Islamic prayer items nearby, serene and contemplative, photorealistic",
        "title": "Ramadan - Prayer Moment"
    },
    
    "ramadan_quran": {
        "prompt": "Beautifully open Al-Quran on wooden stand with soft light, Indonesian mosque interior in background, peaceful Ramadan night atmosphere, warm golden lighting, spiritual and serene, photorealistic",
        "title": "Ramadan - Quran Reading"
    },
    
    # Testimonial visuals
    "testimonial_daughter": {
        "prompt": "Young Indonesian Muslim woman smiling warmly at camera, holding smartphone showing video call, emotional and genuine expression, modern home setting, natural lighting, photorealistic portrait",
        "title": "Testimonial - Daughter Story"
    }
}

def generate_image_with_fal(prompt: str, image_key: str) -> Dict:
    """Generate image using fal.ai flux model"""
    
    print(f"🎨 Generating image: {image_key}")
    print(f"📝 Prompt: {prompt[:100]}...")
    
    try:
        # Set FAL_KEY
        os.environ["FAL_KEY"] = FAL_KEY
        
        # Call fal.ai flux/schnell model (fast, high-quality)
        handler = fal_client.submit(
            "fal-ai/flux/schnell",
            arguments={
                "prompt": prompt,
                "image_size": "landscape_16_9",
                "num_inference_steps": 4,
                "num_images": 1,
                "enable_safety_checker": True
            }
        )
        
        # Wait for result
        result = handler.get()
        
        # Get image URL
        image_url = result["images"][0]["url"]
        width = result["images"][0].get("width", 1024)
        height = result["images"][0].get("height", 576)
        
        print(f"✅ Generated: {image_url}")
        
        return {
            "url": image_url,
            "width": width,
            "height": height
        }
        
    except Exception as e:
        print(f"❌ Error generating {image_key}: {str(e)}")
        raise

def upload_to_supabase_storage(image_url: str, image_key: str) -> Dict:
    """Download image and upload to Supabase storage"""
    
    print(f"📤 Uploading {image_key} to Supabase...")
    
    try:
        # Download image
        response = requests.get(image_url)
        response.raise_for_status()
        image_data = response.content
        
        # Upload to Supabase storage
        storage_path = f"gift-ideas/emotional/{image_key}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.jpg"
        
        result = supabase.storage.from_("images").upload(
            storage_path,
            image_data,
            {"content-type": "image/jpeg"}
        )
        
        # Get public URL
        public_url = supabase.storage.from_("images").get_public_url(storage_path)
        
        print(f"✅ Uploaded to: {storage_path}")
        
        return {
            "storage_path": storage_path,
            "public_url": public_url,
            "file_size": len(image_data)
        }
        
    except Exception as e:
        print(f"❌ Error uploading {image_key}: {str(e)}")
        raise

def save_to_database(image_key: str, image_data: Dict, upload_data: Dict, metadata: Dict):
    """Save image metadata to database"""
    
    print(f"💾 Saving {image_key} to database...")
    
    try:
        # Determine image type from key
        if "hero" in image_key:
            image_type = "hero_background" if "background" in image_key else "hero_moment"
        elif "recipient" in image_key:
            image_type = "wizard_recipient"
        elif "joy" in image_key:
            image_type = "joy_moment"
        elif "ramadan" in image_key:
            image_type = "ramadan_spiritual"
        elif "testimonial" in image_key:
            image_type = "testimonial_visual"
        else:
            image_type = "hero_background"
        
        # Insert to database
        result = supabase.table("gift_emotional_images").insert({
            "image_type": image_type,
            "title": metadata.get("title", image_key),
            "description": metadata.get("description"),
            "prompt_used": metadata.get("prompt"),
            "storage_path": upload_data["storage_path"],
            "public_url": upload_data["public_url"],
            "width": image_data["width"],
            "height": image_data["height"],
            "file_size": upload_data["file_size"],
            "recipient_type": metadata.get("recipient_type"),
            "is_active": True
        }).execute()
        
        print(f"✅ Saved to database: {result.data[0]['id']}")
        
        return result.data[0]
        
    except Exception as e:
        print(f"❌ Error saving {image_key} to database: {str(e)}")
        raise

def generate_all_emotional_images():
    """Generate all emotional images for Gift Ideas feature"""
    
    print("🚀 Starting emotional image generation...")
    print(f"📊 Total images to generate: {len(EMOTIONAL_PROMPTS)}\n")
    
    results = []
    
    for image_key, config in EMOTIONAL_PROMPTS.items():
        try:
            print(f"\n{'='*60}")
            print(f"Processing: {image_key}")
            print(f"{'='*60}")
            
            # Step 1: Generate with fal.ai
            image_data = generate_image_with_fal(config["prompt"], image_key)
            
            # Step 2: Upload to Supabase storage
            upload_data = upload_to_supabase_storage(image_data["url"], image_key)
            
            # Step 3: Save metadata to database
            db_record = save_to_database(image_key, image_data, upload_data, config)
            
            results.append({
                "key": image_key,
                "status": "success",
                "id": db_record["id"],
                "url": db_record["public_url"]
            })
            
            print(f"✅ {image_key} COMPLETE\n")
            
        except Exception as e:
            print(f"❌ {image_key} FAILED: {str(e)}\n")
            results.append({
                "key": image_key,
                "status": "failed",
                "error": str(e)
            })
    
    # Summary
    print(f"\n{'='*60}")
    print("📊 GENERATION SUMMARY")
    print(f"{'='*60}")
    
    success_count = len([r for r in results if r["status"] == "success"])
    failed_count = len([r for r in results if r["status"] == "failed"])
    
    print(f"✅ Success: {success_count}/{len(EMOTIONAL_PROMPTS)}")
    print(f"❌ Failed: {failed_count}/{len(EMOTIONAL_PROMPTS)}")
    
    if failed_count > 0:
        print("\nFailed images:")
        for r in results:
            if r["status"] == "failed":
                print(f"  - {r['key']}: {r['error']}")
    
    print(f"\n🎉 Image generation complete!")
    
    return results

if __name__ == "__main__":
    # Verify environment variables
    if not all([SUPABASE_URL, SUPABASE_KEY, FAL_KEY]):
        print("❌ Missing environment variables!")
        print("Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, FAL_KEY")
        exit(1)
    
    # Run generation
    results = generate_all_emotional_images()
    
    # Save results to file
    import json
    with open("emotional_images_results.json", "w") as f:
        json.dump(results, f, indent=2)
    
    print(f"\n💾 Results saved to: emotional_images_results.json")
