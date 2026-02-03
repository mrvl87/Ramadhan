import os
import requests
import fal_client
from supabase import create_client, Client

# Configuration
SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
# FAL_KEY is handled by fal_client lib automatically if in env

if not all([SUPABASE_URL, SUPABASE_KEY]):
    print("Missing environment variables.")
    # For debugging, let's print what we have (masked)
    print(f"URL: {SUPABASE_URL}")
    print(f"KEY: {'*' * 5 if SUPABASE_KEY else 'None'}")
    exit(1)

print("Initializing Supabase...")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

prompts = [
    {
        "name": "family_gathering",
        "prompt": "wide shot, happy Indonesian Muslim family taking a selfie in a modern cozy living room decorated for Ramadan, warm lighting, photorealistic, 8k, high quality, bokeh"
    },
    {
        "name": "delicious_iftar",
        "prompt": "cinematic overhead shot of a delicious Iftar feast on a wooden table, grilled chicken, rice, dates, fresh juices, Ramadan atmosphere, golden hour lighting, 8k, highly detailed"
    },
    {
        "name": "gift_giving",
        "prompt": "close up, hands holding a beautifully wrapped gift box with Islamic geometric patterns, soft bokeh background of twinkling lights, magical, heartwarming, intricate details, 8k, photorealistic"
    }
]

def generate_and_upload(item):
    print(f"Generating {item['name']}...")
    try:
        handler = fal_client.submit(
            "fal-ai/flux/schnell",
            arguments={"prompt": item["prompt"], "image_size": "landscape_4_3"}
        )
        result = handler.get()
        image_url = result['images'][0]['url']
        
        print(f"  > Generated. Downloading...")
        img_data = requests.get(image_url).content
        
        filename = f"homepage/{item['name']}.jpg"
        print(f"  > Uploading to Supabase: {filename}...")
        
        # Upload to Supabase Storage 'images' bucket
        # upsert=True to overwrite
        res = supabase.storage.from_("images").upload(
            path=filename,
            file=img_data,
            file_options={"content-type": "image/jpeg", "upsert": "true"}
        )
        
        # Get Public URL
        public_url = supabase.storage.from_("images").get_public_url(filename)
        return public_url
    except Exception as e:
        print(f"Error processing {item['name']}: {e}")
        return None

print("Starting generation...")
final_urls = {}
for item in prompts:
    url = generate_and_upload(item)
    if url:
        final_urls[item["name"]] = url
        print(f"  > Done: {url}")

print("\n--- JSON OUTPUT ---")
print(final_urls)
