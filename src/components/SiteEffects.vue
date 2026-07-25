<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';

let cleanup: (() => void) | undefined;

onMounted(() => {
  const toggle = document.querySelector<HTMLButtonElement>('.nav-toggle');
  const linksEl = document.querySelector('.nav-links');

  const onToggle = () => {
    const open = linksEl?.classList.toggle('open');
    toggle?.setAttribute('aria-expanded', String(!!open));
  };
  toggle?.addEventListener('click', onToggle);

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      }
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  cleanup = () => {
    toggle?.removeEventListener('click', onToggle);
    io.disconnect();
  };
});

onUnmounted(() => cleanup?.());
</script>

<template>
  <!-- side effects only -->
</template>
