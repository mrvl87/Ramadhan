export const FAMILY_PHOTO_CONFIG = {
    // LLM Config
    GREETING_MODEL: 'google/gemini-2.5-flash', // Model ID for OpenRouter/Fal Proxy

    // Greeting Generation Config
    GREETING_THEMES: [
        "Kemenangan & Kesucian",
        "Kehangatan Keluarga",
        "Saling Memaafkan",
        "Rasa Syukur",
        "Kenangan Indah",
        "Harapan Masa Depan"
    ],

    // The core instruction for the greeting generation
    GREETING_PROMPT_TEMPLATE: (theme: string) => `Buatkan 1 kalimat ucapan Selamat Hari Raya Idul Fitri yang hangat, akrab, dan natural (umum digunakan) dalam Bahasa Indonesia.
        Tema: ${theme}.
        
        ATURAN WAJIB:
        1. HANYA berikan teks ucapannya saja. Tanpa tanda kutip.
        2. DILARANG memberikan kata pengantar.
        3. DILARANG memberikan pertanyaan atau saran.
        4. Panjang kalimat: 10 sampai 15 kata.
        5. Gunakan bahasa yang sopan namun tidak terlalu kaku/puitis.`
};
