<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import type { CharacterWithPortrait, NenTypeName } from '../data/characters';
import { nenTypeColors } from '../data/characters';
import '../styles/pages/characters.css';

const props = defineProps<{
  characters: CharacterWithPortrait[];
}>();

const FILTERS: Array<'All' | NenTypeName> = [
  'All',
  'Enhancement',
  'Transmutation',
  'Conjuration',
  'Specialization',
  'Emission',
  'Unknown',
];

const STAT_NAMES: Record<string, string> = {
  power: 'Raw Power',
  speed: 'Speed',
  tactics: 'Tactics',
  nen: 'Nen Mastery',
};

const filter = ref<'All' | NenTypeName>('All');
const activeId = ref<string | null>(null);
const barsReady = ref(false);
const closeBtn = ref<HTMLButtonElement | null>(null);
let lastFocus: HTMLElement | null = null;

const active = computed(() => props.characters.find((c) => c.id === activeId.value) ?? null);

watch(active, async (val) => {
  if (!val) {
    document.body.style.overflow = '';
    barsReady.value = false;
    return;
  }
  document.body.style.overflow = 'hidden';
  barsReady.value = false;
  await nextTick();
  closeBtn.value?.focus();
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      barsReady.value = true;
    });
  });
});

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && activeId.value) {
    close();
  }
}

onMounted(() => addEventListener('keydown', onKey));
onUnmounted(() => {
  removeEventListener('keydown', onKey);
  document.body.style.overflow = '';
});

function open(id: string, e: Event) {
  lastFocus = e.currentTarget as HTMLElement;
  barsReady.value = false;
  activeId.value = id;
}

function close() {
  activeId.value = null;
  lastFocus?.focus();
}

function filterColor(f: 'All' | NenTypeName) {
  return f !== 'All' ? nenTypeColors[f] : 'var(--hxh-gold)';
}
</script>

<template>
  <section class="page-head container">
    <span class="section-kicker">HUNTER ASSOCIATION ARCHIVE</span>
    <h1 class="section-title">Character <span class="accent">Dossiers</span></h1>
    <p class="page-sub">
      Ten files from the archive. Filter by Nen type, then open a card to read the full dossier.
    </p>
    <div class="filters" role="group" aria-label="Filter characters by Nen type">
      <button
        v-for="f in FILTERS"
        :key="f"
        type="button"
        class="filter-btn"
        :class="{ active: filter === f }"
        :style="{ '--fc': filterColor(f) }"
        @click="filter = f"
      >
        {{ f }}
      </button>
    </div>
  </section>

  <section class="container">
    <div class="char-grid">
      <button
        v-for="(c, i) in characters"
        :key="c.id"
        type="button"
        class="char-card card"
        :class="{ 'filtered-out': filter !== 'All' && c.nenType !== filter }"
        :style="{ '--cc': c.color, '--cc2': c.color2, '--i': i }"
        aria-haspopup="dialog"
        @click="open(c.id, $event)"
      >
        <span class="char-aura" aria-hidden="true" />
        <span class="char-portrait" aria-hidden="true">
          <span class="char-portrait-art">
            <img :src="c.portrait" alt="" width="200" height="240" loading="lazy" />
          </span>
          <span class="char-badge" v-html="c.emblem" />
        </span>
        <span class="char-name">{{ c.name }}</span>
        <span class="char-epithet">{{ c.epithet }}</span>
        <span class="char-nen" :style="{ '--nc': nenTypeColors[c.nenType] }">{{ c.nenType }}</span>
        <span class="char-open">OPEN FILE ▸</span>
      </button>
    </div>
  </section>

  <div
    class="modal-backdrop"
    :hidden="!active"
    @click.self="close"
  >
    <div
      v-if="active"
      class="modal card"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-name"
      :style="{ '--cc': active.color }"
    >
      <button
        ref="closeBtn"
        type="button"
        class="modal-close"
        aria-label="Close dossier"
        @click="close"
      >
        ✕
      </button>
      <div class="modal-head">
        <div class="modal-portrait" aria-hidden="true">
          <img :src="active.portrait" alt="" width="200" height="240" />
        </div>
        <div>
          <div class="modal-nen">{{ active.nenType }} · Nen type</div>
          <h2 id="modal-name">{{ active.name }}</h2>
          <p class="modal-epithet">{{ active.epithet }}</p>
        </div>
      </div>
      <blockquote class="modal-quote">“{{ active.quote }}”</blockquote>
      <p class="modal-bio">{{ active.bio }}</p>
      <div class="modal-cols">
        <div>
          <h3 class="modal-h3">Known Abilities</h3>
          <ul class="modal-abilities">
            <li v-for="a in active.abilities" :key="a">{{ a }}</li>
          </ul>
        </div>
        <div>
          <h3 class="modal-h3">Hunter Assessment</h3>
          <div class="stats">
            <div v-for="(v, k) in active.stats" :key="k">
              <div class="stat-label">
                <span>{{ STAT_NAMES[k] }}</span>
                <span>{{ v }}</span>
              </div>
              <div class="stat-track">
                <div class="stat-fill" :style="{ width: barsReady ? `${v}%` : '0%' }" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
