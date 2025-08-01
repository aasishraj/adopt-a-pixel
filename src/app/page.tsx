'use client';

import { useState, useEffect } from 'react';
import { pixelOperations, PixelData } from '../lib/supabase';

// Using PixelData from supabase.ts instead of local interface

const VERTICAL_PIXELS = 8;
const HORIZONTAL_PIXELS = 10;
const TOTAL_PIXELS = VERTICAL_PIXELS * HORIZONTAL_PIXELS;

const AVAILABLE_COLORS = [
  '#FF6B6B', // Red
  '#FFFFFF', // White
  '#FF9F43', // Orange
  '#48DBFB', // Sky Blue
  '#5F27CD', // Purple
  '#F368E0', // Hot Pink
  '#00B894', // Jade
  '#FFDC00', // Bright Yellow
  '#A3CB38', // Lime Green
  '#341F97', // Deep Indigo
  '#FF793F', // Coral
  '#222F3E', // Dark Gray-Blue
];

const EMOJIS = [
  "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇",
  "🙂", "☺️", "😋", "😛", "🤗", "🤭", "🥰", "😍", "🤩", "😘",
  "😗", "😚", "😙", "🥳"
];

export default function Home() {
  const [pixels, setPixels] = useState<PixelData[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPixel, setSelectedPixel] = useState<number | null>(null);
  const [adopter, setAdopter] = useState('');
  const [selectedColor, setSelectedColor] = useState(AVAILABLE_COLORS[0]);
  const [loading, setLoading] = useState(true);

  // Initialize and load pixels from Supabase
  useEffect(() => {
    const loadPixels = async () => {
      const loadedPixels = await pixelOperations.getAllPixels();
      setPixels(loadedPixels);
    };

    const initializeApp = async () => {
      setLoading(true);
      
      // Initialize pixels in database if needed
      await pixelOperations.initializePixels(TOTAL_PIXELS);
      
      // Load current pixel state
      await loadPixels();
      
      setLoading(false);
    };

    initializeApp();

    // Subscribe to real-time changes
    const subscription = pixelOperations.subscribeToPixelChanges((payload) => {
      if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
        const updatedPixel = payload.new as PixelData;
        setPixels(prev => 
          prev.map(pixel => 
            pixel.id === updatedPixel.id ? updatedPixel : pixel
          )
        );
      }
    });

    // Auto-refresh every 5 seconds
    const refreshInterval = setInterval(() => {
      loadPixels();
    }, 5000);

    return () => {
      subscription.unsubscribe();
      clearInterval(refreshInterval);
    };
  }, []);

  // Check if all pixels are adopted and reset if so
  useEffect(() => {
    if (pixels.length > 0 && pixels.every(pixel => pixel.adopted)) {
      setTimeout(async () => {
        await pixelOperations.resetAllPixels();
        // The real-time subscription will update the UI automatically
      }, 10000); // Wait 10 seconds before reset
    }
  }, [pixels]);

  const handlePixelClick = (pixelId: number) => {
    const pixel = pixels[pixelId];
    if (!pixel.adopted) {
      setSelectedPixel(pixelId);
      setShowModal(true);
    }
  };

  const handleAdopt = async () => {
    if (selectedPixel !== null && adopter.trim()) {
      const randomEmoji = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
      
      const success = await pixelOperations.adoptPixel(
        selectedPixel, 
        adopter.trim(), 
        selectedColor, 
        randomEmoji
      );
      
      if (success) {
        setShowModal(false);
        setSelectedPixel(null);
        setAdopter('');
        setSelectedColor(AVAILABLE_COLORS[0]);
      } else {
        alert('Failed to adopt pixel. Please try again.');
      }
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setSelectedPixel(null);
    setAdopter('');
    setSelectedColor(AVAILABLE_COLORS[0]);
  };

  const adoptedCount = pixels.filter(p => p.adopted).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading pixels...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-800">
          Adopt a Pixel
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Click on a grey pixel to adopt it! ({adoptedCount}/{TOTAL_PIXELS} adopted)
        </p>
        <p className="text-center text-xs text-gray-500 mb-4">
          Grid: {HORIZONTAL_PIXELS} × {VERTICAL_PIXELS} pixels
        </p>
        <p className="text-center text-sm text-gray-500 mb-4">
          🔄 Live updates
        </p>
        
        {/* Pixel Grid */}
        <div className="flex justify-center">
          <div 
            className="grid gap-1 bg-white p-4 rounded-lg shadow-lg"
            style={{ 
              gridTemplateColumns: `repeat(${HORIZONTAL_PIXELS}, 1fr)`,
              width: 'fit-content'
            }}
          >
          {pixels.map((pixel) => (
            <div
              key={pixel.id}
              onClick={() => handlePixelClick(pixel.id)}
              className={`
                w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 rounded-sm cursor-pointer transition-all duration-200 
                hover:scale-110 hover:shadow-md flex items-center justify-center text-xs
                ${!pixel.adopted ? 'hover:bg-gray-300' : ''}
              `}
              style={{ backgroundColor: pixel.color }}
              title={pixel.adopted ? `Adopted by ${pixel.adopter}` : 'Click to adopt me!'}
            >
              {pixel.adopted && (
                <span className="text-xs sm:text-sm">{pixel.emoji}</span>
              )}
            </div>
          ))}
          </div>
        </div>

        {adoptedCount === TOTAL_PIXELS && (
          <div className="text-center mt-6 p-4 bg-green-100 rounded-lg">
            <p className="text-green-800 font-semibold text-lg">
              🎉 All pixels adopted! Resetting in 10 seconds... 🎉
            </p>
          </div>
        )}
      </div>

      {/* Adoption Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold text-center mb-4 text-gray-800">
              🥺 Will you adopt me?
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your name:
                </label>
                <input
                  type="text"
                  value={adopter}
                  onChange={(e) => setAdopter(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:shadow-[2px_2px_4px_rgba(0,0,0,0.2)] text-gray-900 placeholder-gray-500"
                  placeholder="Enter your name"
                  maxLength={20}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose a color:
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {AVAILABLE_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`
                        w-8 h-8 rounded-full border-2 transition-all
                        ${selectedColor === color ? 'border-gray-800 scale-110' : 'border-gray-300'}
                      `}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleCancel}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                >
                  Maybe later
                </button>
                <button
                  onClick={handleAdopt}
                  disabled={!adopter.trim()}
                  className={`
                    flex-1 px-4 py-2 rounded-md transition-colors
                    ${adopter.trim() 
                      ? 'bg-blue-500 text-white hover:bg-blue-600' 
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  Yes, adopt! 💖
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
