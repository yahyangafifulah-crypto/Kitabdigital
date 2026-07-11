import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

// Initialize the GoogleGenAI client with key and telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

export async function POST(req: NextRequest) {
  try {
    const { type, reference, arabic, translation, question, chatHistory, isFollowUp } = await req.json();

    if (!reference || !arabic) {
      return NextResponse.json(
        { error: "Reference and Arabic text are required" },
        { status: 400 }
      );
    }

    // Common system context
    const systemInstruction = `
Anda adalah seorang Ustadz dan Ulama tafsir yang bijaksana, moderat, berwawasan luas, dan penyayang. 
Anda menjelaskan kutipan kitab suci atau hadits dalam Bahasa Indonesia yang santun, sejuk, dan memotivasi. 
Utamakan pesan perdamaian, akhlak mulia (akhlaqul karimah), kesucian jiwa (tazkiyatun nafs), serta keimanan yang kokoh. 
Jangan membuat kesimpulan ekstrem, kaku, atau menghakimi.
`;

    if (isFollowUp && chatHistory && chatHistory.length > 0) {
      // Conversational chat mode for follow-ups
      const formattedHistory = chatHistory.map((msg: any) => {
        return `${msg.role === 'user' ? 'Pertanyaan Pengguna' : 'Jawaban Anda'}: ${msg.content}`;
      }).join("\n\n");

      const prompt = `
REFERENSI KITAB/AYAT YANG SEDANG DIBAHAS:
Tipe: ${type || 'Ayat/Hadits'}
Referensi: ${reference}
Teks Arab: ${arabic}
Terjemahan Indonesia: ${translation || 'Tidak ada terjemahan'}

RIWAYAT PERCAKAPAN SEBELUMNYA:
${formattedHistory}

PERTANYAAN BARU DARI PENGGUNA:
"${question}"

Silakan jawab pertanyaan baru dari pengguna di atas secara santun, berlandaskan hikmah spiritual yang relevan dengan konteks ayat/hadits yang dibahas. Jawablah langsung secara naratif menggunakan format Markdown yang rapi (tidak dalam format JSON). Sampaikan penjelasan Anda seperti seorang guru spiritual yang sabar dan bijaksana.
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        },
      });

      return NextResponse.json({ text: response.text || "Mohon maaf, saya tidak sempat menyusun jawaban. Silakan ulangi pertanyaan Anda." });
    } else {
      // Initial structured explanation mode
      const prompt = `
REFERENSI KITAB/AYAT:
Tipe: ${type || 'Ayat/Hadits'}
Referensi: ${reference}
Teks Arab: ${arabic}
Terjemahan Indonesia: ${translation || 'Tidak ada terjemahan'}
${question ? `Pertanyaan khusus dari pengguna: "${question}"` : ''}

Silakan susun respons Anda dalam format JSON terstruktur dengan kunci-kunci berikut (pastikan mengembalikan JSON valid):
1. "explanation": Penjelasan komprehensif, mendalam tentang asbabun nuzul (jika ada), konteks spiritual, makna kata kunci, dan tafsirnya secara bahasa serta ruhiah. Minimal 3 paragraf, sampaikan dengan bahasa yang lembut dan memotivasi.
2. "lessons": Array berisi 3-4 hikmah atau pelajaran penting yang bisa diambil dari teks tersebut.
3. "actions": Array berisi 3 praktikal sehari-hari (amalan nyata) yang dapat dilakukan oleh pembaca dalam kehidupan modern untuk mengamalkan teks ini.
4. "relatedContext": Penjelasan singkat mengenai keterkaitan teks ini dengan kehidupan sehari-hari atau saran bacaan kitab penunjang lainnya.

PENTING: Pastikan respons Anda adalah objek JSON murni yang valid tanpa pembungkus markdown markdown-codeblocks (seperti \`\`\`json ... \`\`\`), sehingga bisa langsung diparsing dengan JSON.parse.
`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          systemInstruction: systemInstruction,
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      });

      const responseText = response.text || "{}";
      
      try {
        const parsed = JSON.parse(responseText.trim());
        return NextResponse.json(parsed);
      } catch (parseError) {
        // Fallback if parsing fails (unlikely, but safe)
        return NextResponse.json({
          explanation: responseText,
          lessons: ["Mengambil pelajaran dari hikmah kitab suci.", "Mengamalkannya dalam kehidupan sehari-hari.", "Meningkatkan ketaqwaan."],
          actions: ["Membaca teks secara konsisten.", "Merengkuh maknanya dalam hati.", "Berbagi kebaikan dengan sesama."],
          relatedContext: "Konteks spiritual Kitab Suci."
        });
      }
    }

  } catch (error: any) {
    console.error("Error generating explanation:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan saat memproses penjelasan AI: " + (error?.message || error) },
      { status: 500 }
    );
  }
}
