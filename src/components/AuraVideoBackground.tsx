interface AuraVideoBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  overlayOpacity?: string;
}

export default function AuraVideoBackground({
  children,
  className = '',
  overlayOpacity = 'opacity-40',
}: AuraVideoBackgroundProps) {
  return (
    <div className={`relative w-full overflow-hidden bg-[#000000] text-white ${className}`}>
      {/* Background Layer with Floating Flowers Video */}
      <div 
        className="absolute inset-0 z-0 bottom-[-360px] pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          className={`w-full h-full object-cover object-bottom ${overlayOpacity} filter brightness-110 contrast-100`}
        >
          <source
            src="https://strvid.nyc3.cdn.digitaloceanspaces.com/motionsite/floating_flowers.mp4"
            type="video/mp4"
          />
        </video>

        {/* Multi-stop vertical dark gradient overlay - lightened for better visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />

        {/* Ambient subtle glow at the center */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(194, 186, 155, 0.15) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* Foreground Content with Z-index context */}
      <div className="relative z-10 w-full">
        {children}
      </div>
    </div>
  );
}
