'use client';

import React from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin, type ToolbarProps, type ToolbarSlot } from '@react-pdf-viewer/default-layout';
import { Maximize2, Minimize2 } from 'lucide-react';

// Import react-pdf-viewer styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

interface PdfViewerProps {
  fileUrl: string;
  title?: string;
}

export default function PdfViewer({ fileUrl, title }: PdfViewerProps) {
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Listen to Escape key to exit fullscreen
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Configure custom toolbar to EXCLUDE the broken native fullscreen button
  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    renderToolbar: (RenderToolbar: (props: ToolbarProps) => React.ReactElement) => (
      <RenderToolbar>
        {(slots: ToolbarSlot) => {
          const {
            CurrentPageInput,
            GoToNextPage,
            GoToPreviousPage,
            NumberOfPages,
            ShowSearchPopover,
            Zoom,
            ZoomIn,
            ZoomOut,
          } = slots;

          return (
            <div className="flex items-center justify-between w-full px-4 py-2 bg-white border-b border-stone-200 text-stone-700 select-none">
              <div className="flex items-center gap-2">
                <ShowSearchPopover />
              </div>
              
              <div className="flex items-center gap-1.5">
                <GoToPreviousPage />
                <div className="flex items-center gap-1 bg-stone-50 border border-stone-200 rounded px-2 py-0.5">
                  <CurrentPageInput />
                  <span className="text-stone-400 text-xs px-1 font-serif">dari</span>
                  <span className="text-stone-700 text-xs font-serif font-bold min-w-[12px] text-center">
                    <NumberOfPages />
                  </span>
                </div>
                <GoToNextPage />
              </div>

              <div className="flex items-center gap-2">
                <ZoomOut />
                <div className="w-16 text-center text-xs font-mono">
                  <Zoom />
                </div>
                <ZoomIn />
              </div>
            </div>
          );
        }}
      </RenderToolbar>
    ),
  });

  return (
    <div 
      className={`${
        isFullscreen 
          ? 'fixed inset-0 z-[9999] bg-stone-950 flex flex-col p-2 md:p-4 animate-fade-in' 
          : 'w-full h-full flex flex-col bg-stone-50 relative'
      } transition-all duration-300`}
      id="pdf-viewer-container"
    >
      {/* Floating Fullscreen Toggle Button - completely immune to iframe restrictions! */}
      <button
        onClick={toggleFullscreen}
        className={`absolute right-4 top-16 z-50 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all border ${
          isFullscreen 
            ? 'bg-stone-800 hover:bg-stone-700 text-stone-100 border-stone-700' 
            : 'bg-white hover:bg-stone-100 text-stone-800 border-stone-250'
        }`}
        title={isFullscreen ? 'Keluar dari Layar Penuh (ESC)' : 'Tampilkan Layar Penuh'}
      >
        {isFullscreen ? (
          <>
            <Minimize2 className="w-4 h-4 text-amber-500" />
            <span>Keluar Layar Penuh</span>
          </>
        ) : (
          <>
            <Maximize2 className="w-4 h-4 text-emerald-600" />
            <span>Layar Penuh</span>
          </>
        )}
      </button>

      {/* Show sleek title bar in Fullscreen mode */}
      {isFullscreen && title && (
        <div className="bg-stone-900 border border-stone-800 px-5 py-3 rounded-t-2xl flex items-center justify-between text-stone-100 mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <h3 className="font-serif text-sm font-bold truncate max-w-lg">
              Membaca: {title}
            </h3>
          </div>
          <span className="text-[10px] bg-stone-800 text-stone-400 px-2.5 py-1 rounded-lg font-mono tracking-wider">
            TEKAN ESC UNTUK KELUAR
          </span>
        </div>
      )}

      <div className={`flex-1 overflow-hidden relative ${isFullscreen ? 'rounded-b-2xl' : ''}`} style={{ height: '100%' }}>
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
          <Viewer
            fileUrl={fileUrl}
            plugins={[defaultLayoutPluginInstance]}
            theme={isFullscreen ? 'dark' : 'light'}
          />
        </Worker>
      </div>
    </div>
  );
}
