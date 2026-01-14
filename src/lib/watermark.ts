import sharp from 'sharp';

/**
 * Applies a branding watermark to the image buffer.
 */
export async function applyWatermark(imageBuffer: ArrayBuffer): Promise<Buffer> {
    const original = sharp(imageBuffer);
    const metadata = await original.metadata();

    const width = metadata.width || 1024;
    const height = metadata.height || 1024;

    // Design the SVG Watermark
    // 1. Text: "Made with RamadanHub AI"
    // 2. Style: Semi-transparent white text with shadow
    // 3. Position: Bottom center/right

    const fontSize = Math.floor(width * 0.04); // 4% of width
    const margin = Math.floor(width * 0.05);

    const svgText = `
    <svg width="${width}" height="${height}">
      <style>
        .title { fill: rgba(255, 255, 255, 0.7); font-size: ${fontSize}px; font-weight: bold; font-family: sans-serif; filter: drop-shadow(2px 2px 2px rgba(0,0,0,0.5)); }
        .preview { fill: rgba(255, 255, 255, 0.15); font-size: ${fontSize * 3}px; font-weight: bold; font-family: sans-serif; transform: rotate(-45deg); transform-origin: center; }
      </style>
      
      <!-- Big Center Preview Mark -->
      <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" class="preview">PREVIEW</text>
      
      <!-- Corner Brand Mark -->
      <text x="${width - margin}" y="${height - margin}" text-anchor="end" class="title">Made with RamadanHub AI</text>
    </svg>
    `;

    // Composite
    const processedBuffer = await original
        .composite([
            {
                input: Buffer.from(svgText),
                top: 0,
                left: 0,
            },
        ])
        .jpeg({ quality: 90 }) // Re-encode as high quality JPEG
        .toBuffer();

    return processedBuffer;
}
