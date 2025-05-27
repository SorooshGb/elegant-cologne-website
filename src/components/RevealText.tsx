'use client';

import { useGSAP } from '@gsap/react';
import { asText, RichTextField } from '@prismicio/client';
import clsx from 'clsx';
import { gsap } from 'gsap';
import { ElementType, ReactNode, useRef } from 'react';

gsap.registerPlugin(useGSAP);

type RevealTextProps = {
  field: RichTextField;
  id: string;
  className?: string;
  staggerAmount?: number;
  as?: ElementType;
  duration?: number;
  align?: 'center' | 'start' | 'end';
};

gsap.registerPlugin(useGSAP);

function RevealText(
  {
    field,
    id,
    align = 'start',
    as: Component = 'div',
    duration = .8,
    staggerAmount = .1,
    className
  }: RevealTextProps
) {
  const words = asText(field).split(' ');
  const componentRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.to('.reveal-text-word', {
        y: 0,
        stagger: staggerAmount,
        duration,
        ease: 'power3.out',
      });
    });

    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.to('.reveal-text-word', {
        duration: 0.5,
        opacity: 1,
        ease: 'none',
        y: 0,
        stagger: 0,
      });
    });
  }, { scope: componentRef });

  return (
    <Component
      ref={componentRef}
      className={clsx(
        'reveal-text text-balance',
        align === 'center' && 'text-center',
        align === 'start' && 'text-left',
        align === 'end' && 'text-right',
        className
      )}
    >
      {words.map((word, index) => (
        <span
          key={`${word}-${index}-${id}`}
          className="mb-0 inline-block overflow-hidden pb-4"
        >
          <span className="reveal-text-word mt-0 inline-block translate-y-[120%] will-change-transform">
            {word}
            {index < word.length - 1 && <>&nbsp;</>}
          </span>
        </span>
      ))}
    </Component>
  );
}
export default RevealText;
