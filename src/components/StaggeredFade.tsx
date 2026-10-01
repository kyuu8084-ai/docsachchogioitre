import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface StaggeredFadeProps {
  text: string;
  className?: string;
  delayOffset?: number;
}

export default function StaggeredFade({ text, className = '', delayOffset = 0 }: StaggeredFadeProps) {
  const ref = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, { once: true });

  const characters = Array.from(text);

  return (
    <span ref={ref} className={`inline-block ${className}`}>
      {characters.map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{
            duration: 0.5,
            delay: delayOffset + index * 0.05,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="inline-block"
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </span>
  );
}
