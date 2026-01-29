# Gift Ideas Emotional Image Generation

Generate AI-powered emotional images for the Gift Ideas landing page and wizard using fal.ai.

## Setup

### 1. Install Python Dependencies

```bash
cd scripts
pip install -r requirements.txt
```

### 2. Environment Variables

Make sure your `.env.local` contains:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# fal.ai
FAL_KEY=your_fal_api_key
```

### 3. Run Database Migration

```sql
-- Run in Supabase SQL Editor:
-- Execute: supabase/migrations/20260129_gift_emotional_images.sql
```

### 4. Generate Images

```bash
cd scripts
python generate_emotional_images.py
```

This will:
- Generate 14 emotional images using fal.ai
- Upload them to Supabase storage
- Save metadata to `gift_emotional_images` table

**Estimated time:** 5-10 minutes (depending on fal.ai queue)
**Estimated cost:** ~$0.28 (14 images × $0.02 per image)

## Generated Images

### Hero Section (2 images)
- `hero_background` - Warm Indonesian family gathering
- `hero_moment_joy` - Mother opening gift with joy

### Wizard Recipients (7 images)
- `recipient_parent` - Elderly parents reading Quran
- `recipient_spouse` - Couple holding hands
- `recipient_child` - Child with gift
- `recipient_sibling` - Siblings laughing
- `recipient_friend` - Friends sharing moment
- `recipient_colleague` - Professional interaction
- `recipient_religious_leader` - Ustadz/Imam

### Emotional Moments (2 images)
- `joy_unwrapping` - Unwrapping gift
- `joy_embrace` - Grateful embrace

### Ramadan Spiritual (2 images)
- `ramadan_prayer` - Prayer on sajadah
- `ramadan_quran` - Open Quran

### Testimonials (1 image)
- `testimonial_daughter` - Young woman testimonial

## Usage in Code

### Landing Page
```typescript
import { getHeroImages } from '@/features/gift-ideas/image-actions'

const { background, moment } = await getHeroImages()
```

### Wizard
```typescript
import { getRecipientImage } from '@/features/gift-ideas/image-actions'

const image = await getRecipientImage('parent')
```

## Troubleshooting

### "Module not found: fal_client"
```bash
pip install fal-client
```

### "Missing environment variables"
Check your `.env.local` file has all required keys.

### Images not showing
1. Check Supabase storage bucket "images" is public
2. Verify RLS policies allow public read
3. Check `is_active = true` in database

## Manual Image Management

### View all images
```sql
SELECT * FROM gift_emotional_images;
```

### Deactivate an image
```sql
UPDATE gift_emotional_images 
SET is_active = false 
WHERE id = 'image_id';
```

### Regenerate specific image
Edit `generate_emotional_images.py` and comment out unwanted images in `EMOTIONAL_PROMPTS`.

## Cost Optimization

- **fal.ai model:** `fal-ai/flux/schnell` (fast, cheap)
- **Cost per image:** ~$0.02
- **Total for 14 images:** ~$0.28
- **Generation time:** 4 steps per image ≈ 30s each

To reduce costs:
- Generate only needed images
- Use lower quality settings (reduce `num_inference_steps`)
- Reuse images across multiple recipients

## Next Steps

After generation:
1. ✅ Images are in Supabase storage
2. ✅ Metadata in database
3. ✅ Landing page uses hero images
4. 🔄 Update wizard StepOne to use recipient images
5. 🔄 Add testimonial images to testimonial section

---

Need help? Check the prompts in `generate_emotional_images.py` to customize image style.
