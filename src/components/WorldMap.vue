<script setup lang="ts">
import type { LatLngBounds, LayerGroup, Map as LeafletMap, Marker } from 'leaflet';
import { computed, nextTick, onMounted, onUnmounted, ref, shallowRef, watch } from 'vue';
import {
  MAP_CAMERA,
  MAP_HEIGHT,
  MAP_WIDTH,
  type LegendItem,
  type MapPlace,
  type PlaceType,
} from '../data/map';
import { markerGlyphSvg } from '../lib/mapMarkerGlyphs';
import '../styles/pages/map.css';

const props = defineProps<{
  known: MapPlace[];
  dark: MapPlace[];
  legend: LegendItem[];
  calamities: MapPlace[];
  mapSrc: string;
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
const mapRef = shallowRef<LeafletMap | null>(null);
const worldBoundsRef = shallowRef<LatLngBounds | null>(null);
const knownBoundsRef = shallowRef<LatLngBounds | null>(null);
const darkLayerRef = shallowRef<LayerGroup | null>(null);
const markersById = shallowRef(new Map<string, Marker>());
/** Set after Leaflet loads — refreshes DivIcon active state. */
const syncMarkerActiveState = shallowRef<(() => void) | null>(null);

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

/** Match stage aspect to the active camera frame so Leaflet doesn't crop left/right. */
const stageStyle = computed(() => {
  const { w, h } = darkMode.value
    ? { w: MAP_WIDTH, h: MAP_HEIGHT }
    : MAP_CAMERA.knownFrame;
  return {
    aspectRatio: `${w} / ${h}`,
    width: `min(100%, calc(min(70vh, 720px) * ${w} / ${h}))`,
  };
});

/** Image pixel (top-left origin) → Leaflet CRS.Simple latlng. */
function toLatLng(x: number, y: number): [number, number] {
  return [MAP_HEIGHT - y, x];
}

function imageBounds(): [[number, number], [number, number]] {
  return [
    [0, 0],
    [MAP_HEIGHT, MAP_WIDTH],
  ];
}

function knownBounds(): [[number, number], [number, number]] {
  const { x, y, w, h } = MAP_CAMERA.knownFrame;
  return [toLatLng(x, y + h), toLatLng(x + w, y)];
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function selectPlace(id: string) {
  if (!places.value.some((p) => p.id === id)) return;
  selectedId.value = id;
}

function clearSelection() {
  selectedId.value = null;
}

/**
 * Apply camera from MAP_CAMERA in src/data/map.ts.
 * Tune knownFrame / knownZoomIn / trueZoomIn there — no need to edit this file.
 */
function lockCamera(animate: boolean) {
  const map = mapRef.value;
  const world = worldBoundsRef.value;
  const known = knownBoundsRef.value;
  if (!map || !world || !known) return;

  const cam = MAP_CAMERA;
  const focus = darkMode.value ? world : known;
  const padPx = darkMode.value ? cam.truePadding : cam.knownPadding;
  const boundsPad = darkMode.value ? cam.trueBoundsPad : cam.knownBoundsPad;
  const zoomIn = darkMode.value ? cam.trueZoomIn : cam.knownZoomIn;

  // Unlock first so True Map can zoom out from Known World.
  map.setMinZoom(-8);
  map.setMaxZoom(cam.maxZoom);
  map.setMaxBounds(boundsPad > 0 ? focus.pad(boundsPad) : focus);

  map.fitBounds(focus, {
    animate: false,
    padding: [padPx, padPx],
  });

  const fitted = map.getZoom();
  const nextZoom = Math.min(cam.maxZoom, Math.max(-8, fitted + zoomIn));
  map.setView(map.getCenter(), nextZoom, { animate, duration: animate ? 0.75 : 0 });

  // Don't allow zooming out past this fitted view.
  map.setMinZoom(nextZoom);
}

function fitView(animate: boolean) {
  lockCamera(animate);
}

function activeBounds(): LatLngBounds | null {
  const known = knownBoundsRef.value;
  const world = worldBoundsRef.value;
  if (!known || !world) return null;
  const focus = darkMode.value ? world : known;
  const pad = darkMode.value ? MAP_CAMERA.trueBoundsPad : MAP_CAMERA.knownBoundsPad;
  return pad > 0 ? focus.pad(pad) : focus;
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

  const map = mapRef.value;
  const darkLayer = darkLayerRef.value;
  if (map && darkLayer) {
    if (nextDark) darkLayer.addTo(map);
    else map.removeLayer(darkLayer);
  }

  await nextTick();
  map?.invalidateSize({ animate: false });
  requestAnimationFrame(() => {
    map?.invalidateSize({ animate: false });
    lockCamera(true);
  });
}

function zoomIn() {
  mapRef.value?.zoomIn();
}

function zoomOut() {
  mapRef.value?.zoomOut();
}

function resetZoom() {
  fitView(true);
}

function focusCalamity(id: string) {
  selectPlace(id);
  const marker = markersById.value.get(id);
  const map = mapRef.value;
  if (marker && map) {
    map.panTo(marker.getLatLng(), { animate: true });
  }
}

watch(selectedId, () => {
  syncMarkerActiveState.value?.();
});

onMounted(async () => {
  const el = mapEl.value;
  if (!el) return;

  const L = (await import('leaflet')).default;
  await import('leaflet/dist/leaflet.css');

  function markerIcon(place: MapPlace, active: boolean) {
    const name = escapeHtml(place.name);
    const isCalamity = place.type === 'calamity';
    const rank = place.rank
      ? `<span class="hxh-marker-rank">${escapeHtml(place.rank)}</span>`
      : '';
    const glyph = markerGlyphSvg(place.id, place.type);
    const classes = [
      'hxh-marker',
      active ? 'is-active' : '',
      isCalamity ? 'is-calamity' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return L.divIcon({
      className: 'hxh-marker-wrap',
      html: `
        <button type="button" class="${classes}" data-type="${place.type}" data-place="${escapeHtml(place.id)}" style="--mc:${escapeHtml(place.color)}" aria-label="${name}">
          <svg class="hxh-marker-svg" viewBox="-16 -16 32 40" width="40" height="50" aria-hidden="true">
            ${isCalamity ? `<circle class="hxh-cal-glow" cx="0" cy="0" r="14" fill="${escapeHtml(place.color)}"/>` : ''}
            <line class="hxh-pin-stem" x1="0" y1="11" x2="0" y2="22" stroke="${escapeHtml(place.color)}" stroke-width="2" stroke-linecap="round"/>
            <circle class="hxh-pin-disc" cx="0" cy="0" r="12" fill="${escapeHtml(place.color)}" stroke="#0b0d12" stroke-width="2.2"/>
            <circle cx="0" cy="0" r="12" fill="none" stroke="#fff" stroke-opacity="0.22" stroke-width="1.2"/>
            <g class="hxh-pin-glyph">${glyph}</g>
          </svg>
          ${rank}
          <span class="hxh-marker-label">${name}</span>
        </button>
      `,
      iconSize: [40, 50],
      iconAnchor: [20, 46],
    });
  }

  syncMarkerActiveState.value = () => {
    for (const [id, marker] of markersById.value) {
      const place = places.value.find((p) => p.id === id);
      if (!place) continue;
      marker.setIcon(markerIcon(place, selectedId.value === id));
    }
  };

  const world = L.latLngBounds(imageBounds());
  const map = L.map(el, {
    crs: L.CRS.Simple,
    minZoom: -5,
    maxZoom: 2,
    zoomSnap: 0,
    zoomDelta: 0.4,
    wheelPxPerZoomLevel: 120,
    attributionControl: false,
    zoomControl: false,
    maxBounds: world,
    maxBoundsViscosity: 1,
  });

  L.imageOverlay(props.mapSrc, world, { interactive: false }).addTo(map);

  const knownLayer = L.layerGroup().addTo(map);
  const darkLayer = L.layerGroup();
  const byId = new Map<string, Marker>();

  function addPlaceMarker(place: MapPlace, layer: LayerGroup) {
    const marker = L.marker(toLatLng(place.x, place.y), {
      icon: markerIcon(place, false),
      keyboard: true,
      title: place.name,
    });
    marker.on('click', (e) => {
      L.DomEvent.stopPropagation(e);
      selectPlace(place.id);
    });
    marker.addTo(layer);
    byId.set(place.id, marker);
  }

  for (const place of props.known) addPlaceMarker(place, knownLayer);
  for (const place of props.dark) addPlaceMarker(place, darkLayer);

  mapRef.value = map;
  worldBoundsRef.value = world;
  knownBoundsRef.value = L.latLngBounds(knownBounds());
  darkLayerRef.value = darkLayer;
  markersById.value = byId;

  // Start in Known World — darkLayer stays off the map until True Map.
  map.invalidateSize();
  lockCamera(false);

  map.on('zoomend moveend', () => {
    const minZ = map.getMinZoom();
    if (map.getZoom() < minZ - 0.001) map.setZoom(minZ);
    const focus = activeBounds();
    if (focus && !focus.contains(map.getBounds())) {
      map.panInsideBounds(focus, { animate: false });
    }
  });

  map.on('resize', () => {
    map.invalidateSize({ animate: false });
    lockCamera(false);
  });
});

onUnmounted(() => {
  mapRef.value?.remove();
  mapRef.value = null;
  worldBoundsRef.value = null;
  knownBoundsRef.value = null;
  darkLayerRef.value = null;
  markersById.value = new Map();
  syncMarkerActiveState.value = null;
});
</script>

<template>
  <section class="page-head container">
    <span class="section-kicker">CARTOGRAPHY DIVISION · CLEARANCE LEVEL ★★</span>
    <h1 class="section-title">
      The <span class="accent-g">World</span> — and What Lies <span class="accent">Beyond</span>
    </h1>
    <p class="page-sub">
      Official Association survey chart. Zoom the Known World — then request clearance for the true map
      around Lake Mobius.
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
        <div ref="mapEl" class="leaflet-host" role="img" aria-label="Hunter x Hunter world map" />

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
            Places + zoom: <code>src/data/map.ts</code> → <code>MAP_CAMERA</code>
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
