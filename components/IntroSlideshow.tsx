'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring, useAnimationFrame, useReducedMotion } from 'framer-motion';
import Image from 'next/image';

interface IntroSlideshowProps {
  onComplete: () => void;
  images: string[];
}

const slides = [
  {
    title: 'Politics in Sixty Seconds',
    subtitle: 'Exploring New Frontiers',
  },
  {
    title: 'Innovation',
    subtitle: 'Through Systematic Inquiry',
  },
  {
    title: 'Discover',
    subtitle: 'What Lies Beyond',
  },
];

type Phase = 'intro' | 'flythrough' | 'complete';

const floatingPositions = [
  { x: -35, y: -35, rotate: -12, baseScale: 0.6 },
  { x: 35, y: -30, rotate: 8, baseScale: 0.7 },
  { x: -40, y: 15, rotate: 6, baseScale: 0.55 },
  { x: 38, y: 20, rotate: -10, baseScale: 0.65 },
  { x: -25, y: 35, rotate: 15, baseScale: 0.5 },
  { x: 30, y: 38, rotate: -8, baseScale: 0.55 },
  { x: -20, y: -15, rotate: -5, baseScale: 0.45 },
  { x: 25, y: -5, rotate: 12, baseScale: 0.5 },
];

function FlyingImage({
  src,
  index,
  phase,
  flythroughProgress,
  totalSteps,
}: {
  src: string;
  index: number;
  phase: Phase;
  flythroughProgress: number;
  totalSteps: number;
}) {
  const pos = floatingPositions[index];

  // Raw target values (x/y in vw/vh units, others numeric)
  const rawX = useMotionValue(pos.x);
  const rawY = useMotionValue(pos.y);
  const rawScale = useMotionValue(pos.baseScale * 0.3);
  const rawRotate = useMotionValue(pos.rotate);
  const rawOpacity = useMotionValue(0);

  // Spring-smoothed display values — always running, never interrupted
  const smoothX = useSpring(rawX, { stiffness: 60, damping: 20, mass: 1 });
  const smoothY = useSpring(rawY, { stiffness: 60, damping: 20, mass: 1 });
  const scale = useSpring(rawScale, { stiffness: 50, damping: 18, mass: 1.2 });
  const rotate = useSpring(rawRotate, { stiffness: 45, damping: 16 });
  const opacity = useSpring(rawOpacity, { stiffness: 80, damping: 28 });

  // Convert numeric vw/vh values to CSS calc strings (handles centering + offset)
  const x = useTransform(smoothX, (v) => `calc(-50% + ${v}vw)`);
  const y = useTransform(smoothY, (v) => `calc(-50% + ${v}vh)`);

  // Staggered entrance on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      rawScale.set(pos.baseScale);
      rawOpacity.set(0.65);
    }, index * 180);
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const prefersReducedMotion = useReducedMotion();

  // Organic floating in intro phase — sinusoidal, continuous, no snaps
  useAnimationFrame((time) => {
    if (phase !== 'intro' || prefersReducedMotion) return;
    const t = time / 1000;
    rawX.set(pos.x + Math.cos(t * 0.28 + index * 0.65) * 1.8);
    rawY.set(pos.y + Math.sin(t * 0.35 + index * 0.88) * 2.5);
    rawRotate.set(pos.rotate + Math.sin(t * 0.18 + index * 0.5) * 2);
  });

  // Flythrough: update spring targets per scroll step
  useEffect(() => {
    if (phase !== 'flythrough') return;
    const progress = flythroughProgress / totalSteps;
    rawX.set(pos.x * (1 - progress * 1.3));
    rawY.set(pos.y * (1 - progress * 1.3));
    // Reduced max scale from 5 to 3.5 to prevent GPU rendering lag when overlapping huge rotated layers
    rawScale.set(pos.baseScale + progress * (3.5 - pos.baseScale));
    rawRotate.set(pos.rotate * (1 - progress));
    // Start fading out earlier (at 50% instead of 75%) to ease GPU compositing fill-rate
    rawOpacity.set(progress > 0.5 ? Math.max(0, 1 - (progress - 0.5) * 2) : 1);
  }, [phase, flythroughProgress, totalSteps, pos, rawX, rawY, rawScale, rawRotate, rawOpacity]);

  // Complete: zoom past the camera
  useEffect(() => {
    if (phase !== 'complete') return;
    rawScale.set(8);
    rawOpacity.set(0);
  }, [phase, rawScale, rawOpacity]);

  return (
    <motion.div
      className="absolute w-32 md:w-48 aspect-[3/4] pointer-events-none"
      style={{
        left: '50%',
        top: '50%',
        x,
        y,
        scale,
        rotateZ: rotate,
        opacity,
        transformStyle: 'preserve-3d',
        willChange: 'transform, opacity'
      }}
    >
      <Image
        src={src}
        alt=""
        fill
        className="object-cover rounded-sm shadow-2xl"
        priority
      />
    </motion.div>
  );
}

export default function IntroSlideshow({ onComplete, images }: IntroSlideshowProps) {
  const prefersReducedMotion = useReducedMotion();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [phase, setPhase] = useState<Phase>('intro');
  const [flythroughProgress, setFlythroughProgress] = useState(0);
  const accumulatedDelta = useRef(0);
  const isAnimating = useRef(false);
  const threshold = 35;
  const totalFlythroughSteps = 20;

  useEffect(() => {
    if (prefersReducedMotion) {
      onComplete();
    }
  }, [prefersReducedMotion, onComplete]);

  useEffect(() => {
    if (phase !== 'intro') return;
    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearTimeout(timer);
  }, [currentSlide, phase]);

  const startFlythrough = useCallback(() => {
    if (phase !== 'intro') return;
    if (prefersReducedMotion) { onComplete(); return; }
    setPhase('flythrough');
  }, [phase, prefersReducedMotion, onComplete]);

  const handleFlythroughScroll = useCallback((delta: number) => {
    if (phase !== 'flythrough' || isAnimating.current) return;

    accumulatedDelta.current += delta;

    if (Math.abs(accumulatedDelta.current) >= threshold) {
      const direction = accumulatedDelta.current > 0 ? 1 : -1;

      if (direction > 0) {
        setFlythroughProgress((prev) => {
          const newProgress = Math.min(prev + 1, totalFlythroughSteps);
          if (newProgress >= totalFlythroughSteps) {
            isAnimating.current = true;
            setTimeout(() => {
              setPhase('complete');
              setTimeout(() => {
                onComplete();
              }, 250); // Sped up the transition
            }, 50);
          }
          return newProgress;
        });
      } else {
        setFlythroughProgress((prev) => Math.max(prev - 1, 0));
      }

      accumulatedDelta.current = 0;
    }
  }, [phase, onComplete, totalFlythroughSteps, threshold]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (phase === 'intro') {
        startFlythrough();
      } else if (phase === 'flythrough') {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === ' ') {
          e.preventDefault();
          handleFlythroughScroll(threshold + 10);
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
          e.preventDefault();
          handleFlythroughScroll(-(threshold + 10));
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (phase === 'intro') {
        startFlythrough();
      } else if (phase === 'flythrough') {
        handleFlythroughScroll(e.deltaY);
      }
    };

    const handleClick = () => {
      if (phase === 'intro') startFlythrough();
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      if (phase === 'intro') startFlythrough();
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (phase === 'flythrough') {
        e.preventDefault();
        const delta = touchStartY - e.touches[0].clientY;
        handleFlythroughScroll(delta * 1.5);
        touchStartY = e.touches[0].clientY;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('click', handleClick);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [phase, startFlythrough, handleFlythroughScroll]);

  const progressPercent = Math.round((flythroughProgress / totalFlythroughSteps) * 100);

  return (
    <motion.div
      className={`fixed inset-0 z-[100] bg-background overflow-hidden ${phase === 'complete' ? 'pointer-events-none' : ''}`}
      style={{ perspective: 1200 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {images.slice(0, 8).map((src, index) => (
        <FlyingImage
          key={index}
          src={src}
          index={index}
          phase={phase}
          flythroughProgress={flythroughProgress}
          totalSteps={totalFlythroughSteps}
        />
      ))}

      <AnimatePresence>
        {phase === 'intro' && (
          <motion.div
            className="relative z-10 h-full flex items-center justify-center"
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -40, scale: 1.05 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="text-center px-6 max-w-[92vw] mx-auto"
              >
                <motion.h1
                  className="font-serif text-[clamp(2.25rem,9vw,8rem)] leading-[1.05] tracking-tight mb-6 text-balance"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <span className="italic">{slides[currentSlide].title}</span>
                </motion.h1>
                <motion.p
                  className="font-mono text-sm md:text-lg uppercase tracking-[0.3em] text-foreground/50"
                  initial={{ opacity: 0, letterSpacing: '0.5em' }}
                  animate={{ opacity: 1, letterSpacing: '0.3em' }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  {slides[currentSlide].subtitle}
                </motion.p>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {phase === 'flythrough' && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div className="text-center">
              <motion.p
                className="font-mono text-xs md:text-sm uppercase tracking-[0.3em] text-foreground/70"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                Keep scrolling to enter
              </motion.p>
              <motion.div
                className="mt-6 flex justify-center gap-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-1 h-6 bg-foreground/40 rounded-full"
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      delay: i * 0.15,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {phase === 'intro' && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-4 z-30">
          {slides.map((_, index) => (
            <motion.div
              key={index}
              className="h-0.5 rounded-full bg-foreground/10 overflow-hidden"
              style={{ width: 60 }}
            >
              <motion.div
                className="h-full bg-foreground/60"
                animate={{
                  width: index === currentSlide ? '100%' : index < currentSlide ? '100%' : '0%',
                }}
                transition={{
                  duration: index === currentSlide ? 3 : 0.3,
                  ease: 'linear',
                }}
              />
            </motion.div>
          ))}
        </div>
      )}

      {phase === 'flythrough' && (
        <motion.div
          className="absolute bottom-24 left-1/2 -translate-x-1/2 z-30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="w-48 h-1.5 bg-foreground/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-foreground/70 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ type: 'spring', stiffness: 80, damping: 15 }}
            />
          </div>
          <motion.p
            className="text-center mt-3 font-mono text-xs uppercase tracking-widest text-foreground/50"
            key={progressPercent}
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
          >
            {progressPercent}%
          </motion.p>
        </motion.div>
      )}

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
      >
        <p className="font-mono text-[10px] uppercase tracking-widest text-foreground/30">
          {phase === 'intro'
            ? 'Press any key, click, or scroll to begin'
            : 'Scroll or use arrow keys to continue'}
        </p>
      </motion.div>
    </motion.div>
  );
}
