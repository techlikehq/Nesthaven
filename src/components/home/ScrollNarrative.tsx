import { useRef, useState, useCallback, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  AnimatePresence,
  useMotionValueEvent,
} from 'motion/react';

const FACTS = [
  {
    label: "The Beginning",
    text: "We started with a simple observation: modern architecture had become too cold. NestHaven was born from the desire to build places that actually feel like home.",
  },
  {
    label: "Our Process",
    text: "We don't just 'vet' assets. We walk through every site, feel the light, and imagine how someone would spend their morning there. Logic is the tool, but intuition is the guide.",
  },
  {
    label: "The Promise",
    text: "Buildings are just structures. It's the people who breathe life into them that matter. We promise to keep building with that exact thought in mind.",
  },
];

const CFG = {
  R:           36,
  arcDeg:      200,
  startRotate: 150,
  bg:          '#0C0702',
  trackStroke: 'rgba(210,155,50,0.13)',
  arcGold:     '#C8923A',
  textGold:    '#FFFFFF',
  totalVh:     500,
};

function useTypewriter(text: string, playing: boolean, speed = 22) {
  const [displayed, setDisplayed] = useState('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (!playing) { setDisplayed(''); return; }
    setDisplayed('');
    let i = 0;
    timerRef.current = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(timerRef.current!);
    }, speed);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [text, playing, speed]);
  return displayed;
}

function FactPanel({
  label, text, opacity, y, active,
}: {
  label: string; text: string; opacity: any; y: any; active: boolean;
}) {
  const typed      = useTypewriter(text, active, 22);
  const showCursor = active && typed.length < text.length;

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 flex flex-col items-center justify-center gap-4"
    >
      <span style={{
        fontFamily:    'monospace',
        fontSize:      'clamp(9px, 0.85vw, 11px)',
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        fontWeight:    500,
        color:         CFG.arcGold,
      }}>
        {label}
      </span>
      <p style={{
        fontSize:      'clamp(15px, 1.4vw, 19px)',
        color:         CFG.textGold,
        fontWeight:    300,
        lineHeight:    1.72,
        letterSpacing: '0.01em',
        textAlign:     'center',
        margin:        0,
        minHeight:     '4.8em',
      }}>
        {typed}
        {showCursor && (
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.65, repeat: Infinity, ease: 'linear' }}
            style={{ color: CFG.arcGold, marginLeft: 2 }}
          >
            |
          </motion.span>
        )}
      </p>
    </motion.div>
  );
}

function CursorImg({ x, y, src, visible }: { x: any; y: any; src: string; visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && src && (
        <motion.div
          key={src}
          className="fixed pointer-events-none z-[9999] overflow-hidden"
          style={{ x, y, translateX: '-22%', translateY: '-66%', width: 168, height: 224, borderRadius: 3 }}
          initial={{ opacity: 0, scale: 0.82, rotate: -8 }}
          animate={{ opacity: 1, scale: 1,    rotate:  5 }}
          exit={{   opacity: 0, scale: 0.82              }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <img src={src} alt="" className="w-full h-full object-cover" draggable={false} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ProgressDots({ active }: { active: number }) {
  return (
    <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
      {FACTS.map((_, i) => (
        <motion.div
          key={i}
          animate={{
            width:           active === i ? 20 : 4,
            backgroundColor: active === i ? CFG.arcGold : 'rgba(255,255,255,0.18)',
          }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          style={{ height: 4, borderRadius: 2 }}
        />
      ))}
    </div>
  );
}

export default function ScrollNarrative() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const R          = CFG.R;
  const C          = 2 * Math.PI * R;
  const maxArc     = (CFG.arcDeg / 360) * C;
  const dashOffset = useTransform(scrollYProgress, [0, 1], [C, C - maxArc]);

  const op0 = useTransform(scrollYProgress, [0.00, 0.04, 0.28, 0.34], [0, 1, 1, 0]);
  const op1 = useTransform(scrollYProgress, [0.28, 0.34, 0.60, 0.66], [0, 1, 1, 0]);
  const op2 = useTransform(scrollYProgress, [0.60, 0.66, 0.94, 1.00], [0, 1, 1, 0]);
  const opacities = [op0, op1, op2];

  const ty0 = useTransform(scrollYProgress, [0.00, 0.06], [18, 0]);
  const ty1 = useTransform(scrollYProgress, [0.28, 0.36], [18, 0]);
  const ty2 = useTransform(scrollYProgress, [0.60, 0.68], [18, 0]);
  const yOffsets = [ty0, ty1, ty2];

  const [activeIdx, setActiveIdx] = useState(-1);
  const WINDOWS = [
    [0.04, 0.28],
    [0.34, 0.60],
    [0.66, 0.94],
  ] as const;

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    let next = -1;
    WINDOWS.forEach(([s, e], i) => { if (v >= s && v < e) next = i; });
    setActiveIdx(prev => (next !== prev ? next : prev));
  });

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const sX   = useSpring(rawX, { stiffness: 420, damping: 32 });
  const sY   = useSpring(rawY, { stiffness: 420, damping: 32 });
  const [hov,  setHov]  = useState(false);
  const [imgI, setImgI] = useState(0);
  const lastPos = useRef({ x: 0, y: 0 });

  const onMove = useCallback((e: React.MouseEvent) => {
    rawX.set(e.clientX);
    rawY.set(e.clientY);
    if (Math.hypot(e.clientX - lastPos.current.x, e.clientY - lastPos.current.y) > 120) {
      setImgI(i => (i + 1) % FACTS.length);
      lastPos.current = { x: e.clientX, y: e.clientY };
    }
  }, [rawX, rawY]);

  const scrollHintOp = useTransform(scrollYProgress, [0, 0.05], [1, 0]);
  const arcTransform = `rotate(${CFG.startRotate}, 50, 50)`;

  return (
    <>
      <CursorImg x={sX} y={sY} src={(FACTS[imgI] as any).image ?? ''} visible={hov} />

      <div
        ref={containerRef}
        className="relative"
        style={{ height: `${CFG.totalVh}vh`, backgroundColor: CFG.bg }}
      >
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">

          <ProgressDots active={activeIdx} />

          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 pointer-events-none select-none"
            style={{ width: '100vw', height: '100vw' }}
          >
            <svg viewBox="0 0 100 100" width="100%" height="100%" overflow="visible">
              <defs>
                <linearGradient id="sn-arc-g" gradientUnits="userSpaceOnUse"
                  x1="2" y1="2" x2="98" y2="98">
                  <stop offset="0%"   stopColor="rgba(160,90,10,0.0)"   />
                  <stop offset="18%"  stopColor="rgba(190,130,35,0.85)" />
                  <stop offset="52%"  stopColor={CFG.arcGold}           />
                  <stop offset="82%"  stopColor="rgba(190,130,35,0.7)"  />
                  <stop offset="100%" stopColor="rgba(160,90,10,0.0)"   />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r={R} fill="none"
                stroke={CFG.trackStroke} strokeWidth="0.45" strokeDasharray="1.2 3.0" />
              <g transform={arcTransform}>
                <motion.circle cx="50" cy="50" r={R} fill="none"
                  stroke="rgba(190,130,35,0.09)" strokeWidth="9" strokeLinecap="round"
                  strokeDasharray={`${C} ${C}`}
                  style={{ strokeDashoffset: dashOffset } as React.CSSProperties} />
                <motion.circle cx="50" cy="50" r={R} fill="none"
                  stroke="rgba(200,145,40,0.18)" strokeWidth="3.5" strokeLinecap="round"
                  strokeDasharray={`${C} ${C}`}
                  style={{ strokeDashoffset: dashOffset } as React.CSSProperties} />
                <motion.circle cx="50" cy="50" r={R} fill="none"
                  stroke="url(#sn-arc-g)" strokeWidth="1.2" strokeLinecap="round"
                  strokeDasharray={`${C} ${C}`}
                  style={{ strokeDashoffset: dashOffset } as React.CSSProperties} />
                <motion.circle cx="50" cy="50" r={R} fill="none"
                  stroke="rgba(240,210,120,0.48)" strokeWidth="0.28" strokeLinecap="round"
                  strokeDasharray={`${C} ${C}`}
                  style={{ strokeDashoffset: dashOffset } as React.CSSProperties} />
              </g>
            </svg>
          </div>

          {/* Text pinned to 72% down — sits in the belly of the arc */}
          <div
            className="absolute z-10"
            style={{
              top:       '72%',
              left:      '50%',
              transform: 'translate(-50%, -50%)',
              width:     'min(500px, 44vw)',
              textAlign: 'center',
            }}
            onMouseMove={onMove}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
          >
            <div style={{ position: 'relative', height: 'clamp(180px, 20vw, 240px)' }}>
              {FACTS.map(({ label, text }, idx) => (
                <FactPanel
                  key={idx}
                  label={label}
                  text={text}
                  opacity={opacities[idx]}
                  y={yOffsets[idx]}
                  active={activeIdx === idx}
                />
              ))}
            </div>
          </div>

          <motion.div
            style={{
              position:      'absolute',
              bottom:        36,
              left:          '50%',
              transform:     'translateX(-50%)',
              display:       'flex',
              flexDirection: 'column',
              alignItems:    'center',
              gap:           8,
              opacity:       scrollHintOp,
            }}
          >
            <span style={{
              fontFamily:    'monospace',
              fontSize:       9,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color:         'rgba(255,255,255,0.3)',
            }}>
              
            </span>
            <motion.div
              style={{
                width:        1,
                height:       28,
                background:   'linear-gradient(to bottom, rgba(255, 255, 255, 0.35), transparent)',
                borderRadius: 1,
              }}
              animate={{ scaleY: [1, 0.4, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>

        </div>
      </div>
    </>
  );
}
