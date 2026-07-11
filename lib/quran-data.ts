export interface SurahHeader {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: 'Mekah' | 'Madinah';
  arti: string;
}

export interface Verse {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audioUrl?: string;
}

export interface SurahDetails extends SurahHeader {
  deskripsi?: string;
  ayat: Verse[];
}

export interface Hadith {
  nomor: number;
  judul: string;
  perawi: string;
  teksArab: string;
  teksIndonesia: string;
  penjelasan: string;
  tema: string;
}

// 114 Surah headers for fast listing
export const SURAH_LIST: SurahHeader[] = [
  { nomor: 1, nama: "الفاتحة", namaLatin: "Al-Fatihah", jumlahAyat: 7, tempatTurun: "Mekah", arti: "Pembukaan" },
  { nomor: 2, nama: "البقرة", namaLatin: "Al-Baqarah", jumlahAyat: 286, tempatTurun: "Madinah", arti: "Sapi Betina" },
  { nomor: 3, nama: "آل عمران", namaLatin: "Ali 'Imran", jumlahAyat: 200, tempatTurun: "Madinah", arti: "Keluarga Imran" },
  { nomor: 4, nama: "النساء", namaLatin: "An-Nisa'", jumlahAyat: 176, tempatTurun: "Madinah", arti: "Wanita" },
  { nomor: 5, nama: "المائدة", namaLatin: "Al-Ma'idah", jumlahAyat: 120, tempatTurun: "Madinah", arti: "Hidangan" },
  { nomor: 6, nama: "الأنعام", namaLatin: "Al-An'am", jumlahAyat: 165, tempatTurun: "Mekah", arti: "Binatang Ternak" },
  { nomor: 7, nama: "الأعراف", namaLatin: "Al-A'raf", jumlahAyat: 206, tempatTurun: "Mekah", arti: "Tempat Tertinggi" },
  { nomor: 8, nama: "الأنفال", namaLatin: "Al-Anfal", jumlahAyat: 75, tempatTurun: "Madinah", arti: "Rampasan Perang" },
  { nomor: 9, nama: "التوبة", namaLatin: "At-Tawbah", jumlahAyat: 129, tempatTurun: "Madinah", arti: "Pengampunan" },
  { nomor: 10, nama: "يونس", namaLatin: "Yunus", jumlahAyat: 109, tempatTurun: "Mekah", arti: "Nabi Yunus" },
  { nomor: 11, nama: "هود", namaLatin: "Hud", jumlahAyat: 123, tempatTurun: "Mekah", arti: "Nabi Hud" },
  { nomor: 12, nama: "يوسف", namaLatin: "Yusuf", jumlahAyat: 111, tempatTurun: "Mekah", arti: "Nabi Yusuf" },
  { nomor: 13, nama: "الرعد", namaLatin: "Ar-Ra'd", jumlahAyat: 43, tempatTurun: "Madinah", arti: "Guruh" },
  { nomor: 14, nama: "ابراهيم", namaLatin: "Ibrahim", jumlahAyat: 52, tempatTurun: "Mekah", arti: "Nabi Ibrahim" },
  { nomor: 15, nama: "الحجر", namaLatin: "Al-Hijr", jumlahAyat: 99, tempatTurun: "Mekah", arti: "Lembah Hijr" },
  { nomor: 16, nama: "النحل", namaLatin: "An-Nahl", jumlahAyat: 128, tempatTurun: "Mekah", arti: "Lebah" },
  { nomor: 17, nama: "الإسراء", namaLatin: "Al-Isra'", jumlahAyat: 111, tempatTurun: "Mekah", arti: "Memperjalankan di Malam Hari" },
  { nomor: 18, nama: "الكهف", namaLatin: "Al-Kahf", jumlahAyat: 110, tempatTurun: "Mekah", arti: "Goa" },
  { nomor: 19, nama: "مريم", namaLatin: "Maryam", jumlahAyat: 98, tempatTurun: "Mekah", arti: "Maryam" },
  { nomor: 20, nama: "طه", namaLatin: "Taha", jumlahAyat: 135, tempatTurun: "Mekah", arti: "Taha" },
  { nomor: 21, nama: "الأنبياء", namaLatin: "Al-Anbiya'", jumlahAyat: 112, tempatTurun: "Mekah", arti: "Para Nabi" },
  { nomor: 22, nama: "الحج", namaLatin: "Al-Hajj", jumlahAyat: 78, tempatTurun: "Madinah", arti: "Haji" },
  { nomor: 23, nama: "المؤمنون", namaLatin: "Al-Mu'minun", jumlahAyat: 118, tempatTurun: "Mekah", arti: "Orang-Orang Mukmin" },
  { nomor: 24, nama: "النور", namaLatin: "An-Nur", jumlahAyat: 64, tempatTurun: "Madinah", arti: "Cahaya" },
  { nomor: 25, nama: "الفرقان", namaLatin: "Al-Furqan", jumlahAyat: 77, tempatTurun: "Mekah", arti: "Pembeda" },
  { nomor: 26, nama: "الشعراء", namaLatin: "Asy-Syu'ara'", jumlahAyat: 227, tempatTurun: "Mekah", arti: "Para Penyair" },
  { nomor: 27, nama: "النمل", namaLatin: "An-Naml", jumlahAyat: 93, tempatTurun: "Mekah", arti: "Semut" },
  { nomor: 28, nama: "القصص", namaLatin: "Al-Qasas", jumlahAyat: 88, tempatTurun: "Mekah", arti: "Kisah-Kisah" },
  { nomor: 29, nama: "العنكبوت", namaLatin: "Al-'Ankabut", jumlahAyat: 69, tempatTurun: "Mekah", arti: "Laba-Laba" },
  { nomor: 30, nama: "الروم", namaLatin: "Ar-Rum", jumlahAyat: 60, tempatTurun: "Mekah", arti: "Bangsa Romawi" },
  { nomor: 31, nama: "لقمان", namaLatin: "Luqman", jumlahAyat: 34, tempatTurun: "Mekah", arti: "Luqman" },
  { nomor: 32, nama: "السجدة", namaLatin: "As-Sajdah", jumlahAyat: 30, tempatTurun: "Mekah", arti: "Sajdah" },
  { nomor: 33, nama: "الأحزاب", namaLatin: "Al-Ahzab", jumlahAyat: 73, tempatTurun: "Madinah", arti: "Golongan yang Bersekutu" },
  { nomor: 34, nama: "سبإ", namaLatin: "Saba'", jumlahAyat: 54, tempatTurun: "Mekah", arti: "Kaum Saba'" },
  { nomor: 35, nama: "فاطر", namaLatin: "Fatir", jumlahAyat: 45, tempatTurun: "Mekah", arti: "Pencipta" },
  { nomor: 36, nama: "يس", namaLatin: "Yasin", jumlahAyat: 83, tempatTurun: "Mekah", arti: "Yasin" },
  { nomor: 37, nama: "الصافات", namaLatin: "As-Saffat", jumlahAyat: 182, tempatTurun: "Mekah", arti: "Barisan-Barisan" },
  { nomor: 38, nama: "ص", namaLatin: "Sad", jumlahAyat: 88, tempatTurun: "Mekah", arti: "Sad" },
  { nomor: 39, nama: "الزمر", namaLatin: "Az-Zumar", jumlahAyat: 75, tempatTurun: "Mekah", arti: "Rombongan-Rombongan" },
  { nomor: 40, nama: "غافر", namaLatin: "Ghafir", jumlahAyat: 85, tempatTurun: "Mekah", arti: "Maha Pengampun" },
  { nomor: 41, nama: "فصلت", namaLatin: "Fussilat", jumlahAyat: 54, tempatTurun: "Mekah", arti: "Dijelaskan" },
  { nomor: 42, nama: "الشورى", namaLatin: "Asy-Syura", jumlahAyat: 53, tempatTurun: "Mekah", arti: "Musyawarah" },
  { nomor: 43, nama: "الزخرف", namaLatin: "Az-Zukhruf", jumlahAyat: 89, tempatTurun: "Mekah", arti: "Perhiasan" },
  { nomor: 44, nama: "الدخان", namaLatin: "Ad-Dukhan", jumlahAyat: 59, tempatTurun: "Mekah", arti: "Kabut" },
  { nomor: 45, nama: "الجاثية", namaLatin: "Al-Jasiyah", jumlahAyat: 37, tempatTurun: "Mekah", arti: "Yang Berlutut" },
  { nomor: 46, nama: "الأحقاف", namaLatin: "Al-Ahqaf", jumlahAyat: 35, tempatTurun: "Mekah", arti: "Bukit-Bukit Pasir" },
  { nomor: 47, nama: "محمد", namaLatin: "Muhammad", jumlahAyat: 38, tempatTurun: "Madinah", arti: "Nabi Muhammad" },
  { nomor: 48, nama: "الفتح", namaLatin: "Al-Fath", jumlahAyat: 29, tempatTurun: "Madinah", arti: "Kemenangan" },
  { nomor: 49, nama: "الحجرات", namaLatin: "Al-Hujurat", jumlahAyat: 18, tempatTurun: "Madinah", arti: "Kamar-Kamar" },
  { nomor: 50, nama: "ق", namaLatin: "Qaf", jumlahAyat: 45, tempatTurun: "Mekah", arti: "Qaf" },
  { nomor: 51, nama: "الذاريات", namaLatin: "Az-Zariyat", jumlahAyat: 60, tempatTurun: "Mekah", arti: "Angin yang Menerbangkan" },
  { nomor: 52, nama: "الطور", namaLatin: "At-Tur", jumlahAyat: 49, tempatTurun: "Mekah", arti: "Bukit" },
  { nomor: 53, nama: "النجم", namaLatin: "An-Najm", jumlahAyat: 62, tempatTurun: "Mekah", arti: "Bintang" },
  { nomor: 54, nama: "المر", namaLatin: "Al-Ma'arij", jumlahAyat: 44, tempatTurun: "Mekah", arti: "Tempat Naik" },
  { nomor: 55, nama: "الرحمن", namaLatin: "Ar-Rahman", jumlahAyat: 78, tempatTurun: "Madinah", arti: "Maha Pengasih" },
  { nomor: 56, nama: "الواقعة", namaLatin: "Al-Waqi'ah", jumlahAyat: 96, tempatTurun: "Mekah", arti: "Hari Kiamat" },
  { nomor: 57, nama: "الحديد", namaLatin: "Al-Hadid", jumlahAyat: 29, tempatTurun: "Madinah", arti: "Besi" },
  { nomor: 58, nama: "المجادلة", namaLatin: "Al-Mujadilah", jumlahAyat: 22, tempatTurun: "Madinah", arti: "Gugatan" },
  { nomor: 59, nama: "الحشر", namaLatin: "Al-Hasyr", jumlahAyat: 24, tempatTurun: "Madinah", arti: "Pengusiran" },
  { nomor: 60, nama: "الممتحنة", namaLatin: "Al-Mumtahanah", jumlahAyat: 13, tempatTurun: "Madinah", arti: "Wanita yang Diuji" },
  { nomor: 61, nama: "الصف", namaLatin: "As-Saff", jumlahAyat: 14, tempatTurun: "Madinah", arti: "Barisan" },
  { nomor: 62, nama: "الجمعة", namaLatin: "Al-Jum'ah", jumlahAyat: 11, tempatTurun: "Madinah", arti: "Hari Jumat" },
  { nomor: 63, nama: "المنافقون", namaLatin: "Al-Munafiqun", jumlahAyat: 11, tempatTurun: "Madinah", arti: "Orang-Orang Munafik" },
  { nomor: 64, nama: "التغابن", namaLatin: "At-Taghabun", jumlahAyat: 18, tempatTurun: "Madinah", arti: "Pengungkapan Kesalahan" },
  { nomor: 65, nama: "الطلاق", namaLatin: "At-Talaq", jumlahAyat: 12, tempatTurun: "Madinah", arti: "Talak" },
  { nomor: 66, nama: "التحريم", namaLatin: "At-Tahrim", jumlahAyat: 12, tempatTurun: "Madinah", arti: "Pengharaman" },
  { nomor: 67, nama: "الملك", namaLatin: "Al-Mulk", jumlahAyat: 30, tempatTurun: "Mekah", arti: "Kerajaan" },
  { nomor: 68, nama: "القلم", namaLatin: "Al-Qalam", jumlahAyat: 52, tempatTurun: "Mekah", arti: "Pena" },
  { nomor: 69, nama: "الحاقة", namaLatin: "Al-Haqqah", jumlahAyat: 52, tempatTurun: "Mekah", arti: "Hari Kiamat yang Pasti" },
  { nomor: 70, nama: "المعارج", namaLatin: "Al-Ma'arij", jumlahAyat: 44, tempatTurun: "Mekah", arti: "Tempat-Tempat Naik" },
  { nomor: 71, nama: "نوح", namaLatin: "Nuh", jumlahAyat: 28, tempatTurun: "Mekah", arti: "Nabi Nuh" },
  { nomor: 72, nama: "الجن", namaLatin: "Al-Jinn", jumlahAyat: 28, tempatTurun: "Mekah", arti: "Jin" },
  { nomor: 73, nama: "المزمل", namaLatin: "Al-Muzzammil", jumlahAyat: 20, tempatTurun: "Mekah", arti: "Orang yang Berselimut" },
  { nomor: 74, nama: "المدثر", namaLatin: "Al-Muddassir", jumlahAyat: 56, tempatTurun: "Mekah", arti: "Orang yang Berkemul" },
  { nomor: 75, nama: "القيامة", namaLatin: "Al-Qiyamah", jumlahAyat: 40, tempatTurun: "Mekah", arti: "Hari Kiamat" },
  { nomor: 76, nama: "الإنسان", namaLatin: "Al-Insan", jumlahAyat: 31, tempatTurun: "Madinah", arti: "Manusia" },
  { nomor: 77, nama: "المرسلات", namaLatin: "Al-Mursalat", jumlahAyat: 50, tempatTurun: "Mekah", arti: "Malaikat yang Diutus" },
  { nomor: 78, nama: "النبإ", namaLatin: "An-Naba'", jumlahAyat: 40, tempatTurun: "Mekah", arti: "Berita Besar" },
  { nomor: 79, nama: "النازعات", namaLatin: "An-Nazi'at", jumlahAyat: 46, tempatTurun: "Mekah", arti: "Malaikat yang Mencabut" },
  { nomor: 80, nama: "عبس", namaLatin: "'Abasa", jumlahAyat: 42, tempatTurun: "Mekah", arti: "Ia Bermuka Masam" },
  { nomor: 81, nama: "التكوير", namaLatin: "At-Takwir", jumlahAyat: 29, tempatTurun: "Mekah", arti: "Penggulungan" },
  { nomor: 82, nama: "الانفطار", namaLatin: "Al-Infitar", jumlahAyat: 19, tempatTurun: "Mekah", arti: "Terbelah" },
  { nomor: 83, nama: "المطففين", namaLatin: "Al-Mutaffifin", jumlahAyat: 36, tempatTurun: "Mekah", arti: "Orang-Orang yang Curang" },
  { nomor: 84, nama: "الانشقاق", namaLatin: "Al-Insyiqaq", jumlahAyat: 25, tempatTurun: "Mekah", arti: "Terbelah Dua" },
  { nomor: 85, nama: "البروج", namaLatin: "Al-Buruj", jumlahAyat: 22, tempatTurun: "Mekah", arti: "Gugusan Bintang" },
  { nomor: 86, nama: "الطارق", namaLatin: "At-Tariq", jumlahAyat: 17, tempatTurun: "Mekah", arti: "Yang Datang di Malam Hari" },
  { nomor: 87, nama: "الأعلى", namaLatin: "Al-A'la", jumlahAyat: 19, tempatTurun: "Mekah", arti: "Yang Maha Tinggi" },
  { nomor: 88, nama: "الغاشية", namaLatin: "Al-Ghasyiyah", jumlahAyat: 26, tempatTurun: "Mekah", arti: "Hari Kiamat yang Menghinakan" },
  { nomor: 89, nama: "الفجر", namaLatin: "Al-Fajr", jumlahAyat: 30, tempatTurun: "Mekah", arti: "Fajar" },
  { nomor: 90, nama: "البلد", namaLatin: "Al-Balad", jumlahAyat: 20, tempatTurun: "Mekah", arti: "Negeri" },
  { nomor: 91, nama: "الشمس", namaLatin: "Asy-Syams", jumlahAyat: 15, tempatTurun: "Mekah", arti: "Matahari" },
  { nomor: 92, nama: "الليل", namaLatin: "Al-Lail", jumlahAyat: 21, tempatTurun: "Mekah", arti: "Malam" },
  { nomor: 93, nama: "الضحى", namaLatin: "Ad-Duha", jumlahAyat: 11, tempatTurun: "Mekah", arti: "Dhuha" },
  { nomor: 94, nama: "الشرح", namaLatin: "Al-Insyirah", jumlahAyat: 8, tempatTurun: "Mekah", arti: "Melapangkan Dada" },
  { nomor: 95, nama: "التين", namaLatin: "At-Tin", jumlahAyat: 8, tempatTurun: "Mekah", arti: "Buah Tin" },
  { nomor: 96, nama: "العلق", namaLatin: "Al-'Alaq", jumlahAyat: 19, tempatTurun: "Mekah", arti: "Segumpal Darah" },
  { nomor: 97, nama: "القدر", namaLatin: "Al-Qadr", jumlahAyat: 5, tempatTurun: "Mekah", arti: "Kemuliaan" },
  { nomor: 98, nama: "البينة", namaLatin: "Al-Bayyinah", jumlahAyat: 8, tempatTurun: "Madinah", arti: "Bukti Nyata" },
  { nomor: 99, nama: "الزلزلة", namaLatin: "Az-Zalzalah", jumlahAyat: 8, tempatTurun: "Madinah", arti: "Goncangan" },
  { nomor: 100, nama: "العاديات", namaLatin: "Al-'Adiyat", jumlahAyat: 11, tempatTurun: "Mekah", arti: "Kuda Perang yang Berlari Kencang" },
  { nomor: 101, nama: "القارعة", namaLatin: "Al-Qari'ah", jumlahAyat: 11, tempatTurun: "Mekah", arti: "Hari Kiamat" },
  { nomor: 102, nama: "التكاثر", namaLatin: "At-Takasur", jumlahAyat: 8, tempatTurun: "Mekah", arti: "Bermegah-Megahan" },
  { nomor: 103, nama: "العصر", namaLatin: "Al-'Asr", jumlahAyat: 3, tempatTurun: "Mekah", arti: "Demi Masa" },
  { nomor: 104, nama: "الهمزة", namaLatin: "Al-Humazah", jumlahAyat: 9, tempatTurun: "Mekah", arti: "Pengumpat" },
  { nomor: 105, nama: "الفيل", namaLatin: "Al-Fil", jumlahAyat: 5, tempatTurun: "Mekah", arti: "Gajah" },
  { nomor: 106, nama: "قريش", namaLatin: "Quraisy", jumlahAyat: 4, tempatTurun: "Mekah", arti: "Suku Quraisy" },
  { nomor: 107, nama: "الماعون", namaLatin: "Al-Ma'un", jumlahAyat: 7, tempatTurun: "Mekah", arti: "Barang yang Berguna" },
  { nomor: 108, nama: "الكوثر", namaLatin: "Al-Kausar", jumlahAyat: 3, tempatTurun: "Mekah", arti: "Nikmat yang Banyak" },
  { nomor: 109, nama: "الكافرون", namaLatin: "Al-Kafirun", jumlahAyat: 6, tempatTurun: "Mekah", arti: "Orang-Orang Kafir" },
  { nomor: 110, nama: "النصر", namaLatin: "An-Nasr", jumlahAyat: 3, tempatTurun: "Madinah", arti: "Pertolongan" },
  { nomor: 111, nama: "المسد", namaLatin: "Al-Lahab", jumlahAyat: 5, tempatTurun: "Mekah", arti: "Gejolak Api" },
  { nomor: 112, nama: "الإخلاص", namaLatin: "Al-Ikhlas", jumlahAyat: 4, tempatTurun: "Mekah", arti: "Ikhlas" },
  { nomor: 113, nama: "الفلق", namaLatin: "Al-Falaq", jumlahAyat: 5, tempatTurun: "Mekah", arti: "Waktu Subuh" },
  { nomor: 114, nama: "الناس", namaLatin: "An-Nas", jumlahAyat: 6, tempatTurun: "Mekah", arti: "Manusia" }
];

// Offline fallback detailed data for major Surahs
export const LOCAL_SURAHS: Record<number, SurahDetails> = {
  1: {
    nomor: 1,
    nama: "الفاتحة",
    namaLatin: "Al-Fatihah",
    jumlahAyat: 7,
    tempatTurun: "Mekah",
    arti: "Pembukaan",
    deskripsi: "Surat Al-Fatihah (Pembukaan) yang diturunkan di Mekah dan terdiri dari 7 ayat. Surat ini adalah Ummul Qur'an (Induk Al-Quran) dan wajib dibaca dalam setiap rakaat shalat.",
    ayat: [
      {
        nomorAyat: 1,
        teksArab: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        teksLatin: "Bismillāhir-raḥmānir-raḥīm.",
        teksIndonesia: "Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.",
        audioUrl: "https://cdn.equran.id/audio-ayat/Abdurrahman-as-Sudais/001001.mp3"
      },
      {
        nomorAyat: 2,
        teksArab: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
        teksLatin: "Al-ḥamdu lillāhi rabbil-'ālamīn.",
        teksIndonesia: "Segala puji bagi Allah, Tuhan seluruh alam,",
        audioUrl: "https://cdn.equran.id/audio-ayat/Abdurrahman-as-Sudais/001002.mp3"
      },
      {
        nomorAyat: 3,
        teksArab: "الرَّحْمَٰنِ الرَّحِيمِ",
        teksLatin: "Ar-raḥmānir-raḥīm.",
        teksIndonesia: "Yang Maha Pengasih, Maha Penyayang,",
        audioUrl: "https://cdn.equran.id/audio-ayat/Abdurrahman-as-Sudais/001003.mp3"
      },
      {
        nomorAyat: 4,
        teksArab: "مَالِكِ يَوْمِ الدِّينِ",
        teksLatin: "Māliki yaumid-dīn.",
        teksIndonesia: "Pemilik hari pembalasan.",
        audioUrl: "https://cdn.equran.id/audio-ayat/Abdurrahman-as-Sudais/001004.mp3"
      },
      {
        nomorAyat: 5,
        teksArab: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
        teksLatin: "Iyyāka na'budu wa iyyāka nasta'īn.",
        teksIndonesia: "Hanya kepada Engkaulah kami menyembah dan hanya kepada Engkaulah kami memohon pertolongan.",
        audioUrl: "https://cdn.equran.id/audio-ayat/Abdurrahman-as-Sudais/001005.mp3"
      },
      {
        nomorAyat: 6,
        teksArab: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
        teksLatin: "Ihdinaṣ-ṣirāṭal-mustaqīm.",
        teksIndonesia: "Tunjukkanlah kami jalan yang lurus,",
        audioUrl: "https://cdn.equran.id/audio-ayat/Abdurrahman-as-Sudais/001006.mp3"
      },
      {
        nomorAyat: 7,
        teksArab: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
        teksLatin: "Ṣirāṭallażīna an'amta 'alayhim gairil-magḍūbi 'alayhim wa laḍ-ḍāllīn.",
        teksIndonesia: "(yaitu) jalan orang-orang yang telah Engkau beri nikmat kepadanya; bukan (jalan) mereka yang dimurkai, dan bukan (pula jalan) mereka yang sesat.",
        audioUrl: "https://cdn.equran.id/audio-ayat/Abdurrahman-as-Sudais/001007.mp3"
      }
    ]
  },
  112: {
    nomor: 112,
    nama: "الإخلاص",
    namaLatin: "Al-Ikhlas",
    jumlahAyat: 4,
    tempatTurun: "Mekah",
    arti: "Ikhlas",
    deskripsi: "Surat Al-Ikhlas (Kemurnian Keesaan Allah) diturunkan di Mekah dan menekankan konsep Tauhid (Keesaan Mutlak Allah SWT) sebagai pondasi aqidah Islam.",
    ayat: [
      {
        nomorAyat: 1,
        teksArab: "قُلْ هُوَ اللَّهُ أَحَدٌ",
        teksLatin: "Qul huwallāhu aḥad.",
        teksIndonesia: "Katakanlah (Muhammad), 'Dialah Allah, Yang Maha Esa.'",
        audioUrl: "https://cdn.equran.id/audio-ayat/Abdurrahman-as-Sudais/112001.mp3"
      },
      {
        nomorAyat: 2,
        teksArab: "اللَّهُ الصَّمَدُ",
        teksLatin: "Allāhuṣ-ṣamad.",
        teksIndonesia: "Allah tempat meminta segala sesuatu.",
        audioUrl: "https://cdn.equran.id/audio-ayat/Abdurrahman-as-Sudais/112002.mp3"
      },
      {
        nomorAyat: 3,
        teksArab: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
        teksLatin: "Lam yalid wa lam yūlad.",
        teksIndonesia: "(Allah) tidak beranak dan tidak pula diperanakkan,",
        audioUrl: "https://cdn.equran.id/audio-ayat/Abdurrahman-as-Sudais/112003.mp3"
      },
      {
        nomorAyat: 4,
        teksArab: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
        teksLatin: "Wa lam yakul lahū kufuwan aḥad.",
        teksIndonesia: "dan tidak ada sesuatu yang setara dengan Dia.",
        audioUrl: "https://cdn.equran.id/audio-ayat/Abdurrahman-as-Sudais/112004.mp3"
      }
    ]
  },
  113: {
    nomor: 113,
    nama: "الفلق",
    namaLatin: "Al-Falaq",
    jumlahAyat: 5,
    tempatTurun: "Mekah",
    arti: "Waktu Subuh",
    deskripsi: "Surat Al-Falaq (Waktu Subuh) merupakan doa perlindungan dari segala jenis kejahatan makhluk, sihir, dan rasa dengki.",
    ayat: [
      {
        nomorAyat: 1,
        teksArab: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ",
        teksLatin: "Qul a'ūżu birabbil-falaq.",
        teksIndonesia: "Katakanlah, 'Aku berlindung kepada Tuhan yang menguasai subuh (fajar),'",
        audioUrl: "https://cdn.equran.id/audio-ayat/Abdurrahman-as-Sudais/113001.mp3"
      },
      {
        nomorAyat: 2,
        teksArab: "مِن شَرِّ مَا خَلَقَ",
        teksLatin: "Min syarri mā khalaq.",
        teksIndonesia: "dari kejahatan (makhluk yang) Dia ciptakan,",
        audioUrl: "https://cdn.equran.id/audio-ayat/Abdurrahman-as-Sudais/113002.mp3"
      },
      {
        nomorAyat: 3,
        teksArab: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ",
        teksLatin: "Wa min syarri gāsiqin iżā waqab.",
        teksIndonesia: "dan dari kejahatan malam apabila telah gelap gulita,",
        audioUrl: "https://cdn.equran.id/audio-ayat/Abdurrahman-as-Sudais/113003.mp3"
      },
      {
        nomorAyat: 4,
        teksArab: "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ",
        teksLatin: "Wa min syarrin-naffāṡāti fil-'uqad.",
        teksIndonesia: "dan dari kejahatan (wanita-wanita) penyihir yang meniup pada buhul-buhul (talinya),",
        audioUrl: "https://cdn.equran.id/audio-ayat/Abdurrahman-as-Sudais/113004.mp3"
      },
      {
        nomorAyat: 5,
        teksArab: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
        teksLatin: "Wa min syarri ḥāsidin iżā ḥasad.",
        teksIndonesia: "dan dari kejahatan orang yang dengki apabila dia dengki.'",
        audioUrl: "https://cdn.equran.id/audio-ayat/Abdurrahman-as-Sudais/113005.mp3"
      }
    ]
  },
  114: {
    nomor: 114,
    nama: "الناس",
    namaLatin: "An-Nas",
    jumlahAyat: 6,
    tempatTurun: "Mekah",
    arti: "Manusia",
    deskripsi: "Surat An-Nas (Manusia) diturunkan bersama Al-Falaq sebagai 'Al-Mu'awwidzatain' (dua surat pelindung) untuk memohon perlindungan dari bisikan was-was setan baik dari kalangan jin maupun manusia.",
    ayat: [
      {
        nomorAyat: 1,
        teksArab: "قُل * أَعُوذُ بِرَبِّ النَّاسِ",
        teksLatin: "Qul a'ūżu birabbin-nās.",
        teksIndonesia: "Katakanlah, 'Aku berlindung kepada Tuhannya manusia,'",
        audioUrl: "https://cdn.equran.id/audio-ayat/Abdurrahman-as-Sudais/114001.mp3"
      },
      {
        nomorAyat: 2,
        teksArab: "مَلِكِ النَّاسِ",
        teksLatin: "Malikin-nās.",
        teksIndonesia: "Raja manusia,",
        audioUrl: "https://cdn.equran.id/audio-ayat/Abdurrahman-as-Sudais/114002.mp3"
      },
      {
        nomorAyat: 3,
        teksArab: "إِلَٰهِ النَّاسِ",
        teksLatin: "Ilāhin-nās.",
        teksIndonesia: "Sembahan manusia,",
        audioUrl: "https://cdn.equran.id/audio-ayat/Abdurrahman-as-Sudais/114003.mp3"
      },
      {
        nomorAyat: 4,
        teksArab: "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ",
        teksLatin: "Min syarril-waswāsil-khannās.",
        teksIndonesia: "dari kejahatan (bisikan) setan yang bersembunyi,",
        audioUrl: "https://cdn.equran.id/audio-ayat/Abdurrahman-as-Sudais/114004.mp3"
      },
      {
        nomorAyat: 5,
        teksArab: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ",
        teksLatin: "Allażī yuwaswisu fī ṣudūrin-nās,",
        teksIndonesia: "yang membisikkan (kejahatan) ke dalam dada manusia,",
        audioUrl: "https://cdn.equran.id/audio-ayat/Abdurrahman-as-Sudais/114005.mp3"
      },
      {
        nomorAyat: 6,
        teksArab: "مِنَ الْجِنَّةِ وَالنَّاسِ",
        teksLatin: "Minal-jinnati wan-nās.",
        teksIndonesia: "dari (golongan) jin dan manusia.'",
        audioUrl: "https://cdn.equran.id/audio-ayat/Abdurrahman-as-Sudais/114006.mp3"
      }
    ]
  }
};

// Arbain Nawawi Compilation (Selected famous ones)
export const HADITH_LIST: Hadith[] = [
  {
    nomor: 1,
    judul: "Niat dan Keikhlasan",
    perawi: "HR. Bukhari & Muslim",
    teksArab: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى، فَمَنْ كَانَتْ هِجْرَتُهُ إِلَى اللَّهِ وَرَسُولِهِ فَهِجْرَتُهُ إِلَى اللَّهِ وَرَسُولِهِ، وَمَنْ كَانَت * هِجْرَتُهُ لِدُنْيَا يُصِيبُهَا أَوِ امْرَأَةٍ يَنْكِحُهَا فَهِجْرَتُهُ إِلَى مَا هَاجَرَ إِلَيْهِ.",
    teksIndonesia: "Sesungguhnya setiap amalan itu bergantung pada niatnya, dan setiap orang hanya akan mendapatkan apa yang ia niatkan. Barangsiapa yang hijrahnya karena Allah dan Rasul-Nya, maka hijrahnya itu kepada Allah dan Rasul-Nya. Dan barangsiapa yang hijrahnya karena dunia yang ingin digapainya atau karena wanita yang ingin dinikahinya, maka hijrahnya itu menuju apa yang ia tuju dalam hijrahnya tersebut.",
    penjelasan: "Hadits ini merupakan landasan utama ajaran Islam. Segala ibadah wajib didasari oleh niat yang tulus ikhlas hanya mengharap keridhaan Allah SWT. Niat membedakan antara rutinitas biasa dengan amal ibadah yang bernilai pahala.",
    tema: "Aqidah & Keikhlasan"
  },
  {
    nomor: 2,
    judul: "Iman, Islam, Ihsan & Kiamat",
    perawi: "HR. Muslim",
    teksArab: "يَا مُحَمَّدُ أَخْبِرْنِي عَنِ الإِسْلاَمِ. فَقَالَ رَسُولُ اللَّهِ صلى الله عليه وسلم: الإِسْلاَمُ أَنْ تَشْهَدَ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَتُقِيمَ الصَّلاَةَ، وَتُؤْتِيَ الزَّكَاةَ، وَتَصُومَ رَمَضَانَ، وَتَحُجَّ الْبَيْتَ إِنِ اسْتَطَعْتَ إِلَيْهِ سَبِيلاً... قَالَ: فَأَخْبِرْنِي عَنِ الإِيمَانِ. قَالَ: أَنْ تُؤْمِنَ بِاللَّهِ وَمَلاَئِكَتِهِ وَكُتُبِهِ وَرُسُلِهِ وَالْيَوْمِ الآخِرِ وَتُؤْمِنَ بِالْقَدَرِ خَيْرِهِ وَشَرِّهِ... قَالَ: فَأَخْبِرْنِي عَنِ الإِحْسَانِ. قَالَ: أَنْ تَعْبُدَ اللَّهَ كَأَنَّكَ تَرَاهُ فَإِنْ لَمْ تَكُنْ تَرَاهُ فَإِنَّهُ يَرَاكَ...",
    teksIndonesia: "Wahai Muhammad, khabarkan kepadaku tentang Islam. Rasulullah bersabda: 'Islam adalah engkau bersaksi tiada tuhan selain Allah dan Muhammad utusan Allah, mendirikan shalat, menunaikan zakat, berpuasa Ramadhan, dan naik haji ke Baitullah jika mampu.' ... Khabarkan kepadaku tentang Iman. Beliau bersabda: 'Engkau beriman kepada Allah, malaikat-malaikat-Nya, kitab-kitab-Nya, rasul-rasul-Nya, hari akhir, dan takdir yang baik maupun yang buruk.' ... Khabarkan kepadaku tentang Ihsan. Beliau bersabda: 'Engkau menyembah Allah seolah-olah engkau melihat-Nya, jika engkau tidak melihat-Nya, maka sesungguhnya Dia melihatmu.'",
    penjelasan: "Dikenal sebagai Hadits Jibril. Menjelaskan tiga tingkatan keberagamaan: Islam (amalan lahiriyah), Iman (keyakinan batiniah), dan Ihsan (kesadaran spiritual mendalam/muraqabah) bahwa Allah SWT selalu mengawasi kita setiap saat.",
    tema: "Pilar Agama (Arkanuddin)"
  },
  {
    nomor: 3,
    judul: "Rukun Islam",
    perawi: "HR. Bukhari & Muslim",
    teksArab: "بُنِيَ الإِسْلاَمُ عَلَى خَمْسٍ: شَهَادَةِ أَنْ لاَ إِلَهَ إِلاَّ اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ، وَإِقَامِ الصَّلاَةِ، وَإِيتَاءِ الزَّكَاةِ، وَحَجِّ الْبَيْتِ، وَصَوْمِ رَمَضَانَ.",
    teksIndonesia: "Islam dibangun di atas lima perkara: Bersaksi bahwa tiada tuhan selain Allah dan Muhammad utusan Allah, mendirikan shalat, menunaikan zakat, naik haji ke Baitullah, dan berpuasa di bulan Ramadhan.",
    penjelasan: "Hadits ini menegaskan lima pilar penyangga bangunan Islam. Jika salah satu pilar ini roboh tanpa alasan syar'i, maka keislaman seseorang terganggu kelayakannya.",
    tema: "Arkanul Islam"
  },
  {
    nomor: 12,
    judul: "Meninggalkan Hal yang Sia-Sia",
    perawi: "HR. Tirmidzi",
    teksArab: "مِنْ حُسْنِ إِسْلاَمِ الْمَرْءِ تَرْكُهُ مَا لاَ يَعْنِيهِ.",
    teksIndonesia: "Di antara tanda kebaikan Islam seseorang adalah dia meninggalkan hal-hal yang tidak bermanfaat baginya.",
    penjelasan: "Pilar penting dalam manajemen diri dan waktu seorang Muslim. Meninggalkan urusan yang tidak mendatangkan kebaikan bagi dunia maupun akhiratnya, termasuk menghindari ghibah, kepo yang tak berdasar, dan membuang waktu.",
    tema: "Akhlaq & Kepribadian"
  },
  {
    nomor: 13,
    judul: "Mencintai Saudara Seiman",
    perawi: "HR. Bukhari & Muslim",
    teksArab: "لاَ يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ.",
    teksIndonesia: "Tidak sempurna iman salah seorang di antara kalian sampai dia mencintai untuk saudaranya apa yang dia cintai untuk dirinya sendiri.",
    penjelasan: "Mengajarkan nilai empati sosial dan persaudaraan (Ukhuwah Islamiyah). Iman yang matang membuang rasa egois, iri, dengki, dan menggantinya dengan keinginan agar saudaranya juga merasakan kebaikan yang sama.",
    tema: "Sosial & Persaudaraan"
  },
  {
    nomor: 15,
    judul: "Berkata Baik, Memuliakan Tetangga & Tamu",
    perawi: "HR. Bukhari & Muslim",
    teksArab: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ، وَمَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيُكْرِمْ جَارَهُ، وَمَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيُكْرِمْ ضَيْفَهُ.",
    teksIndonesia: "Barangsiapa yang beriman kepada Allah dan Hari Akhir, maka hendaklah dia berkata baik atau diam. Barangsiapa yang beriman kepada Allah dan Hari Akhir, maka hendaklah dia memuliakan tetangganya. Dan barangsiapa yang beriman kepada Allah dan Hari Akhir, maka hendaklah dia memuliakan tamunya.",
    penjelasan: "Menghubungkan keimanan transendental secara langsung dengan akhlaq horizontal. Menjaga lisan, bertetangga dengan harmonis, dan memuliakan tamu adalah indikasi nyata iman di dalam dada.",
    tema: "Akhlaq Kemasyarakatan"
  },
  {
    nomor: 18,
    judul: "Bertaqwa Dimanapun Berada",
    perawi: "HR. Tirmidzi",
    teksArab: "اتَّقِ اللَّهَ حَيْثُمَا كُنْتَ، وَأَتْبِعِ السَّيِّئَةَ الْحَسَنَةَ تَمْحُهَا، وَخَالِقِ النَّاسَ بِخُلُقٍ حَسَنٍ.",
    teksIndonesia: "Bertaqwalah kepada Allah di mana saja engkau berada, iringilah keburukan dengan kebaikan niscaya kebaikan itu akan menghapusnya, dan pergaulilah manusia dengan akhlak yang mulia.",
    penjelasan: "Tiga wasiat agung Rasulullah SAW: Habluminallah (kesadaran taqwa kontinu), perbaikan diri internal (menghapus dosa dengan amal shaleh), dan Habluminannas (berakhlak mulia di tengah masyarakat).",
    tema: "Prinsip Hidup Mukmin"
  }
];

// Daily Dhikr (Wirid / Doa)
export interface DhikrItem {
  id: string;
  lafadz: string;
  latin: string;
  arti: string;
  target: number;
  fadhilah: string;
}

export const DHIKR_MORNING: DhikrItem[] = [
  {
    id: "dzikir_1",
    lafadz: "أَعُوذُ بِاللَّهِ مِنَ الشَّيْطَانِ الرَّجِيمِ * اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ ۗ مَن ذَا الَّذِي يَشْفَعُ عِندَهُ إِلَّا بِإِذْنِهِ ۚ يَعْلَمُ مَا بَيْنَ أَيْدِيهِمْ وَمَا خَلْفَهِمْ ۖ وَلَا يُحِيطُونَ بِشَيْءٍ مِّنْ عِلْمِهِ إِلَّا بِمَا شَاءَ ۚ وَسِعَ كُرْسِيُّهُ السَّمَاوَاتِ وَالْأَرْضَ ۖ وَلَا يَئُودُهُ حِفْظُهُمَا ۚ وَهُوَ الْعَلِيُّ الْعَظِيمُ",
    latin: "Allāhu lā ilāha illā huwal-ḥayyul-qayyūm, lā ta'khużuhū sinatuw wa lā naūm, lahū mā fis-samāwāti wa mā fil-arḍ, man żal-lażī yasyfa'u 'indahū illā bi'iżnih, ya'lamu mā baina aidīhim wa mā khalfahum, wa lā yuḥīṭūna bisyayi'im min 'ilmihī illā bimā syā', wasi'a kursiyyuhus-samāwāti wal-arḍ, wa lā ya'ūduhū ḥifẓuhumā, wa huwal-'aliyyul-'aẓīm.",
    arti: "Allah, tidak ada tuhan selain Dia. Yang Maha Hidup, yang terus-menerus mengurus (makhluk-Nya), tidak mengantuk dan tidak tidur. Milik-Nya apa yang ada di langit dan apa yang ada di bumi. Tidak ada yang dapat memberi syafaat di sisi-Nya tanpa izin-Nya. Dia mengetahui apa yang di hadapan mereka dan apa yang di belakang mereka, dan mereka tidak mengetahui sesuatu apa pun tentang ilmu-Nya melainkan apa yang Dia kehendaki. Kursi-Nya meliputi langit dan bumi. Dan Dia tidak merasa berat memelihara keduanya, dan Dia Maha Tinggi, Maha Besar. (Ayat Kursi)",
    target: 1,
    fadhilah: "Mendapat perlindungan dari gangguan setan hingga petang hari."
  },
  {
    id: "dzikir_2",
    lafadz: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ",
    latin: "Allāhumma bika aṣbaḥnā, wa bika amsaynā, wa bika naḥyā, wa bika namūtu, wa ilaykan-nusyūr.",
    arti: "Ya Allah, dengan rahmat dan pertolongan-Mu kami memasuki waktu pagi, dan dengan rahmat-Mu kami memasuki waktu petang. Dengan rahmat-Mu kami hidup, dengan takdir-Mu kami mati, dan kepada-Mu tempat kembali.",
    target: 1,
    fadhilah: "Doa syukur menyambut pagi hari yang diajarkan Rasulullah SAW."
  },
  {
    id: "dzikir_3",
    lafadz: "سُبْحَانَ اللهِ وَبِحَمْدِهِ",
    latin: "Subḥānallāhi wa biḥamdih.",
    arti: "Maha Suci Allah dan dengan memuji-Nya.",
    target: 100,
    fadhilah: "Dihapus dosa-dosanya meskipun sebanyak buih di lautan jika dibaca 100 kali dalam sehari."
  },
  {
    id: "dzikir_4",
    lafadz: "أَسْتَغْفِرُ اللهَ وَأَتُوْبُ إِلَيْهِ",
    latin: "Astagfirullāha wa atūbu ilaih.",
    arti: "Aku memohon ampunan kepada Allah dan aku bertaubat kepada-Nya.",
    target: 100,
    fadhilah: "Melapangkan rezeki, menghapus dosa, dan memberikan ketenangan hati."
  },
  {
    id: "dzikir_5",
    lafadz: "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ",
    latin: "Allāhumma ṣalli wa sallim 'alā nabiyyinā Muḥammad.",
    arti: "Ya Allah, limpahkanlah shalawat dan salam kepada Nabi kami Muhammad.",
    target: 10,
    fadhilah: "Mendapatkan syafaat Rasulullah SAW di hari kiamat kelak."
  }
];
