import { useState, useEffect, useRef } from 'react';

interface ConfettiProps {
  active: boolean;
  combo: number;
}

const EMOJIS = ['🎉', '✨', '🎊', '🌟', '💫', '🍜', '🎯', '🔥', '💖', '🥳'];

interface Particle {
  id: number;
  emoji: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  scale: number;
}

export default function Confetti({ active, combo }: ConfettiProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const idRef = useRef(0);
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (!active || combo < 2) {
      setParticles([]);
      return;
    }

    const count = Math.min(combo * 6, 40);
    const newParticles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: idRef.current++,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
        x: Math.random() * 100,
        y: -10 - Math.random() * 20,
        vx: (Math.random() - 0.5) * 2,
        vy: 1.5 + Math.random() * 3,
        rotation: Math.random() * 360,
        scale: 0.6 + Math.random() * 1.2,
      });
    }

    setParticles(newParticles);

    // 动画循环
    let lastTime = performance.now();
    const animate = (now: number) => {
      const dt = (now - lastTime) / 16;
      lastTime = now;

      setParticles((prev) => {
        const next = prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx * dt,
            y: p.y + p.vy * dt,
            rotation: p.rotation + p.vx * 3 * dt,
            vy: p.vy + 0.03 * dt,
          }))
          .filter((p) => p.y < 120);
        if (next.length === 0) return next;
        return next;
      });

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
    };
  }, [active, combo]);

  if (particles.length === 0) return null;

  return (
    <div className="confetti-overlay" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="confetti-particle"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            transform: `rotate(${p.rotation}deg) scale(${p.scale})`,
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}
