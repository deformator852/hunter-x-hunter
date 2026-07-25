import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import {
  HEX_ORDER,
  HEX_PCT_BY_DISTANCE,
  principles,
  quiz,
  nenTypes,
  type FaceLink,
  type NenType,
} from '../data/nen';
import '../styles/pages/nen.css';

type Props = {
  faces: Record<string, FaceLink[]>;
  charactersHref: string;
};

export default function NenGuide({ faces, charactersHref }: Props) {
  const [principleId, setPrincipleId] = useState(principles[0].id);
  const principle = principles.find((p) => p.id === principleId) ?? principles[0];

  const [selectedType, setSelectedType] = useState<string | null>(null);

  const [step, setStep] = useState(0);
  const [tally, setTally] = useState<Record<string, number>>({});
  const [result, setResult] = useState<NenType | null>(null);
  const [glassFx, setGlassFx] = useState('');

  const pctMap = useMemo(() => {
    if (!selectedType) return null;
    const idx = HEX_ORDER.indexOf(selectedType as (typeof HEX_ORDER)[number]);
    if (idx < 0) return null;
    const map: Record<string, string> = {};
    HEX_ORDER.forEach((id, nIdx) => {
      const dist = Math.min(Math.abs(nIdx - idx), 6 - Math.abs(nIdx - idx));
      map[id] = `${HEX_PCT_BY_DISTANCE[dist]}%`;
    });
    return map;
  }, [selectedType]);

  useEffect(() => {
    if (!result) {
      setGlassFx('');
      return;
    }
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setGlassFx(`fx-${result.id}`));
    });
    return () => cancelAnimationFrame(id);
  }, [result]);

  const answer = (t: string) => {
    const next = { ...tally, [t]: (tally[t] || 0) + 1 };
    const nextStep = step + 1;
    if (nextStep < quiz.length) {
      setTally(next);
      setStep(nextStep);
      return;
    }
    setTally(next);
    setStep(nextStep);
    const winnerId = Object.entries(next).sort((a, b) => b[1] - a[1])[0][0];
    const type = nenTypes.find((x) => x.id === winnerId)!;
    setResult(type);
  };

  const retry = () => {
    setStep(0);
    setTally({});
    setResult(null);
    setGlassFx('');
  };

  const progress = result ? 100 : (step / quiz.length) * 100;
  const question = quiz[Math.min(step, quiz.length - 1)];

  return (
    <>
      <section className="page-head container">
        <span className="section-kicker">FORBIDDEN CURRICULUM · FLOOR 200 AND ABOVE</span>
        <h1 className="section-title">
          <span className="accent-g">Nen</span> — The Power of Life Energy
        </h1>
        <p className="page-sub">
          Every living body leaks a life energy called <strong>aura</strong>. Nen is the discipline of
          controlling it — the secret that separates floor 199 of Heavens Arena from floor 200.
        </p>
      </section>

      <section className="section container">
        <span className="section-kicker reveal">LESSON ONE</span>
        <h2 className="section-title reveal">
          The Four <span className="accent">Principles</span>
        </h2>
        <div className="principles card reveal">
          <div className="aura-stage" aria-hidden="true">
            <svg
              viewBox="0 0 200 260"
              className="aura-figure"
              data-state={principleId}
              style={{ '--aura-color': principle.color } as CSSProperties}
            >
              <g className="aura-layer aura-outer">
                <ellipse cx="100" cy="140" rx="78" ry="112" fill="var(--aura-color, #4fbf67)" opacity="0.10" />
              </g>
              <g className="aura-layer aura-mid">
                <ellipse cx="100" cy="140" rx="60" ry="94" fill="var(--aura-color, #4fbf67)" opacity="0.16" />
              </g>
              <g className="aura-layer aura-inner">
                <ellipse cx="100" cy="140" rx="44" ry="78" fill="var(--aura-color, #4fbf67)" opacity="0.22" />
              </g>
              <g className="hatsu-beam">
                <path d="M100 96 L172 40 l-8 22 26 -6 -34 34z" fill="var(--aura-color, #f4c95d)" opacity="0.85" />
              </g>
              <g fill="#0e1118" stroke="#39415a" strokeWidth="2.5">
                <circle cx="100" cy="66" r="20" />
                <path d="M100 88 c-24 0 -34 18 -36 42 l-6 52 h16 l6 -38 4 96 h14 l2 -60 2 60 h14 l4 -96 6 38 h16 l-6 -52 c-2 -24 -12 -42 -36 -42z" />
              </g>
            </svg>
          </div>
          <div className="principles-panel">
            <div className="principle-tabs" role="tablist" aria-label="Nen principles">
              {principles.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  className={`p-tab${principleId === p.id ? ' active' : ''}`}
                  role="tab"
                  aria-selected={principleId === p.id}
                  style={{ '--pc': p.color } as CSSProperties}
                  onClick={() => setPrincipleId(p.id)}
                >
                  {p.name}
                </button>
              ))}
            </div>
            <div className="p-body active">
              <div className="p-jp" style={{ color: principle.color }}>
                {principle.jp}
              </div>
              <p>{principle.desc}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section container">
        <span className="section-kicker reveal">LESSON TWO</span>
        <h2 className="section-title reveal">
          The Six <span className="accent-g">Aura Types</span>
        </h2>
        <p className="page-sub reveal">
          Everyone is born leaning toward one of six categories — drawn exactly as Wing drew it. Click a
          type: your training efficiency in the others depends on how close they sit on the chart
          (<strong>100%</strong> yours · <strong>80%</strong> adjacent · <strong>60%</strong> next ·
          <strong>40%</strong> across).
        </p>
        <div className="hex-wrap card reveal">
          <svg viewBox="0 0 400 400" className="hex-chart" role="group" aria-label="Nen type chart">
            <polygon
              points="200,42 338,122 338,278 200,358 62,278 62,122"
              fill="none"
              stroke="var(--line)"
              strokeWidth="2"
            />
            {nenTypes.map((t) => (
              <line
                key={`spoke-${t.id}`}
                x1="200"
                y1="200"
                x2={t.x}
                y2={t.y}
                stroke="var(--line)"
                strokeWidth="1"
                strokeDasharray="3 5"
              />
            ))}
            <circle cx="200" cy="200" r="4" fill="var(--text-dim)" />
            {nenTypes.map((t) => (
              <g
                key={t.id}
                className={`hex-node${selectedType === t.id ? ' selected' : ''}`}
                tabIndex={0}
                role="button"
                aria-label={`${t.name} Nen type`}
                style={{ '--tc': t.color } as CSSProperties}
                onClick={() => setSelectedType(t.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedType(t.id);
                  }
                }}
              >
                <circle cx={t.x} cy={t.y} r="30" className="hex-dot" />
                <circle cx={t.x} cy={t.y} r="30" className="hex-ring" />
                <text x={t.x} y={t.y + 1} textAnchor="middle" className="hex-pct">
                  {pctMap ? pctMap[t.id] : '·'}
                </text>
                <text
                  x={t.x}
                  y={t.y + (t.y < 200 ? -42 : 54)}
                  textAnchor="middle"
                  className="hex-label"
                >
                  {t.name}
                </text>
              </g>
            ))}
          </svg>
          <div className="hex-info">
            {!selectedType && (
              <p className="hex-hint">☝ Click any of the six types on the chart to open its file.</p>
            )}
            {nenTypes.map((t) => {
              if (selectedType !== t.id) return null;
              const typeFaces = faces[t.id] || [];
              return (
                <div key={t.id} className="hex-detail">
                  <h3 style={{ color: t.color }}>{t.name}</h3>
                  <p className="hex-desc">{t.desc}</p>
                  <div className="hex-meta">
                    <div>
                      <span className="hex-meta-k">Water test</span>
                      {t.water}
                    </div>
                    <div>
                      <span className="hex-meta-k">Personality</span>
                      {t.personality}
                    </div>
                    <div>
                      <span className="hex-meta-k">Known users</span>
                      {t.users}
                    </div>
                  </div>
                  {typeFaces.length > 0 && (
                    <div className="hex-faces">
                      {typeFaces.map((f) => (
                        <a
                          key={f.id}
                          className="hex-face"
                          href={charactersHref}
                          style={{ '--fc': f.color } as CSSProperties}
                          title={`${f.name} — see dossier`}
                        >
                          <span className="hex-face-art">
                            <img src={f.portrait} alt={f.name} width={80} height={80} loading="lazy" />
                          </span>
                          <span className="hex-face-name">{f.name}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section container">
        <span className="section-kicker reveal">LESSON THREE</span>
        <h2 className="section-title reveal">
          Water <span className="accent">Divination</span>
        </h2>
        <p className="page-sub reveal">
          A glass of water, a floating leaf, and your Ren. Answer six questions the way Hisoka would
          profile you — then watch what your aura does to the glass.
        </p>

        <div className="divination card reveal">
          {!result && (
            <div className="quiz">
              <div className="quiz-progress">
                <div className="quiz-bar" style={{ width: `${progress}%` }} />
              </div>
              <div>
                <p className="q-text">
                  {step + 1} / {quiz.length} — {question.q}
                </p>
                <div className="q-answers">
                  {question.a.map((a, i) => (
                    <button
                      key={`${step}-${a.t}-${i}`}
                      type="button"
                      className="q-answer"
                      style={{ animationDelay: `${i * 0.07}s` }}
                      onClick={() => answer(a.t)}
                    >
                      {a.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {result && (
            <div className="result">
              <div className="glass-stage">
                <svg viewBox="0 0 220 260" className={`glass-svg ${glassFx}`} aria-hidden="true">
                  <defs>
                    <clipPath id="glass-clip">
                      <path d="M60 40 L74 220 a12 12 0 0 0 12 10 h48 a12 12 0 0 0 12 -10 L160 40 Z" />
                    </clipPath>
                  </defs>
                  <rect x="20" y="230" width="180" height="8" rx="4" fill="#2a3040" />
                  <g clipPath="url(#glass-clip)">
                    <rect id="water" x="50" y="120" width="120" height="120" fill="#58b3e0" opacity="0.5" />
                    <g id="impurities" opacity="0">
                      <circle cx="95" cy="150" r="3" fill="#cbd2e0" />
                      <circle cx="120" cy="175" r="4" fill="#cbd2e0" />
                      <circle cx="105" cy="195" r="2.5" fill="#cbd2e0" />
                      <circle cx="130" cy="150" r="2.5" fill="#cbd2e0" />
                      <circle cx="88" cy="182" r="3.5" fill="#cbd2e0" />
                    </g>
                  </g>
                  <g id="overflow" opacity="0">
                    <path d="M62 46 q-4 18 -8 26" stroke="#58b3e0" strokeWidth="4" fill="none" strokeLinecap="round" />
                    <path d="M158 46 q4 18 8 26" stroke="#58b3e0" strokeWidth="4" fill="none" strokeLinecap="round" />
                  </g>
                  <path
                    d="M60 40 L74 220 a12 12 0 0 0 12 10 h48 a12 12 0 0 0 12 -10 L160 40 Z"
                    fill="rgba(255,255,255,0.05)"
                    stroke="#8b94a8"
                    strokeWidth="3"
                  />
                  <g id="leaf">
                    <ellipse cx="110" cy="120" rx="16" ry="6" fill="#4fbf67" />
                    <path d="M96 120 h28" stroke="#2e7d43" strokeWidth="1.5" />
                  </g>
                  <g id="sparkles" opacity="0" fill="#f4c95d">
                    <path d="M70 80 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3z" />
                    <path d="M150 70 l2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5z" />
                    <path d="M135 100 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" />
                  </g>
                  <g fill="none" stroke="#39415a" strokeWidth="3" opacity="0.9">
                    <path d="M14 150 q20 -8 34 4 M14 168 q20 -6 32 4" strokeLinecap="round" />
                    <path d="M206 150 q-20 -8 -34 4 M206 168 q-20 -6 -32 4" strokeLinecap="round" />
                  </g>
                </svg>
              </div>
              <div className="result-copy">
                <div className="result-kicker">YOUR AURA TYPE</div>
                <h3 className="result-name" style={{ color: result.color }}>
                  {result.name}
                </h3>
                <p className="result-water">💧 {result.water}</p>
                <p className="result-desc">{result.desc}</p>
                <p className="result-users">You share a type with: {result.users}</p>
                <button type="button" className="btn btn-ghost" onClick={retry}>
                  Divine Again
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
