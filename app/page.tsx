'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import IntroSlideshow from '@/components/IntroSlideshow';
import ScrollSection, {
  useSlideScroll,
  SlideSection,
  FloatingImage,
  SectionImage,
  CountUp,
  ProgressIndicator,
  ScrollHint,
  SectionCounter,
} from '@/components/ScrollSection';

const sampleImages = [
  '/1.webp',
  '/2.webp',
  '/3.webp',
  '/4.webp',
];

const sectionLabels = [
  'Title',
  'Topic',
  'Problem Statement',
  'Current Research – "GAP"',
  'Proposed Methodology',
  'Research Question',
  'Focused topic',
  'Purpose',
  'Context',
  'Scope',
  'Scale',
  'Value',
  'Feasibility',
  'Next Steps',
  'References (APA Citation)',
];

export default function Home() {
  const [showIntro, setShowIntro] = useState(true);
  const [mounted, setMounted] = useState(false);
  const totalSections = 15;
  const { currentSection, goToSection } = useSlideScroll(showIntro ? 0 : totalSections);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <AnimatePresence>
        {showIntro && (
          <IntroSlideshow 
            onComplete={() => setShowIntro(false)} 
            images={sampleImages}
          />
        )}
      </AnimatePresence>

      <main 
        className="fixed inset-0 bg-background overflow-hidden"
        style={{
          opacity: showIntro ? 0 : 1,
          transition: 'opacity 0.3s ease-out',
          pointerEvents: showIntro ? 'none' : 'auto'
        }}
      >
        {/* Floating background gallery (collage) */}
        <div 
          className="hidden md:block fixed inset-0 pointer-events-none" 
          style={{ zIndex: 0, opacity: currentSection === 0 ? 0.3 : 0.8, transition: 'opacity 0.5s' }}
        >
          {/* Top Left */}
          <FloatingImage
            index={0}
            src={sampleImages[0]}
            className="w-20 md:w-32 aspect-[3/4] opacity-20"
            style={{ top: '8%', left: '10%' }}
            parallaxStrength={15}
            rotateAmount={-2}
            imgStyle={{ filter: 'grayscale(0.2) contrast(1.08)' }}
          />
          
          {/* Middle Right */}
          <FloatingImage
            index={1}
            src={sampleImages[3]}
            className="w-24 md:w-40 aspect-[3/4] opacity-15"
            style={{ top: '45%', right: '6%' }}
            parallaxStrength={25}
            rotateAmount={4}
            imgStyle={{ filter: 'saturate(0.9) brightness(1.05)' }}
          />
          
          {/* Bottom Middle */}
          <FloatingImage
            index={2}
            src={sampleImages[1]}
            className="w-28 md:w-36 aspect-[3/4] opacity-20"
            style={{ bottom: '10%', right: '35%' }}
            parallaxStrength={20}
            rotateAmount={-3}
            imgStyle={{ filter: 'sepia(0.12) contrast(1.05)' }}
          />
        </div>

        {/* Per-section image reveals — hidden on mobile to avoid content overlap */}
        <div className="hidden md:block fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
          <SectionImage
            src={sampleImages[0]}
            currentSection={currentSection}
            targetSection={2}
            position="bottom-left"
            size="md"
            imageOpacity={0.3}
            imgStyle={{ filter: 'contrast(1.08) brightness(1.02)' }}
          />
          <SectionImage
            src={sampleImages[1]}
            currentSection={currentSection}
            targetSection={4}
            position="top-right"
            size="sm"
            imageOpacity={0.28}
            imgStyle={{ transform: 'scaleX(-1)', filter: 'saturate(0.9) contrast(1.05)' }}
          />
          <SectionImage
            src={sampleImages[2]}
            currentSection={currentSection}
            targetSection={6}
            position="mid-left"
            size="md"
            imageOpacity={0.25}
            imgStyle={{ filter: 'grayscale(0.15) contrast(1.06)' }}
          />
          <SectionImage
            src={sampleImages[3]}
            currentSection={currentSection}
            targetSection={9}
            position="top-left"
            size="md"
            imageOpacity={0.28}
            imgStyle={{ transform: 'scaleX(-1)', filter: 'sepia(0.12) brightness(1.03)' }}
          />
          <SectionImage
            src={sampleImages[1]}
            currentSection={currentSection}
            targetSection={11}
            position="mid-right"
            size="sm"
            imageOpacity={0.25}
            imgStyle={{ filter: 'contrast(1.1) saturate(0.85)' }}
          />
          <SectionImage
            src={sampleImages[3]}
            currentSection={currentSection}
            targetSection={13}
            position="bottom-left"
            size="md"
            imageOpacity={0.3}
            imgStyle={{ transform: 'scaleX(-1)', filter: 'brightness(1.05) contrast(1.05)' }}
          />
        </div>

          {/* Progress indicator */}
          <ProgressIndicator
            currentSection={currentSection} 
            totalSections={totalSections}
            sectionLabels={sectionLabels}
            goToSection={goToSection}
          />

          {/* Section counter */}
          <SectionCounter
            currentSection={currentSection}
            totalSections={totalSections}
            darkSections={[5, 14]}
          />

          {/* Scroll hint */}
          <ScrollHint visible={currentSection === 0} />

          {/* Section 0: Title — Monologue */}
          <SlideSection index={0} currentSection={currentSection}>
            <div className="absolute inset-0 flex flex-col justify-end px-6 md:px-16 pb-[12vh] z-10">
              <div className="overflow-hidden mb-2">
                <motion.span
                  className="font-serif text-[clamp(2.1rem,8vw,6rem)] italic leading-[0.88] tracking-tight text-accent block"
                  initial={{ y: '110%' }}
                  animate={{ y: currentSection === 0 && !showIntro ? '0%' : '110%' }}
                  transition={{ duration: 1.0, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
                >
                  Short-Form
                </motion.span>
              </div>
              <div className="overflow-hidden mb-2">
                <motion.span
                  className="font-serif text-[clamp(2.4rem,10vw,8rem)] leading-[0.88] tracking-tight text-foreground/35 block"
                  initial={{ y: '110%' }}
                  animate={{ y: currentSection === 0 && !showIntro ? '0%' : '110%' }}
                  transition={{ duration: 1.0, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
                >
                  Political Media
                </motion.span>
              </div>
              <div className="overflow-hidden mb-10">
                <motion.span
                  className="font-serif text-[clamp(2.1rem,8vw,6rem)] leading-[0.88] tracking-tight block"
                  initial={{ y: '110%' }}
                  animate={{ y: currentSection === 0 && !showIntro ? '0%' : '110%' }}
                  transition={{ duration: 1.0, delay: 0.31, ease: [0.22, 1, 0.36, 1] }}
                >
                  & Civic Confidence
                </motion.span>
              </div>
              <motion.p
                className="font-mono text-[10px] uppercase tracking-[0.35em] text-foreground/35 max-w-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: currentSection === 0 && !showIntro ? 1 : 0 }}
                transition={{ duration: 0.8, delay: 0.75 }}
              >
                Academic Research Proposal: High school students' understanding of political issues
              </motion.p>
              <motion.p
                className="font-serif italic text-base md:text-lg text-foreground/70 mt-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: currentSection === 0 && !showIntro ? 1 : 0, y: currentSection === 0 && !showIntro ? 0 : 10 }}
                transition={{ duration: 0.8, delay: 0.9 }}
              >
                By Ethan Li Ngan Sun
              </motion.p>
            </div>
          </SlideSection>

          {/* Section 1: Topic */}
          <SlideSection index={1} currentSection={currentSection}>
            <div className="max-w-4xl mx-auto px-6">
              <div className="grid md:grid-cols-[1fr_2fr] gap-12 items-start">
                <ScrollSection animation="fade-left" isActive={currentSection === 1}>
                  <div>
                    <h2 className="font-serif text-4xl md:text-6xl tracking-tight">Topic</h2>
                  </div>
                </ScrollSection>
                <ScrollSection animation="fade-right" isActive={currentSection === 1} delay={0.2}>
                  <div className="space-y-6">
                    <p className="text-xl md:text-3xl leading-relaxed text-foreground/90 font-light">
                      The Effect of Short-Form Political Media on High School Students’ Political Understanding and Civic Confidence
                    </p>
                    <div className="flex gap-4 flex-wrap">
                      {['Media Literacy', 'Civic Confidence', 'Adolescence'].map((tag, i) => (
                        <motion.span
                          key={tag}
                          className="px-4 py-2 border border-foreground/10 rounded-full font-mono text-xs uppercase tracking-wider"
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: currentSection === 1 ? 1 : 0, scale: currentSection === 1 ? 1 : 0.85 }}
                          transition={{ duration: 0.5, delay: currentSection === 1 ? 0.5 + i * 0.1 : 0, ease: [0.22, 1, 0.36, 1] }}
                        >
                          {tag}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </ScrollSection>
              </div>
            </div>
          </SlideSection>

          {/* Section 2: Problem Statement — Evidence (numbered statements) */}
          <SlideSection index={2} currentSection={currentSection}>
            <div className="max-w-4xl w-full mx-auto px-6 md:px-10">
              <ScrollSection animation="fade-up" isActive={currentSection === 2}>
                <h2 className="font-serif text-3xl md:text-5xl tracking-tight mb-12">Problem Statement</h2>
              </ScrollSection>
              {[
                { n: '01', title: 'Emotional Algorithms', body: 'Young people rapidly encounter political information that is simplified or driven by emotion, rewarded for algorithmic engagement rather than accuracy.' },
                { n: '02', title: 'Illusion of Knowledge', body: 'Presented through viral soundbites, high schoolers may feel informed without grasping the issue’s complexity, creating overconfidence or sudden political distrust.' },
                { n: '03', title: 'Civic Impact', body: 'This contributes to a society where political confidence and distrust are based heavily on emotional reactions rather than factual evidence or careful evaluation.' },
              ].map((item, i) => (
                <ScrollSection key={item.n} animation="fade-left" isActive={currentSection === 2} delay={0.15 + i * 0.13}>
                  <div className="flex items-start gap-6 md:gap-10 py-8 border-b border-foreground/8 last:border-0">
                    <span className="font-serif text-5xl md:text-7xl text-accent/30 leading-none tabular-nums shrink-0 w-20 md:w-28 pt-1">
                      {item.n}
                    </span>
                    <div>
                      <h3 className="font-serif text-2xl md:text-3xl mb-3">{item.title}</h3>
                      <p className="text-foreground/70 text-lg md:text-xl leading-relaxed">{item.body}</p>
                    </div>
                  </div>
                </ScrollSection>
              ))}
            </div>
          </SlideSection>

          {/* Section 3: Current Research - GAP */}
          <SlideSection index={3} currentSection={currentSection}>
            <div className="max-w-4xl mx-auto px-6">
              <ScrollSection animation="rotate-in" isActive={currentSection === 3}>
                <h2 className="font-serif text-3xl md:text-5xl tracking-tight mb-10">
                  Current Research - <span className="italic">&quot;GAP&quot;</span>
                </h2>
              </ScrollSection>
              <div className="space-y-4">
                {[
                  'Current research shows social media use is high amongst teens and efficacy matters for democratic participation.',
                  'Much research focuses broadly on teen social media use and youth political engagement rather than specific content types.',
                  'Studies on TikTok misinformation do not fully evaluate high school students’ perceived understanding of the issues.',
                  'A major gap remains in measuring immediate post-exposure changes to students’ political efficacy based on specific media styles.',
                ].map((gap, i) => (
                  <ScrollSection key={i} animation="fade-left" isActive={currentSection === 3} delay={0.2 + i * 0.1}>
                    <div className="flex items-start gap-6 p-4 rounded-lg hover:bg-foreground/[0.02] transition-colors">
                      <span className="font-mono text-2xl md:text-3xl text-foreground/20">{String(i + 1).padStart(2, '0')}</span>
                      <p className="text-xl md:text-2xl text-foreground/80 leading-relaxed font-light">{gap}</p>
                    </div>
                  </ScrollSection>
                ))}
              </div>
            </div>
          </SlideSection>

          {/* Section 4: Proposed Methodology */}
          <SlideSection index={4} currentSection={currentSection}>
            <div className="max-w-5xl mx-auto px-6">
              <ScrollSection animation="elastic" isActive={currentSection === 4}>
                <h2 className="font-serif text-3xl md:text-5xl tracking-tight mb-10">Proposed Methodology</h2>
              </ScrollSection>
              <div className="grid md:grid-cols-2 gap-16">
                <ScrollSection animation="fade-left" isActive={currentSection === 4} delay={0.2}>
                  <div>
                    <h3 className="font-serif text-2xl italic mb-2">Quantitative</h3>
                    <div className="w-8 h-px bg-foreground/20 mb-8" />
                    <ul className="space-y-5">
                      {[
                        'Pretest-posttest format to measure baseline vs post-exposure variables',
                        'Collect data on perceived understanding levels',
                        'Measure changes in civic confidence and political efficacy',
                      ].map((item, j) => (
                        <li key={j} className="flex gap-4 text-foreground/80 text-base md:text-lg leading-relaxed font-light">
                          <span className="font-mono text-[10px] text-foreground/30 pt-1.5 tabular-nums shrink-0">{String(j + 1).padStart(2, '0')}</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollSection>
                <ScrollSection animation="fade-right" isActive={currentSection === 4} delay={0.3}>
                  <div>
                    <h3 className="font-serif text-2xl italic mb-2 text-foreground/60">Qualitative</h3>
                    <div className="w-8 h-px bg-foreground/15 mb-8" />
                    <ul className="space-y-5">
                      {[
                        'Written reflections on content trust and emotional response',
                        'Student explanations of persuasive techniques identified',
                        'Analyze interpretations based on 3 distinct media styles viewed',
                      ].map((item, j) => (
                        <li key={j} className="flex gap-4 text-foreground/80 text-base md:text-lg leading-relaxed font-light">
                          <span className="font-mono text-[10px] text-foreground/30 pt-1.5 tabular-nums shrink-0">{String(j + 1).padStart(2, '0')}</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollSection>
              </div>
            </div>
          </SlideSection>

          {/* Section 5: Research Question — Dark Monologue */}
          <SlideSection index={5} currentSection={currentSection} darkBg>
            <div className="w-full px-10 md:px-16 max-w-5xl mx-auto relative">
              {/* Decorative large question mark */}
              <motion.span
                className="absolute right-8 top-1/2 -translate-y-1/2 font-serif text-[20vw] text-foreground/5 leading-none pointer-events-none select-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: currentSection === 5 ? 1 : 0 }}
                transition={{ duration: 1.2, delay: 0.6 }}
              >
                ?
              </motion.span>
              <motion.span
                className="font-mono text-[10px] uppercase tracking-[0.35em] text-accent/70 block mb-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: currentSection === 5 ? 1 : 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                05 · Research Question
              </motion.span>
              {[
                'How does exposure',
                'to different styles of',
                'short-form political media',
                'influence high school students’',
                'perceived understanding of political issues',
                'and sense of political efficacy?',
              ].map((line, i) => (
                <div key={i} className="overflow-hidden">
                  <motion.p
                    className={`font-serif text-[clamp(1.6rem,4vw,3.6rem)] italic leading-[1.12] tracking-tight ${i === 5 ? 'text-accent' : 'text-foreground/90'}`}
                    initial={{ y: '110%' }}
                    animate={{ y: currentSection === 5 ? '0%' : '110%' }}
                    transition={{ duration: 0.85, delay: 0.2 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                  >
                    {line}
                  </motion.p>
                </div>
              ))}
            </div>
          </SlideSection>

          {/* Section 6: Focused Topic */}
          <SlideSection index={6} currentSection={currentSection}>
            <div className="max-w-5xl mx-auto px-6">
              <ScrollSection animation="fade-up" isActive={currentSection === 6}>
                <h2 className="font-serif text-3xl md:text-5xl tracking-tight mb-12">Focused Variables</h2>
              </ScrollSection>
              <div className="grid md:grid-cols-3 gap-8">
                <ScrollSection animation="fade-right" isActive={currentSection === 6} delay={0.2}>
                  <div className="p-6 border border-foreground/10 rounded-xl bg-foreground/[0.02]">
                    <h3 className="font-serif text-2xl md:text-3xl mb-4 text-accent/80">Independent Variable</h3>
                    <p className="text-foreground/80 text-lg md:text-xl mb-4 font-light">Type of short-form political media viewed:</p>
                    <ul className="space-y-3 font-light text-foreground/60 text-base md:text-lg">
                      <li>• Issue-based INFO content</li>
                      <li>• Emotional CONFLICT content</li>
                      <li>• Influencer COMMENTARY</li>
                    </ul>
                  </div>
                </ScrollSection>
                <ScrollSection animation="fade-up" isActive={currentSection === 6} delay={0.3}>
                  <div className="p-6 border border-foreground/10 rounded-xl bg-foreground/[0.02]">
                    <h3 className="font-serif text-2xl md:text-3xl mb-4 text-foreground/80">Dependent Variables</h3>
                    <ul className="space-y-4 font-light text-foreground/70 text-lg md:text-xl">
                      <li>• Perceived issue understanding</li>
                      <li>• Civic confidence / efficacy</li>
                      <li>• Trust / skepticism level</li>
                      <li>• Emotional response</li>
                    </ul>
                  </div>
                </ScrollSection>
                <ScrollSection animation="fade-left" isActive={currentSection === 6} delay={0.4}>
                  <div className="p-6 border border-foreground/10 rounded-xl bg-foreground/[0.02]">
                    <h3 className="font-serif text-2xl md:text-3xl mb-4 text-foreground/50">Control Variables</h3>
                    <ul className="space-y-3 font-light text-foreground/60 text-base md:text-lg">
                      <li>• Previous online exposure</li>
                      <li>• Prior political interest</li>
                      <li>• Familiarity with issue</li>
                      <li>• Platform format & length</li>
                    </ul>
                  </div>
                </ScrollSection>
              </div>
            </div>
          </SlideSection>

          {/* Section 7: Purpose */}
          <SlideSection index={7} currentSection={currentSection}>
            <div className="max-w-4xl mx-auto px-6">
              <ScrollSection animation="fade-up" isActive={currentSection === 7}>
                <h2 className="font-serif text-3xl md:text-5xl tracking-tight mb-12">Purpose</h2>
              </ScrollSection>
              <div className="space-y-8">
                {[
                  { num: '01', text: 'To clearly understand whether short-form political media helps students feel more informed or creates a surface-level illusion.' },
                  { num: '02', text: 'To explain how different messaging styles shape early voter trust, engagement confidence, and evidence interpretation.' },
                  { num: '03', text: 'To help educators teach young, digital-first demographics how to recognize persuasive techniques and question incomplete claims.' },
                ].map((item, i) => (
                  <ScrollSection key={item.num} animation="fade-right" isActive={currentSection === 7} delay={0.2 + i * 0.15}>
                    <motion.div 
                      className="flex items-start gap-8 group"
                      whileHover={{ x: 10 }}
                    >
                      <span className="font-mono text-5xl md:text-7xl text-foreground/10 group-hover:text-foreground/20 transition-colors">{item.num}</span>
                      <p className="text-xl md:text-3xl text-foreground/80 leading-relaxed pt-3 font-light">{item.text}</p>
                    </motion.div>
                  </ScrollSection>
                ))}
              </div>
            </div>
          </SlideSection>

          {/* Section 8: Context */}
          <SlideSection index={8} currentSection={currentSection}>
            <div className="max-w-4xl mx-auto px-6">
              <ScrollSection animation="rotate-in" isActive={currentSection === 8}>
                <h2 className="font-serif text-3xl md:text-5xl tracking-tight mb-10">Context</h2>
              </ScrollSection>
              <ScrollSection animation="blur" isActive={currentSection === 8} delay={0.2}>
                <div className="relative max-w-prose">
                  <motion.div
                    className="absolute -left-4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-foreground/20 to-transparent"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: currentSection === 8 ? 1 : 0 }}
                    transition={{ duration: 1 }}
                  />
                  <p className="text-xl md:text-2xl leading-relaxed text-foreground/80 pl-8 font-light">
                    High school students get almost all their news and political insight through social media algorithms focused on high-engagement, short-form content. With this demographic nearing voting age, they face a complex media environment demanding careful navigation.
                  </p>
                  <p className="text-xl md:text-2xl leading-relaxed text-foreground/60 pl-8 mt-6 font-light">
                    Previous studies have analyzed the algorithm's role in echo chambers, but there is limited data on how specific video formats—Informational, Emotional, and Commentary—differentially impact Gen-Z's internal confidence in their civic knowledge.
                  </p>
                </div>
              </ScrollSection>
            </div>
          </SlideSection>

          {/* Section 9: Scope */}
          <SlideSection index={9} currentSection={currentSection}>
            <div className="max-w-5xl mx-auto px-6">
              <ScrollSection animation="scale" isActive={currentSection === 9}>
                <h2 className="font-serif text-3xl md:text-5xl tracking-tight mb-12">Scope</h2>
              </ScrollSection>
              <div className="grid md:grid-cols-2 gap-12">
                <ScrollSection animation="fade-left" isActive={currentSection === 9} delay={0.2}>
                  <div>
                    <h3 className="font-mono text-sm uppercase tracking-wider mb-6 text-foreground/50 flex items-center gap-3">
                      <span className="w-8 h-px bg-foreground/20" />
                      Included
                    </h3>
                    <ul className="space-y-4">
                      {['High school demographics (approx. ages 14-18)', 'TikTok/Reels/Shorts formatted media', 'Perceived understanding and efficacy metrics', 'Short-term media exposure effects'].map((item) => (
                        <li key={item} className="text-foreground/80 text-lg md:text-xl font-light flex items-center gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-foreground/40 shrink-0" />
                          <span className="leading-snug">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollSection>
                <ScrollSection animation="fade-right" isActive={currentSection === 9} delay={0.3}>
                  <div>
                    <h3 className="font-mono text-sm uppercase tracking-wider mb-6 text-foreground/40 flex items-center gap-3">
                      <span className="w-8 h-px bg-foreground/10" />
                      Excluded
                    </h3>
                    <ul className="space-y-4">
                      {['Long-term behavioral changes (e.g., actual voting rates)', 'Traditional news mediums (TV, articles)', 'College-level or adult demographics', 'In-depth algorithm reverse engineering'].map((item) => (
                        <li key={item} className="text-foreground/50 text-lg md:text-xl font-light flex items-center gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-foreground/20 shrink-0" />
                          <span className="leading-snug">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </ScrollSection>
              </div>
            </div>
          </SlideSection>

          {/* Section 10: Scale — Data with counting numbers */}
          <SlideSection index={10} currentSection={currentSection}>
            <div className="max-w-5xl w-full mx-auto px-10 md:px-16">
              <ScrollSection animation="fade-up" isActive={currentSection === 10}>
                <h2 className="font-serif text-3xl md:text-5xl tracking-tight mb-14">Scale</h2>
              </ScrollSection>
              {/* Hero stat — largest and most impactful */}
              <ScrollSection animation="blur" isActive={currentSection === 10} delay={0.1}>
                <div className="mb-10 pb-8 border-b border-foreground/8">
                  <div className="flex flex-col md:flex-row md:items-baseline gap-3 md:gap-4">
                    <span className="font-serif text-[clamp(4rem,14vw,11rem)] leading-none tracking-tight text-accent">
                      <CountUp end={60} suffix="" isActive={currentSection === 10} duration={1.6} />
                    </span>
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.3em] text-foreground/45 mb-1">Student Participants</p>
                      <p className="text-foreground/60 text-base max-w-sm">Manageable sample of high schoolers (Grades 9-12) for baseline vs. post-exposure collection</p>
                    </div>
                  </div>
                </div>
              </ScrollSection>
              {/* Supporting stats */}
              <div className="grid grid-cols-3 gap-4 md:gap-8">
                {[
                  { end: 3, suffix: '', label: 'Media Styles', delay: 0.3 },
                  { end: 25, suffix: ' Min', label: 'Session Length', delay: 0.4 },
                  { end: 5, suffix: ' Mos', label: 'Study Duration', delay: 0.5 },
                ].map((item) => (
                  <ScrollSection key={item.label} animation="fade-up" isActive={currentSection === 10} delay={item.delay}>
                    <div>
                      <span className="font-serif text-3xl md:text-6xl leading-none block mb-2">
                        <CountUp end={item.end} suffix={item.suffix} isActive={currentSection === 10} duration={1.2} />
                      </span>
                      <span className="font-mono text-[10px] md:text-xs uppercase tracking-wider text-foreground/45">{item.label}</span>
                    </div>
                  </ScrollSection>
                ))}
              </div>
            </div>
          </SlideSection>

          {/* Section 11: Value */}
          <SlideSection index={11} currentSection={currentSection}>
            <div className="max-w-4xl mx-auto px-6">
              <ScrollSection animation="fade-up" isActive={currentSection === 11}>
                <h2 className="font-serif text-3xl md:text-5xl tracking-tight mb-12">Value</h2>
              </ScrollSection>
              <div>
                {[
                  { letter: 'A', title: 'Academic Value', desc: 'Fills a gap in quantitative data regarding how specific short-form media formats manipulate Gen-Z political confidence' },
                  { letter: 'P', title: 'Practical Value', desc: 'Provides educators and parents actionable frameworks for medial literacy interventions tailored to algorithm realities' },
                  { letter: 'S', title: 'Social Value', desc: 'Mitigates the chilling effect of algorithmically-driven political anxiety on youth democratic participation' },
                ].map((item, i) => (
                  <ScrollSection key={item.letter} animation="parallax" isActive={currentSection === 11} delay={0.15 + i * 0.15}>
                    <motion.div
                      className="flex items-start gap-8 py-8 border-b border-foreground/8 last:border-0"
                      whileHover={{ x: 8 }}
                    >
                      <span className="font-serif text-[5rem] leading-none text-foreground/[0.1] shrink-0 w-20 select-none">{item.letter}</span>
                      <div className="pt-2">
                        <h3 className="font-serif text-2xl md:text-3xl mb-3">{item.title}</h3>
                        <p className="text-foreground/70 text-lg md:text-xl leading-relaxed font-light">{item.desc}</p>
                      </div>
                    </motion.div>
                  </ScrollSection>
                ))}
              </div>
            </div>
          </SlideSection>

          {/* Section 12: Ethics & Limitations */}
          <SlideSection index={12} currentSection={currentSection}>
            <div className="max-w-4xl mx-auto px-6">
              <ScrollSection animation="rotate-in" isActive={currentSection === 12}>
                <h2 className="font-serif text-3xl md:text-5xl tracking-tight mb-12">Ethics & Limitations</h2>
              </ScrollSection>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { title: 'Content Safety', desc: 'Content will be fictional, neutral, or non-partisan to minimize risk, avoiding actual extremist propaganda.' },
                  { title: 'Voluntary & Anonymous', desc: 'Students are not asked to reveal their true political beliefs, just how they interpret formatting styles.' },
                  { title: 'Time Constraint', desc: 'Confined to a 5-month timeline, the study measures immediate short-term exposure, not lasting behavioral shifts.' },
                  { title: 'Scale Limit', desc: 'Restricted to ~30-60 high schoolers across single localized settings, meaning broader generalization will require further study.' },
                ].map((item, i) => (
                  <ScrollSection key={item.title} animation="fade-up" isActive={currentSection === 12} delay={0.1 + i * 0.1}>
                    <motion.div 
                      className="p-8 rounded-xl border border-foreground/10 hover:border-foreground/20 transition-colors bg-foreground/[0.01]"
                      whileHover={{ x: 5 }}
                    >
                      <h3 className="font-serif text-xl md:text-2xl mb-3 text-foreground/80">{item.title}</h3>
                      <p className="text-foreground/60 text-lg leading-relaxed font-light">{item.desc}</p>
                    </motion.div>
                  </ScrollSection>
                ))}
              </div>
            </div>
          </SlideSection>

          {/* Section 13: Timeline */}
          <SlideSection index={13} currentSection={currentSection}>
            <div className="max-w-4xl mx-auto px-6">
              <ScrollSection animation="scale" isActive={currentSection === 13}>
                <h2 className="font-serif text-3xl md:text-4xl tracking-tight mb-6 md:mb-8">Timeline</h2>
              </ScrollSection>
              <div className="space-y-4 md:space-y-5">
                {[
                  { num: 1, title: 'Finalize Design & Submissions', desc: 'Secure research question, content samples, consent process, measurable tools and complete UofT ethics board approval.', time: 'Month 1' },
                  { num: 2, title: 'Launch Execution', desc: 'Launch survey and reflection prompts with high school student participation groups.', time: 'Month 2' },
                  { num: 3, title: 'Data Processing', desc: 'Collect, parse, and appropriately sort through the student survey and reflection data.', time: 'Month 3' },
                  { num: 4, title: 'Data Analysis', desc: 'Analyze the quantitative pretest-posttest responses alongside their written qualitative reflections.', time: 'Month 4' },
                  { num: 5, title: 'Write Final Report', desc: 'Write complete findings, outline limitations, discuss implications, and plan next steps.', time: 'Month 5' },
                ].map((item, i) => (
                  <ScrollSection key={item.num} animation="fade-left" isActive={currentSection === 13} delay={0.1 + i * 0.12}>
                    <motion.div
                      className="flex items-start gap-4 md:gap-5"
                      whileHover={{ x: 10 }}
                    >
                      <motion.div
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-foreground/20 hover:border-foreground/40 flex items-center justify-center shrink-0 mt-0.5"
                        whileHover={{ scale: 1.1 }}
                      >
                        <span className="font-serif text-lg md:text-xl text-foreground/60">{item.num}</span>
                      </motion.div>
                      <div>
                        <h3 className="font-serif text-lg md:text-2xl mb-0.5">{item.title}</h3>
                        <p className="text-foreground/70 text-sm md:text-base leading-snug mb-1 font-light">{item.desc}</p>
                        <span className="font-mono text-xs uppercase tracking-wider text-foreground/40">{item.time}</span>
                      </div>
                    </motion.div>
                  </ScrollSection>
                ))}
              </div>
            </div>
          </SlideSection>

          {/* Section 14: References — Dark closing */}
          <SlideSection index={14} currentSection={currentSection} darkBg>
            <div className="max-w-3xl w-full mx-auto px-10 md:px-16">
              <motion.span
                className="font-mono text-[10px] uppercase tracking-[0.35em] text-accent/70 block mb-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: currentSection === 14 ? 1 : 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                14 · References
              </motion.span>
              <div className="space-y-5">
                <div>
                  <h3 className="font-mono text-xs md:text-sm uppercase tracking-[0.3em] text-foreground/60 mb-3">
                    Image citations
                  </h3>
                  <div className="space-y-2.5">
                    {[
                      <>Foreman, T. (2024, October 28). <i className="italic">American battleground: How a night of fighting words upended the election</i>. CNN. https://www.cnn.com/2024/10/28/politics/american-battleground-biden-trump-debate/index.html</>,
                      <>Northup, K. (2025, February 7). <i className="italic">The state of TikTok in the United States</i>. RDW Group. https://rdwgroup.com/blog/2025/02/07/the-state-of-tiktok-in-the-united-states/</>,
                      <>BBC News. (2020, October 23). <i className="italic">Presidential debate: Second Trump v Biden debate in pictures</i>. https://www.bbc.com/news/in-pictures-54654486</>,
                      <>Krulder, J. (2018, May 1). <i className="italic">Bringing All Students Into Discussions</i>. Edutopia. https://www.edutopia.org/article/bringing-all-students-discussions/</>,
                    ].map((ref, i) => (
                      <div key={i} className="overflow-hidden">
                        <motion.p
                          className="font-mono text-[10px] md:text-xs text-foreground/55 leading-snug break-words"
                          initial={{ y: '110%' }}
                          animate={{ y: currentSection === 14 ? '0%' : '110%' }}
                          transition={{ duration: 0.75, delay: 0.15 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                        >
                          {ref}
                        </motion.p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-mono text-xs md:text-sm uppercase tracking-[0.3em] text-foreground/60 mb-3">
                    References
                  </h3>
                  <div className="space-y-2.5">
                    {[
                      <>Bhargava, P., MacDonald, K., Newton, C., Lin, H., &amp; Pennycook, G. (2023). How effective are TikTok misinformation debunking videos? <i className="italic">Harvard Kennedy School Misinformation Review</i>.</>,
                      <>Oden, A., &amp; Porter, L. (2023). The Kids Are Online: Teen Social Media Use, Civic Engagement, and Affective Polarization. <i className="italic">Social Media + Society, 9</i>(3).</>,
                      <>Organisation for Economic Co-operation and Development. (2021). <i className="italic">Political efficacy and participation: An empirical analysis in European countries</i>.</>,
                      <>Siegel-Stechler, K., Hilton, K., &amp; Medina, A. (2025, May 12). Youth Rely on Digital Platforms, Need Media Literacy to Access Political Information. <i className="italic">CIRCLE</i>.</>,
                    ].map((ref, i) => (
                      <div key={i} className="overflow-hidden">
                        <motion.p
                          className="font-mono text-[10px] md:text-xs text-foreground/55 leading-snug break-words"
                          initial={{ y: '110%' }}
                          animate={{ y: currentSection === 14 ? '0%' : '110%' }}
                          transition={{ duration: 0.75, delay: 0.45 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                        >
                          {ref}
                        </motion.p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <motion.div
                className="mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: currentSection === 14 ? 1 : 0 }}
                transition={{ duration: 1.0, delay: 0.8 }}
              >
                <span className="font-serif text-[clamp(2rem,5vw,3.5rem)] italic text-accent/60 leading-none">Fin.</span>
              </motion.div>

              <motion.div
                className="mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: currentSection === 14 ? 1 : 0 }}
                transition={{ duration: 1.0, delay: 1.2 }}
              >
                <a 
                  href="https://v0.app/templates/3d-gallery-photography-template-JUFK37Esjlj" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-mono text-[10px] uppercase tracking-wider text-foreground/30 hover:text-foreground/60 transition-colors"
                >
                  Design Template by v0
                </a>
              </motion.div>
            </div>
          </SlideSection>
        </main>
    </>
  );
}
