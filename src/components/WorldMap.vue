<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, shallowRef, watch } from 'vue';
import {
  MAP_CAMERA,
  MAP_HEIGHT,
  MAP_WIDTH,
  type LegendItem,
  type MapPlace,
  type PlaceType,
} from '../data/map';
import { createVectorMap, type VectorMapHandle } from '../lib/pixiVectorMap';
import '../styles/pages/map.css';

const props = defineProps<{
  known: MapPlace[];
  dark: MapPlace[];
  legend: LegendItem[];
  calamities: MapPlace[];
}>();

const TYPE_LABELS: Record<PlaceType, string> = {
  city: 'City',
  island: 'Island',
  landmark: 'Landmark',
  conflict: 'Conflict zone',
  calamity: 'Calamity',
};

const darkMode = ref(false);
const showOverlay = ref(false);
const selectedId = ref<string | null>(null);

const mapEl = ref<HTMLDivElement | null>(null);
const mapHandle = shallowRef<VectorMapHandle | null>(null);

const places = computed(() => [...props.known, ...props.dark]);
const selected = computed(
  () => (selectedId.value ? places.value.find((p) => p.id === selectedId.value) ?? null : null)
);

const typeLabel = computed(() => {
  if (!selected.value) return '';
  return selected.value.rank
    ? `${TYPE_LABELS[selected.value.type] || 'Location'} · Threat ${selected.value.rank}`
    : TYPE_LABELS[selected.value.type] || 'Location';
});

const stageStyle = computed(() => {
  const { w, h } = darkMode.value
    ? { w: MAP_WIDTH, h: MAP_HEIGHT }
    : MAP_CAMERA.knownFrame;
  return {
    aspectRatio: `${w} / ${h}`,
    width: `min(100%, calc(min(70vh, 720px) * ${w} / ${h}))`,
  };
});

function selectPlace(id: string) {
  if (!places.value.some((p) => p.id === id)) return;
  selectedId.value = id;
}

function clearSelection() {
  selectedId.value = null;
}

async function setView(nextDark: boolean) {
  if (nextDark === darkMode.value) return;

  if (nextDark) {
    showOverlay.value = true;
    await new Promise((r) => setTimeout(r, 700));
    showOverlay.value = false;
  }

  darkMode.value = nextDark;
  clearSelection();
  await nextTick();
  // Stage aspect changes with the mode — wait a frame so Pixi sees the new size.
  requestAnimationFrame(() => {
    mapHandle.value?.setDarkMode(nextDark);
  });
}

function zoomIn() {
  mapHandle.value?.zoomBy(1.2);
}

function zoomOut() {
  mapHandle.value?.zoomBy(1 / 1.2);
}

function resetZoom() {
  mapHandle.value?.fitView(true);
}

function focusCalamity(id: string) {
  selectPlace(id);
  const place = places.value.find((p) => p.id === id);
  if (place) mapHandle.value?.focusWorldPoint(place.x, place.y);
}

watch(selectedId, (id) => {
  mapHandle.value?.setSelected(id);
});

onMounted(async () => {
  const el = mapEl.value;
  if (!el) return;

  mapHandle.value = await createVectorMap(el, {
    known: props.known,
    dark: props.dark,
    onSelect: selectPlace,
  });
});

onUnmounted(() => {
  mapHandle.value?.destroy();
  mapHandle.value = null;
});
</script>

<template>
  <section class="page-head container">
    <span class="section-kicker">CARTOGRAPHY DIVISION · CLEARANCE LEVEL ★★</span>
    <h1 class="section-title">
      The <span class="accent-g">World</span> — and What Lies <span class="accent">Beyond</span>
    </h1>
    <p class="page-sub">
      Vector survey chart traced from the Association map. Zoom freely — edges stay sharp.
      Known World first, then request clearance for Lake Mobius and beyond.
    </p>
    <div class="view-toggle" role="group" aria-label="Map view">
      <button
        :class="['vt-btn', { active: !darkMode }]"
        type="button"
        @click="void setView(false)"
      >
        Known World
      </button>
      <button
        :class="['vt-btn', 'vt-dark', { active: darkMode }]"
        type="button"
        @click="void setView(true)"
      >
        ⚠ The True Map
      </button>
    </div>
  </section>

  <section class="container">
    <div class="map-frame card">
      <div :class="['map-stage', { 'dark-view': darkMode }]" :style="stageStyle">
        <div ref="mapEl" class="pixi-host" role="img" aria-label="Hunter x Hunter vector world map" />

        <div class="zoom-controls" aria-label="Zoom controls">
          <button type="button" title="Zoom in" @click="zoomIn">+</button>
          <button type="button" title="Zoom out" @click="zoomOut">−</button>
          <button type="button" title="Fit map" @click="resetZoom">⌂</button>
        </div>

        <div v-if="showOverlay" class="classified-overlay" aria-hidden="true">
          <div class="classified-stamp">CLASSIFIED</div>
          <p>Clearance ★★ — Dark Continent survey</p>
        </div>
      </div>

      <aside class="map-info">
        <div v-if="!selected" class="mi-empty">
          <p>▸ Select a marker on the map to read the Association's field notes.</p>
          <p class="mi-hint">
            Places: <code>src/data/map.ts</code> · Shapes: <code>src/data/mapVectors.ts</code>
          </p>
        </div>
        <div
          v-else
          class="mi-detail"
          :style="{ '--mi-color': selected.color }"
        >
          <div v-if="selected.image" class="mi-img-wrap">
            <img :src="selected.image" :alt="selected.name" width="400" height="220" />
          </div>
          <div class="mi-type">{{ typeLabel }}</div>
          <h3>{{ selected.name }}</h3>
          <p>{{ selected.text }}</p>
        </div>
      </aside>
    </div>

    <div class="map-legend card" aria-label="Map legend">
      <div v-for="l in legend" :key="l.id" class="legend-item">
        <span class="legend-swatch" :style="{ '--lc': l.color }" :data-type="l.id" />
        <span>{{ l.label }}</span>
      </div>
    </div>

    <div v-if="darkMode" class="calamities card">
      <h2 class="cal-title">Five Calamities</h2>
      <p class="cal-sub">Threat ranks from Association field reports. Click a row to focus the marker.</p>
      <ul class="cal-list">
        <li v-for="c in calamities" :key="c.id">
          <button
            type="button"
            class="cal-row"
            :style="{ '--mc': c.color }"
            @click="focusCalamity(c.id)"
          >
            <span class="cal-rank">{{ c.rank }}</span>
            <span class="cal-name">{{ c.name }}</span>
            <span class="cal-snip">{{ c.text }}</span>
          </button>
        </li>
      </ul>
    </div>

    <p v-if="darkMode" class="map-footnote">
      The "world map" every civilian knows is the small green smudge in the middle. Lake Mobius —
      what they call "the ocean" — is a lake. The land beyond has returned 149 expeditions as
      corpses, madmen, or not at all. The Hunter Association keeps the door anyway.
    </p>
  </section>
</template>
