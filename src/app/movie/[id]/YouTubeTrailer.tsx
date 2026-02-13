"use client";

import { useState } from "react";
import { Play, X } from "lucide-react";

interface YouTubeTrailerProps {
  videoId: string;
  title: string;
}

export function YouTubeTrailer({ videoId, title }: YouTubeTrailerProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!videoId) return null;

  return (
    <div className="mb-6">
      {!isOpen ? (
        /* Thumbnail Preview */
        <div 
          className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group"
          onClick={() => setIsOpen(true)}
        >
          <img
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              // Fallback to medium quality if maxresdefault doesn't exist
              (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
            }}
          />
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-red-600 flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-lg">
              <Play className="w-8 h-8 md:w-10 md:h-10 text-white ml-1" fill="white" />
            </div>
          </div>
          
          {/* "Watch Trailer" Text */}
          <div className="absolute bottom-3 left-3 bg-black/80 px-3 py-1 rounded text-white text-sm font-medium">
            Watch Trailer
          </div>
        </div>
      ) : (
        /* Video Embed */
        <div className="relative aspect-video rounded-lg overflow-hidden bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
          
          {/* Close Button */}
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-3 right-3 w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white hover:bg-black/80 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
