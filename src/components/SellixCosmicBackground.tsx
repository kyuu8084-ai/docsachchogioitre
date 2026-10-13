import { useState, useEffect, useRef } from 'react';

interface SellixCosmicBackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

const VIDEO_URL = "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_104036_bd6924f6-3c8e-417e-8465-6d03c8c2e9e6.mp4";
const POSTER_URL = "https://d2ol7oe51mr4n9.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/82e7eb75-c65f-490a-99b5-f3d1cad54200.webp";

export default function SellixCosmicBackground({
  children,
  className = '',
}: SellixCosmicBackgroundProps) {
  const [activeVideo, setActiveVideo] = useState<'A' | 'B'>('A');
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const vidA = videoARef.current;
    const vidB = videoBRef.current;
    if (!vidA || !vidB) return;

    // Cross-fade seamless loop handling for the 10.04s video clip
    const handleTimeUpdateA = () => {
      // 0.9s before loop ends (around 9.1s)
      if (vidA.duration && vidA.currentTime >= vidA.duration - 0.9) {
        vidB.currentTime = 0;
        vidB.play().catch(() => {});
        setActiveVideo('B');
      }
    };

    const handleTimeUpdateB = () => {
      if (vidB.duration && vidB.currentTime >= vidB.duration - 0.9) {
        vidA.currentTime = 0;
        vidA.play().catch(() => {});
        setActiveVideo('A');
      }
    };

    vidA.addEventListener('timeupdate', handleTimeUpdateA);
    vidB.addEventListener('timeupdate', handleTimeUpdateB);

    // Explicitly trigger play on mount
    const tryPlay = () => {
      vidA.play().catch(() => {
        // Fallback on user touch or click if blocked
        const startOnInteract = () => {
          vidA.play().catch(() => {});
          window.removeEventListener('click', startOnInteract);
          window.removeEventListener('touchstart', startOnInteract);
        };
        window.addEventListener('click', startOnInteract, { once: true });
        window.addEventListener('touchstart', startOnInteract, { once: true });
      });
    };
    tryPlay();

    return () => {
      vidA.removeEventListener('timeupdate', handleTimeUpdateA);
      vidB.removeEventListener('timeupdate', handleTimeUpdateB);
    };
  }, []);

  return (
    <div className={`relative w-full overflow-hidden bg-[#000000] text-white ${className}`}>
      {/* Exact Spec: 1280:800 bleed box always covering the viewport with dual seamless crossfade videos */}
      <div 
        className="fixed inset-0 pointer-events-none select-none overflow-hidden z-0"
        aria-hidden="true"
        role="img"
        aria-label="Stylised globe of Earth rendered as a purple dot matrix against a starfield, slowly rotating"
      >
        <div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black"
          style={{
            width: 'max(100vw, calc(100vh * 1.6))',
            height: 'max(62.5vw, 100vh)',
          }}
        >
          {/* Video A */}
          <video
            ref={videoARef}
            id="bgVideoA"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            poster={POSTER_URL}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[900ms] ease-linear pointer-events-none bg-black ${
              activeVideo === 'A' ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              objectPosition: '51% 8%',
            }}
          >
            <source src={VIDEO_URL} type="video/mp4" />
          </video>

          {/* Video B (Cross-fade double buffer to eliminate seam snap) */}
          <video
            ref={videoBRef}
            id="bgVideoB"
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            poster={POSTER_URL}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[900ms] ease-linear pointer-events-none bg-black ${
              activeVideo === 'B' ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              objectPosition: '51% 8%',
            }}
          >
            <source src={VIDEO_URL} type="video/mp4" />
          </video>

          {/* Vignette & Ambient Atmosphere */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-transparent to-black/75 pointer-events-none" />
          <div 
            className="absolute inset-0 pointer-events-none opacity-30"
            style={{
              background: 'radial-gradient(circle at 50% 40%, rgba(147, 51, 234, 0.12) 0%, transparent 65%)',
            }}
          />
        </div>
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
}
