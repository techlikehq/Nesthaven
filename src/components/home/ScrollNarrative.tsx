import { useRef, useState, useCallback } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  AnimatePresence,
} from 'motion/react';

/* ─────────────────────────────────────────────────────────────
   CONTENT — edit freely
───────────────────────────────────────────────────────────── */
/* ── Humanized Content — Replace your FACTS const ── */
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

/* ─────────────────────────────────────────────────────────────
   CONFIG — tweak values here
   ─────────────────────────────────────────────────────────────
   HOW THE CIRCLE WORKS
   ────────────────────
   • The SVG container is 100vw × 100vw (a square the width of the screen).
   • It is pinned to the TOP of the sticky section.
   • The sticky section has overflow:hidden so the BOTTOM HALF of the
     circle is invisible — only the top arc shows, exactly like joindawn.
   • Circle center = (50%, 50%) of the 100vw square  =  (50vw, 50vw)
     On a 1366×768 screen that is (683px, 683px) — BELOW viewport centre.
   • The visible arc sweeps from bottom-left → top → bottom-right (≈195°).
   ─────────────────────────────────────────────────────────────
   ARC ANGLE MATHS
   ───────────────
   SVG draws clockwise from 0° = 3 o'clock.
   To visually start at 8 o'clock (240° CW from 12):
     SVG start angle = 240° − 90° = 150°   →  rotate(150, 50, 50)
   Arc travels 200° CW from there, ending near 3–4 o'clock.
───────────────────────────────────────────────────────────── */
const CFG = {
  R:           48,       // SVG radius (viewBox 0-100)
  arcDeg:      200,      // degrees the arc draws during full scroll
  startRotate: 150,      // SVG rotate for 8-o'clock visual start (= 240°−90°)
  bg:          '#0C0702',
  trackStroke: 'rgba(210,155,50,0.13)',
  arcGold:     '#C8923A',
  textGold:    '#D4AA65',
};

/* ─────────────────────────────────────────────────────────────
   CURSOR IMAGE POPUP
───────────────────────────────────────────────────────────── */
function CursorImg({ x, y, src, visible }: { x: any; y: any; src: string; visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key={src}
          className="fixed pointer-events-none z-[9999] overflow-hidden"
          style={{
            x, y,
            translateX: '-22%',
            translateY: '-66%',
            width: 168,
            height: 224,
            borderRadius: 3,
          }}
          initial={{ opacity: 0, scale: 0.82, rotate: -8 }}
          animate={{ opacity: 1, scale: 1,    rotate:  5 }}
          exit={{   opacity: 0, scale: 0.82              }}
          transition={{ 
            duration: 0.8, // Slower, more deliberate
            ease: [0.16, 1, 0.3, 1] // A more "organic" spring-like curve
          }}
        >
          <img src={src} alt="" className="w-full h-full object-cover" draggable={false} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */
export default function ScrollNarrative() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  /* ── Arc maths ── */
  const R      = CFG.R;
  const C      = 2 * Math.PI * R;                    // ≈ 301.6 SVG units
  const maxArc = (CFG.arcDeg / 360) * C;             // ≈ 167.6 (200°)

  // strokeDasharray = "C C":  at dashOffset=C nothing shows; at C−maxArc, 200° shows
  const dashOffset = useTransform(scrollYProgress, [0, 1], [C, C - maxArc]);

  /* ── Text opacities (React rules: no hooks inside loops) ── */
  const op0 = useTransform(scrollYProgress, [0.00, 0.06, 0.27, 0.33], [0, 1, 1, 0]);
  const op1 = useTransform(scrollYProgress, [0.33, 0.39, 0.61, 0.67], [0, 1, 1, 0]);
  const op2 = useTransform(scrollYProgress, [0.67, 0.73, 0.94, 1.00], [0, 1, 1, 0]);
  const opacities = [op0, op1, op2];

  const ty0 = useTransform(scrollYProgress, [0.00, 0.08], [16, 0]);
  const ty1 = useTransform(scrollYProgress, [0.33, 0.41], [16, 0]);
  const ty2 = useTransform(scrollYProgress, [0.67, 0.75], [16, 0]);
  const yOffsets = [ty0, ty1, ty2];

  /* ── Cursor tracking ── */
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

  const scrollHintOp = useTransform(scrollYProgress, [0, 0.07], [1, 0]);
  const arcTransform = `rotate(${CFG.startRotate}, 50, 50)`;

  return (
    <>
      <CursorImg x={sX} y={sY} src={FACTS[imgI].image} visible={hov} />

      {/* ── 300vh scroll container ── */}
      <div
        ref={containerRef}
        className="relative h-[300vh]"
        style={{ backgroundColor: CFG.bg }}
      >
        {/* ── Sticky viewport ── */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">

          {/* ════════════════════════════════════════════════════
              CIRCLE SVG
              ─────────────────────────────────────────────────
              100vw × 100vw square pinned to the TOP of section.
              overflow:hidden on the parent hides the bottom half.
              This leaves only the top arc visible — joindawn style.
          ════════════════════════════════════════════════════ */}
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 pointer-events-none select-none"
            style={{ width: '100vw', height: '100vw' }}
          >
            <svg
              viewBox="0 0 100 100"
              width="100%"
              height="100%"
              overflow="visible"
            >
              <defs>
                {/* Warm golden gradient — fades at both tips of the arc */}
                <linearGradient
                  id="sn-arc-g"
                  gradientUnits="userSpaceOnUse"
                  x1="2" y1="2" x2="98" y2="98"
                >
                  <stop offset="0%"   stopColor="rgba(160,90,10,0.0)"  />
                  <stop offset="18%"  stopColor="rgba(190,130,35,0.85)"/>
                  <stop offset="52%"  stopColor={CFG.arcGold}          />
                  <stop offset="82%"  stopColor="rgba(190,130,35,0.7)" />
                  <stop offset="100%" stopColor="rgba(160,90,10,0.0)"  />
                </linearGradient>
              </defs>

              {/* ① TRACK — thin dashed ring, always visible */}
              <circle
                cx="50" cy="50" r={R}
                fill="none"
                stroke={CFG.trackStroke}
                strokeWidth="0.42"
                strokeDasharray="1.3 2.9"  /* dash size  gap size */
              />

              {/* ② ARC LAYERS — wrapped in <g> for the start-angle rotation  */}
              {/*   rotate(150, 50, 50) → drawing starts at visual 8 o'clock   */}
              <g transform={arcTransform}>

                {/* Outer soft glow */}
                <motion.circle
                  cx="50" cy="50" r={R}
                  fill="none"
                  stroke="rgba(190,130,35,0.09)"
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeDasharray={`${C} ${C}`}
                  style={{ strokeDashoffset: dashOffset } as React.CSSProperties}
                />

                {/* Inner glow */}
                <motion.circle
                  cx="50" cy="50" r={R}
                  fill="none"
                  stroke="rgba(200,145,40,0.18)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeDasharray={`${C} ${C}`}
                  style={{ strokeDashoffset: dashOffset } as React.CSSProperties}
                />

                {/* Sharp golden arc */}
                <motion.circle
                  cx="50" cy="50" r={R}
                  fill="none"
                  stroke="url(#sn-arc-g)"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                  strokeDasharray={`${C} ${C}`}
                  style={{ strokeDashoffset: dashOffset } as React.CSSProperties}
                />

                {/* Bright luminance core */}
                <motion.circle
                  cx="50" cy="50" r={R}
                  fill="none"
                  stroke="rgba(240,205,110,0.45)"
                  strokeWidth="0.32"
                  strokeLinecap="round"
                  strokeDasharray={`${C} ${C}`}
                  style={{ strokeDashoffset: dashOffset } as React.CSSProperties}
                />
              </g>
                  {/* Change the dotted accent loop to random offsets */}
                  {Array.from({ length: 6 }, (_, r) =>
                    Array.from({ length: 3 }, (_, c) => (
                      <circle
                        key={`${r}-${c}`}
                        // Add a slight random jitter so it doesn't look like a machine placed them
                        cx={75 + c * 3.5 + (Math.random() * 2)}
                        cy={28 + r * 4.5 + (Math.random() * 2)}
                        r="0.6"
                        fill="rgba(200,150,50,0.18)"
                      />
                    ))
                  )}
            </svg>
          </div>

          {/* ════════════════════════════════════════════════════
              TEXT — small, centered, positioned inside the arc
          ════════════════════════════════════════════════════ */}
          <div
            className="relative z-10"
            style={{ textAlign: 'center' }}
            onMouseMove={onMove}
            onMouseEnter={() => setHov(true)}
            onMouseLeave={() => setHov(false)}
          >
            {/*
              The text wrapper is narrow so the paragraph wraps naturally
              and stays well inside the visible arc area.
            */}
            <div
              style={{
                position: 'relative',
                width: 'min(480px, 38vw)',   /* narrow — keeps text tight like joindawn */
                height: 'clamp(120px, 14vw, 160px)',
              }}
            >
              {FACTS.map(({ label, text }, idx) => (
                <motion.div
                  key={idx}
                  style={{ opacity: opacities[idx], y: yOffsets[idx] }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-4"
                >
                  {/* Step counter */}
                  <span style={{
                    fontFamily: 'monospace',
                    fontSize: 10,
                    letterSpacing: '0.24em',
                    textTransform: 'uppercase',
                    color: 'rgba(200,155,55,0.5)',
                  }}>
                    {label}
                  </span>

                  {/* Narrative — body-sized, not title-sized */}
                  <p style={{
                    fontSize:     'clamp(14px, 1.45vw, 18px)',  /* ← small, like joindawn subtitle */
                    color:         CFG.textGold,
                    fontWeight:    300,
                    lineHeight:    1.62,
                    letterSpacing: '0.01em',
                    textAlign:    'center',
                    margin:        0,
                  }}>
                    {text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Scroll hint */}
          <motion.div
            style={{
              position: 'absolute',
              bottom: 36,
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              opacity: scrollHintOp,
            }}
          >
            <span style={{
              fontFamily:    'monospace',
              fontSize:       9,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color:         'rgba(200,155,55,0.3)',
            }}>
              Scroll
            </span>
            <motion.div
              style={{
                width:      1,
                height:     28,
                background: 'linear-gradient(to bottom, rgba(200,155,55,0.3), transparent)',
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