'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Book, 
  Search, 
  Volume2, 
  VolumeX, 
  Bookmark, 
  FileText, 
  Sparkles, 
  Compass, 
  RotateCcw, 
  Plus, 
  Play, 
  Pause, 
  HelpCircle, 
  ChevronRight, 
  Check, 
  Sliders, 
  BookmarkCheck, 
  MessageSquare, 
  ArrowRight, 
  Calculator, 
  Settings, 
  Send,
  Moon,
  Sun,
  BookOpen,
  Info,
  UploadCloud,
  Trash2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { type PesantrenKitab, saveKitab, getAllKitabs, deleteKitab, isUsingMemoryFallback } from '../lib/indexed-db';
import dynamic from 'next/dynamic';

const PdfViewer = dynamic(() => import('../components/PdfViewer'), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center h-full text-stone-500 font-serif gap-2 bg-stone-50">
      <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-serif">Memuat Penampil PDF...</span>
    </div>
  ),
});

import { 
  SURAH_LIST, 
  LOCAL_SURAHS, 
  HADITH_LIST, 
  DHIKR_MORNING, 
  type SurahHeader, 
  type SurahDetails, 
  type Verse, 
  type Hadith, 
  type DhikrItem 
} from '../lib/quran-data';

export default function KitabDigital() {
  // Navigation & Tab state
  const [activeTab, setActiveTab] = useState<'quran' | 'hadith' | 'dzikir' | 'tasbih' | 'zakat' | 'pesantren'>('quran');
  
  // Al-Quran state
  const [selectedSurahNo, setSelectedSurahNo] = useState<number>(1);
  const [surahDetails, setSurahDetails] = useState<SurahDetails | null>(null);
  const [isLoadingSurah, setIsLoadingSurah] = useState<boolean>(false);
  const [surahError, setSurahError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Customization state
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('lg');
  const [showTransliteration, setShowTransliteration] = useState<boolean>(true);
  const [showTranslation, setShowTranslation] = useState<boolean>(true);
  const [selectedReciter, setSelectedReciter] = useState<string>('01'); // 01 is Abdurrahman as-Sudais

  // Audio Playback states
  const [fullSurahAudio, setFullSurahAudio] = useState<HTMLAudioElement | null>(null);
  const [isFullSurahPlaying, setIsFullSurahPlaying] = useState<boolean>(false);
  const [activeVerseAudio, setActiveVerseAudio] = useState<HTMLAudioElement | null>(null);
  const [playingVerseId, setPlayingVerseId] = useState<string | null>(null);

  // AI Assistant state
  const [isAiOpen, setIsAiOpen] = useState<boolean>(false);
  const [aiContext, setAiContext] = useState<{
    type: 'verse' | 'hadith' | 'general';
    reference: string;
    arabic: string;
    translation: string;
  } | null>(null);
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [customQuestion, setCustomQuestion] = useState<string>('');
  const [initialAiOutput, setInitialAiOutput] = useState<{
    explanation?: string;
    lessons?: string[];
    actions?: string[];
    relatedContext?: string;
  } | null>(null);

  // Personalization / Storage states
  const [bookmarks, setBookmarks] = useState<Array<{
    id: string;
    type: 'verse' | 'hadith';
    reference: string;
    arabic: string;
    translation: string;
    surahNo?: number;
    verseNo?: number;
    hadithNo?: number;
    addedAt?: string;
  }>>([]);
  const [notes, setNotes] = useState<Record<string, string>>({}); // keys: 'verse-{surah}-{verse}' or 'hadith-{no}'
  const [activeNoteEditKey, setActiveNoteEditKey] = useState<string | null>(null);
  const [noteInputText, setNoteInputText] = useState<string>('');

  // Dhikr Counter & Tasbih states
  const [activeDhikrIndex, setActiveDhikrIndex] = useState<number>(0);
  const [dhikrCounts, setDhikrCounts] = useState<Record<string, number>>({});
  const [tasbihTotal, setTasbihTotal] = useState<number>(0);
  const [tasbihTarget, setTasbihTarget] = useState<number>(33);
  const [tasbihLabel, setTasbihLabel] = useState<string>('Subhanallah');
  const [tasbihHistory, setTasbihHistory] = useState<Array<{ title: string; count: number; date: string }>>([]);

  // Zakat Calculator state
  const [goldPrice, setGoldPrice] = useState<number>(1400000); // Default ~Rp 1.4M / gram
  const [zakatTab, setZakatTab] = useState<'maal' | 'fitrah'>('maal');
  const [zakatInputs, setZakatInputs] = useState({
    tabungan: 0,
    emasPerak: 0,
    investasi: 0,
    perdagangan: 0,
    pertanian: 0,
    hutang: 0,
  });
  const [zakatFitrahJiwa, setZakatFitrahJiwa] = useState<number>(1);
  const [berasPrice, setBerasPrice] = useState<number>(15000); // Rp per kg

  // Kitab Pesantren state & handlers
  const [pesantrenKitabs, setPesantrenKitabs] = useState<PesantrenKitab[]>([]);
  const [selectedKitab, setSelectedKitab] = useState<PesantrenKitab | null>(null);
  const [selectedKitabUrl, setSelectedKitabUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [isMemoryOnly, setIsMemoryOnly] = useState<boolean>(false);
  const [isIframe, setIsIframe] = useState<boolean>(false);
  
  // Kitab form state
  const [newKitabNama, setNewKitabNama] = useState<string>('');
  const [newKitabKategori, setNewKitabKategori] = useState<string>('Fiqih');
  const [newKitabDeskripsi, setNewKitabDeskripsi] = useState<string>('');

  // Handle Kitab Selection
  const handleSelectKitab = (kitab: PesantrenKitab) => {
    setSelectedKitab(kitab);
    if (selectedKitabUrl) {
      URL.revokeObjectURL(selectedKitabUrl);
    }
    const url = URL.createObjectURL(kitab.blob);
    setSelectedKitabUrl(url);
  };

  // Drag & Drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    setUploadError(null);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      await processUploadedFile(file);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setUploadError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      await processUploadedFile(file);
    }
  };

  const processUploadedFile = async (file: File) => {
    if (file.type !== "application/pdf") {
      setUploadError("Hanya file PDF yang didukung.");
      return;
    }

    setIsUploading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: "application/pdf" });
      
      const newKitab: PesantrenKitab = {
        id: `kitab-${Date.now()}`,
        nama: newKitabNama.trim() || file.name.replace(/\.[^/.]+$/, ""),
        kategori: newKitabKategori,
        deskripsi: newKitabDeskripsi.trim() || "Tidak ada deskripsi.",
        fileName: file.name,
        fileSize: file.size,
        uploadedAt: new Date().toLocaleString('id-ID'),
        blob: blob
      };

      await saveKitab(newKitab);
      const updatedKitabs = await getAllKitabs();
      setPesantrenKitabs(updatedKitabs);
      setIsMemoryOnly(isUsingMemoryFallback());
      
      // Select the newly uploaded kitab automatically
      handleSelectKitab(newKitab);

      // Clear form inputs
      setNewKitabNama('');
      setNewKitabDeskripsi('');
    } catch (err) {
      console.error(err);
      setUploadError("Gagal memproses dan menyimpan file PDF.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteKitab = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus kitab ini dari rak?")) {
      try {
        await deleteKitab(id);
        const updatedKitabs = await getAllKitabs();
        setPesantrenKitabs(updatedKitabs);
        if (selectedKitab?.id === id) {
          setSelectedKitab(null);
          if (selectedKitabUrl) {
            URL.revokeObjectURL(selectedKitabUrl);
            setSelectedKitabUrl(null);
          }
        }
      } catch (err) {
        console.error(err);
        alert("Gagal menghapus kitab.");
      }
    }
  };

  // Clean up audio players & PDF object URL on unmount
  useEffect(() => {
    return () => {
      if (fullSurahAudio) {
        fullSurahAudio.pause();
      }
      if (activeVerseAudio) {
        activeVerseAudio.pause();
      }
      if (selectedKitabUrl) {
        URL.revokeObjectURL(selectedKitabUrl);
      }
    };
  }, [fullSurahAudio, activeVerseAudio, selectedKitabUrl]);

  // Chat window bottom ref for scrolling
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Handle Loading Surah Details - Declared standard function to avoid hoisting issues and support reactive effects
  async function loadSurahDetails(nomor: number) {
    setIsLoadingSurah(true);
    setSurahError(null);
    
    // Stop any playing audio
    stopAllAudio();

    try {
      // 1. Check local offline cache
      if (LOCAL_SURAHS[nomor]) {
        setSurahDetails(LOCAL_SURAHS[nomor]);
        setIsLoadingSurah(false);
        return;
      }

      // 2. Dynamic Fetch from equran.id API
      const response = await fetch(`https://equran.id/api/v2/surat/${nomor}`);
      if (!response.ok) {
        throw new Error("Gagal mengunduh surat dari server.");
      }
      const result = await response.json();
      
      if (result.code === 200 && result.data) {
        const data = result.data;
        const detailed: SurahDetails = {
          nomor: data.nomor,
          nama: data.nama,
          namaLatin: data.namaLatin,
          jumlahAyat: data.jumlahAyat,
          tempatTurun: data.tempatTurun,
          arti: data.arti,
          deskripsi: data.deskripsi,
          ayat: data.ayat.map((ay: any) => ({
            nomorAyat: ay.nomorAyat,
            teksArab: ay.teksArab,
            teksLatin: ay.teksLatin,
            teksIndonesia: ay.teksIndonesia,
            // Reciter 01 is Sudais, if missing find first key
            audioUrl: ay.audio ? (ay.audio[selectedReciter] || ay.audio['01'] || Object.values(ay.audio)[0]) : ''
          }))
        };
        setSurahDetails(detailed);
      } else {
        throw new Error("Format data tidak sesuai.");
      }
    } catch (err: any) {
      console.error(err);
      setSurahError(
        "Koneksi lambat atau sedang offline. Menampilkan Surat Al-Fatihah sebagai cadangan. Anda tetap dapat membaca Surat Al-Fatihah, Al-Ikhlas, Al-Falaq, dan An-Nas secara luring."
      );
      // fallback to offline Al-Fatihah
      setSurahDetails(LOCAL_SURAHS[1]);
    } finally {
      setIsLoadingSurah(false);
    }
  }

  // Initialize and load persistent data
  useEffect(() => {
    const storedBookmarks = localStorage.getItem('kitab_bookmarks');
    const storedNotes = localStorage.getItem('kitab_notes');
    const storedTasbihHistory = localStorage.getItem('kitab_tasbih_history');

    Promise.resolve().then(async () => {
      if (storedBookmarks) {
        try { setBookmarks(JSON.parse(storedBookmarks)); } catch(e) {}
      }
      
      if (storedNotes) {
        try { setNotes(JSON.parse(storedNotes)); } catch(e) {}
      }

      if (storedTasbihHistory) {
        try { setTasbihHistory(JSON.parse(storedTasbihHistory)); } catch(e) {}
      }

      if (typeof window !== 'undefined') {
        setIsIframe(window.self !== window.top);
      }

      try {
        const kitabs = await getAllKitabs();
        setPesantrenKitabs(kitabs);
        setIsMemoryOnly(isUsingMemoryFallback());
      } catch (err) {
        console.error("Gagal memuat Kitab Pesantren:", err);
      }

      loadSurahDetails(1);
    });
  }, []);

  // Change Surah Selector
  const handleSelectSurah = (nomor: number) => {
    setSelectedSurahNo(nomor);
    loadSurahDetails(nomor);
  };

  // Stop all active audio playbacks
  function stopAllAudio() {
    if (fullSurahAudio) {
      fullSurahAudio.pause();
      setIsFullSurahPlaying(false);
    }
    if (activeVerseAudio) {
      activeVerseAudio.pause();
      setPlayingVerseId(null);
    }
  }

  // Play individual verse audio
  const handlePlayVerseAudio = (verse: Verse, idStr: string) => {
    if (playingVerseId === idStr) {
      // already playing, toggle pause
      if (activeVerseAudio) {
        activeVerseAudio.pause();
        setPlayingVerseId(null);
      }
      return;
    }

    // Stop existing audio
    stopAllAudio();

    if (!verse.audioUrl) {
      alert("Audio tidak tersedia untuk ayat ini.");
      return;
    }

    const audio = new Audio(verse.audioUrl);
    audio.play()
      .then(() => {
        setActiveVerseAudio(audio);
        setPlayingVerseId(idStr);
      })
      .catch((e) => {
        console.error("Audio playback error:", e);
        alert("Gagal memutar audio. Silakan periksa koneksi internet Anda.");
      });

    audio.onended = () => {
      setPlayingVerseId(null);
    };
  };

  // Play Full Surah Murottal (Dynamic URL from equran API)
  const handleToggleFullMurottal = () => {
    if (isFullSurahPlaying) {
      if (fullSurahAudio) {
        fullSurahAudio.pause();
        setIsFullSurahPlaying(false);
      }
      return;
    }

    stopAllAudio();

    const formattedNo = String(selectedSurahNo).padStart(3, '0');
    // We can use Sudais or any other premium murottal source
    const murottalUrl = `https://cdn.equran.id/audio-full/Abdurrahman-as-Sudais/${formattedNo}.mp3`;

    const audio = new Audio(murottalUrl);
    audio.play()
      .then(() => {
        setFullSurahAudio(audio);
        setIsFullSurahPlaying(true);
      })
      .catch((err) => {
        console.error(err);
        alert("Gagal memutar audio murottal surat penuh. Silakan periksa jaringan internet Anda.");
      });

    audio.onended = () => {
      setIsFullSurahPlaying(false);
    };
  };

  // Bookmark verse / hadith
  const handleToggleBookmark = (
    type: 'verse' | 'hadith',
    ref: string,
    arab: string,
    indo: string,
    meta?: { surahNo?: number; verseNo?: number; hadithNo?: number }
  ) => {
    const bookmarkId = type === 'verse' 
      ? `verse-${meta?.surahNo}-${meta?.verseNo}` 
      : `hadith-${meta?.hadithNo}`;

    const exists = bookmarks.find(b => b.id === bookmarkId);

    let updated;
    if (exists) {
      updated = bookmarks.filter(b => b.id !== bookmarkId);
    } else {
      updated = [
        ...bookmarks,
        {
          id: bookmarkId,
          type,
          reference: ref,
          arabic: arab,
          translation: indo,
          surahNo: meta?.surahNo,
          verseNo: meta?.verseNo,
          hadithNo: meta?.hadithNo,
          addedAt: new Date().toLocaleString('id-ID')
        }
      ];
    }
    setBookmarks(updated);
    localStorage.setItem('kitab_bookmarks', JSON.stringify(updated));
  };

  // Notes handling
  const handleSaveNote = (key: string) => {
    const updatedNotes = {
      ...notes,
      [key]: noteInputText
    };
    if (!noteInputText.trim()) {
      delete updatedNotes[key];
    }
    setNotes(updatedNotes);
    localStorage.setItem('kitab_notes', JSON.stringify(updatedNotes));
    setActiveNoteEditKey(null);
  };

  const startEditNote = (key: string, currentText: string) => {
    setActiveNoteEditKey(key);
    setNoteInputText(currentText || '');
  };

  // AI Explainer logic
  const handleAskAI = async (
    type: 'verse' | 'hadith' | 'general',
    ref: string,
    arab: string,
    translation: string
  ) => {
    setIsAiOpen(true);
    setAiLoading(true);
    setInitialAiOutput(null);
    setAiContext({ type, reference: ref, arabic: arab, translation });
    
    // Set initial question
    const defaultQuestion = type === 'verse' 
      ? `Tolong jelaskan secara mendalam tentang Ayat ini (${ref}), berikan hikmah dan panduan amalan nyata sehari-hari.`
      : `Tolong jelaskan secara mendalam tentang Hadits ini (${ref}), berikan pelajaran moral spiritual dan panduan amalan nyata.`;

    setChatHistory([
      { role: 'user', content: defaultQuestion }
    ]);

    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          reference: ref,
          arabic: arab,
          translation
        })
      });

      if (!response.ok) {
        let errorMsg = "Terjadi masalah pada asisten AI.";
        try {
          const errData = await response.json();
          if (errData && errData.error) {
            errorMsg = errData.error;
          }
        } catch (_) {}
        throw new Error(errorMsg);
      }
      const data = await response.json();
      
      setInitialAiOutput(data);
      
      // Append AI response to chat history
      let structuredMessage = `${data.explanation || 'Berikut penjelasannya:'}\n\n`;
      
      if (data.lessons && data.lessons.length > 0) {
        structuredMessage += `**Pelajaran Utama (Hikmah):**\n`;
        data.lessons.forEach((l: string, i: number) => {
          structuredMessage += `${i + 1}. ${l}\n`;
        });
        structuredMessage += `\n`;
      }

      if (data.actions && data.actions.length > 0) {
        structuredMessage += `**Amalan Praktis Sehari-hari:**\n`;
        data.actions.forEach((a: string, i: number) => {
          structuredMessage += `• ${a}\n`;
        });
        structuredMessage += `\n`;
      }

      if (data.relatedContext) {
        structuredMessage += `**Konteks Tambahan:**\n${data.relatedContext}`;
      }

      setChatHistory(prev => [
        ...prev,
        { role: 'assistant', content: structuredMessage }
      ]);

    } catch (err: any) {
      console.error(err);
      setChatHistory(prev => [
        ...prev,
        { role: 'assistant', content: `Mohon maaf, saya mengalami kesulitan untuk tersambung ke jaringan spiritual AI saat ini. Detail kendala: ${err?.message || err}. Silakan dicoba lagi nanti.` }
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  // Follow up chat with AI
  const handleSendChatFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim() || aiLoading || !aiContext) return;

    const userText = customQuestion;
    setCustomQuestion('');
    setAiLoading(true);

    const updatedHistory = [
      ...chatHistory,
      { role: 'user' as const, content: userText }
    ];

    setChatHistory(updatedHistory);

    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: aiContext.type,
          reference: aiContext.reference,
          arabic: aiContext.arabic,
          translation: aiContext.translation,
          question: userText,
          chatHistory: updatedHistory.slice(-6), // Send last 6 messages to keep context short and clear
          isFollowUp: true
        })
      });

      if (!response.ok) {
        let errorMsg = "Terjadi gangguan koneksi.";
        try {
          const errData = await response.json();
          if (errData && errData.error) {
            errorMsg = errData.error;
          }
        } catch (_) {}
        throw new Error(errorMsg);
      }
      const data = await response.json();

      setChatHistory(prev => [
        ...prev,
        { role: 'assistant', content: data.text || "Terima kasih atas pertanyaannya. Mari kita terus mengkaji hikmah di balik ayat-ayat suci." }
      ]);
    } catch (err: any) {
      setChatHistory(prev => [
        ...prev,
        { role: 'assistant', content: `Maaf, terjadi gangguan koneksi atau kendala server: ${err?.message || err}. Silakan kirimkan kembali pertanyaan Anda.` }
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  // Tasbih state handler
  const handleTasbihClick = () => {
    const currentCount = (dhikrCounts[tasbihLabel] || 0) + 1;
    const updatedCounts = {
      ...dhikrCounts,
      [tasbihLabel]: currentCount
    };
    setDhikrCounts(updatedCounts);
    setTasbihTotal(prev => prev + 1);

    // simple vibration on target reached
    if (currentCount === tasbihTarget && navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
  };

  const handleResetTasbih = () => {
    if (confirm(`Simpan hitungan "${tasbihLabel}" sebanyak ${dhikrCounts[tasbihLabel] || 0} ke dalam riwayat?`)) {
      const historyItem = {
        title: tasbihLabel,
        count: dhikrCounts[tasbihLabel] || 0,
        date: new Date().toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };
      const updatedHistory = [historyItem, ...tasbihHistory].slice(0, 15);
      setTasbihHistory(updatedHistory);
      localStorage.setItem('kitab_tasbih_history', JSON.stringify(updatedHistory));
    }
    
    setDhikrCounts({
      ...dhikrCounts,
      [tasbihLabel]: 0
    });
  };

  // Zakat calculations
  const calculateZakatMaal = () => {
    const totalHarta = 
      (zakatInputs.tabungan || 0) + 
      (zakatInputs.emasPerak || 0) + 
      (zakatInputs.investasi || 0) + 
      (zakatInputs.perdagangan || 0) + 
      (zakatInputs.pertanian || 0) - 
      (zakatInputs.hutang || 0);

    // Nisab is equivalent to 85 grams of gold
    const nisabThreshold = 85 * goldPrice;
    const isZakatMandatory = totalHarta >= nisabThreshold;
    const zakatToPay = isZakatMandatory ? totalHarta * 0.025 : 0;

    return {
      totalHarta,
      nisabThreshold,
      isZakatMandatory,
      zakatToPay
    };
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(num);
  };

  // Filtering list based on search
  const filteredSurahs = SURAH_LIST.filter(s => 
    s.namaLatin.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.arti.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.nomor.toString() === searchQuery
  );

  const filteredHadiths = HADITH_LIST.filter(h => 
    h.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.tema.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.teksIndonesia.toLowerCase().includes(searchQuery.toLowerCase()) ||
    h.nomor.toString() === searchQuery
  );

  return (
    <div className="min-h-screen bg-[#f7f5ef] text-stone-800 flex flex-col relative overflow-x-hidden selection:bg-amber-100 selection:text-amber-900" id="kitab-main-app">
      
      {/* HEADER SECTION */}
      <header className="border-b border-stone-200 bg-white/90 backdrop-blur-md sticky top-0 z-40 px-4 py-3 md:px-8 shadow-xs" id="app-header">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-900 text-amber-400 rounded-xl shadow-md border border-amber-500/20">
              <BookOpen className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-emerald-950 font-serif">Kitab Digital</h1>
              <p className="text-xs text-stone-500 font-medium">Al-Quran Kemenag • Hadits Arbain • Asisten AI</p>
            </div>
          </div>

          {/* Quick Stats or Theme Settings */}
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={() => setIsAiOpen(prev => !prev)}
              className="flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-medium text-xs md:text-sm rounded-lg hover:from-amber-600 hover:to-amber-700 shadow-sm transition-all transform active:scale-95 cursor-pointer"
              title="Tanya Ustadz AI"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Ustadz AI</span>
            </button>
            
            {/* Quick Bookmark View Icon */}
            <div className="relative group">
              <button 
                onClick={() => {
                  setActiveTab('quran');
                  setSearchQuery('bookmark'); // easily filter bookmarks if typed, but let's provide direct click
                }}
                className="p-2 text-stone-600 hover:text-emerald-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
                title="Buka Bookmark"
              >
                <Bookmark className="w-5 h-5" />
                {bookmarks.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                    {bookmarks.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* SUB HEADER NAV BAR */}
      <nav className="bg-emerald-900 text-white/90 shadow-inner px-4 overflow-x-auto scrollbar-none" id="main-navigation">
        <div className="max-w-7xl mx-auto flex items-center gap-1 md:gap-4 py-1.5">
          <button 
            onClick={() => { setActiveTab('quran'); setSearchQuery(''); }}
            className={`px-4 py-2 text-xs md:text-sm font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${activeTab === 'quran' ? 'bg-amber-500 text-emerald-950 shadow-md font-semibold' : 'hover:bg-white/10 text-stone-200'}`}
          >
            <Book className="w-4 h-4" />
            Al-Quran Digital
          </button>
          
          <button 
            onClick={() => { setActiveTab('hadith'); setSearchQuery(''); }}
            className={`px-4 py-2 text-xs md:text-sm font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${activeTab === 'hadith' ? 'bg-amber-500 text-emerald-950 shadow-md font-semibold' : 'hover:bg-white/10 text-stone-200'}`}
          >
            <BookOpen className="w-4 h-4" />
            Hadits Arbain
          </button>

          <button 
            onClick={() => { setActiveTab('dzikir'); setSearchQuery(''); }}
            className={`px-4 py-2 text-xs md:text-sm font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${activeTab === 'dzikir' ? 'bg-amber-500 text-emerald-950 shadow-md font-semibold' : 'hover:bg-white/10 text-stone-200'}`}
          >
            <Compass className="w-4 h-4" />
            Muthola&apos;ah Dzikir Pagi
          </button>

          <button 
            onClick={() => { setActiveTab('tasbih'); setSearchQuery(''); }}
            className={`px-4 py-2 text-xs md:text-sm font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${activeTab === 'tasbih' ? 'bg-amber-500 text-emerald-950 shadow-md font-semibold' : 'hover:bg-white/10 text-stone-200'}`}
          >
            <RotateCcw className="w-4 h-4" />
            Tasbih Digital
          </button>

          <button 
            onClick={() => { setActiveTab('zakat'); setSearchQuery(''); }}
            className={`px-4 py-2 text-xs md:text-sm font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${activeTab === 'zakat' ? 'bg-amber-500 text-emerald-950 shadow-md font-semibold' : 'hover:bg-white/10 text-stone-200'}`}
          >
            <Calculator className="w-4 h-4" />
            Kalkulator Zakat
          </button>

          <button 
            onClick={() => { setActiveTab('pesantren'); setSearchQuery(''); }}
            className={`px-4 py-2 text-xs md:text-sm font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${activeTab === 'pesantren' ? 'bg-amber-500 text-emerald-950 shadow-md font-semibold' : 'hover:bg-white/10 text-stone-200'}`}
          >
            <FileText className="w-4 h-4" />
            Kitab Pesantren
          </button>
        </div>
      </nav>

      {/* CORE WORKSPACE */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-4 md:py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 relative" id="workspace-grid">
        
        {/* LEFT COLUMN - NAVIGATION DIRECTORY / DIRECTORY LIST */}
        <section className="lg:col-span-4 bg-white rounded-2xl shadow-xs border border-stone-200 overflow-hidden flex flex-col h-[500px] lg:h-[750px] transition-all" id="directory-sidebar">
          
          {/* List Search & Header */}
          <div className="p-4 border-b border-stone-150 bg-stone-50/50">
            <h2 className="text-stone-800 font-serif font-semibold text-lg flex items-center gap-2">
              {activeTab === 'quran' && 'Daftar Surat'}
              {activeTab === 'hadith' && 'Kitab Hadits Arbain'}
              {activeTab === 'dzikir' && 'Wird & Dzikir Ma\'tsurat'}
              {activeTab === 'tasbih' && 'Counter Dzikir & Shalawat'}
              {activeTab === 'zakat' && 'Menu Simulasi Zakat'}
              {activeTab === 'pesantren' && 'Kitab Pesantren (PDF)'}
            </h2>
            <p className="text-xs text-stone-500 mb-3">
              {activeTab === 'quran' && 'Pilih surat untuk mulai mengaji & mendalami makna'}
              {activeTab === 'hadith' && 'Kumpulan hadits rujukan utama umat Islam'}
              {activeTab === 'dzikir' && 'Amalan dzikir pagi pelindung diri sehari-hari'}
              {activeTab === 'tasbih' && 'Fokus dzikir & istighfar harian'}
              {activeTab === 'zakat' && 'Zakat Maal & Zakat Fitrah Indonesia'}
              {activeTab === 'pesantren' && 'Membaca dan menelaah kitab-kitab pesantren Anda'}
            </p>

            {/* Search Input for Quran / Hadith */}
            {(activeTab === 'quran' || activeTab === 'hadith') && (
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  placeholder={activeTab === 'quran' ? "Cari Surat (contoh: Yasin, Kahf)..." : "Cari judul/materi hadits..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-sm pl-9 pr-4 py-2 border border-stone-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800 bg-white"
                />
              </div>
            )}
          </div>

          {/* Dynamic Scroll List */}
          <div className="flex-1 overflow-y-auto divide-y divide-stone-100">
            
            {/* AL-QURAN SURAH DIRECTORY */}
            {activeTab === 'quran' && (
              <>
                {filteredSurahs.length === 0 ? (
                  <div className="p-8 text-center text-stone-500 text-sm">
                    Surat &ldquo;{searchQuery}&rdquo; tidak ditemukan.
                  </div>
                ) : (
                  filteredSurahs.map((surah) => {
                    const isSelected = selectedSurahNo === surah.nomor;
                    const isLocal = !!LOCAL_SURAHS[surah.nomor];
                    return (
                      <button
                        key={surah.nomor}
                        onClick={() => handleSelectSurah(surah.nomor)}
                        className={`w-full text-left p-3.5 flex items-center justify-between transition-colors cursor-pointer ${isSelected ? 'bg-amber-500/10 border-l-4 border-emerald-800' : 'hover:bg-stone-50/70'}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${isSelected ? 'bg-emerald-900 text-amber-400' : 'bg-stone-100 text-stone-600'}`}>
                            {surah.nomor}
                          </div>
                          <div>
                            <div className="font-semibold text-stone-800 text-sm md:text-base flex items-center gap-1.5">
                              {surah.namaLatin}
                              {isLocal && (
                                <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-sans font-normal">Offline</span>
                              )}
                            </div>
                            <div className="text-xs text-stone-500">
                              {surah.arti} • {surah.jumlahAyat} Ayat
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-serif text-lg font-semibold text-emerald-900 block font-arabic leading-none mb-1">
                            {surah.nama}
                          </span>
                          <span className="text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded uppercase font-medium">
                            {surah.tempatTurun}
                          </span>
                        </div>
                      </button>
                    );
                  })
                )}
              </>
            )}

            {/* HADITH DIRECTORY */}
            {activeTab === 'hadith' && (
              <>
                {filteredHadiths.map((hadith) => {
                  const isBookmarked = bookmarks.some(b => b.id === `hadith-${hadith.nomor}`);
                  return (
                    <button
                      key={hadith.nomor}
                      onClick={() => {
                        // We scroll to hadith on main page or select it
                        const element = document.getElementById(`hadith-card-${hadith.nomor}`);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                      }}
                      className="w-full text-left p-3.5 hover:bg-stone-50 flex items-start gap-3 transition-colors cursor-pointer"
                    >
                      <div className="w-8 h-8 shrink-0 rounded-lg bg-amber-500/10 text-emerald-900 flex items-center justify-center text-xs font-bold font-mono">
                        {hadith.nomor}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-semibold text-stone-800 text-sm truncate">{hadith.judul}</span>
                          {isBookmarked && <Bookmark className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />}
                        </div>
                        <p className="text-xs text-stone-500 truncate mb-1">{hadith.perawi}</p>
                        <span className="inline-block text-[10px] bg-stone-100 text-emerald-800 px-2 py-0.5 rounded font-medium">
                          {hadith.tema}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </>
            )}

            {/* DHIKR DIRECTORY LIST */}
            {activeTab === 'dzikir' && (
              <>
                {DHIKR_MORNING.map((dhikr, idx) => {
                  const isCurrent = activeDhikrIndex === idx;
                  const currentCount = dhikrCounts[dhikr.id] || 0;
                  return (
                    <button
                      key={dhikr.id}
                      onClick={() => setActiveDhikrIndex(idx)}
                      className={`w-full text-left p-4 transition-colors cursor-pointer ${isCurrent ? 'bg-amber-500/10 border-l-4 border-emerald-800' : 'hover:bg-stone-50'}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Bagian {idx + 1}</span>
                        {currentCount >= dhikr.target ? (
                          <span className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                            <Check className="w-3 h-3" /> Selesai
                          </span>
                        ) : (
                          <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-semibold">
                            Target: {dhikr.target}x
                          </span>
                        )}
                      </div>
                      <h4 className="text-stone-800 font-semibold text-sm line-clamp-1">{dhikr.arti}</h4>
                      <p className="text-xs text-stone-500 mt-1 line-clamp-1 italic">{dhikr.latin}</p>
                    </button>
                  );
                })}
              </>
            )}

            {/* TASBIH SETTINGS DIRECTORY */}
            {activeTab === 'tasbih' && (
              <div className="p-4 space-y-4">
                <h3 className="font-serif font-semibold text-stone-800 text-sm">Pilih Lafadz Dzikir</h3>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { label: 'Subhanallah', arabic: 'سُبْحَانَ اللهِ' },
                    { label: 'Alhamdulillah', arabic: 'الْحَمْدُ للهِ' },
                    { label: 'Allahu Akbar', arabic: 'اللهُ أَكْبَرُ' },
                    { label: 'La ilaha illallah', arabic: 'لَا إِلٰهَ إِلَّا اللهُ' },
                    { label: 'Astaghfirullah', arabic: 'أَسْتَغْفِرُ اللهَ' },
                    { label: 'Shalawat Nabi', arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ' }
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => {
                        setTasbihLabel(preset.label);
                        // reset current count if switching or keep
                      }}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${tasbihLabel === preset.label ? 'bg-emerald-900 border-emerald-900 text-white shadow-sm' : 'bg-stone-50 border-stone-200 hover:bg-stone-100'}`}
                    >
                      <div>
                        <div className="font-semibold text-sm">{preset.label}</div>
                        <div className={`text-[10px] ${tasbihLabel === preset.label ? 'text-amber-300' : 'text-stone-500'}`}>
                          Hitungan: {dhikrCounts[preset.label] || 0}
                        </div>
                      </div>
                      <span className="font-serif font-semibold text-base font-arabic">{preset.arabic}</span>
                    </button>
                  ))}
                </div>

                {/* Target adjustment */}
                <div className="space-y-2 pt-2 border-t border-stone-100">
                  <span className="text-xs font-semibold text-stone-500 block">Atur Target Dzikir</span>
                  <div className="grid grid-cols-4 gap-2">
                    {[33, 99, 100, 1000].map((t) => (
                      <button
                        key={t}
                        onClick={() => setTasbihTarget(t)}
                        className={`py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${tasbihTarget === t ? 'bg-amber-500 border-amber-500 text-emerald-950 shadow-xs' : 'bg-white border-stone-200 hover:bg-stone-100 text-stone-700'}`}
                      >
                        {t}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ZAKAT MENU */}
            {activeTab === 'zakat' && (
              <div className="p-4 space-y-4">
                <span className="text-xs font-semibold text-stone-500 block uppercase tracking-wider">Metode Perhitungan</span>
                
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setZakatTab('maal')}
                    className={`py-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${zakatTab === 'maal' ? 'bg-emerald-900 text-white border-emerald-900 shadow-sm' : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100'}`}
                  >
                    Zakat Maal (Harta)
                  </button>
                  <button
                    onClick={() => setZakatTab('fitrah')}
                    className={`py-2.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${zakatTab === 'fitrah' ? 'bg-emerald-900 text-white border-emerald-900 shadow-sm' : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100'}`}
                  >
                    Zakat Fitrah
                  </button>
                </div>

                <div className="p-3.5 bg-amber-50 border border-amber-200/60 rounded-xl space-y-2">
                  <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 shrink-0" />
                    Panduan & Aturan Nisab
                  </h4>
                  <p className="text-[11px] leading-relaxed text-amber-800">
                    {zakatTab === 'maal' 
                      ? 'Nisab Zakat Maal adalah setara 85 gram emas murni. Jika harta tersimpan Anda selama 1 tahun (Haul) melebihi batas ini, wajib mengeluarkan zakat sebesar 2,5%.'
                      : 'Zakat Fitrah dikeluarkan pada bulan Ramadhan, berupa makanan pokok seberat 2.5 kg atau 3.5 liter beras per jiwa. Dapat dikonversi dalam bentuk uang senilai harga beras.'
                    }
                  </p>
                </div>
              </div>
            )}

            {/* PESANTREN KITAB DIRECTORY */}
            {activeTab === 'pesantren' && (
              <div className="p-4 space-y-4">
                <span className="text-xs font-semibold text-stone-500 block uppercase tracking-wider">
                  Daftar Kitab Unggahan
                </span>
                
                {pesantrenKitabs.length === 0 ? (
                  <div className="p-6 border-2 border-dashed border-stone-200 rounded-2xl text-center space-y-2">
                    <FileText className="w-8 h-8 text-stone-300 mx-auto" />
                    <p className="text-xs text-stone-500 font-medium">Belum ada kitab di rak.</p>
                    <p className="text-[10px] text-stone-400">Silakan unggah file PDF kitab Anda menggunakan panel di sebelah kanan.</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                    {pesantrenKitabs.map((kitab) => {
                      const isSelected = selectedKitab?.id === kitab.id;
                      return (
                        <div
                          key={kitab.id}
                          className={`group w-full rounded-xl border p-3 flex items-start justify-between transition-all ${isSelected ? 'bg-emerald-900 border-emerald-900 text-white shadow-md' : 'bg-stone-50 border-stone-200 hover:bg-stone-100/80 text-stone-800'}`}
                        >
                          <button
                            onClick={() => handleSelectKitab(kitab)}
                            className="flex-1 text-left cursor-pointer mr-2"
                          >
                            <span className="font-serif font-bold text-sm block truncate">
                              {kitab.nama}
                            </span>
                            <span className={`text-[10px] block mt-0.5 truncate ${isSelected ? 'text-amber-300' : 'text-stone-500'}`}>
                              {kitab.kategori} • {(kitab.fileSize / (1024 * 1024)).toFixed(2)} MB
                            </span>
                          </button>
                          
                          <button
                            onClick={() => handleDeleteKitab(kitab.id)}
                            className={`p-1.5 rounded-lg transition-all cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100 ${isSelected ? 'text-red-300 hover:bg-white/10' : 'text-stone-400 hover:text-red-650 hover:bg-stone-200/50'}`}
                            title="Hapus kitab ini"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Quick instructions or footer */}
          <div className="p-3 border-t border-stone-150 bg-stone-50/50 flex items-center justify-between text-[11px] text-stone-500 font-medium">
            <span>Dikelola oleh Ustadz AI</span>
            <span>v2.1 • Kemenag RI</span>
          </div>

        </section>

        {/* RIGHT COLUMN - MAIN INTERACTIVE WORKSPACE */}
        <section className="lg:col-span-8 space-y-6" id="main-content-workspace">
          
          {/* 1. AL-QURAN TAB ACTIVE VIEW */}
          {activeTab === 'quran' && (
            <div className="space-y-6">
              
              {/* Surah Banner Card */}
              {surahDetails && (
                <div className="bg-emerald-950 text-white p-6 md:p-8 rounded-3xl relative overflow-hidden shadow-md border border-emerald-800/20" id="surah-banner-card">
                  {/* Decorative Islamic Geometric background */}
                  <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 flex items-center justify-center select-none pointer-events-none">
                    <Compass className="w-48 h-48 animate-spin-slow" />
                  </div>

                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] bg-amber-500 text-emerald-950 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                          Surat ke-{surahDetails.nomor}
                        </span>
                        <span className="text-[10px] bg-white/10 text-stone-200 px-2 py-0.5 rounded font-medium">
                          {surahDetails.tempatTurun}
                        </span>
                      </div>
                      <h2 className="text-2xl md:text-3.5xl font-bold font-serif tracking-tight text-amber-400">
                        {surahDetails.namaLatin}
                      </h2>
                      <p className="text-stone-300 text-sm mt-1.5 font-medium">
                        &ldquo;{surahDetails.arti}&rdquo; • {surahDetails.jumlahAyat} Ayat
                      </p>
                    </div>

                    {/* Surah Arabic Name & Full Recitation Player */}
                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center border-t border-white/10 md:border-t-0 pt-3 md:pt-0 gap-3">
                      <span className="font-serif text-3xl md:text-4.5xl text-amber-100 font-arabic leading-none">
                        {surahDetails.nama}
                      </span>
                      
                      {/* Audio Play control */}
                      <button
                        onClick={handleToggleFullMurottal}
                        className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-emerald-950 hover:bg-amber-600 transition-colors font-bold text-xs md:text-sm rounded-xl shadow-md cursor-pointer"
                      >
                        {isFullSurahPlaying ? (
                          <>
                            <VolumeX className="w-4 h-4" /> Pause Murottal
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-4 h-4 animate-bounce" /> Putar Murottal
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Description Box collapse */}
                  {surahDetails.deskripsi && (
                    <div className="mt-6 pt-4 border-t border-white/10 text-xs text-stone-300 leading-relaxed font-normal">
                      <p dangerouslySetInnerHTML={{ __html: surahDetails.deskripsi }} />
                    </div>
                  )}
                </div>
              )}

              {/* Toolbar Controls */}
              <div className="bg-white p-4 rounded-2xl shadow-xs border border-stone-200 flex flex-wrap items-center justify-between gap-4" id="surah-reading-toolbar">
                {/* FontSize selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-stone-500 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5" />
                    Ukuran Arab:
                  </span>
                  <div className="bg-stone-50 p-1 rounded-xl border border-stone-200 flex items-center">
                    {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => setFontSize(size)}
                        className={`px-3 py-1 text-xs font-bold rounded-lg uppercase transition-all cursor-pointer ${fontSize === size ? 'bg-emerald-900 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-150'}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Toggles for layout translation */}
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-600">
                    <input 
                      type="checkbox" 
                      checked={showTransliteration} 
                      onChange={() => setShowTransliteration(!showTransliteration)}
                      className="rounded border-stone-300 text-emerald-900 focus:ring-emerald-900 w-4 h-4"
                    />
                    Latin / Bacaan
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-600">
                    <input 
                      type="checkbox" 
                      checked={showTranslation} 
                      onChange={() => setShowTranslation(!showTranslation)}
                      className="rounded border-stone-300 text-emerald-900 focus:ring-emerald-900 w-4 h-4"
                    />
                    Terjemahan
                  </label>
                </div>
              </div>

              {/* Error state */}
              {surahError && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl text-xs leading-relaxed font-medium">
                  {surahError}
                </div>
              )}

              {/* Loader */}
              {isLoadingSurah ? (
                <div className="p-20 text-center space-y-3">
                  <div className="w-10 h-10 border-4 border-emerald-900 border-t-amber-500 rounded-full animate-spin mx-auto" />
                  <p className="text-sm text-stone-500 font-medium font-serif animate-pulse">Memuat Kalamullah secara interaktif...</p>
                </div>
              ) : (
                /* Verses Grid */
                <div className="space-y-6" id="verses-reading-list">
                  
                  {/* Bismillah Banner for non-Fatihah/Tawbah */}
                  {selectedSurahNo !== 1 && selectedSurahNo !== 9 && surahDetails && (
                    <div className="py-6 text-center border-b border-stone-200/60">
                      <p className="font-serif text-2xl md:text-3.5xl text-emerald-950 font-arabic">
                        بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
                      </p>
                      <p className="text-[11px] text-stone-400 mt-2 font-mono italic">
                        Dengan nama Allah Yang Maha Pengasih, Maha Penyayang
                      </p>
                    </div>
                  )}

                  {surahDetails?.ayat.map((verse) => {
                    const idStr = `surah-${surahDetails.nomor}-verse-${verse.nomorAyat}`;
                    const isVersePlaying = playingVerseId === idStr;
                    const isBookmarked = bookmarks.some(b => b.id === `verse-${surahDetails.nomor}-${verse.nomorAyat}`);
                    const userNote = notes[idStr];
                    const isEditingNote = activeNoteEditKey === idStr;

                    return (
                      <div 
                        key={verse.nomorAyat}
                        id={`verse-container-${verse.nomorAyat}`}
                        className="bg-white rounded-2xl p-5 md:p-6 shadow-xs border border-stone-200 hover:border-emerald-800/10 transition-all space-y-4"
                      >
                        {/* Verse Action bar */}
                        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                          <span className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-xs font-bold text-stone-600 border border-stone-200">
                            {verse.nomorAyat}
                          </span>

                          <div className="flex items-center gap-2">
                            {/* Play audio button */}
                            <button
                              onClick={() => handlePlayVerseAudio(verse, idStr)}
                              className={`p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center ${isVersePlaying ? 'bg-emerald-900 text-amber-400' : 'bg-stone-50 hover:bg-stone-100 text-stone-600'}`}
                              title={isVersePlaying ? "Pause Audio" : "Putar Audio Ayat"}
                            >
                              <Volume2 className={`w-4 h-4 ${isVersePlaying ? 'animate-pulse' : ''}`} />
                            </button>

                            {/* Bookmarked toggle */}
                            <button
                              onClick={() => handleToggleBookmark(
                                'verse', 
                                `Q.S ${surahDetails.namaLatin} [${surahDetails.nomor}:${verse.nomorAyat}]`,
                                verse.teksArab,
                                verse.teksIndonesia,
                                { surahNo: surahDetails.nomor, verseNo: verse.nomorAyat }
                              )}
                              className={`p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center ${isBookmarked ? 'bg-amber-100 text-amber-600' : 'bg-stone-50 hover:bg-stone-100 text-stone-600'}`}
                              title="Simpan Bookmark"
                            >
                              <Bookmark className="w-4 h-4" />
                            </button>

                            {/* AI Tafsir Button */}
                            <button
                              onClick={() => handleAskAI(
                                'verse',
                                `Q.S ${surahDetails.namaLatin} Ayat ${verse.nomorAyat}`,
                                verse.teksArab,
                                verse.teksIndonesia
                              )}
                              className="px-3 py-1.5 bg-gradient-to-r from-amber-50 to-amber-100/50 hover:from-amber-100 text-amber-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer border border-amber-200/55"
                            >
                              <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
                              Tanya AI
                            </button>
                          </div>
                        </div>

                        {/* Arabic Text (dynamic styling based on fontSize) */}
                        <div className="text-right py-4 font-serif">
                          <p 
                            className={`arabic-text font-arabic font-normal text-emerald-950 ${
                              fontSize === 'sm' ? 'text-xl' :
                              fontSize === 'md' ? 'text-2xl' :
                              fontSize === 'lg' ? 'text-3xl md:text-3.5xl' :
                              'text-4xl md:text-4.5xl'
                            }`}
                          >
                            {verse.teksArab}
                          </p>
                        </div>

                        {/* Transliteration / Latin read */}
                        {showTransliteration && (
                          <p className="text-xs md:text-sm italic text-amber-800 leading-relaxed font-serif pl-1 border-l-2 border-amber-200">
                            {verse.teksLatin}
                          </p>
                        )}

                        {/* Indonesian Translation */}
                        {showTranslation && (
                          <p className="text-stone-700 text-sm leading-relaxed font-normal pl-1">
                            {verse.teksIndonesia}
                          </p>
                        )}

                        {/* Personal Notes Box */}
                        <div className="pt-3 border-t border-stone-100 space-y-2">
                          {userNote ? (
                            <div className="bg-stone-50 border border-stone-150 p-3 rounded-xl text-xs space-y-1.5 relative group">
                              <div className="flex items-center justify-between text-stone-500 font-semibold uppercase tracking-wider text-[10px]">
                                <span>Refleksi Pribadi Anda</span>
                                <button 
                                  onClick={() => startEditNote(idStr, userNote)}
                                  className="text-emerald-800 hover:underline cursor-pointer font-sans"
                                >
                                  Edit Catatan
                                </button>
                              </div>
                              <p className="text-stone-700 font-normal italic">&ldquo;{userNote}&rdquo;</p>
                            </div>
                          ) : (
                            !isEditingNote && (
                              <button
                                onClick={() => startEditNote(idStr, '')}
                                className="text-stone-400 hover:text-emerald-800 text-xs flex items-center gap-1.5 font-semibold cursor-pointer transition-colors"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                Tulis Refleksi/Tadabbur Pribadi...
                              </button>
                            )
                          )}

                          {isEditingNote && (
                            <div className="space-y-2">
                              <textarea
                                value={noteInputText}
                                onChange={(e) => setNoteInputText(e.target.value)}
                                placeholder="Tulis apa hikmah, tadabbur, atau catatan yang Anda petik dari ayat ini..."
                                className="w-full text-xs p-3 border border-stone-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800 bg-white"
                                rows={2}
                              />
                              <div className="flex items-center gap-1.5 justify-end">
                                <button
                                  onClick={() => setActiveNoteEditKey(null)}
                                  className="px-2.5 py-1 text-xs text-stone-500 rounded hover:bg-stone-100 cursor-pointer"
                                >
                                  Batal
                                </button>
                                <button
                                  onClick={() => handleSaveNote(idStr)}
                                  className="px-3 py-1 text-xs bg-emerald-900 text-white rounded hover:bg-emerald-950 font-semibold cursor-pointer"
                                >
                                  Simpan
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                      </div>
                    );
                  })}

                </div>
              )}

            </div>
          )}

          {/* 2. HADITS ARBAIN ACTIVE VIEW */}
          {activeTab === 'hadith' && (
            <div className="space-y-6">
              <div className="bg-stone-800 text-amber-50 p-6 md:p-8 rounded-3xl relative overflow-hidden shadow-md" id="hadith-banner">
                <div className="relative z-10 space-y-2">
                  <span className="text-[10px] bg-amber-400 text-stone-900 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                    Syarah Al-Arba&apos;in An-Nawawiyyah
                  </span>
                  <h2 className="text-2xl md:text-3xl font-serif font-bold text-amber-300">
                    Kitab Hadits Arbain Nawawi
                  </h2>
                  <p className="text-xs md:text-sm text-stone-300 max-w-2xl leading-relaxed">
                    Kumpulan 42 hadits penting yang dikompilasi oleh Imam Nawawi, merangkum inti ajaran pokok, hukum syariat, akhlaq mulia, dan thariqah keselamatan lahir batin.
                  </p>
                </div>
              </div>

              {/* Hadith List Container */}
              <div className="space-y-8" id="hadith-cards-scroller">
                {filteredHadiths.map((hadith) => {
                  const idStr = `hadith-${hadith.nomor}`;
                  const isBookmarked = bookmarks.some(b => b.id === idStr);
                  const userNote = notes[idStr];
                  const isEditingNote = activeNoteEditKey === idStr;

                  return (
                    <div 
                      key={hadith.nomor}
                      id={`hadith-card-${hadith.nomor}`}
                      className="bg-white rounded-2xl p-6 md:p-8 shadow-xs border border-stone-200 hover:border-amber-500/10 transition-all space-y-5"
                    >
                      {/* Title/Meta Bar */}
                      <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                        <div>
                          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Hadits No. {hadith.nomor}</span>
                          <h3 className="text-base md:text-lg font-serif font-bold text-stone-900 mt-0.5">{hadith.judul}</h3>
                          <span className="text-[10px] text-stone-400 font-mono">{hadith.perawi}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleToggleBookmark(
                              'hadith',
                              `Hadits Arbain No. ${hadith.nomor} (${hadith.judul})`,
                              hadith.teksArab,
                              hadith.teksIndonesia,
                              { hadithNo: hadith.nomor }
                            )}
                            className={`p-2 rounded-xl transition-all cursor-pointer ${isBookmarked ? 'bg-amber-100 text-amber-600' : 'bg-stone-50 hover:bg-stone-100 text-stone-500'}`}
                            title="Simpan ke Bookmark"
                          >
                            <Bookmark className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleAskAI(
                              'hadith',
                              `Hadits Arbain No. ${hadith.nomor} - ${hadith.judul}`,
                              hadith.teksArab,
                              hadith.teksIndonesia
                            )}
                            className="px-3 py-1.5 bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-all cursor-pointer border border-amber-200/50 shadow-xs"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                            Tanya Ustadz AI
                          </button>
                        </div>
                      </div>

                      {/* Arabic Segment */}
                      <div className="text-right py-3 font-serif">
                        <p className="arabic-text font-arabic text-2xl md:text-3.5xl text-emerald-950 font-normal leading-loose">
                          {hadith.teksArab}
                        </p>
                      </div>

                      {/* Indonesian Translation Segment */}
                      <div className="space-y-1.5">
                        <span className="text-xs font-semibold text-stone-500 block uppercase tracking-wider">Terjemahan</span>
                        <p className="text-stone-700 text-sm leading-relaxed font-normal">
                          {hadith.teksIndonesia}
                        </p>
                      </div>

                      {/* Standard Commentary Summary */}
                      <div className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl space-y-1.5">
                        <span className="text-xs font-semibold text-emerald-900 block uppercase tracking-wider">Syarah / Kandungan Hadits</span>
                        <p className="text-stone-600 text-xs md:text-sm leading-relaxed font-normal">
                          {hadith.penjelasan}
                        </p>
                      </div>

                      {/* Notes Box */}
                      <div className="pt-3 border-t border-stone-100 space-y-2">
                        {userNote ? (
                          <div className="bg-stone-50 border border-stone-150 p-3 rounded-xl text-xs space-y-1.5 relative">
                            <div className="flex items-center justify-between text-stone-500 font-semibold uppercase tracking-wider text-[10px]">
                              <span>Refleksi Pribadi</span>
                              <button 
                                onClick={() => startEditNote(idStr, userNote)}
                                className="text-emerald-800 hover:underline cursor-pointer font-sans"
                              >
                                Edit Catatan
                              </button>
                            </div>
                            <p className="text-stone-700 font-normal italic">&ldquo;{userNote}&rdquo;</p>
                          </div>
                        ) : (
                          !isEditingNote && (
                            <button
                              onClick={() => startEditNote(idStr, '')}
                              className="text-stone-400 hover:text-emerald-800 text-xs flex items-center gap-1.5 font-semibold cursor-pointer"
                            >
                              <FileText className="w-3.5 h-3.5" />
                              Tulis catatan refleksimu untuk hadits ini...
                            </button>
                          )
                        )}

                        {isEditingNote && (
                          <div className="space-y-2">
                            <textarea
                              value={noteInputText}
                              onChange={(e) => setNoteInputText(e.target.value)}
                              placeholder="Tulis tadabbur atau pelajaran praktis dari hadits ini..."
                              className="w-full text-xs p-3 border border-stone-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-800/20 focus:border-emerald-800 bg-white"
                              rows={2}
                            />
                            <div className="flex items-center gap-1.5 justify-end">
                              <button
                                onClick={() => setActiveNoteEditKey(null)}
                                className="px-2.5 py-1 text-xs text-stone-500 rounded hover:bg-stone-100 cursor-pointer"
                              >
                                Batal
                              </button>
                              <button
                                onClick={() => handleSaveNote(idStr)}
                                className="px-3 py-1 text-xs bg-emerald-900 text-white rounded hover:bg-emerald-950 font-semibold cursor-pointer"
                              >
                                Simpan
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. DAILY DHIKR READS */}
          {activeTab === 'dzikir' && (
            <div className="space-y-6">
              <div className="bg-emerald-900 text-amber-50 p-6 md:p-8 rounded-3xl shadow-sm border border-emerald-800/20">
                <span className="text-[10px] bg-amber-500 text-emerald-950 px-2 py-0.5 rounded font-bold uppercase tracking-wider">Al-Ma&apos;tsurat</span>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-amber-300 mt-1">Dzikir Pagi Pelindung Diri</h2>
                <p className="text-xs md:text-sm text-stone-200 mt-2 leading-relaxed">
                  Dzikir harian pagi hari yang bersumber langsung dari Al-Quran dan Hadits shahih. Merapikan fikiran, mendatangkan ketenangan qolbu, dan menjaga diri dari godaan jin serta kesusahan dunia.
                </p>
              </div>

              {/* Dhikr Slide/Carousel detail view */}
              {DHIKR_MORNING[activeDhikrIndex] && (
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xs border border-stone-200 space-y-6">
                  
                  {/* Progress Header */}
                  <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">Urutan Dzikir {activeDhikrIndex + 1} dari {DHIKR_MORNING.length}</span>
                      <h3 className="text-base font-bold text-stone-900">Membaca Wird</h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone-500">
                        Selesai: {dhikrCounts[DHIKR_MORNING[activeDhikrIndex].id] || 0} / {DHIKR_MORNING[activeDhikrIndex].target} Kali
                      </span>
                    </div>
                  </div>

                  {/* Arabic block */}
                  <div className="text-right py-4 font-serif">
                    <p className="arabic-text font-arabic text-2xl md:text-3.5xl text-emerald-950 font-normal leading-loose">
                      {DHIKR_MORNING[activeDhikrIndex].lafadz}
                    </p>
                  </div>

                  {/* Transliteration */}
                  <div className="space-y-1 pl-3 border-l-2 border-emerald-800">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">Latin Bacaan</span>
                    <p className="text-stone-700 text-xs md:text-sm italic leading-relaxed font-serif">
                      {DHIKR_MORNING[activeDhikrIndex].latin}
                    </p>
                  </div>

                  {/* Translation */}
                  <div className="space-y-1 pl-3">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Arti Terjemahan</span>
                    <p className="text-stone-600 text-xs md:text-sm leading-relaxed">
                      {DHIKR_MORNING[activeDhikrIndex].arti}
                    </p>
                  </div>

                  {/* Benefit */}
                  <div className="p-4 bg-amber-50/50 border border-amber-200/50 rounded-2xl flex items-start gap-2.5">
                    <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider">Fadhilah / Keutamaan</span>
                      <p className="text-amber-800 text-xs leading-relaxed font-medium mt-0.5">
                        {DHIKR_MORNING[activeDhikrIndex].fadhilah}
                      </p>
                    </div>
                  </div>

                  {/* Tap Interactive Counter for Active Dhikr */}
                  <div className="pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => {
                          setDhikrCounts({
                            ...dhikrCounts,
                            [DHIKR_MORNING[activeDhikrIndex].id]: 0
                          });
                        }}
                        className="px-4 py-2.5 bg-stone-50 hover:bg-stone-100 text-stone-600 font-bold text-xs rounded-xl flex items-center gap-1 cursor-pointer transition-colors"
                        title="Reset hitungan bagian ini"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        Reset
                      </button>

                      {/* AI Explain in context */}
                      <button
                        onClick={() => handleAskAI(
                          'verse',
                          `Dzikir Pagi Ke-${activeDhikrIndex + 1}`,
                          DHIKR_MORNING[activeDhikrIndex].lafadz,
                          DHIKR_MORNING[activeDhikrIndex].arti
                        )}
                        className="px-4 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/50 font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        Tanya AI Tafsir Dzikir
                      </button>
                    </div>

                    {/* TAP ACTION BUTTON */}
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <button
                        onClick={() => {
                          const current = dhikrCounts[DHIKR_MORNING[activeDhikrIndex].id] || 0;
                          setDhikrCounts({
                            ...dhikrCounts,
                            [DHIKR_MORNING[activeDhikrIndex].id]: current + 1
                          });
                        }}
                        className="flex-1 sm:flex-none px-8 py-3.5 bg-emerald-900 text-white font-bold text-sm rounded-2xl hover:bg-emerald-950 shadow-md flex items-center justify-center gap-2 cursor-pointer transition-transform active:scale-95"
                      >
                        <Plus className="w-4 h-4 text-amber-400" />
                        TAP HITUNG (+1)
                      </button>

                      {/* Next button */}
                      <button
                        onClick={() => {
                          if (activeDhikrIndex < DHIKR_MORNING.length - 1) {
                            setActiveDhikrIndex(prev => prev + 1);
                          } else {
                            alert("Alhamdulillah, semua wirid dzikir pagi telah diselesaikan!");
                          }
                        }}
                        className="p-3.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl flex items-center justify-center cursor-pointer transition-colors"
                        title="Dzikir Selanjutnya"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>

                  </div>

                </div>
              )}
            </div>
          )}

          {/* 4. TASBIH COUNTER */}
          {activeTab === 'tasbih' && (
            <div className="space-y-6">
              
              <div className="bg-emerald-950 p-8 rounded-3xl text-center space-y-6 relative overflow-hidden shadow-md border border-emerald-900/40" id="tasbih-canvas">
                
                {/* Decorative border */}
                <div className="absolute inset-4 border border-amber-500/10 rounded-2xl pointer-events-none" />

                <div className="space-y-1">
                  <span className="text-[10px] bg-amber-500 text-emerald-950 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    Tasbih Ring Interaktif
                  </span>
                  <h3 className="text-xl md:text-2xl font-serif font-bold text-amber-300">
                    {tasbihLabel}
                  </h3>
                  <p className="text-xs text-stone-300">
                    Target: {tasbihTarget} Kali • Total akumulasi dzikir hari ini: {tasbihTotal}x
                  </p>
                </div>

                {/* LARGE CIRCULAR TAPPER */}
                <div className="relative w-52 h-52 md:w-60 md:h-60 mx-auto flex items-center justify-center">
                  
                  {/* Progress circle outline */}
                  <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                    <circle
                      cx="50%"
                      cy="50%"
                      r="46%"
                      stroke="#022c22"
                      strokeWidth="6"
                      fill="transparent"
                    />
                    <circle
                      cx="50%"
                      cy="50%"
                      r="46%"
                      stroke="#d4af37"
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 46}`}
                      strokeDashoffset={`${2 * Math.PI * 46 * (1 - Math.min((dhikrCounts[tasbihLabel] || 0) / tasbihTarget, 1))}`}
                      className="transition-all duration-300"
                    />
                  </svg>

                  {/* Main Tap Button */}
                  <button
                    onClick={handleTasbihClick}
                    className="w-40 h-40 md:w-48 md:h-48 rounded-full bg-emerald-900 text-amber-400 hover:bg-emerald-850 flex flex-col items-center justify-center gap-1 shadow-2xl border border-amber-500/20 cursor-pointer active:scale-95 transition-transform relative group select-none"
                  >
                    {/* Glowing effect inside */}
                    <div className="absolute inset-3 rounded-full bg-emerald-950/40 group-hover:bg-emerald-950/20 transition-all" />
                    
                    <span className="text-4xl md:text-5xl font-mono font-bold tracking-tight z-10 text-white animate-pulse">
                      {dhikrCounts[tasbihLabel] || 0}
                    </span>
                    <span className="text-[10px] font-bold text-amber-500/80 uppercase tracking-widest z-10">
                      TAP ME
                    </span>
                  </button>

                </div>

                {/* Tasbih control bar */}
                <div className="flex items-center justify-center gap-4 relative z-10">
                  <button
                    onClick={handleResetTasbih}
                    className="px-5 py-2.5 bg-white/10 hover:bg-white/15 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4.5 h-4.5 text-amber-400" />
                    Selesai & Simpan
                  </button>

                  <button
                    onClick={() => {
                      setDhikrCounts({ ...dhikrCounts, [tasbihLabel]: 0 });
                    }}
                    className="px-5 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-500/30 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    Reset Hitung
                  </button>
                </div>

              </div>

              {/* Tasbih History Log */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200 space-y-4">
                <h3 className="font-serif font-bold text-stone-900 text-base">Riwayat Sesi Wirid</h3>
                {tasbihHistory.length === 0 ? (
                  <p className="text-xs text-stone-500 italic">Belum ada riwayat sesi dzikir yang tersimpan hari ini.</p>
                ) : (
                  <div className="divide-y divide-stone-100 max-h-48 overflow-y-auto pr-2">
                    {tasbihHistory.map((hist, idx) => (
                      <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-semibold text-stone-800">{hist.title}</span>
                          <span className="text-stone-400 font-mono block text-[10px]">{hist.date}</span>
                        </div>
                        <span className="font-mono bg-stone-100 text-stone-700 font-bold px-2.5 py-1 rounded-lg">
                          {hist.count}x
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* 5. ZAKAT CALCULATOR */}
          {activeTab === 'zakat' && (
            <div className="space-y-6">
              
              {/* Active Sub Section: Maal */}
              {zakatTab === 'maal' && (
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 space-y-6">
                  
                  <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                    <div>
                      <h3 className="font-serif font-bold text-lg text-stone-900">Kalkulator Zakat Maal (Harta Kekayaan)</h3>
                      <p className="text-xs text-stone-500">Membantu perhitungan zakat harta yang mengendap selama 1 tahun.</p>
                    </div>
                  </div>

                  {/* Gold Price Input */}
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                    <div>
                      <span className="text-xs font-bold text-stone-600 uppercase tracking-wider block">Harga Emas Murni Saat Ini</span>
                      <p className="text-[11px] text-stone-400 mt-0.5">Rujukan harga emas batangan Kemenag/Antam per gram.</p>
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 text-sm font-bold">Rp</span>
                      <input 
                        type="number"
                        value={goldPrice}
                        onChange={(e) => setGoldPrice(Number(e.target.value))}
                        className="w-full text-sm pl-10 pr-4 py-2 border border-stone-250 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-800/20 bg-white font-mono text-right font-bold"
                      />
                    </div>
                  </div>

                  {/* Form Fields Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-stone-600 block">Tabungan / Kas / Setara Kas</span>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 text-xs">Rp</span>
                        <input 
                          type="number"
                          value={zakatInputs.tabungan || ''}
                          onChange={(e) => setZakatInputs({ ...zakatInputs, tabungan: Number(e.target.value) })}
                          placeholder="0"
                          className="w-full text-sm pl-9 pr-4 py-2 border border-stone-250 rounded-xl bg-stone-50/20 text-right font-mono text-stone-800"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-stone-600 block">Investasi (Saham, Obligasi, Reksadana)</span>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 text-xs">Rp</span>
                        <input 
                          type="number"
                          value={zakatInputs.investasi || ''}
                          onChange={(e) => setZakatInputs({ ...zakatInputs, investasi: Number(e.target.value) })}
                          placeholder="0"
                          className="w-full text-sm pl-9 pr-4 py-2 border border-stone-250 rounded-xl bg-stone-50/20 text-right font-mono text-stone-800"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-stone-600 block">Nilai Emas / Perak Fisik Yang Disimpan</span>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 text-xs">Rp</span>
                        <input 
                          type="number"
                          value={zakatInputs.emasPerak || ''}
                          onChange={(e) => setZakatInputs({ ...zakatInputs, emasPerak: Number(e.target.value) })}
                          placeholder="0"
                          className="w-full text-sm pl-9 pr-4 py-2 border border-stone-250 rounded-xl bg-stone-50/20 text-right font-mono text-stone-800"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-stone-600 block">Aset Perdagangan / Bisnis (Modal & Untung)</span>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 text-xs">Rp</span>
                        <input 
                          type="number"
                          value={zakatInputs.perdagangan || ''}
                          onChange={(e) => setZakatInputs({ ...zakatInputs, perdagangan: Number(e.target.value) })}
                          placeholder="0"
                          className="w-full text-sm pl-9 pr-4 py-2 border border-stone-250 rounded-xl bg-stone-50/20 text-right font-mono text-stone-800"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-stone-600 block">Kewajiban / Hutang Jatuh Tempo (Pengurang)</span>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 text-xs">Rp</span>
                        <input 
                          type="number"
                          value={zakatInputs.hutang || ''}
                          onChange={(e) => setZakatInputs({ ...zakatInputs, hutang: Number(e.target.value) })}
                          placeholder="0"
                          className="w-full text-sm pl-9 pr-4 py-2 border border-stone-250 rounded-xl bg-stone-50/20 text-right font-mono text-stone-800 focus:border-red-500"
                        />
                      </div>
                    </div>

                  </div>

                  {/* Zakat Maal Result Cards */}
                  {(() => {
                    const result = calculateZakatMaal();
                    return (
                      <div className="pt-6 border-t border-stone-100 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          
                          <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200">
                            <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Total Harta Kena Zakat</span>
                            <span className="text-xl font-mono font-bold text-stone-850">{formatRupiah(result.totalHarta)}</span>
                            <span className="text-[11px] text-stone-400 block mt-1">Batas Nisab: {formatRupiah(result.nisabThreshold)} (85g Emas)</span>
                          </div>

                          <div className={`p-4 rounded-2xl border ${result.isZakatMandatory ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-stone-50 border-stone-200 text-stone-600'}`}>
                            <span className="text-[10px] font-bold uppercase tracking-wider block">Status Kewajiban Zakat</span>
                            <span className="text-lg font-serif font-bold block mt-0.5">
                              {result.isZakatMandatory ? '✅ WAJIB BAYAR ZAKAT' : '❌ BELUM WAJIB ZAKAT'}
                            </span>
                            <span className="text-xs block mt-1">
                              {result.isZakatMandatory 
                                ? 'Harta Anda telah melampaui ambang batas Nisab.'
                                : 'Harta simpanan Anda belum mencapai ambang batas Nisab.'
                              }
                            </span>
                          </div>

                        </div>

                        {result.isZakatMandatory && (
                          <div className="p-5 bg-gradient-to-r from-amber-500/10 to-amber-500/5 border border-amber-300 rounded-2xl flex items-center justify-between">
                            <div>
                              <span className="text-xs font-bold text-amber-900 block uppercase tracking-wider">Nilai Zakat Maal Yang Wajib Ditunaikan (2.5%)</span>
                              <span className="text-2xl md:text-3xl font-mono font-bold text-amber-700">{formatRupiah(result.zakatToPay)}</span>
                            </div>
                            
                            {/* Ask AI how to distribute Zakat properly */}
                            <button
                              onClick={() => handleAskAI(
                                'general',
                                'Distribusi Zakat Maal Syariat',
                                `Saya memiliki harta tersimpan sebesar ${formatRupiah(result.totalHarta)} dengan nilai wajib zakat ${formatRupiah(result.zakatToPay)}.`,
                                'Bagaimana aturan pendistribusian zakat maal kepada 8 asnaf dan adab menunaikan zakat menurut fiqih mualamat?'
                              )}
                              className="px-4 py-2 bg-emerald-900 text-white hover:bg-emerald-950 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
                            >
                              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                              Tanya AI Adab Zakat
                            </button>
                          </div>
                        )}

                      </div>
                    );
                  })()}

                </div>
              )}

              {/* Active Sub Section: Fitrah */}
              {zakatTab === 'fitrah' && (
                <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200 space-y-6">
                  
                  <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                    <div>
                      <h3 className="font-serif font-bold text-lg text-stone-900">Kalkulator Zakat Fitrah</h3>
                      <p className="text-xs text-stone-500">Membantu perhitungan zakat fitrah untuk keluarga menyambut Idul Fitri.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-stone-600 block">Jumlah Anggota Keluarga (Jiwa)</span>
                      <div className="relative">
                        <input 
                          type="number"
                          value={zakatFitrahJiwa}
                          onChange={(e) => setZakatFitrahJiwa(Math.max(1, Number(e.target.value)))}
                          min={1}
                          className="w-full text-sm px-4 py-2 border border-stone-250 rounded-xl bg-stone-50/20 font-bold"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-stone-600 block">Harga Beras per Kilogram (Konsumsi Harian)</span>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 text-xs">Rp</span>
                        <input 
                          type="number"
                          value={berasPrice}
                          onChange={(e) => setBerasPrice(Number(e.target.value))}
                          className="w-full text-sm pl-9 pr-4 py-2 border border-stone-250 rounded-xl bg-stone-50/20 font-mono text-right"
                        />
                      </div>
                    </div>

                  </div>

                  <div className="p-6 bg-stone-50 rounded-3xl border border-stone-200 space-y-4">
                    <h4 className="font-serif font-bold text-stone-900 text-base">Hasil Perhitungan Zakat Fitrah</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-white rounded-2xl border border-stone-150">
                        <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Jika Ditunaikan Dengan Beras</span>
                        <span className="text-2xl font-bold text-emerald-900 block mt-0.5">{zakatFitrahJiwa * 2.5} Kg</span>
                        <span className="text-[11px] text-stone-400 block mt-0.5">Saran Kemenag: 2.5 kg atau 3.5 liter beras per jiwa.</span>
                      </div>

                      <div className="p-4 bg-white rounded-2xl border border-stone-150">
                        <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Jika Ditunaikan Dengan Uang Tunai</span>
                        <span className="text-2xl font-bold text-emerald-900 block mt-0.5">{formatRupiah(zakatFitrahJiwa * 2.5 * berasPrice)}</span>
                        <span className="text-[11px] text-stone-400 block mt-0.5">Dihitung berdasarkan harga beras dikali jumlah jiwa.</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-stone-150 flex items-center justify-between text-xs text-stone-500">
                      <span>Zakat wajib dikeluarkan sebelum pelaksanaan shalat Idul Fitri.</span>
                      
                      <button
                        onClick={() => handleAskAI(
                          'general',
                          'Syarat Sah Zakat Fitrah',
                          `Zakat Fitrah untuk ${zakatFitrahJiwa} orang anggota keluarga.`,
                          'Apa niat lafadz zakat fitrah untuk diri sendiri, istri, anak-anak, dan seluruh keluarga besar?'
                        )}
                        className="text-emerald-800 hover:underline font-bold cursor-pointer"
                      >
                        Lihat Niat Zakat Fitrah (AI)
                      </button>
                    </div>

                  </div>

                </div>
              )}

            </div>
          )}

          {/* 6. KITAB PESANTREN TAB ACTIVE VIEW */}
          {activeTab === 'pesantren' && (
            <div className="space-y-6">
              
              {/* Header Banner */}
              <div className="bg-emerald-950 text-white p-6 md:p-8 rounded-3xl relative overflow-hidden shadow-md border border-emerald-800/20">
                <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 flex items-center justify-center select-none pointer-events-none">
                  <BookOpen className="w-48 h-48 animate-spin-slow" />
                </div>

                <div className="relative z-10">
                  <span className="text-[10px] bg-amber-500 text-emerald-950 px-2.5 py-0.5 rounded font-bold uppercase tracking-wider">
                    Maktabah Syakhshiyah
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold font-serif tracking-tight text-amber-400 mt-2">
                    Maktabah & Kitab Pesantren
                  </h2>
                  <p className="text-stone-300 text-xs md:text-sm mt-1.5 leading-relaxed max-w-2xl">
                    Pusat penyimpanan dan pembacaan berkas kitab mandiri. Unggah kitab-kitab kuning rujukan pesantren (Fiqih, Nahwu, Tafsir, dll.) dalam format PDF untuk disimpan di database luring peramban Anda.
                  </p>
                </div>
              </div>

              {/* Iframe warning / Permanent storage notice */}
              {isIframe && (
                <div className="bg-amber-50 border border-amber-200 p-4 md:p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-fade-in shadow-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      <h4 className="text-xs font-bold text-amber-900 font-serif">
                        Mode Pratinjau Terdeteksi (Penyimpanan Sementara)
                      </h4>
                    </div>
                    <p className="text-[11px] text-amber-800 leading-relaxed max-w-4xl">
                      Browser membatasi penyimpanan permanen (IndexedDB) di dalam bingkai pratinjau iFrame ini. Kitab yang diunggah hanya tersimpan sementara selama sesi ini berlangsung. Agar tersimpan secara <strong>PERMANEN</strong> di perangkat Anda, silakan buka aplikasi di Tab Baru.
                    </p>
                  </div>
                  <a
                    href="https://ais-pre-ahzj62n2l5rlgeholi4zvl-11679801363.asia-southeast1.run.app"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold text-xs rounded-xl shadow-xs shrink-0 cursor-pointer text-center"
                  >
                    Buka di Tab Baru ↗
                  </a>
                </div>
              )}

              {/* Main Content Area */}
              {selectedKitab && selectedKitabUrl ? (
                <div className="space-y-6">
                  {/* Selected Kitab Metadata Card */}
                  <div className="bg-white p-5 md:p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-stone-100 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold uppercase">
                            {selectedKitab.kategori}
                          </span>
                          <span className="text-[10px] bg-stone-100 text-stone-500 px-2 py-0.5 rounded font-mono">
                            {(selectedKitab.fileSize / (1024 * 1024)).toFixed(2)} MB
                          </span>
                          {isMemoryOnly && (
                            <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-medium">
                              Sesi Sementara
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg md:text-xl font-serif font-bold text-stone-900 mt-1">
                          {selectedKitab.nama}
                        </h3>
                        <p className="text-xs text-stone-500 mt-1">
                          Diunggah: {selectedKitab.uploadedAt} • Nama file: {selectedKitab.fileName}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        {/* Direct PDF Fullscreen / Native view */}
                        <a
                          href={selectedKitabUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 transition-colors font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          Buka PDF di Tab Baru
                        </a>

                        {/* Ask AI about this Kitab */}
                        <button
                          onClick={() => handleAskAI(
                            'general',
                            `Kajian Kitab ${selectedKitab.nama}`,
                            `Saya sedang membaca Kitab "${selectedKitab.nama}" berkategori ${selectedKitab.kategori}.`,
                            `Tolong jelaskan deskripsi umum, pengarang utama, materi-materi pokok yang dibahas, serta nilai penting Kitab "${selectedKitab.nama}" ini dalam tradisi keilmuan pesantren.`
                          )}
                          className="px-3.5 py-2 bg-amber-500 text-emerald-950 hover:bg-amber-600 transition-colors font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          Tanya AI Kitab
                        </button>

                        {/* Close View button */}
                        <button
                          onClick={() => {
                            setSelectedKitab(null);
                            if (selectedKitabUrl) {
                              URL.revokeObjectURL(selectedKitabUrl);
                              setSelectedKitabUrl(null);
                            }
                          }}
                          className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                        >
                          Tutup
                        </button>
                      </div>
                    </div>

                    {selectedKitab.deskripsi && (
                      <div className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-3 rounded-xl border border-stone-150">
                        <span className="font-semibold text-stone-700 block mb-0.5">Catatan/Deskripsi Kitab:</span>
                        <p>{selectedKitab.deskripsi}</p>
                      </div>
                    )}

                    {/* High Fidelity PDF Viewer Frame using react-pdf-viewer */}
                    <div className="border border-stone-250 rounded-2xl overflow-hidden bg-stone-100 h-[700px] relative shadow-inner animate-fade-in flex flex-col">
                      <PdfViewer fileUrl={selectedKitabUrl} title={selectedKitab.nama} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* Empty/Intro State */}
                  <div className="md:col-span-7 bg-white p-6 md:p-8 rounded-3xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-6">
                    <div className="space-y-4">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-emerald-900 flex items-center justify-center">
                        <Book className="w-6 h-6 text-emerald-800" />
                      </div>
                      <h3 className="text-lg md:text-xl font-serif font-bold text-stone-900">
                        Silakan Pilih atau Unggah Kitab Anda
                      </h3>
                      <p className="text-stone-600 text-xs md:text-sm leading-relaxed">
                        Anda belum membuka kitab apa pun di viewer. Pilih kitab yang ada di panel daftar unggahan (sebelah kiri) untuk mulai membaca secara digital, atau gunakan formulir di sebelah kanan untuk menambahkan kitab kuning/pesantren PDF baru ke rak Anda secara instan.
                      </p>
                      
                      <div className="pt-4 border-t border-stone-100 space-y-3 text-xs text-stone-500">
                        <span className="font-bold text-stone-700 block">💡 Tips Membaca & Belajar:</span>
                        <div className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                          <p>Gunakan tombol <strong className="text-emerald-950 font-semibold">Tanya AI Kitab</strong> setelah memuat PDF untuk berkonsultasi tentang pokok fikih atau bab spesifik dari kitab tersebut dengan Ustadz AI.</p>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                          <p>Semua file disimpan secara lokal di browser Anda memakai teknologi IndexedDB berkapasitas besar, aman dan sepenuhnya luring (offline).</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-amber-50 border border-amber-200/60 rounded-2xl">
                      <p className="text-[11px] text-amber-800 leading-relaxed">
                        ⚠️ <strong>Catatan Kompatibilitas:</strong> Sebagian besar browser modern (Chrome, Safari, Edge) dapat langsung merender PDF di layar komputer atau laptop Anda secara responsif.
                      </p>
                    </div>
                  </div>

                  {/* Upload Kitab Form Card */}
                  <div className="md:col-span-5 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-4">
                    <h4 className="font-serif font-bold text-stone-950 text-base flex items-center gap-2 border-b border-stone-100 pb-2">
                      <UploadCloud className="w-4.5 h-4.5 text-emerald-800" />
                      Unggah Kitab Baru
                    </h4>

                    <div className="space-y-4">
                      {/* Name field */}
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-stone-600 block">Nama Kitab</label>
                        <input
                          type="text"
                          placeholder="Contoh: Safinatun Najah (kosongkan untuk nama asli)"
                          value={newKitabNama}
                          onChange={(e) => setNewKitabNama(e.target.value)}
                          className="w-full text-xs border border-stone-250 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-800/20 bg-stone-50/20"
                        />
                      </div>

                      {/* Category selection */}
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-stone-600 block">Kategori Kitab</label>
                        <select
                          value={newKitabKategori}
                          onChange={(e) => setNewKitabKategori(e.target.value)}
                          className="w-full text-xs border border-stone-250 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-800/20 bg-white"
                        >
                          {['Fiqih', 'Tafsir', 'Hadits', 'Akhlaq & Tasawuf', 'Nahwu & Sorof', 'Tarikh/Sejarah', 'Lainnya'].map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      {/* Description field */}
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-stone-600 block">Deskripsi / Catatan Singkat</label>
                        <textarea
                          placeholder="Tulis ringkasan atau rujukan khusus..."
                          rows={2}
                          value={newKitabDeskripsi}
                          onChange={(e) => setNewKitabDeskripsi(e.target.value)}
                          className="w-full text-xs border border-stone-250 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-800/20 bg-stone-50/20"
                        />
                      </div>

                      {/* Drag & Drop Upload Zone */}
                      <div
                        onDragEnter={handleDrag}
                        onDragOver={handleDrag}
                        onDragLeave={handleDrag}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer relative ${dragActive ? 'border-amber-500 bg-amber-500/5' : 'border-stone-250 hover:border-emerald-800 bg-stone-50/40'}`}
                      >
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={handleFileChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          id="kitab-pdf-uploader"
                          disabled={isUploading}
                        />

                        <div className="space-y-2">
                          <UploadCloud className="w-8 h-8 text-stone-400 mx-auto" />
                          <p className="text-xs font-semibold text-stone-700">Tarik berkas PDF di sini</p>
                          <p className="text-[10px] text-stone-400">Atau ketuk untuk mencari file di komputer Anda</p>
                        </div>
                      </div>

                      {isUploading && (
                        <div className="text-center p-3 space-y-1 text-xs">
                          <div className="w-5 h-5 border-2 border-emerald-900 border-t-amber-500 rounded-full animate-spin mx-auto" />
                          <p className="text-stone-500 font-medium font-serif animate-pulse">Menyimpan kitab ke penyimpanan lokal...</p>
                        </div>
                      )}

                      {uploadError && (
                        <div className="p-3 bg-red-50 text-red-800 rounded-xl text-[11px] font-medium leading-relaxed">
                          {uploadError}
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

        </section>

      </main>

      {/* FLOATING USTADZ AI SLIDE-OVER DRAWER (RIGHT PANEL) */}
      <AnimatePresence>
        {isAiOpen && (
          <>
            {/* Backdrop filter overlay */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAiOpen(false)}
              className="fixed inset-0 bg-stone-900 z-50 cursor-pointer"
              id="ai-backdrop"
            />

            {/* Slide-over panel */}
            <motion.section 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white border-l border-stone-200 shadow-2xl z-50 flex flex-col h-full"
              id="ai-asisten-panel"
            >
              
              {/* Drawer Header */}
              <div className="p-4 border-b border-stone-200 bg-emerald-950 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                  <div>
                    <h3 className="font-serif font-bold text-base text-amber-300">Asisten Tafsir (Ustadz AI)</h3>
                    <p className="text-[10px] text-stone-300">Berbasis kecerdasan buatan syariah moderat</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsAiOpen(false)}
                  className="p-1.5 hover:bg-white/10 rounded-lg text-white/80 hover:text-white cursor-pointer transition-colors"
                >
                  Tutup ×
                </button>
              </div>

              {/* Active Context Box if any */}
              {aiContext && (
                <div className="p-3 bg-stone-50 border-b border-stone-200 text-xs space-y-1 shrink-0">
                  <div className="flex items-center justify-between text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                    <span>Kitab Rujukan Pembahasan</span>
                    <span className="text-emerald-800">{aiContext.reference}</span>
                  </div>
                  {aiContext.arabic && (
                    <p className="font-serif font-arabic text-right text-emerald-950 font-normal truncate">
                      {aiContext.arabic}
                    </p>
                  )}
                  <p className="text-stone-500 line-clamp-1 italic">
                    {aiContext.translation}
                  </p>
                </div>
              )}

              {/* Chat Thread Scroller */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50/50">
                {chatHistory.map((msg, idx) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div 
                      key={idx}
                      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[85%] rounded-2xl p-3 text-xs md:text-sm leading-relaxed ${isUser ? 'bg-emerald-900 text-white rounded-br-none' : 'bg-white border border-stone-200 text-stone-800 shadow-xs rounded-bl-none'}`}>
                        <span className="text-[9px] block font-bold mb-1 opacity-60 uppercase tracking-widest text-right">
                          {isUser ? 'Anda' : 'Ustadz AI'}
                        </span>
                        
                        {/* Render simple markdown replacements */}
                        <div className="space-y-1 font-normal whitespace-pre-wrap">
                          {msg.content.split('\n').map((line, lIdx) => {
                            if (line.startsWith('**') && line.endsWith('**')) {
                              return <h4 key={lIdx} className="font-bold text-amber-600 mt-2">{line.replace(/\*\*/g, '')}</h4>;
                            }
                            if (line.startsWith('**')) {
                              return <strong key={lIdx} className="font-bold text-stone-800">{line.replace(/\*\*/g, '')}</strong>;
                            }
                            if (line.startsWith('• ') || line.startsWith('- ')) {
                              return <li key={lIdx} className="ml-2 list-disc">{line.substring(2)}</li>;
                            }
                            return <p key={lIdx}>{line}</p>;
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* AI typing state */}
                {aiLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border border-stone-200 rounded-2xl rounded-bl-none p-4 max-w-[80%] space-y-2 shadow-xs">
                      <span className="text-[9px] block font-bold opacity-60 uppercase tracking-widest">Ustadz AI</span>
                      <div className="flex items-center gap-1.5 py-1">
                        <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                      </div>
                      <p className="text-[11px] text-stone-400 italic">Sedang mentadabburkan kitab suci untuk Anda...</p>
                    </div>
                  </div>
                )}
                
                {/* dummy div to scroll to */}
                <div ref={chatBottomRef} />
              </div>

              {/* Chat Input Bar */}
              <form 
                onSubmit={handleSendChatFollowUp}
                className="p-3 border-t border-stone-200 bg-white flex items-center gap-2 shrink-0"
              >
                <input 
                  type="text"
                  placeholder="Ketik pertanyaan untuk Ustadz AI..."
                  value={customQuestion}
                  onChange={(e) => setCustomQuestion(e.target.value)}
                  disabled={aiLoading || !aiContext}
                  className="flex-1 text-xs border border-stone-250 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-800/20 bg-stone-50/30 disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={aiLoading || !customQuestion.trim() || !aiContext}
                  className="p-2.5 bg-emerald-900 hover:bg-emerald-950 text-white rounded-xl transition-all disabled:opacity-40 cursor-pointer flex items-center justify-center shrink-0"
                >
                  <Send className="w-4.5 h-4.5" />
                </button>
              </form>

            </motion.section>
          </>
        )}
      </AnimatePresence>

      {/* FOOTER STATS */}
      <footer className="bg-stone-900 text-stone-400 py-10 px-4 mt-12 border-t border-stone-800" id="app-footer">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-xs leading-relaxed">
          
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-amber-400 text-sm">Tentang Kitab Digital</h4>
            <p>
              Aplikasi Kitab Digital merupakan platform kajian Islam interaktif yang menggabungkan kemudahan membaca Al-Quran, hadits, dan dzikir Ma&apos;tsurat, dilengkapi dengan penjelasan tafsir modern berbasis kecerdasan buatan dari Google Gemini.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-serif font-bold text-amber-400 text-sm">Keandalan Offline</h4>
            <p>
              Halaman ini dirancang andal. Surat-surat pendek pelindung harian (Al-Fatihah, Al-Ikhlas, Al-Falaq, An-Nas) dan rujukan 7 hadits dasar hadits Arbain Nawawi dapat diakses kapan pun bahkan saat Anda tidak terhubung ke internet.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-serif font-bold text-amber-400 text-sm">Aspek Fiqih & AI</h4>
            <p>
              Tafsir dan asisten Ustadz AI menggunakan model modern Google Gemini. Respons dirancang secara moderat (wasathiyah) sesuai dengan rujukan aqidah ahlussunnah wal jamaah, mengedepankan tasamuh, toleransi, akhlaqul karimah, dan kesantunan berbahasa.
            </p>
          </div>

        </div>

        <div className="max-w-7xl mx-auto border-t border-stone-800/80 mt-8 pt-6 text-center text-[10px] text-stone-500">
          <p>© 2026 Kitab Digital Interaktif. Sumber data dari Kementerian Agama (Kemenag) RI & eQuran ID.</p>
        </div>
      </footer>

    </div>
  );
}
