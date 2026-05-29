'use client';

import { useRef, useEffect, useState, useCallback, type ReactNode } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

export function useSlideScroll(totalSections: number) {
  const [currentSection, setCurrentSection] = useState(0);
  const currentSectionRef = useRef(0);
  const isAnimating = useRef(false);
  const accumulatedDelta = useRef(0);
  const threshold = 80;
  const canScroll = useRef(false);

  useEffect(() => {
    if (totalSections > 0) {
      // Prevent residual scrolling momentum from accidentally skipping the first slide
      canScroll.current = false;
      accumulatedDelta.current = 0;
      const timer = setTimeout(() => {
        canScroll.current = true;
      }, 1000); 
      return () => clearTimeout(timer);
    } else {
      canScroll.current = false;
    }
  }, [totalSections]);

  const goToSection = useCallback((index: number) => {
    if (!canScroll.current || index < 0 || index >= totalSections || isAnimating.current) return;
    isAnimating.current = true;
    setCurrentSection(index);
    currentSectionRef.current = index;
    setTimeout(() => {
      isAnimating.current = false;
    }, 700);
  }, [totalSections]);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    accumulatedDelta.current += e.deltaY;
    if (Math.abs(accumulatedDelta.current) >= threshold) {
      const direction = accumulatedDelta.current > 0 ? 1 : -1;
      goToSection(currentSectionRef.current + direction);
      accumulatedDelta.current = 0;
    }
  }, [goToSection]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault();
      goToSection(currentSectionRef.current + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      goToSection(currentSectionRef.current - 1);
    }
  }, [goToSection]);

  const handleTouchStart = useRef<number>(0);

  const handleTouch = useCallback((e: TouchEvent) => {
    if (e.type === 'touchstart') {
      handleTouchStart.current = e.touches[0].clientY;
    } else if (e.type === 'touchend') {
      const delta = handleTouchStart.current - e.changedTouches[0].clientY;
      if (Math.abs(delta) > 50) {
        goToSection(currentSectionRef.current + (delta > 0 ? 1 : -1));
      }
    }
  }, [goToSection]);

  useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouch as EventListener);
    window.addEventListener('touchend', handleTouch as EventListener);
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouch as EventListener);
      window.removeEventListener('touchend', handleTouch as EventListener);
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [handleWheel, handleKeyDown, handleTouch]);

  return { currentSection, goToSection, totalSections };
}

type AnimationType =
  | 'fade-up'
  | 'fade-left'
  | 'fade-right'
  | 'scale'
  | 'blur'
  | 'split-reveal'
  | 'stagger-words'
  | 'parallax'
  | 'rotate-in'
  | 'elastic';

interface ScrollSectionProps {
  children: ReactNode;
  className?: string;
  animation?: AnimationType;
  delay?: number;
  isActive?: boolean;
}

const animations = {
  'fade-up': {
    hidden: { opacity: 0, y: 60 },
    visible: { opacity: 1, y: 0 },
  },
  'fade-left': {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0 },
  },
  'fade-right': {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.85 },
    visible: { opacity: 1, scale: 1 },
  },
  blur: {
    hidden: { opacity: 0, filter: 'blur(16px)' },
    visible: { opacity: 1, filter: 'blur(0px)' },
  },
  'split-reveal': {
    hidden: { opacity: 0, clipPath: 'inset(0 50% 0 50%)' },
    visible: { opacity: 1, clipPath: 'inset(0 0% 0 0%)' },
  },
  'stagger-words': {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  parallax: {
    hidden: { opacity: 0, y: 100, scale: 0.92 },
    visible: { opacity: 1, y: 0, scale: 1 },
  },
  'rotate-in': {
    hidden: { opacity: 0, rotateX: 35, y: 40 },
    visible: { opacity: 1, rotateX: 0, y: 0 },
  },
  elastic: {
    hidden: { opacity: 0, scale: 0.6 },
    visible: { opacity: 1, scale: 1 },
  },
};

export default function ScrollSection({
  children,
  className = '',
  animation = 'fade-up',
  delay = 0,
  isActive = false,
}: ScrollSectionProps) {
  const springConfig = animation === 'elastic'
    ? { type: 'spring' as const, stiffness: 110, damping: 14 }
    : { duration: 0.65, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay };

  return (
    <motion.div
      initial="hidden"
      animate={isActive ? 'visible' : 'hidden'}
      variants={animations[animation]}
      transition={springConfig}
      className={className}
      style={{ perspective: animation === 'rotate-in' ? 1000 : undefined }}
    >
      {children}
    </motion.div>
  );
}

// Floating ambient image — compositor-thread keyframe animation (WAAPI, no JS RAF)
interface FloatingImageProps {
  src: string;
  index?: number;
  className?: string;
  style?: React.CSSProperties;
  parallaxStrength?: number;
  rotateAmount?: number;
  imgClassName?: string;
  imgStyle?: React.CSSProperties;
}

// Each image gets a unique phase offset and duration so they drift independently
const floatProfiles = [
  { yDuration: 7.2, rDuration: 11.4, yPhase: 0,    rPhase: 0 },
  { yDuration: 9.1, rDuration: 13.7, yPhase: 0.4,  rPhase: 0.6 },
  { yDuration: 8.3, rDuration: 10.8, yPhase: 0.7,  rPhase: 0.2 },
  { yDuration: 10.6, rDuration: 15.2, yPhase: 0.2, rPhase: 0.8 },
  { yDuration: 6.9, rDuration: 12.1, yPhase: 0.9,  rPhase: 0.4 },
  { yDuration: 11.3, rDuration: 9.6, yPhase: 0.5,  rPhase: 0.1 },
];

export function FloatingImage({
  src,
  index = 0,
  className = '',
  style,
  parallaxStrength = 20,
  rotateAmount = 5,
  imgClassName = '',
  imgStyle,
}: FloatingImageProps) {
  const prefersReducedMotion = useReducedMotion();
  const profile = floatProfiles[index % floatProfiles.length];
  const yAmp = parallaxStrength;
  const rAmp = rotateAmount;

  if (prefersReducedMotion) {
    return (
      <div className={`absolute pointer-events-none ${className}`} style={style}>
        <img
          src={src}
          alt=""
          className={`w-full h-full object-cover rounded-sm shadow-2xl ${imgClassName}`}
          style={imgStyle}
        />
      </div>
    );
  }

  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      style={style}
      animate={{
        y: [0, -yAmp * 0.6, yAmp, yAmp * 0.3, -yAmp * 0.8, 0],
        rotate: [-rAmp * 0.4, rAmp, rAmp * 0.2, -rAmp * 0.8, -rAmp * 0.3, -rAmp * 0.4],
        scale: [1, 1.025, 0.985, 1.015, 0.995, 1],
      }}
      transition={{
        y: { duration: profile.yDuration, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror', delay: profile.yPhase * profile.yDuration },
        rotate: { duration: profile.rDuration, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror', delay: profile.rPhase * profile.rDuration },
        scale: { duration: (profile.yDuration + profile.rDuration) / 2, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' },
      }}
    >
      <img
        src={src}
        alt=""
        className={`w-full h-full object-cover rounded-sm shadow-2xl ${imgClassName}`}
        style={imgStyle}
      />
    </motion.div>
  );
}

// Per-section image — slides in when section is active, retreats when not
interface SectionImageProps {
  src: string;
  currentSection: number;
  targetSection: number;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'mid-left' | 'mid-right';
  size?: 'sm' | 'md' | 'lg';
  imageOpacity?: number;
  imgClassName?: string;
  imgStyle?: React.CSSProperties;
}

const sectionImagePositions = {
  'top-left':    { top: '8%',  left: '3%',  entryX: -50, entryY: -20 },
  'top-right':   { top: '8%',  right: '3%', entryX: 50,  entryY: -20 },
  'bottom-left': { bottom: '8%', left: '3%', entryX: -50, entryY: 20 },
  'bottom-right':{ bottom: '8%', right: '3%', entryX: 50, entryY: 20 },
  'mid-left':    { top: '30%', left: '2%',  entryX: -60, entryY: 0 },
  'mid-right':   { top: '30%', right: '2%', entryX: 60,  entryY: 0 },
};

const sectionImageSizes = {
  sm: 'w-20 md:w-24 lg:w-28 xl:w-36',
  md: 'w-24 md:w-32 lg:w-36 xl:w-52',
  lg: 'w-32 md:w-40 lg:w-44 xl:w-64',
};

// Ken-burns profiles vary by section index so each image has a distinct drift direction
const kenBurnsProfiles = [
  { scale: [1, 1.07], x: [0, -10], y: [0, -6], duration: 9 },
  { scale: [1, 1.05], x: [0, 8],   y: [0, -8], duration: 11 },
  { scale: [1, 1.08], x: [0, -6],  y: [0, 10], duration: 10 },
  { scale: [1, 1.06], x: [0, 10],  y: [0, 6],  duration: 8 },
  { scale: [1, 1.07], x: [0, -8],  y: [0, -10], duration: 12 },
  { scale: [1, 1.05], x: [0, 6],   y: [0, 8],  duration: 9 },
  { scale: [1, 1.09], x: [0, -10], y: [0, 4],  duration: 11 },
  { scale: [1, 1.06], x: [0, 8],   y: [0, -6], duration: 10 },
];

export function SectionImage({
  src,
  currentSection,
  targetSection,
  position = 'top-right',
  size = 'md',
  imageOpacity = 0.35,
  imgClassName = '',
  imgStyle,
}: SectionImageProps) {
  const isActive = currentSection === targetSection;
  const pos = sectionImagePositions[position];
  const entryRotate = pos.entryX > 0 ? 6 : -6;
  const kb = kenBurnsProfiles[targetSection % kenBurnsProfiles.length];

  return (
    <motion.div
      className={`absolute aspect-[3/4] pointer-events-none overflow-hidden rounded-sm shadow-2xl ${sectionImageSizes[size]}`}
      style={{ ...pos, zIndex: 1 }}
      initial={{ opacity: 0, x: pos.entryX, y: pos.entryY, scale: 0.88, rotate: entryRotate }}
      animate={{
        opacity: isActive ? imageOpacity : 0,
        x: isActive ? 0 : pos.entryX * 0.4,
        y: isActive ? 0 : pos.entryY * 0.4,
        scale: isActive ? 1 : 0.92,
        rotate: isActive ? 0 : entryRotate * 0.5,
      }}
      transition={{
        opacity: { duration: isActive ? 0.65 : 0.3, ease: 'easeOut' },
        x: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
        y: { duration: 0.85, ease: [0.22, 1, 0.36, 1] },
        scale: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
        rotate: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
      }}
    >
      <motion.div
        className="w-full h-full"
        animate={isActive
          ? { scale: kb.scale, x: kb.x, y: kb.y }
          : { scale: 1, x: 0, y: 0 }
        }
        transition={{ duration: kb.duration, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' }}
      >
        <img
          src={src}
          alt=""
          className={`w-full h-full object-cover ${imgClassName}`}
          style={imgStyle}
        />
      </motion.div>
    </motion.div>
  );
}

// CountUp — animates a number from 0 to end when isActive becomes true
interface CountUpProps {
  end: number;
  suffix?: string;
  duration?: number;
  isActive: boolean;
  className?: string;
}

export function CountUp({ end, suffix = '', duration = 1.4, isActive, className = '' }: CountUpProps) {
  const [count, setCount] = useState(0);
  const started = useRef(false);
  const rafRef = useRef(0);
  const wasActiveRef = useRef(false);

  useEffect(() => {
    // When leaving a slide, don't reset to 0 — it can flash during exit transitions.
    if (!isActive) {
      wasActiveRef.current = false;
      started.current = false;
      cancelAnimationFrame(rafRef.current);
      return;
    }

    // On re-enter, start from 0 again.
    if (!wasActiveRef.current) {
      setCount(0);
      started.current = false;
      wasActiveRef.current = true;
    }

    if (started.current) return;
    started.current = true;
    const startTime = performance.now();
    const tick = () => {
      const elapsed = performance.now() - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) rafRef.current = requestAnimationFrame(tick);
      else setCount(end);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isActive, end, duration]);

  return <span className={className}>{count}{suffix}</span>;
}

// Section slide container — depth-based cinematic transition
interface SlideSectionProps {
  children: ReactNode;
  index: number;
  currentSection: number;
  className?: string;
  darkBg?: boolean;
}

export function SlideSection({ children, index, currentSection, className = '', darkBg = false }: SlideSectionProps) {
  const isActive = currentSection === index;
  const isPast = currentSection > index;

  return (
    <motion.section
      data-dark={darkBg ? 'true' : undefined}
      className={`absolute inset-0 flex items-center justify-center ${className}`}
      initial={{ opacity: 0 }}
      animate={{
        opacity: isActive ? 1 : 0,
        scale: isActive ? 1 : isPast ? 0.93 : 1.02,
        y: isActive ? 0 : isPast ? -24 : 32,
      }}
      transition={{
        opacity: { duration: isActive ? 0.45 : 0.25, ease: 'easeOut' },
        scale: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
        y: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
      }}
      style={{ pointerEvents: isActive ? 'auto' : 'none', zIndex: isActive ? 2 : 1 }}
    >
      {children}
    </motion.section>
  );
}

// Progress indicator
interface ProgressIndicatorProps {
  currentSection: number;
  totalSections: number;
  sectionLabels?: string[];
  goToSection: (index: number) => void;
}

export function ProgressIndicator({ currentSection, totalSections, sectionLabels, goToSection }: ProgressIndicatorProps) {
  return (
    <div className="fixed right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2 md:gap-3">
      {Array.from({ length: totalSections }).map((_, index) => (
        <button
          key={index}
          onClick={() => goToSection(index)}
          className="group relative flex items-center justify-end p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/50 rounded cursor-pointer"
          aria-label={sectionLabels?.[index] || `Go to section ${index + 1}`}
        >
          <span className="absolute right-8 opacity-0 group-hover:opacity-100 transition-all duration-300 font-mono text-[11px] md:text-sm uppercase tracking-wider text-foreground whitespace-nowrap bg-background/80 px-3 py-1.5 rounded-md pointer-events-none transform translate-x-2 group-hover:translate-x-0">
            {sectionLabels?.[index] || `Section ${index + 1}`}
          </span>
          <motion.div
            className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${currentSection === index ? 'bg-foreground' : 'bg-foreground/20 hover:bg-foreground/50'}`}
            animate={{ scale: currentSection === index ? 1.4 : 1 }}
            transition={{ duration: 0.3 }}
          />
        </button>
      ))}
    </div>
  );
}

// Section counter — fixed bottom-left position indicator
interface SectionCounterProps {
  currentSection: number;
  totalSections: number;
  darkSections?: number[];
}

export function SectionCounter({ currentSection, totalSections, darkSections = [] }: SectionCounterProps) {
  const isDark = darkSections.includes(currentSection);
  const current = String(currentSection + 1).padStart(2, '0');
  const total = String(totalSections).padStart(2, '0');

  return (
    <div
      className="fixed bottom-8 left-6 md:left-8 z-40 select-none"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="flex items-baseline gap-1.5 font-mono text-[10px] uppercase tracking-widest">
        <AnimatePresence mode="wait">
          <motion.span
            key={currentSection}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={isDark ? '' : 'text-foreground/40'}
            style={isDark ? { color: 'oklch(95% 0.003 260 / 0.45)' } : undefined}
          >
            {current}
          </motion.span>
        </AnimatePresence>
        <span
          className={isDark ? '' : 'text-foreground/20'}
          style={isDark ? { color: 'oklch(95% 0.003 260 / 0.25)' } : undefined}
          aria-hidden="true"
        >
          / {total}
        </span>
      </div>
    </div>
  );
}

// Scroll hint
export function ScrollHint({ visible }: { visible: boolean }) {
  return (
    <motion.div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40">
        Scroll or use arrow keys
      </span>
      <motion.div
        className="w-5 h-8 border border-foreground/30 rounded-full flex justify-center pt-1.5"
        animate={{ y: [0, 5, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <motion.div
          className="w-1 h-1.5 bg-foreground/50 rounded-full"
          animate={{ y: [0, 8, 0], opacity: [1, 0, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </motion.div>
    </motion.div>
  );
}
