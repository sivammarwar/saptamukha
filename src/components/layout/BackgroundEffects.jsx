import React, { useEffect, useRef } from 'react';

function SriYantra() {
  return (
    <svg
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-[0.04] animate-spin-slow pointer-events-none"
      viewBox="0 0 200 200"
    >
      <g fill="none" stroke="#c8960c" strokeWidth="0.5">
        {/* Outer triangle */}
        <polygon points="100,10 190,160 10,160" />
        {/* Inner downward triangle */}
        <polygon points="100,190 10,40 190,40" />
        {/* Concentric triangles */}
        <polygon points="100,30 170,150 30,150" />
        <polygon points="100,170 30,50 170,50" />
        <polygon points="100,50 150,140 50,140" />
        <polygon points="100,150 50,60 150,60" />
        <polygon points="100,70 130,130 70,130" />
        <polygon points="100,130 70,70 130,70" />
        {/* Bindu (center dot) */}
        <circle cx="100" cy="100" r="3" fill="#c8960c" />
        {/* Outer circle */}
        <circle cx="100" cy="100" r="95" />
        {/* Lotus petals */}
        {Array.from({ length: 8 }).map((_, i) => (
          <ellipse
            key={i}
            cx="100"
            cy="100"
            rx="85"
            ry="20"
            transform={`rotate(${i * 45} 100 100)`}
          />
        ))}
      </g>
    </svg>
  );
}

function Particles() {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;
    let particles = [];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.5 - 0.2,
        alpha: Math.random() * 0.5 + 0.1,
        life: Math.random() * 100,
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        if (p.life <= 0 || p.y < -10) {
          particles[i] = {
            x: Math.random() * canvas.width,
            y: canvas.height + 10,
            r: Math.random() * 2 + 0.5,
            vx: (Math.random() - 0.5) * 0.3,
            vy: -Math.random() * 0.5 - 0.2,
            alpha: Math.random() * 0.5 + 0.1,
            life: Math.random() * 200 + 100,
          };
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200, 150, 12, ${p.alpha})`;
        ctx.fill();
      });
      animId = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}

export default function BackgroundEffects() {
  return (
    <>
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Radial glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(139,0,0,0.3) 0%, rgba(200,150,12,0.1) 40%, transparent 70%)',
          }}
        />
        <SriYantra />
      </div>
      <Particles />
      {/* Noise overlay */}
      <div className="noise-overlay" />
    </>
  );
}
