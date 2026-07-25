import { useEffect, useRef, useState, type CSSProperties } from 'react';
import type { CharacterWithPortrait, NenTypeName } from '../data/characters';
import { nenTypeColors } from '../data/characters';
import '../styles/pages/characters.css';

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

type Props = {
  characters: CharacterWithPortrait[];
};

export default function CharacterDossiers({ characters }: Props) {
  const [filter, setFilter] = useState<'All' | NenTypeName>('All');
  const [activeId, setActiveId] = useState<string | null>(null);
  const [barsReady, setBarsReady] = useState(false);
  const lastFocus = useRef<HTMLElement | null>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  const active = characters.find((c) => c.id === activeId) ?? null;

  useEffect(() => {
    if (!active) {
      document.body.style.overflow = '';
      setBarsReady(false);
      return;
    }
    document.body.style.overflow = 'hidden';
    closeBtn.current?.focus();
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setBarsReady(true));
    });
    return () => cancelAnimationFrame(id);
  }, [active]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeId) {
        setActiveId(null);
        lastFocus.current?.focus();
      }
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [activeId]);

  const open = (id: string, el: HTMLElement) => {
    lastFocus.current = el;
    setBarsReady(false);
    setActiveId(id);
  };

  const close = () => {
    setActiveId(null);
    lastFocus.current?.focus();
  };

  return (
    <>
      <section className="page-head container">
        <span className="section-kicker">HUNTER ASSOCIATION ARCHIVE</span>
        <h1 className="section-title">
          Character <span className="accent">Dossiers</span>
        </h1>
        <p className="page-sub">
          Ten files from the archive. Filter by Nen type, then open a card to read the full dossier.
        </p>
        <div className="filters" role="group" aria-label="Filter characters by Nen type">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              className={`filter-btn${filter === f ? ' active' : ''}`}
              style={
                {
                  '--fc': f !== 'All' ? nenTypeColors[f] : 'var(--hxh-gold)',
                } as CSSProperties
              }
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      <section className="container">
        <div className="char-grid">
          {characters.map((c, i) => {
            const hidden = filter !== 'All' && c.nenType !== filter;
            return (
              <button
                key={c.id}
                type="button"
                className={`char-card card${hidden ? ' filtered-out' : ''}`}
                style={
                  {
                    '--cc': c.color,
                    '--cc2': c.color2,
                    '--i': i,
                  } as CSSProperties
                }
                aria-haspopup="dialog"
                onClick={(e) => open(c.id, e.currentTarget)}
              >
                <span className="char-aura" aria-hidden="true" />
                <span className="char-portrait" aria-hidden="true">
                  <span className="char-portrait-art">
                    <img src={c.portrait} alt="" width={200} height={240} loading="lazy" />
                  </span>
                  <span
                    className="char-badge"
                    dangerouslySetInnerHTML={{ __html: c.emblem }}
                  />
                </span>
                <span className="char-name">{c.name}</span>
                <span className="char-epithet">{c.epithet}</span>
                <span
                  className="char-nen"
                  style={{ '--nc': nenTypeColors[c.nenType] } as CSSProperties}
                >
                  {c.nenType}
                </span>
                <span className="char-open">OPEN FILE ▸</span>
              </button>
            );
          })}
        </div>
      </section>

      <div
        className="modal-backdrop"
        hidden={!active}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        {active && (
          <div
            className="modal card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-name"
            style={{ '--cc': active.color } as CSSProperties}
          >
            <button
              ref={closeBtn}
              type="button"
              className="modal-close"
              aria-label="Close dossier"
              onClick={close}
            >
              ✕
            </button>
            <div className="modal-head">
              <div className="modal-portrait" aria-hidden="true">
                <img src={active.portrait} alt="" width={200} height={240} />
              </div>
              <div>
                <div className="modal-nen">{active.nenType} · Nen type</div>
                <h2 id="modal-name">{active.name}</h2>
                <p className="modal-epithet">{active.epithet}</p>
              </div>
            </div>
            <blockquote className="modal-quote">“{active.quote}”</blockquote>
            <p className="modal-bio">{active.bio}</p>
            <div className="modal-cols">
              <div>
                <h3 className="modal-h3">Known Abilities</h3>
                <ul className="modal-abilities">
                  {active.abilities.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="modal-h3">Hunter Assessment</h3>
                <div className="stats">
                  {Object.entries(active.stats).map(([k, v]) => (
                    <div key={k}>
                      <div className="stat-label">
                        <span>{STAT_NAMES[k]}</span>
                        <span>{v}</span>
                      </div>
                      <div className="stat-track">
                        <div
                          className="stat-fill"
                          style={{ width: barsReady ? `${v}%` : '0%' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
