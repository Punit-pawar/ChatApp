import { useRef, useLayoutEffect, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame
} from "framer-motion";

/* ------------------ Utils ------------------ */

const wrap = (min, max, v) => {
  const range = max - min;
  const mod = (((v - min) % range) + range) % range;
  return mod + min;
};

function useElementWidth(ref) {
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const updateWidth = () => {
      if (ref.current) {
        setWidth(ref.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [ref]);

  return width;
}

/* ---------------- VelocityText ---------------- */

function VelocityText({
  children,
  baseVelocity,
  scrollContainerRef,
  className = "",
  damping = 50,
  stiffness = 400,
  numCopies = 10,
  velocityMapping = { input: [0, 1000], output: [0, 5] },
  parallaxClassName,
  scrollerClassName,
  parallaxStyle,
  scrollerStyle
}) {
  const baseX = useMotionValue(0);

  const { scrollY } = useScroll({
    container: scrollContainerRef?.current || undefined
  });

  const scrollVelocity = useVelocity(scrollY);

  const smoothVelocity = useSpring(scrollVelocity, {
    damping,
    stiffness
  });

  const velocityFactor = useTransform(
    smoothVelocity,
    velocityMapping.input,
    velocityMapping.output,
    { clamp: false }
  );

  const copyRef = useRef(null);
  const copyWidth = useElementWidth(copyRef);

  const x = useTransform(baseX, (v) => {
    if (!copyWidth) return "0px";
    return `${wrap(-copyWidth, 0, v)}px`;
  });

  const directionFactor = useRef(1);

  useAnimationFrame((_, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    const vf = velocityFactor.get();

    if (vf < 0) directionFactor.current = -1;
    else if (vf > 0) directionFactor.current = 1;

    const cappedVelocity = Math.min(Math.abs(vf), 5);
    moveBy += directionFactor.current * moveBy * cappedVelocity;

    baseX.set(baseX.get() + moveBy);
  });

  const spans = Array.from({ length: numCopies }).map((_, i) => (
    <span
      key={i}
      ref={i === 0 ? copyRef : null}
      className={`flex-shrink-0 ${className}`}
    >
      {children}
    </span>
  ));

  return (
    <div
      className={`${parallaxClassName} relative overflow-hidden`}
      style={parallaxStyle}
    >
      <motion.div
        className={`${scrollerClassName} flex whitespace-nowrap text-center font-sans text-4xl font-bold tracking-[-0.02em] drop-shadow md:text-[5rem]`}
        style={{ x, ...scrollerStyle }}
      >
        {spans}
      </motion.div>
    </div>
  );
}

/* ---------------- ScrollVelocity ---------------- */

export const ScrollVelocity = ({
  scrollContainerRef,
  texts = [],
  velocity = 100,
  className = "",
  damping = 50,
  stiffness = 400,
  numCopies = 20,
  velocityMapping = { input: [0, 1000], output: [0, 5] },
  parallaxClassName,
  scrollerClassName,
  parallaxStyle,
  scrollerStyle
}) => {
  return (
    <section>
      {texts.map((text, index) => (
        <VelocityText
          key={index}
          baseVelocity={index % 2 === 0 ? velocity : -velocity}
          scrollContainerRef={scrollContainerRef}
          className={className}
          damping={damping}
          stiffness={stiffness}
          numCopies={numCopies}
          velocityMapping={velocityMapping}
          parallaxClassName={parallaxClassName}
          scrollerClassName={scrollerClassName}
          parallaxStyle={parallaxStyle}
          scrollerStyle={scrollerStyle}
        >
          {text}&nbsp;
        </VelocityText>
      ))}
    </section>
  );
};

export default ScrollVelocity;
