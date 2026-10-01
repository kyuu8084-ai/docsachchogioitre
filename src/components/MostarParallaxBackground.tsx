import { useEffect, useRef } from 'react';

export default function MostarParallaxBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rootEl = containerRef.current;
    if (!rootEl) return;

    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetScroll = 0;
    let smoothScroll = 0;
    let initialized = false;
    let rafId: number | null = null;

    const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));
    const smoothstep = (e0: number, e1: number, v: number) => {
      const x = clamp((v - e0) / (e1 - e0));
      return x * x * (3 - 2 * x);
    };
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const segmentInOut = (s: number, a: number, b: number, c: number, d: number) => {
      const enter = smoothstep(a, b, s);
      const exit = smoothstep(c, d, s);
      return { enter, exit, active: enter * (1 - exit) };
    };

    const getScrollDistance = () => {
      return clamp(window.scrollY, 0, 3700);
    };

    const handlePointerMove = (e: MouseEvent) => {
      targetMouseX = e.clientX / window.innerWidth - 0.5;
      targetMouseY = e.clientY / window.innerHeight - 0.5;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    const update = () => {
      targetScroll = getScrollDistance();
      if (!initialized) {
        smoothScroll = targetScroll;
        initialized = true;
      } else {
        smoothScroll = lerp(smoothScroll, targetScroll, 0.14);
      }
      if (Math.abs(smoothScroll - targetScroll) < 0.08) smoothScroll = targetScroll;

      mouseX = lerp(mouseX, targetMouseX, 0.12);
      mouseY = lerp(mouseY, targetMouseY, 0.12);

      const frame2 = segmentInOut(smoothScroll, 560, 900, 1300, 1620);
      const frame3 = segmentInOut(smoothScroll, 1760, 2140, 2540, 2700);
      const progress = clamp(smoothScroll / 2700);
      const blurActive = clamp(frame2.active + frame3.active);
      const frame2Opacity = frame2.active * (1 - frame3.enter);
      const splitDrift = Math.pow(frame2.enter, 1.5);
      const backScale = 0.76 + progress * 0.2 + frame2.enter * 0.18 + frame3.enter * 0.16;
      const sharedHeroY = progress * -74;
      const sharedHeroScale = progress * 0.23;

      // Set CSS variables on rootEl
      rootEl.style.setProperty('--mx', mouseX.toFixed(4));
      rootEl.style.setProperty('--my', mouseY.toFixed(4));
      rootEl.style.setProperty('--back-opacity', (1 - frame2.active * 0.06).toFixed(4));
      rootEl.style.setProperty('--back-x', `${(mouseX * -12).toFixed(2)}px`);
      rootEl.style.setProperty('--back-y', `${(mouseY * -4).toFixed(2)}px`);
      rootEl.style.setProperty('--back-scale', backScale.toFixed(4));
      rootEl.style.setProperty('--four-y', `${(10 + progress * 10).toFixed(2)}vh`);
      rootEl.style.setProperty('--four-scale', (0.78 + progress * 0.16).toFixed(4));
      rootEl.style.setProperty('--bazaar-y', `${(20 - progress * 8).toFixed(2)}vh`);
      rootEl.style.setProperty('--blur-px', `${(blurActive * 14).toFixed(2)}px`);
      rootEl.style.setProperty('--back-brightness', (1 - blurActive * 0.255).toFixed(4));
      rootEl.style.setProperty('--bazaar-blur-px', `${(frame2.active * 14).toFixed(2)}px`);
      rootEl.style.setProperty('--bazaar-brightness', (1 - frame2.active * 0.255 - frame3.active * 0.06).toFixed(4));
      rootEl.style.setProperty('--bazaar-saturation', (1 + frame3.active * 0.18).toFixed(4));
      rootEl.style.setProperty('--shade-z', frame2.active > 0.02 ? '2' : '0');
      rootEl.style.setProperty('--shade-top-alpha', (blurActive * 0.465).toFixed(4));
      rootEl.style.setProperty('--shade-mid-alpha', (blurActive * 0.42).toFixed(4));
      rootEl.style.setProperty('--shade-bottom-alpha', (blurActive * 0.51).toFixed(4));

      rootEl.style.setProperty('--bridge-x', `calc(-50% + ${(mouseX * 18).toFixed(2)}px)`);
      rootEl.style.setProperty('--bridge-y', `${(mouseY * 8 + sharedHeroY - frame2.exit * 760).toFixed(2)}px`);
      rootEl.style.setProperty('--bridge-bottom', `${(5 - frame2.enter * 13).toFixed(2)}vh`);
      rootEl.style.setProperty('--bridge-width', `${(67.2 + frame2.enter * 37.8).toFixed(2)}vw`);
      rootEl.style.setProperty('--bridge-scale', (1.02 + sharedHeroScale + frame2.exit * 0.46).toFixed(4));

      rootEl.style.setProperty('--split-left-x', `calc(-50% + ${(-splitDrift * 46).toFixed(2)}vw + ${(mouseX * 22).toFixed(2)}px)`);
      rootEl.style.setProperty('--split-left-y', `${(mouseY * 10 + sharedHeroY - splitDrift * 180).toFixed(2)}px`);
      rootEl.style.setProperty('--split-left-scale', (1 + sharedHeroScale + frame2.enter * 0.74).toFixed(4));

      rootEl.style.setProperty('--split-right-x', `calc(-50% + ${(splitDrift * 46).toFixed(2)}vw + ${(mouseX * 22).toFixed(2)}px)`);
      rootEl.style.setProperty('--split-right-y', `${(mouseY * 10 + sharedHeroY - splitDrift * 180).toFixed(2)}px`);
      rootEl.style.setProperty('--split-right-scale', (1 + sharedHeroScale + frame2.enter * 0.74).toFixed(4));

      rootEl.style.setProperty('--frame2-opacity', frame2Opacity.toFixed(4));
      rootEl.style.setProperty('--frame2-x', `calc(-50% + ${(mouseX * 10).toFixed(2)}px)`);
      rootEl.style.setProperty('--frame2-y', `calc(-50% + ${(mouseY * 8 - frame2.exit * 150).toFixed(2)}px)`);
      rootEl.style.setProperty('--frame2-scale', (1.06 + frame2.enter * 0.08 + frame2.exit * 0.08).toFixed(4));

      rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0"
      style={
        {
          '--blur-tint': '74, 181, 224',
          '--shade-top-alpha': 0,
          '--shade-mid-alpha': 0,
          '--shade-bottom-alpha': 0,
          '--shade-z': 0,
          '--back-opacity': 1,
          '--back-x': '0px',
          '--back-y': '0px',
          '--back-scale': 0.76,
          '--four-y': '10vh',
          '--four-scale': 0.78,
          '--bazaar-y': '20vh',
          '--blur-px': '0px',
          '--back-brightness': 1,
          '--bazaar-blur-px': '0px',
          '--bazaar-brightness': 1,
          '--bazaar-saturation': 1,
          '--bridge-x': '-50%',
          '--bridge-y': '0px',
          '--bridge-bottom': '5vh',
          '--bridge-width': '67.2vw',
          '--bridge-scale': 1.02,
          '--split-left-x': '-50%',
          '--split-left-y': '0px',
          '--split-left-scale': 1,
          '--split-right-x': '-50%',
          '--split-right-y': '0px',
          '--split-right-scale': 1,
          '--frame2-opacity': 0,
          '--frame2-x': '-50%',
          '--frame2-y': '-50%',
          '--frame2-scale': 1.06,
        } as React.CSSProperties
      }
    >
      {/* 1. Sky / farthest background */}
      <img
        src="https://raft-blast-61784561.figma.site/_assets/v11/16b5007d9c93971e26ffe4e0e3e37946f6bd538c.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
        style={{
          filter: 'blur(var(--blur-px, 0px)) brightness(var(--back-brightness, 1))',
          transform: 'none',
        }}
      />

      {/* 2. Back-stack: four glow & bazaar mid-back */}
      <div
        className="absolute top-0 bottom-0 -left-[3vw] -right-[3vw] pointer-events-none select-none"
        style={{
          opacity: 'var(--back-opacity, 1)',
          transform: 'translate3d(var(--back-x, 0px), var(--back-y, 0px), 0) scale(var(--back-scale, 0.76))',
          transformOrigin: '50% 100%',
        }}
      >
        {/* Back four glow layer */}
        <img
          src="https://raft-blast-61784561.figma.site/_assets/v11/8a7f8af50e0ce92ec2e228e7b0b4112178c51cf1.png"
          alt=""
          className="absolute bottom-0 left-[48%] w-[112%] h-auto object-contain select-none pointer-events-none"
          style={{
            zIndex: 1,
            opacity: 0.72,
            mixBlendMode: 'screen',
            transform: 'translate3d(-50%, calc(var(--four-y, 10vh) - 110px), 0) scale(var(--four-scale, 0.78))',
          }}
        />

        {/* Bazaar mid-back */}
        <img
          src="https://raft-blast-61784561.figma.site/_assets/v11/864afe00e41e2fa20a5aa546e15cb807e0f81384.png"
          alt=""
          className="absolute bottom-0 left-[48%] w-[112%] h-auto object-contain select-none pointer-events-none"
          style={{
            zIndex: 3,
            opacity: 1,
            filter:
              'blur(var(--bazaar-blur-px, 0px)) brightness(var(--bazaar-brightness, 1)) saturate(var(--bazaar-saturation, 1))',
            transform: 'translate3d(-50%, var(--bazaar-y, 20vh), 0) scale(0.86)',
          }}
        />
      </div>

      {/* 3. Splitframe LEFT */}
      <img
        src="https://raft-blast-61784561.figma.site/_assets/v11/7536d7b60a1fce482cf6edf3f0bffd3bad5d0f8a.png"
        alt=""
        className="absolute left-1/2 -bottom-[2vh] w-[min(118vw,2240px)] h-auto select-none pointer-events-none"
        style={{
          zIndex: 6,
          transform: 'translate3d(var(--split-left-x, -50%), var(--split-left-y, 0px), 0) scale(var(--split-left-scale, 1))',
          transformOrigin: '21% 52%',
        }}
      />

      {/* 4. Splitframe RIGHT */}
      <img
        src="https://raft-blast-61784561.figma.site/_assets/v11/392db6a6a6b98e868bd7f8d3f55bb719d51e5028.png"
        alt=""
        className="absolute left-1/2 -bottom-[2vh] w-[min(118vw,2240px)] h-auto select-none pointer-events-none"
        style={{
          zIndex: 6,
          transform: 'translate3d(var(--split-right-x, -50%), var(--split-right-y, 0px), 0) scale(var(--split-right-scale, 1))',
          transformOrigin: '79% 52%',
        }}
      />

      {/* 5. Bridge foreground */}
      <img
        src="https://raft-blast-61784561.figma.site/_assets/v11/c6a6d8ef49bca43f708aa852692942c45ec950d4.png"
        alt=""
        className="absolute left-1/2 select-none pointer-events-none"
        style={{
          zIndex: 4,
          bottom: 'var(--bridge-bottom, 5vh)',
          width: 'min(var(--bridge-width, 67.2vw), 2140px)',
          height: 'auto',
          transform: 'translate3d(var(--bridge-x, -50%), var(--bridge-y, 0px), 0) scale(var(--bridge-scale, 1.02))',
          transformOrigin: '50% 48%',
        }}
      />

      {/* 6. Frame-two river close-up */}
      <img
        src="https://raft-blast-61784561.figma.site/_assets/v11/ba75252bab2b1c510987b74837770f7bc8a6b2d4.png"
        alt=""
        className="absolute left-1/2 top-1/2 w-[min(122vw,2160px)] h-auto select-none pointer-events-none"
        style={{
          zIndex: 5,
          opacity: 'var(--frame2-opacity, 0)',
          transform: 'translate3d(var(--frame2-x, -50%), var(--frame2-y, -50%), 0) scale(var(--frame2-scale, 1.06))',
          transformOrigin: '50% 48%',
        }}
      />

      {/* 7. Atmosphere Shade Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 'var(--shade-z, 0)' as unknown as number,
          background:
            'linear-gradient(180deg, rgba(74, 181, 224, var(--shade-top-alpha, 0)) 0%, rgba(74, 181, 224, var(--shade-mid-alpha, 0)) 48%, rgba(74, 181, 224, var(--shade-bottom-alpha, 0)) 100%)',
        }}
      />
    </div>
  );
}
