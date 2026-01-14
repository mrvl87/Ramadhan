# Layer 2.1: AI Card System Design

## 1. Product Philosophy
**RamadanHub AI** is not a utility; it is a **social signaling tool**. Users engage to express:
- **Family Pride**: "Look at my beautiful family."
- **Religious Identity**: "I am celebrating a blessed Ramadan."
- **Connection**: "I am thinking of you."

**The Viral Engine**: Every card shared is an advertisement. The "Product" is the image, but the "Hook" is the Watermark and the URL.

---

## 2. Card Categories

### Type A: "The Royal Family" (Photo Integration)
*   **Concept**: Users upload a casual family photo; AI places them in a luxury Islamic setting (e.g., inside a glowing Masjid, under a lantern-lit archway).
*   **Inputs**: Single Family Photo (Face detection required).
*   **Emotional Target**: **Status**. "We look wealthy/blessed."
*   **Monetization Trigger**: "The watermark covers the best face." -> Upgrade to remove.

### Type B: "The Digital Calligrapher" (Name-Based)
*   **Concept**: Stunning 3D Typography of the family name (e.g., "The Wardhana Family") intertwined with gold/floral elements.
*   **Inputs**: Text Only (Family Name, or list of member names).
*   **Emotional Target**: **Identity**. "Our name is art."
*   **Monetization Trigger**: HD resolution. These text details look blurry on free preview.

### Type C: "The Mini-Me Cartoon" (Illustration)
*   **Concept**: Transforms the family photo into a Disney/Pixar-style 3D illustration wearing modest Ramadan fashion.
*   **Inputs**: Photo + Style selection (e.g., watercolor, 3D render).
*   **Emotional Target**: **Fun/Cute**. Highly shareable on Instagram Stories.
*   **Monetization Trigger**: "Unlock the 'Disney' style" (Premium Feature).

### Type D: "The Pious Wish" (Text & Atmosphere)
*   **Concept**: No humans. Just atmospheric scenes (Lanterns, Kaaba, Quran) with a heartfelt custom message.
*   **Inputs**: Custom Message (or AI generated wish).
*   **Emotional Target**: **Respect**. Safe for conservative sharing.
*   **Monetization Trigger**: Unlimited generations to find the "perfect" mood.

---

## 3. User Flow Design

```text
[Landing Page]
  |
  +-> [Choose Card Type] (e.g., Royal Family)
        |
        +-> [Upload/Input] (Frictionless, < 30s)
              |
              +-> [Theme Selection] (Gold, Blue, Minimal)
                    |
                    +-> [GATEKEEPER CHECK] --> (Paywall if 0 credits)
                    |
                    +-> [AI GENERATION] (Consumes 1 Credit)
                          |
                          v
                    [PREVIEW PAGE]
                    (Shows Watermarked, Medium-Res Image)
                          |
        +-----------------+-----------------+
        |                 |                 |
[Share Link]        [Download Low-Res]  [Download HD / Remove Watermark]
(Viral Loop)        (Watermarked)       (LOCK: Pro Only)
        |                                   |
"Check out my card!"                    [PAYWALL MODAL]
                                        "Upgrade to Pro for HD & No Watermark"
```

---

## 4. Data Model (Logical)

### Table: `public.ai_cards`

| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key |
| `user_id` | UUID | Owner (FK to users) |
| `type` | Enum | 'photo_bg', 'typography', 'cartoon', 'wish' |
| `original_image_url` | Text | The raw output from AI provider (Private) |
| `watermarked_url` | Text | The composite image for free display (Public) |
| `input_data` | JSONB | e.g., `{ "prompt": "family in garden", "names": ["Ali"] }` |
| `style_preset` | Text | e.g., 'luxury_gold' |
| `is_hd_unlocked` | Bool | False by default. True if user Upgrades/Unlocks. |
| `created_at` | Timestamp | For sorting history |

**Caching Strategy**:
- Images are stored in Supabase Storage.
- `watermarked_url` is generated once and cached.

---

## 5. Watermark Strategy

The watermark is the primary driver of **Loss Aversion**. It must be part of the image, not an HTML overlay (so it can't be screenshotted away).

1.  **The "Brand" Mark**: Small logo in bottom right. "RamadanHub.ai". (Always present on Free, maybe removable on Pro).
2.  **The "Annoyance" Mark**: Diagonal semi-transparent text across the center. content: "PREVIEW - RamadanHub".
    *   **Opacity**: 15-20%. Visible enough to ruin a print, subtle enough to see the faces.
    *   **Behavior**:
        *   **Free User**: Sees both marks.
        *   **Pro User**: Sees ZERO marks.

---

## 6. Viral Mechanism

1.  **The Shared Asset**: The image itself.
2.  ** The Footer**: When shared on WhatsApp, the caption is auto-filled:
    > "I made this family card with RamadanHub AI! 🌙 Create yours here: [ramadanhub.ai/ref/user_id]"
3.  **The Incentive**: "Refer 3 friends to get 5 free credits." (Future Layer).

---

## 7. Monetization Triggers

| Action | Cost (Free User) | Barrier | Benefit of Pro |
| :--- | :--- | :--- | :--- |
| **Generate Preview** | 1 Credit | **Low**. Uses free credits. | Unlimited Generations. |
| **Download Low-Res** | 0 Extra | **None**. Has Watermark. | No Watermark. |
| **Download HD** | **LOCKED** | **High**. Must Upgrade. | Unlimited HD Downloads. |
| **Regenerate** | 1 Credit | **Medium**. Credits run out fast. | Perfecting the image is free. |

**The "Hook"**:
We let them generate for "Free" (using credits) to trigger the **Endowment Effect**. "I made this, it's mine."
Then we Paywall the **Perfection** (HD, No Watermark).
"You already did the work. Just $5 to make it perfect."
