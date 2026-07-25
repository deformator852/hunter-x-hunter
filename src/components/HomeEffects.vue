<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';

type Particle = {
  x: number;
  y: number;
  r: number;
  vy: number;
  vx: number;
  c: string;
  a: number;
  da: number;
};

let cleanup: (() => void) | undefined;

onMounted(() => {
  const cleanups: Array<() => void> = [];

  const canvas = document.getElementById('aura-canvas') as HTMLCanvasElement | null;
  if (canvas) {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const colors = ['79,191,103', '230,57,70', '88,179,224', '244,201,93'];
      const particles: Particle[] = [];
      let w = 0;
      let h = 0;
      let raf = 0;

      const resize = () => {
        w = canvas.width = canvas.offsetWidth * devicePixelRatio;
        h = canvas.height = canvas.offsetHeight * devicePixelRatio;
      };
      resize();
      addEventListener('resize', resize);
      cleanups.push(() => removeEventListener('resize', resize));

      const spawn = (): Particle => ({
        x: Math.random() * w,
        y: h + 20,
        r: (Math.random() * 3 + 1.2) * devicePixelRatio,
        vy: -(Math.random() * 0.6 + 0.25) * devicePixelRatio,
        vx: (Math.random() - 0.5) * 0.3 * devicePixelRatio,
        c: colors[Math.floor(Math.random() * colors.length)],
        a: 0,
        da: Math.random() * 0.012 + 0.004,
      });

      for (let i = 0; i < 55; i++) {
        const p = spawn();
        p.y = Math.random() * h;
        p.a = Math.random() * 0.6;
        particles.push(p);
      }

      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      const tick = () => {
        ctx.clearRect(0, 0, w, h);
        for (const p of particles) {
          p.y += p.vy;
          p.x += p.vx + Math.sin(p.y * 0.01) * 0.2;
          p.a = Math.min(p.a + p.da, 0.75);
          if (p.y < -20) Object.assign(p, spawn());
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.c},${p.a})`;
          ctx.shadowColor = `rgba(${p.c},0.8)`;
          ctx.shadowBlur = 12;
          ctx.fill();
        }
        if (!reduced) raf = requestAnimationFrame(tick);
      };
      tick();
      cleanups.push(() => cancelAnimationFrame(raf));
    }
  }

  const card = document.getElementById('license-card');
  if (card) {
    const onMove = (e: MouseEvent) => {
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(700px) rotateY(${px * 14}deg) rotateX(${-py * 12}deg)`;
    };
    const onLeave = () => {
      card.style.transform = '';
    };
    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
    cleanups.push(() => {
      card.removeEventListener('mousemove', onMove);
      card.removeEventListener('mouseleave', onLeave);
    });
  }

  const nums = document.querySelectorAll<HTMLElement>('.num');
  const numIo = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        numIo.unobserve(entry.target);
        const el = entry.target as HTMLElement;
        const target = Number(el.dataset.count || 0);
        const t0 = performance.now();
        const dur = 1400;
        const step = (t: number) => {
          const k = Math.min((t - t0) / dur, 1);
          el.textContent = String(Math.round(target * (1 - Math.pow(1 - k, 3))));
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    },
    { threshold: 0.4 }
  );
  nums.forEach((n) => numIo.observe(n));
  cleanups.push(() => numIo.disconnect());

  cleanup = () => cleanups.forEach((fn) => fn());
});

onUnmounted(() => cleanup?.());
</script>

<template>
  <!-- side effects only -->
</template>
