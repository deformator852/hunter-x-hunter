import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { LegendItem, MapPlace, PlaceType } from '../data/map';
import '../styles/pages/map.css';

type Props = {
  known: MapPlace[];
  dark: MapPlace[];
  legend: LegendItem[];
  calamities: MapPlace[];
};

const TYPE_LABELS: Record<PlaceType, string> = {
  city: 'City',
  island: 'Island',
  landmark: 'Landmark',
  conflict: 'Conflict zone',
  calamity: 'Calamity',
};

function MarkerIcon({ type, x, y, color }: { type: PlaceType; x: number; y: number; color: string }) {
  // Keep SVG translate on an outer <g>. CSS hover scale on .marker-icon must not
  // share that node — CSS transform overrides the SVG transform attribute and
  // makes icons jump to the origin.
  const offsetY = type === 'city' || type === 'landmark' ? 18 : 16;
  let icon: ReactNode;
  if (type === 'city') {
    icon = (
      <>
        <rect x="-8" y="-10" width="6" height="14" rx="1" fill={color} stroke="#0b0d12" strokeWidth="1.5" />
        <rect x="1" y="-14" width="7" height="18" rx="1" fill={color} stroke="#0b0d12" strokeWidth="1.5" />
        <rect x="-3" y="-4" width="5" height="8" rx="0.5" fill={color} stroke="#0b0d12" strokeWidth="1.2" />
      </>
    );
  } else if (type === 'landmark') {
    icon = (
      <>
        <path d="M-5 10 h10 l-2 -22 h-6 z" fill={color} stroke="#0b0d12" strokeWidth="1.5" />
        <path d="M0 -12 v-5" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </>
    );
  } else if (type === 'island') {
    icon = (
      <>
        <ellipse cx="0" cy="2" rx="11" ry="5" fill={color} stroke="#0b0d12" strokeWidth="1.5" />
        <path d="M-4 0 q4 -10 10 -2" fill="none" stroke="#0b0d12" strokeWidth="1.5" />
      </>
    );
  } else if (type === 'conflict') {
    icon = (
      <>
        <path d="M0 -12 L10 8 H-10 Z" fill={color} stroke="#0b0d12" strokeWidth="1.5" />
        <text y="5" textAnchor="middle" fontSize="10" fontWeight="700" fill="#0b0d12" fontFamily="sans-serif">
          !
        </text>
      </>
    );
  } else {
    icon = (
      <>
        <circle r="11" fill={color} stroke="#0b0d12" strokeWidth="2" />
        <path d="M-4 -2 L0 5 L4 -2" fill="none" stroke="#0b0d12" strokeWidth="2" strokeLinecap="round" />
      </>
    );
  }

  return (
    <g transform={`translate(${x} ${y - offsetY})`}>
      <g className="marker-icon">{icon}</g>
    </g>
  );
}

function isInteractiveTarget(target: EventTarget | null): boolean {
  const el = target as Element | null;
  if (!el || typeof el.closest !== 'function') return false;
  return Boolean(el.closest('.marker, .zoom-controls, button, a'));
}

function MarkerGroup({
  place,
  active,
  tabIndex,
  onSelect,
}: {
  place: MapPlace;
  active: boolean;
  tabIndex: number;
  onSelect: (id: string) => void;
}) {
  return (
    <g
      className={`marker${active ? ' active' : ''}`}
      data-place={place.id}
      data-type={place.type}
      tabIndex={tabIndex}
      role="button"
      aria-label={place.name}
      style={{ ['--mc' as string]: place.color }}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        onSelect(place.id);
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(place.id);
        }
      }}
    >
      <circle cx={place.x} cy={place.y} r="18" className="marker-halo" />
      <circle cx={place.x} cy={place.y} r="16" fill="#0b0d12" opacity="0.35" />
      <MarkerIcon type={place.type} x={place.x} y={place.y} color={place.color} />
      {place.rank ? (
        <text x={place.x + 16} y={place.y - 18} className="rank-badge">
          {place.rank}
        </text>
      ) : null}
      <text
        x={place.x}
        y={place.y + (place.labelY ?? -42)}
        textAnchor="middle"
        className="marker-label"
      >
        {place.name}
      </text>
    </g>
  );
}

export default function WorldMap({ known, dark, legend, calamities }: Props) {
  const places = useMemo(() => [...known, ...dark], [known, dark]);

  const [darkMode, setDarkMode] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const [isPanning, setIsPanning] = useState(false);

  const viewportRef = useRef<HTMLDivElement>(null);
  const darkModeRef = useRef(darkMode);
  const scaleRef = useRef(scale);
  const txRef = useRef(tx);
  const tyRef = useRef(ty);
  const draggingRef = useRef(false);
  const lastRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    darkModeRef.current = darkMode;
  }, [darkMode]);
  useEffect(() => {
    scaleRef.current = scale;
  }, [scale]);
  useEffect(() => {
    txRef.current = tx;
  }, [tx]);
  useEffect(() => {
    tyRef.current = ty;
  }, [ty]);

  const selected = selectedId ? places.find((p) => p.id === selectedId) ?? null : null;

  const resetZoom = useCallback(() => {
    setScale(1);
    setTx(0);
    setTy(0);
    scaleRef.current = 1;
    txRef.current = 0;
    tyRef.current = 0;
  }, []);

  const clampZoom = (next: number) => Math.min(3.2, Math.max(1, next));

  const clearSelection = useCallback(() => {
    setSelectedId(null);
  }, []);

  const selectPlace = useCallback((id: string) => {
    if (!places.some((p) => p.id === id)) return;
    setSelectedId(id);
  }, [places]);

  const setView = useCallback(
    async (nextDark: boolean) => {
      if (nextDark === darkModeRef.current) return;
      if (nextDark) {
        setShowOverlay(true);
        await new Promise((r) => setTimeout(r, 700));
        setShowOverlay(false);
        resetZoom();
      }
      darkModeRef.current = nextDark;
      setDarkMode(nextDark);
      clearSelection();
    },
    [clearSelection, resetZoom]
  );

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const onPointerDown = (e: PointerEvent) => {
      if (darkModeRef.current) return;
      if (isInteractiveTarget(e.target)) return;
      draggingRef.current = true;
      lastRef.current = { x: e.clientX, y: e.clientY };
      setIsPanning(true);
      viewport.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!draggingRef.current || darkModeRef.current) return;
      const dx = e.clientX - lastRef.current.x;
      const dy = e.clientY - lastRef.current.y;
      lastRef.current = { x: e.clientX, y: e.clientY };
      const nextTx = txRef.current + dx;
      const nextTy = tyRef.current + dy;
      txRef.current = nextTx;
      tyRef.current = nextTy;
      setTx(nextTx);
      setTy(nextTy);
    };

    const endPan = () => {
      draggingRef.current = false;
      setIsPanning(false);
    };

    const onWheel = (e: WheelEvent) => {
      if (darkModeRef.current) return;
      e.preventDefault();
      const factor = e.deltaY > 0 ? 0.9 : 1.1;
      const next = clampZoom(scaleRef.current * factor);
      scaleRef.current = next;
      setScale(next);
      if (next === 1) {
        txRef.current = 0;
        tyRef.current = 0;
        setTx(0);
        setTy(0);
      }
    };

    viewport.addEventListener('pointerdown', onPointerDown);
    viewport.addEventListener('pointermove', onPointerMove);
    viewport.addEventListener('pointerup', endPan);
    viewport.addEventListener('pointercancel', endPan);
    viewport.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      viewport.removeEventListener('pointerdown', onPointerDown);
      viewport.removeEventListener('pointermove', onPointerMove);
      viewport.removeEventListener('pointerup', endPan);
      viewport.removeEventListener('pointercancel', endPan);
      viewport.removeEventListener('wheel', onWheel);
    };
  }, []);

  const zoomIn = () => {
    if (darkMode) return;
    const next = clampZoom(scale * 1.25);
    scaleRef.current = next;
    setScale(next);
  };

  const zoomOut = () => {
    if (darkMode) return;
    const next = clampZoom(scale / 1.25);
    scaleRef.current = next;
    setScale(next);
    if (next === 1) {
      txRef.current = 0;
      tyRef.current = 0;
      setTx(0);
      setTy(0);
    }
  };

  const typeLabel = selected
    ? selected.rank
      ? `${TYPE_LABELS[selected.type] || 'Location'} · Threat ${selected.rank}`
      : TYPE_LABELS[selected.type] || 'Location'
    : '';

  return (
    <>
      <section className="page-head container">
        <span className="section-kicker">CARTOGRAPHY DIVISION · CLEARANCE LEVEL ★★</span>
        <h1 className="section-title">
          The <span className="accent-g">World</span> — and What Lies <span className="accent">Beyond</span>
        </h1>
        <p className="page-sub">
          Click markers for field notes. Zoom the known world — then request clearance for the map civilians never see.
        </p>
        <div className="view-toggle" role="group" aria-label="Map view">
          <button
            className={`vt-btn${!darkMode ? ' active' : ''}`}
            type="button"
            onClick={() => void setView(false)}
          >
            Known World
          </button>
          <button
            className={`vt-btn vt-dark${darkMode ? ' active' : ''}`}
            type="button"
            onClick={() => void setView(true)}
          >
            ⚠ The True Map
          </button>
        </div>
      </section>

      <section className="container">
        <div className="map-frame card">
          <div className={`map-stage${darkMode ? ' dark-view' : ''}`}>
            <div
              className={`map-viewport${isPanning ? ' is-panning' : ''}`}
              ref={viewportRef}
            >
              <div
                className="map-transform"
                style={{ transform: `translate(${tx}px, ${ty}px) scale(${scale})` }}
              >
                <svg
                  viewBox="0 0 1000 700"
                  className={`world-map${darkMode ? ' dark-mode' : ''}`}
                  aria-label="Map of the Hunter x Hunter world"
                >
                  <defs>
                    <radialGradient id="sea" cx="48%" cy="40%" r="78%">
                      <stop offset="0%" stopColor="#1a4a6e" />
                      <stop offset="40%" stopColor="#123552" />
                      <stop offset="75%" stopColor="#0c2238" />
                      <stop offset="100%" stopColor="#07121f" />
                    </radialGradient>
                    <radialGradient id="depth-a" cx="30%" cy="55%" r="35%">
                      <stop offset="0%" stopColor="#0a1828" stopOpacity="0.55" />
                      <stop offset="100%" stopColor="#0a1828" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="depth-b" cx="72%" cy="62%" r="30%">
                      <stop offset="0%" stopColor="#061018" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#061018" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="dark-sea" cx="50%" cy="50%" r="62%">
                      <stop offset="0%" stopColor="#25436b" />
                      <stop offset="70%" stopColor="#122238" />
                      <stop offset="100%" stopColor="#070d17" />
                    </radialGradient>
                    <radialGradient id="calamity-glow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#e63946" stopOpacity="0.55" />
                      <stop offset="100%" stopColor="#e63946" stopOpacity="0" />
                    </radialGradient>
                    <linearGradient id="land-a" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3f8554" />
                      <stop offset="100%" stopColor="#255839" />
                    </linearGradient>
                    <linearGradient id="land-b" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4a9162" />
                      <stop offset="100%" stopColor="#2a5f40" />
                    </linearGradient>
                    <linearGradient id="arid" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#8a7a4a" />
                      <stop offset="100%" stopColor="#5c4e32" />
                    </linearGradient>
                    <linearGradient id="snow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#d8e4ef" />
                      <stop offset="100%" stopColor="#8fa6bc" />
                    </linearGradient>
                    <pattern id="forest-dots" width="18" height="18" patternUnits="userSpaceOnUse">
                      <circle cx="4" cy="5" r="2.2" fill="#1d4a2e" opacity="0.55" />
                      <circle cx="12" cy="12" r="1.8" fill="#1a4028" opacity="0.45" />
                    </pattern>
                    <pattern id="ocean-dots" width="46" height="46" patternUnits="userSpaceOnUse">
                      <circle cx="6" cy="8" r="1" fill="#3d6b96" opacity="0.35" />
                      <circle cx="30" cy="30" r="1" fill="#3d6b96" opacity="0.25" />
                    </pattern>
                    <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="4" result="b" />
                      <feMerge>
                        <feMergeNode in="b" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                    <filter id="fog-blur">
                      <feGaussianBlur stdDeviation="8" />
                    </filter>
                  </defs>

                  <rect x="0" y="0" width="1000" height="700" fill="url(#sea)" id="ocean" />
                  <rect x="0" y="0" width="1000" height="700" fill="url(#ocean-dots)" />
                  <rect x="0" y="0" width="1000" height="700" fill="url(#depth-a)" />
                  <rect x="0" y="0" width="1000" height="700" fill="url(#depth-b)" />

                  <g className="sea-waves" fill="none" stroke="#3d6b96" strokeOpacity="0.35" strokeWidth="1.5">
                    <path className="swave s1" d="M40 420 q60 -12 120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0 t120 0" />
                    <path className="swave s2" d="M20 480 q70 -14 140 0 t140 0 t140 0 t140 0 t140 0 t140 0" />
                    <path className="swave s3" d="M60 560 q55 -10 110 0 t110 0 t110 0 t110 0 t110 0 t110 0 t110 0" />
                  </g>

                  <g id="dark-layer" opacity="0">
                    <rect x="0" y="0" width="1000" height="700" fill="#070d17" />
                    <ellipse cx="500" cy="362" rx="336" ry="258" fill="url(#dark-sea)" />
                    <g fill="none" stroke="#2c4a72" opacity="0.5">
                      <ellipse className="ripple r1" cx="500" cy="362" rx="220" ry="168" strokeWidth="1.5" />
                      <ellipse className="ripple r2" cx="500" cy="362" rx="272" ry="208" strokeWidth="1.2" />
                      <ellipse className="ripple r3" cx="500" cy="362" rx="316" ry="242" strokeWidth="1" />
                    </g>
                    <path
                      d="M0,0 H1000 V700 H0 Z
                     M500,116 C 560,112 622,128 678,150 C 740,176 798,222 826,280 C 850,330 852,392 830,444
                     C 804,506 748,560 678,588 C 620,612 556,622 496,620 C 430,618 364,600 310,566
                     C 252,530 204,478 184,414 C 166,356 172,296 202,244 C 236,186 296,146 364,128
                     C 408,116 452,118 500,116 Z"
                      fill="#10160f"
                      fillRule="evenodd"
                    />
                    <path
                      d="M500,116 C 560,112 622,128 678,150 C 740,176 798,222 826,280 C 850,330 852,392 830,444
                     C 804,506 748,560 678,588 C 620,612 556,622 496,620 C 430,618 364,600 310,566
                     C 252,530 204,478 184,414 C 166,356 172,296 202,244 C 236,186 296,146 364,128
                     C 408,116 452,118 500,116 Z"
                      fill="none"
                      stroke="#2b3b26"
                      strokeWidth="4"
                      strokeDasharray="1 7"
                      strokeLinecap="round"
                    />
                    <g fill="#182114">
                      <path d="M120 90 l30 -44 26 34 22 -40 30 50 z" />
                      <path d="M700 60 l26 -38 22 30 20 -34 28 44 z" />
                      <path d="M880 220 l24 -36 20 28 18 -30 26 40 z" />
                      <path d="M60 560 l28 -40 22 32 20 -36 28 46 z" />
                      <path d="M830 580 l26 -38 22 30 18 -32 28 42 z" />
                    </g>
                    <g fill="#1d2818" opacity="0.9">
                      <circle cx="180" cy="180" r="34" />
                      <circle cx="146" cy="200" r="26" />
                      <circle cx="216" cy="204" r="24" />
                      <circle cx="820" cy="160" r="30" />
                      <circle cx="860" cy="184" r="24" />
                      <circle cx="920" cy="480" r="34" />
                      <circle cx="884" cy="510" r="26" />
                      <circle cx="150" cy="640" r="30" />
                      <circle cx="200" cy="660" r="24" />
                      <circle cx="640" cy="656" r="28" />
                      <circle cx="380" cy="662" r="26" />
                    </g>
                    <g className="dc-fog" filter="url(#fog-blur)" opacity="0.35">
                      <ellipse cx="220" cy="200" rx="120" ry="50" fill="#2a1a1a" />
                      <ellipse cx="780" cy="180" rx="140" ry="55" fill="#2a1a1a" />
                      <ellipse cx="500" cy="600" rx="180" ry="40" fill="#1a2220" />
                    </g>
                    <g className="calamity-glows">
                      <circle cx="240" cy="120" r="60" fill="url(#calamity-glow)" className="cal-glow" />
                      <circle cx="762" cy="118" r="60" fill="url(#calamity-glow)" className="cal-glow" style={{ animationDelay: '-1s' }} />
                      <circle cx="872" cy="400" r="60" fill="url(#calamity-glow)" className="cal-glow" style={{ animationDelay: '-2s' }} />
                      <circle cx="126" cy="420" r="60" fill="url(#calamity-glow)" className="cal-glow" style={{ animationDelay: '-3s' }} />
                      <circle cx="500" cy="628" r="60" fill="url(#calamity-glow)" className="cal-glow" style={{ animationDelay: '-1.5s' }} />
                    </g>
                    <g transform="translate(500 208)">
                      <path d="M-26 26 v-30 a26 26 0 0 1 52 0 v30 z" fill="#151d2c" stroke="#f4c95d" strokeWidth="2.5" />
                      <path d="M0 26 v-52 M-13 26 v-40 M13 26 v-40" stroke="#f4c95d" strokeWidth="1.2" opacity="0.6" />
                    </g>
                    <text x="500" y="76" textAnchor="middle" className="map-title dark-title">
                      THE DARK CONTINENT
                    </text>
                    <text x="500" y="100" textAnchor="middle" className="sealed-label">
                      ◆ SEALED · V5 EYES ONLY ◆
                    </text>
                    <text x="500" y="556" textAnchor="middle" className="map-sub">
                      LAKE MOBIUS
                    </text>
                    <text x="500" y="578" textAnchor="middle" className="map-sub-small">
                      — the &quot;ocean&quot; of the known world —
                    </text>
                  </g>

                  <g id="known-world">
                    <g id="kw-grid" fill="none" stroke="#2f5b85" strokeWidth="1" opacity="0.28">
                      <path d="M500 20 C 200 20 60 180 60 350 C 60 520 200 680 500 680 C 800 680 940 520 940 350 C 940 180 800 20 500 20 Z" />
                      <path d="M500 20 C 350 20 280 180 280 350 C 280 520 350 680 500 680 C 650 680 720 520 720 350 C 720 180 650 20 500 20 Z" />
                      <path d="M500 20 V 680" />
                      <path d="M64 350 H 936" />
                    </g>

                    <g id="kw-routes" fill="none" stroke="#7fb3d9" strokeWidth="2" opacity="0.45" strokeLinecap="round">
                      <path className="route" d="M618 470 C 640 420 660 350 700 280" strokeDasharray="4 9" />
                      <path className="route" d="M618 470 C 560 460 480 420 448 360" strokeDasharray="4 9" style={{ animationDelay: '-2s' }} />
                      <path className="route" d="M540 555 C 460 560 340 560 270 550" strokeDasharray="4 9" style={{ animationDelay: '-4s' }} />
                    </g>

                    <g id="kw-land">
                      <path
                        d="M118,212 C 128,178 162,152 204,148 C 238,144 268,132 304,138 C 342,144 368,164 396,172
                           C 428,180 452,196 462,226 C 472,254 460,278 472,304 C 484,330 502,348 496,378
                           C 490,408 462,428 428,430 C 400,432 380,452 348,452 C 310,452 282,432 246,426
                           C 210,420 182,396 166,364 C 150,332 122,318 112,286 C 104,258 110,236 118,212 Z"
                        fill="url(#land-a)"
                        stroke="#57a06c"
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M180,230 C 200,200 260,184 310,194 C 360,204 408,224 420,258 C 430,288 414,318 380,330
                           C 340,344 280,340 240,320 C 200,300 168,264 180,230 Z"
                        fill="url(#forest-dots)"
                        opacity="0.85"
                      />
                      <path d="M200,250 C 230,235 270,240 290,265 C 270,280 230,278 200,250 Z" fill="url(#arid)" opacity="0.45" />

                      <path
                        d="M612,148 C 640,124 686,112 728,120 C 768,128 806,144 836,172 C 868,202 886,242 878,282
                           C 870,318 844,342 838,378 C 832,412 806,436 770,440 C 736,444 706,428 682,404
                           C 658,380 652,348 644,318 C 636,288 610,268 606,236 C 602,204 594,168 612,148 Z"
                        fill="url(#land-b)"
                        stroke="#57a06c"
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M660,180 C 690,158 740,152 780,168 C 820,184 844,214 840,250 C 836,282 810,300 776,302
                           C 738,304 700,290 680,262 C 662,236 646,204 660,180 Z"
                        fill="url(#forest-dots)"
                        opacity="0.7"
                      />

                      <path
                        d="M146,466 C 168,438 214,428 256,436 C 296,444 330,462 342,494 C 354,526 340,560 308,580
                           C 276,600 228,604 192,590 C 158,576 132,548 128,516 C 126,496 132,480 146,466 Z"
                        fill="url(#land-a)"
                        stroke="#57a06c"
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                      />
                      <path d="M180,500 C 220,490 260,505 280,535 C 250,545 200,540 180,500 Z" fill="url(#forest-dots)" opacity="0.65" />

                      <path
                        d="M428,516 C 452,496 496,490 534,500 C 570,510 594,532 590,562 C 586,590 556,608 518,610
                           C 482,612 446,600 430,574 C 418,554 414,532 428,516 Z"
                        fill="url(#land-b)"
                        stroke="#57a06c"
                        strokeWidth="2.5"
                        strokeLinejoin="round"
                      />

                      <path d="M900,416 c 26,-10 54,4 52,28 c -2,22 -32,32 -52,20 c -18,-11 -20,-40 0,-48 Z" fill="url(#land-a)" stroke="#57a06c" strokeWidth="2" />
                      <circle cx="932" cy="500" r="9" fill="url(#land-a)" stroke="#57a06c" strokeWidth="2" />
                      <path
                        d="M596,470 c 4,-14 20,-22 34,-18 c 10,3 16,10 18,18 c 6,-6 14,-8 20,-4 c -4,6 -10,8 -12,14
                           c -4,10 -16,16 -30,14 c -16,-2 -32,-10 -30,-24 z"
                        fill="url(#land-b)"
                        stroke="#57a06c"
                        strokeWidth="2"
                      />
                      <circle cx="540" cy="555" r="15" fill="url(#land-b)" stroke="#57a06c" strokeWidth="2" />

                      <path d="M448 355 l14 -26 14 26 z" fill="url(#snow)" stroke="#c5d4e2" strokeWidth="1.5" />
                      <path d="M455 340 l7 -12 7 12 z" fill="#eef4f8" />

                      <g stroke="#2c6841" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.9">
                        <path d="M200 250 l10 -16 10 16 M225 244 l9 -14 9 14 M250 252 l10 -16 10 16" />
                        <path d="M700 200 l10 -16 10 16 M726 194 l9 -14 9 14" />
                      </g>
                      <g fill="#1f4a30" opacity="0.9">
                        <circle cx="330" cy="390" r="9" />
                        <circle cx="348" cy="398" r="7" />
                        <circle cx="316" cy="400" r="6" />
                        <circle cx="770" cy="380" r="9" />
                        <circle cx="788" cy="390" r="6" />
                        <circle cx="250" cy="540" r="8" />
                        <circle cx="268" cy="550" r="6" />
                      </g>
                      <g stroke="#3d8fb5" strokeWidth="2" fill="none" opacity="0.8" strokeLinecap="round">
                        <path d="M300 200 C 310 240 290 280 310 320 C 320 340 340 360 336 390" />
                        <path d="M760 220 C 750 260 770 300 750 340 C 742 356 730 372 732 392" />
                      </g>
                    </g>

                    <g id="kw-labels">
                      <text x="290" y="285" className="land-label">
                        AZIAN CONTINENT
                      </text>
                      <text x="745" y="278" className="land-label">
                        YORBIAN CONTINENT
                      </text>
                      <text x="220" y="495" className="land-label label-s">
                        MITENE
                      </text>
                      <text x="220" y="510" className="land-label label-s">
                        UNION
                      </text>
                      <text x="510" y="595" className="land-label label-s">
                        BEGEROSSÉ
                      </text>
                      <text x="924" y="392" className="land-label label-s">
                        OCHIMA
                      </text>
                      <text x="500" y="660" className="sea-label">
                        — T H E &nbsp; G R E A T &nbsp; S E A —
                      </text>
                    </g>

                    <g id="sea-monster" opacity="0.7">
                      <path d="M820 590 q14 -26 34 -8 q-16 2 -20 14 z" fill="#2f5b85" />
                      <path d="M866 596 q10 -18 26 -6 q-12 2 -15 11 z" fill="#2f5b85" />
                      <path d="M900 600 q8 -14 20 -5 q-9 2 -11 9 z" fill="#2f5b85" />
                    </g>

                    <g id="compass" transform="translate(90 96)">
                      <circle r="34" fill="#0d2036" stroke="#3d6b96" strokeWidth="1.5" />
                      <circle r="26" fill="none" stroke="#3d6b96" strokeWidth="0.8" opacity="0.7" />
                      <g id="compass-needle">
                        <path d="M0 -28 L7 0 L0 6 L-7 0 Z" fill="#e63946" />
                        <path d="M0 28 L7 0 L0 -6 L-7 0 Z" fill="#cfd8e6" />
                      </g>
                      <text y="-38" textAnchor="middle" className="compass-letter">
                        N
                      </text>
                      <text y="50" textAnchor="middle" className="compass-letter">
                        S
                      </text>
                      <text x="44" y="5" textAnchor="middle" className="compass-letter">
                        E
                      </text>
                      <text x="-44" y="5" textAnchor="middle" className="compass-letter">
                        W
                      </text>
                    </g>

                    <g id="cartouche" transform="translate(1000 700)">
                      <rect x="-296" y="-76" width="272" height="58" rx="6" fill="#0d2036" stroke="#3d6b96" strokeWidth="1.5" opacity="0.92" />
                      <text x="-160" y="-52" textAnchor="middle" className="cartouche-title">
                        HUNTER ASSOCIATION
                      </text>
                      <text x="-160" y="-32" textAnchor="middle" className="cartouche-sub">
                        OFFICIAL SURVEY · V5 APPROVED EDITION
                      </text>
                    </g>

                    <g id="kw-markers">
                      {known.map((p) => (
                        <MarkerGroup
                          key={p.id}
                          place={p}
                          active={selectedId === p.id}
                          tabIndex={darkMode ? -1 : 0}
                          onSelect={selectPlace}
                        />
                      ))}
                    </g>
                  </g>

                  <g id="dc-markers" opacity="0">
                    {dark.map((p) => (
                      <MarkerGroup
                        key={p.id}
                        place={p}
                        active={selectedId === p.id}
                        tabIndex={darkMode ? 0 : -1}
                        onSelect={selectPlace}
                      />
                    ))}
                  </g>

                  <rect x="0" y="0" width="1000" height="700" fill="none" stroke="#05080e" strokeWidth="26" opacity="0.55" />
                  <rect x="10" y="10" width="980" height="680" fill="none" stroke="#3d6b96" strokeWidth="1.5" opacity="0.5" />
                </svg>
              </div>
            </div>

            <div className="zoom-controls" aria-label="Zoom controls">
              <button type="button" title="Zoom in" onClick={zoomIn}>
                +
              </button>
              <button type="button" title="Zoom out" onClick={zoomOut}>
                −
              </button>
              <button type="button" title="Fit map" onClick={() => { if (!darkMode) resetZoom(); }}>
                ⌂
              </button>
            </div>

            {showOverlay ? (
              <div className="classified-overlay" aria-hidden="true">
                <div className="classified-stamp">CLASSIFIED</div>
                <p>Clearance ★★ — Dark Continent survey</p>
              </div>
            ) : null}
          </div>

          <aside className="map-info">
            {!selected ? (
              <div className="mi-empty">
                <p>▸ Select a marker on the map to read the Association&apos;s field notes.</p>
              </div>
            ) : (
              <div className="mi-detail" style={{ ['--mi-color' as string]: selected.color }}>
                {selected.image ? (
                  <div className="mi-img-wrap">
                    <img src={selected.image} alt={selected.name} width={400} height={220} />
                  </div>
                ) : null}
                <div className="mi-type">{typeLabel}</div>
                <h3>{selected.name}</h3>
                <p>{selected.text}</p>
              </div>
            )}
          </aside>
        </div>

        <div className="map-legend card" aria-label="Map legend">
          {legend.map((l) => (
            <div className="legend-item" key={l.id}>
              <span className="legend-swatch" style={{ ['--lc' as string]: l.color }} data-type={l.id} />
              <span>{l.label}</span>
            </div>
          ))}
        </div>

        {darkMode ? (
          <div className="calamities card">
            <h2 className="cal-title">Five Calamities</h2>
            <p className="cal-sub">Threat ranks from Association field reports. Click a row to focus the marker.</p>
            <ul className="cal-list">
              {calamities.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    className="cal-row"
                    style={{ ['--mc' as string]: c.color }}
                    onClick={() => {
                      selectPlace(c.id);
                      document
                        .querySelector(`.marker[data-place="${c.id}"]`)
                        ?.scrollIntoView({ block: 'nearest', inline: 'nearest' });
                    }}
                  >
                    <span className="cal-rank">{c.rank}</span>
                    <span className="cal-name">{c.name}</span>
                    <span className="cal-snip">{c.text}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {darkMode ? (
          <p className="map-footnote">
            The &quot;world map&quot; every civilian knows is the small green smudge in the middle. Lake Mobius —
            what they call &quot;the ocean&quot; — is a lake. The land beyond has returned 149 expeditions as
            corpses, madmen, or not at all. The Hunter Association keeps the door anyway.
          </p>
        ) : null}
      </section>
    </>
  );
}
