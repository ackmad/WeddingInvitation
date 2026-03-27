"use client";

import { useEffect, useRef } from "react";
import styles from "./SplashSection.module.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  guestName: string;
  onOpen: () => void;
  brideName: string;
  groomName: string;
}

export default function SplashSection({ guestName, onOpen, brideName, groomName }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  // Layer Refs
  const archwayRef = useRef<HTMLDivElement>(null);
  const treeGreenLRef = useRef<HTMLImageElement>(null);
  const treeGreenRRef = useRef<HTMLImageElement>(null);
  const treePinkLRef = useRef<HTMLImageElement>(null);
  const treePinkRRef = useRef<HTMLImageElement>(null);
  const fogRef = useRef<HTMLDivElement>(null);
  const manorRef = useRef<HTMLDivElement>(null);
  const castleRef = useRef<HTMLImageElement>(null);
  const flowerLRef = useRef<HTMLImageElement>(null);
  const flowerRRef = useRef<HTMLImageElement>(null);
  const towerLRef = useRef<HTMLImageElement>(null);
  const towerRRef = useRef<HTMLImageElement>(null);
  const typographyRef = useRef<HTMLDivElement>(null);
  const initialNRef = useRef<SVGPathElement>(null);
  const initialURef = useRef<SVGPathElement>(null);
  const namesRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1, // Smooth scrolling control
          onLeave: () => {
             // Maybe auto-open or just leave
          }
        }
      });

      // --- Phase 1: Archway Zoom (0 - 30%) ---
      tl.to(archwayRef.current, {
        scale: 1.8,
        opacity: 0, // Fade out as we pass through
        transformOrigin: "50% 60%", // Focus on the door area
        ease: "power2.inOut"
      }, 0);

      // Parallax Trees (Optimized: removed scale, reduced y distance)
      tl.to([treeGreenLRef.current, treeGreenRRef.current], {
        y: -50,
        ease: "none"
      }, 0);
      tl.to([treePinkLRef.current, treePinkRRef.current], {
        y: -30,
        ease: "none"
      }, 0.1);

      // --- Phase 2: Fog Transition (25 - 50%) ---
      tl.to(fogRef.current, {
        opacity: 1,
        duration: 0.2
      }, 0.25);
      tl.to(manorRef.current, {
        opacity: 1,
        duration: 0.3
      }, 0.3);
      tl.to(fogRef.current, {
        opacity: 0,
        duration: 0.2
      }, 0.45);

      // --- Phase 3: Layered Assembly (50 - 80%) ---
      tl.fromTo(castleRef.current, 
        { y: 150, opacity: 0 },
        { y: 0, opacity: 1, ease: "power2.out" },
        0.5
      );

      tl.fromTo([flowerLRef.current, flowerRRef.current],
        { scale: 0, rotate: (idx) => idx === 0 ? -15 : 15, opacity: 0 },
        { scale: 1, rotate: 0, opacity: 1, ease: "back.out(1.7)", stagger: 0.05 },
        0.6
      );

      tl.fromTo([towerLRef.current, towerRRef.current],
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, ease: "power2.out", stagger: 0.1 },
        0.7
      );

      // --- Phase 4: Typography Reveal (80 - 100%) ---
      tl.fromTo(typographyRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.2 },
        0.75
      );

      // Initial N Path Animation
      tl.fromTo(initialNRef.current,
        { strokeDashoffset: 350, strokeDasharray: 350 },
        { strokeDashoffset: 0, duration: 0.5 },
        0.8
      );
      // Initial U Path Animation
      tl.fromTo(initialURef.current,
        { strokeDashoffset: 350, strokeDasharray: 350 },
        { strokeDashoffset: 0, duration: 0.5 },
        0.85
      );

      // Full Names Reveal
      tl.fromTo(namesRef.current,
        { clipPath: "inset(100% 0 0 0)", letterSpacing: "0.5em" },
        { clipPath: "inset(0% 0 0 0)", letterSpacing: "0.1em", duration: 0.6, ease: "power3.out" },
        0.9
      );

      // Final Opacity/Reveal for the Open Button
      tl.fromTo(".open-btn-container",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.3 },
        0.95
      );

    }, containerRef); // Scope

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className={styles.container}>
      <div ref={wrapperRef} className={styles.stickyWrapper}>
        
        {/* Layer 0: Static Watercolor Texture */}
        <div className={styles.bgStatic} style={{ backgroundImage: `url('/assets/opening/bg-watercolor-texture.png')` }} />

        {/* Layer 1: Manor (Revealed later) */}
        <div ref={manorRef} className={styles.manorLayer} style={{ backgroundImage: `url('/assets/opening/bg-architecture-manor.png')` }} />

        {/* Layer 2: Parallax Trees */}
        <img ref={treeGreenLRef} src="/assets/opening/tree-green-left.png" className={`${styles.layer} ${styles.treeGreenL}`} alt="" />
        <img ref={treeGreenRRef} src="/assets/opening/tree-green-right.png" className={`${styles.layer} ${styles.treeGreenR}`} alt="" />
        <img ref={treePinkLRef} src="/assets/opening/tree-pink-left.png" className={`${styles.layer} ${styles.treePinkL}`} alt="" />
        <img ref={treePinkRRef} src="/assets/opening/tree-pink-right.png" className={`${styles.layer} ${styles.treePinkR}`} alt="" />

        {/* Layer 3: Archway (The Portal) */}
        <div ref={archwayRef} className={styles.archwayLayer}>
           <img src="/assets/opening/archway-gothic.png" className={styles.archwayImg} alt="" />
        </div>

        {/* Layer 4: Fog Overlay */}
        <div ref={fogRef} className={styles.fogOverlay} />

        {/* Layer 5: Main Castle */}
        <img ref={castleRef} src="/assets/opening/castle-main.png" className={styles.castleImg} alt="" />

        {/* Layer 6: Towers */}
        <img ref={towerLRef} src="/assets/opening/tower-left.png" className={`${styles.layer} ${styles.towerL}`} alt="" />
        <img ref={towerRRef} src="/assets/opening/tower-right.png" className={`${styles.layer} ${styles.towerR}`} alt="" />

        {/* Layer 7: Flowers */}
        <img ref={flowerLRef} src="/assets/opening/flowers-foreground-left.png" className={`${styles.layer} ${styles.flowerL}`} alt="" />
        <img ref={flowerRRef} src="/assets/opening/flowers-foreground-right.png" className={`${styles.layer} ${styles.flowerR}`} alt="" />

        {/* Layer 8: Typography */}
        <div ref={typographyRef} className={styles.typographyLayer}>
          <div className={styles.initialsContainer}>
            <svg viewBox="0 0 100 100" className={styles.initialSvg}>
              <path ref={initialNRef} d="M25 75 C25 25 25 25 25 25 L75 75 L75 25" fill="none" stroke="#C8A882" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className={styles.ampersand}>&</span>
            <svg viewBox="0 0 100 100" className={styles.initialSvg}>
              <path ref={initialURef} d="M25 25 L25 65 C25 80 75 80 75 65 L75 25" fill="none" stroke="#C8A882" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          
          <h1 ref={namesRef} className={styles.fullNames}>
             {brideName} & {groomName}
          </h1>
          
          <div className={`${styles.openBtnContainer} open-btn-container`}>
            {guestName && <p className={styles.guestGreet}>Dear, <span>{guestName}</span></p>}
            <button onClick={onOpen} className={styles.openBtn}>
               Buka Undangan
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
