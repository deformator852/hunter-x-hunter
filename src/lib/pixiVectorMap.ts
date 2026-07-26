import {
  Application,
  Assets,
  Container,
  FederatedPointerEvent,
  Graphics,
  Sprite,
  Text,
  type Texture,
} from 'pixi.js';
import {
  MAP_CAMERA,
  MAP_HEIGHT,
  MAP_WIDTH,
  type MapPlace,
} from '../data/map';
import {
  knownLands,
  knownWorldBox,
  lakeMobius,
  mapLabels,
  newContinentLands,
  type VecPoly,
  type VecRing,
} from '../data/mapVectors';

export type MapRect = { x: number; y: number; w: number; h: number };

export type VectorMapHandle = {
  app: Application;
  setDarkMode: (dark: boolean) => void;
  fitView: (animate?: boolean) => void;
  zoomBy: (factor: number) => void;
  focusWorldPoint: (x: number, y: number) => void;
  setSelected: (id: string | null) => void;
  destroy: () => void;
};

function hexToNum(hex: string): number {
  return Number.parseInt(hex.replace('#', ''), 16);
}

function drawRing(g: Graphics, ring: VecRing) {
  if (ring.length < 6) return;
  g.moveTo(ring[0], ring[1]);
  for (let i = 2; i < ring.length; i += 2) g.lineTo(ring[i], ring[i + 1]);
  g.closePath();
}

function paintPoly(g: Graphics, poly: VecPoly) {
  drawRing(g, poly.ring);
  g.fill({ color: poly.fill });
  if (poly.stroke != null) {
    g.stroke({ width: poly.strokeWidth ?? 2, color: poly.stroke, join: 'round' });
  }
}

function dashedRect(g: Graphics, rect: MapRect, color: number) {
  const { x, y, w, h } = rect;
  const dash = 18;
  const gap = 12;
  const edges: [number, number, number, number][] = [
    [x, y, x + w, y],
    [x + w, y, x + w, y + h],
    [x + w, y + h, x, y + h],
    [x, y + h, x, y],
  ];
  for (const [x1, y1, x2, y2] of edges) {
    const len = Math.hypot(x2 - x1, y2 - y1);
    const ux = (x2 - x1) / len;
    const uy = (y2 - y1) / len;
    let d = 0;
    while (d < len) {
      const seg = Math.min(dash, len - d);
      g.moveTo(x1 + ux * d, y1 + uy * d);
      g.lineTo(x1 + ux * (d + seg), y1 + uy * (d + seg));
      d += dash + gap;
    }
  }
  g.stroke({ width: 3, color, alpha: 0.92, cap: 'round' });
}

type Cam = { scale: number; x: number; y: number };

function fitCamera(
  rect: MapRect,
  viewW: number,
  viewH: number,
  padding: number,
  zoomIn: number
): Cam {
  const availW = Math.max(40, viewW - padding * 2);
  const availH = Math.max(40, viewH - padding * 2);
  const scale = Math.min(availW / rect.w, availH / rect.h) * zoomIn;
  return {
    scale,
    x: viewW / 2 - (rect.x + rect.w / 2) * scale,
    y: viewH / 2 - (rect.y + rect.h / 2) * scale,
  };
}

function clampCamera(cam: Cam, focus: MapRect, viewW: number, viewH: number, padFrac: number): Cam {
  const { minScale, maxScale } = MAP_CAMERA;
  const scale = Math.min(maxScale, Math.max(minScale, cam.scale));
  const padX = focus.w * padFrac;
  const padY = focus.h * padFrac;
  const fx = focus.x - padX;
  const fy = focus.y - padY;
  const fw = focus.w + padX * 2;
  const fh = focus.h + padY * 2;
  const worldLeft = fx * scale;
  const worldTop = fy * scale;
  const worldRight = (fx + fw) * scale;
  const worldBottom = (fy + fh) * scale;
  let x = cam.x;
  let y = cam.y;
  if (worldRight - worldLeft <= viewW) x = viewW / 2 - (fx + fw / 2) * scale;
  else x = Math.min(-worldLeft, Math.max(viewW - worldRight, x));
  if (worldBottom - worldTop <= viewH) y = viewH / 2 - (fy + fh / 2) * scale;
  else y = Math.min(-worldTop, Math.max(viewH - worldBottom, y));
  return { scale, x, y };
}

function makePinMarker(place: MapPlace, onSelect: (id: string) => void): Container {
  const root = new Container();
  root.eventMode = 'static';
  root.cursor = 'pointer';
  root.position.set(place.x, place.y);

  const g = new Graphics();
  const color = hexToNum(place.color);
  g.moveTo(0, 14);
  g.lineTo(0, 26);
  g.stroke({ width: 2.5, color, cap: 'round' });
  g.circle(0, 0, 11);
  g.fill({ color });
  g.stroke({ width: 2.2, color: 0x0b0d12 });
  g.circle(0, 0, 11);
  g.stroke({ width: 1.2, color: 0xffffff, alpha: 0.25 });
  root.addChild(g);

  const label = new Text({
    text: place.name,
    style: {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontSize: 12,
      fontWeight: '700',
      fill: 0xf4f0e4,
      stroke: { color: 0x0b0d12, width: 3 },
    },
  });
  label.anchor.set(0.5, 0);
  label.position.set(0, 28);
  root.addChild(label);

  root.on('pointertap', (e: FederatedPointerEvent) => {
    e.stopPropagation();
    onSelect(place.id);
  });
  return root;
}

/** Calamity: chart sketch sprite + rank badge + name. */
function makeCalamityMarker(
  place: MapPlace,
  texture: Texture,
  onSelect: (id: string) => void
): Container {
  const root = new Container();
  root.eventMode = 'static';
  root.cursor = 'pointer';
  root.position.set(place.x, place.y);

  const glow = new Graphics();
  glow.circle(0, 0, 78);
  glow.fill({ color: hexToNum(place.color), alpha: 0.18 });
  root.addChild(glow);

  const sprite = new Sprite(texture);
  sprite.anchor.set(0.5, 0.55);
  sprite.width = 180;
  sprite.height = 180;
  // Tag for camera counter-scale (keep calamity art readable).
  (root as Container & { __calamity?: boolean }).__calamity = true;
  root.addChild(sprite);

  if (place.rank) {
    const badge = new Graphics();
    badge.roundRect(-18, -98, 36, 22, 6);
    badge.fill({ color: 0x0b0d12, alpha: 0.88 });
    badge.stroke({ width: 1.5, color: hexToNum(place.color) });
    root.addChild(badge);

    const rank = new Text({
      text: place.rank,
      style: {
        fontFamily: 'ui-monospace, monospace',
        fontSize: 13,
        fontWeight: '800',
        fill: 0xfff6e8,
      },
    });
    rank.anchor.set(0.5);
    rank.position.set(0, -87);
    root.addChild(rank);
  }

  const label = new Text({
    text: place.name,
    style: {
      fontFamily: 'Georgia, "Times New Roman", serif',
      fontSize: 14,
      fontWeight: '700',
      fill: 0xf4f0e4,
      stroke: { color: 0x0b0d12, width: 4 },
    },
  });
  label.anchor.set(0.5, 0);
  label.position.set(0, 72);
  root.addChild(label);

  root.on('pointertap', (e: FederatedPointerEvent) => {
    e.stopPropagation();
    onSelect(place.id);
  });
  return root;
}

export async function createVectorMap(
  host: HTMLElement,
  opts: {
    known: MapPlace[];
    dark: MapPlace[];
    onSelect: (id: string) => void;
  }
): Promise<VectorMapHandle> {
  const app = new Application();
  await app.init({
    resizeTo: host,
    antialias: true,
    background: 0xc4a574,
    resolution: Math.min(2, window.devicePixelRatio || 1),
    autoDensity: true,
  });
  host.appendChild(app.canvas);

  const world = new Container();
  app.stage.addChild(world);

  // —— Terrain traced from official-world-map.webp ——
  const parchment = new Graphics();
  parchment.rect(0, 0, MAP_WIDTH, MAP_HEIGHT);
  parchment.fill({ color: 0xc4a574 });

  const lake = new Graphics();
  drawRing(lake, lakeMobius);
  lake.fill({ color: 0x3a7a86 });
  lake.stroke({ width: 4, color: 0x2a5f6a, join: 'round' });

  const lakeRim = new Graphics();
  drawRing(lakeRim, lakeMobius);
  lakeRim.stroke({ width: 2, color: 0x7ec8d4, alpha: 0.55, join: 'round' });

  const lands = new Graphics();
  for (const poly of knownLands) paintPoly(lands, poly);
  for (const poly of newContinentLands) paintPoly(lands, poly);

  // Soft coast glow for known lands
  const landGlow = new Graphics();
  for (const poly of knownLands) {
    drawRing(landGlow, poly.ring);
    landGlow.stroke({ width: 6, color: 0xa8c66c, alpha: 0.35, join: 'round' });
  }

  const kwFrame = new Graphics();
  dashedRect(kwFrame, { ...knownWorldBox }, 0xf4f0e4);

  const labelLayer = new Container();
  const labelNodes: { text: Text; darkOnly?: boolean }[] = [];
  for (const item of mapLabels) {
    const t = new Text({
      text: item.text,
      style: {
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: item.size,
        fontWeight: '700',
        fill: item.color,
        letterSpacing: 1.5,
      },
    });
    t.anchor.set(0.5);
    t.position.set(item.x, item.y);
    t.alpha = 'darkOnly' in item && item.darkOnly ? 0 : 0.95;
    labelLayer.addChild(t);
    labelNodes.push({ text: t, darkOnly: 'darkOnly' in item ? item.darkOnly : false });
  }

  world.addChild(parchment, lake, lakeRim, landGlow, lands, kwFrame, labelLayer);

  const knownMarkers = new Container();
  const darkMarkers = new Container();
  darkMarkers.visible = false;
  const markersById = new Map<string, Container>();

  for (const place of opts.known) {
    const m = makePinMarker(place, opts.onSelect);
    knownMarkers.addChild(m);
    markersById.set(place.id, m);
  }

  // Preload calamity chart sketches, then place large sprites.
  const iconUrls = opts.dark
    .map((p) => p.mapIcon)
    .filter((u): u is string => Boolean(u));
  const iconTextures = new Map<string, Texture>();
  await Promise.all(
    iconUrls.map(async (url) => {
      try {
        const tex = await Assets.load<Texture>(url);
        iconTextures.set(url, tex);
      } catch {
        /* fall back to pin */
      }
    })
  );

  for (const place of opts.dark) {
    const tex = place.mapIcon ? iconTextures.get(place.mapIcon) : undefined;
    const m =
      place.type === 'calamity' && tex
        ? makeCalamityMarker(place, tex, opts.onSelect)
        : makePinMarker(place, opts.onSelect);
    darkMarkers.addChild(m);
    markersById.set(place.id, m);
  }
  world.addChild(knownMarkers, darkMarkers);

  let darkMode = false;
  let cam: Cam = { scale: 1, x: 0, y: 0 };
  let minFitScale = 0.25;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;

  function focusRect(): MapRect {
    return darkMode
      ? { x: 0, y: 0, w: MAP_WIDTH, h: MAP_HEIGHT }
      : { ...MAP_CAMERA.knownFrame };
  }

  function applyCam() {
    const pad = darkMode ? MAP_CAMERA.trueBoundsPad : MAP_CAMERA.knownBoundsPad;
    cam = clampCamera(cam, focusRect(), app.screen.width, app.screen.height, pad);
    if (cam.scale < minFitScale) {
      const cx = (app.screen.width / 2 - cam.x) / Math.max(cam.scale, 0.0001);
      const cy = (app.screen.height / 2 - cam.y) / Math.max(cam.scale, 0.0001);
      cam.scale = minFitScale;
      cam.x = app.screen.width / 2 - cx * cam.scale;
      cam.y = app.screen.height / 2 - cy * cam.scale;
      cam = clampCamera(cam, focusRect(), app.screen.width, app.screen.height, pad);
    }
    world.scale.set(cam.scale);
    world.position.set(cam.x, cam.y);
    const pinScale = Math.min(1.35, Math.max(0.55, 1 / Math.sqrt(cam.scale)));
    const calScale = Math.min(1.15, Math.max(0.75, 0.9 / Math.sqrt(cam.scale)));
    for (const m of markersById.values()) {
      const isCal = Boolean((m as Container & { __calamity?: boolean }).__calamity);
      m.scale.set(isCal ? calScale : pinScale);
    }
  }

  function fitView() {
    const rect = focusRect();
    const padding = darkMode ? MAP_CAMERA.truePadding : MAP_CAMERA.knownPadding;
    const zoomIn = darkMode ? MAP_CAMERA.trueZoomIn : MAP_CAMERA.knownZoomIn;
    const next = fitCamera(rect, app.screen.width, app.screen.height, padding, zoomIn);
    minFitScale = next.scale * 0.98;
    cam = next;
    applyCam();
  }

  function setDarkMode(dark: boolean) {
    darkMode = dark;
    darkMarkers.visible = dark;
    kwFrame.alpha = dark ? 0.4 : 0.95;
    for (const node of labelNodes) {
      if (node.darkOnly) node.text.alpha = dark ? 0.95 : 0;
    }
    fitView();
  }

  function zoomBy(factor: number) {
    const mx = app.screen.width / 2;
    const my = app.screen.height / 2;
    const wx = (mx - cam.x) / cam.scale;
    const wy = (my - cam.y) / cam.scale;
    cam.scale = Math.min(MAP_CAMERA.maxScale, Math.max(minFitScale, cam.scale * factor));
    cam.x = mx - wx * cam.scale;
    cam.y = my - wy * cam.scale;
    applyCam();
  }

  function focusWorldPoint(x: number, y: number) {
    cam.x = app.screen.width / 2 - x * cam.scale;
    cam.y = app.screen.height / 2 - y * cam.scale;
    applyCam();
  }

  function setSelected(id: string | null) {
    for (const [mid, marker] of markersById) {
      marker.alpha = !id || mid === id ? 1 : 0.55;
      const isCal = Boolean((marker as Container & { __calamity?: boolean }).__calamity);
      const base = isCal
        ? Math.min(1.15, Math.max(0.75, 0.9 / Math.sqrt(cam.scale)))
        : Math.min(1.35, Math.max(0.55, 1 / Math.sqrt(cam.scale)));
      marker.scale.set((!id || mid === id ? 1.08 : 1) * base);
    }
  }

  app.stage.eventMode = 'static';
  app.stage.hitArea = app.screen;
  app.stage.on('pointerdown', (e) => {
    dragging = true;
    lastX = e.global.x;
    lastY = e.global.y;
  });
  app.stage.on('pointerup', () => {
    dragging = false;
  });
  app.stage.on('pointerupoutside', () => {
    dragging = false;
  });
  app.stage.on('pointermove', (e) => {
    if (!dragging) return;
    cam.x += e.global.x - lastX;
    cam.y += e.global.y - lastY;
    lastX = e.global.x;
    lastY = e.global.y;
    applyCam();
  });

  const onWheel = (ev: WheelEvent) => {
    ev.preventDefault();
    const factor = ev.deltaY > 0 ? 0.9 : 1.11;
    const mx = ev.offsetX;
    const my = ev.offsetY;
    const wx = (mx - cam.x) / cam.scale;
    const wy = (my - cam.y) / cam.scale;
    cam.scale = Math.min(MAP_CAMERA.maxScale, Math.max(minFitScale, cam.scale * factor));
    cam.x = mx - wx * cam.scale;
    cam.y = my - wy * cam.scale;
    applyCam();
  };
  app.canvas.addEventListener('wheel', onWheel, { passive: false });
  const onResize = () => fitView();
  window.addEventListener('resize', onResize);

  setDarkMode(false);

  return {
    app,
    setDarkMode,
    fitView,
    zoomBy,
    focusWorldPoint,
    setSelected,
    destroy: () => {
      window.removeEventListener('resize', onResize);
      app.canvas.removeEventListener('wheel', onWheel);
      app.destroy(true);
    },
  };
}
