<script setup lang="ts">
import { computed, ref, watch } from 'vue';
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

defineProps<{
  faces: Record<string, FaceLink[]>;
  charactersHref: string;
}>();

const principleId = ref(principles[0].id);
const principle = computed(() => principles.find((p) => p.id === principleId.value) ?? principles[0]);

const selectedType = ref<string | null>(null);

const step = ref(0);
const tally = ref<Record<string, number>>({});
const result = ref<NenType | null>(null);
const glassFx = ref('');

const pctMap = computed(() => {
  if (!selectedType.value) return null;
  const idx = HEX_ORDER.indexOf(selectedType.value as (typeof HEX_ORDER)[number]);
  if (idx < 0) return null;
  const map: Record<string, string> = {};
  HEX_ORDER.forEach((id, nIdx) => {
    const dist = Math.min(Math.abs(nIdx - idx), 6 - Math.abs(nIdx - idx));
    map[id] = `${HEX_PCT_BY_DISTANCE[dist]}%`;
  });
  return map;
});

watch(result, (val) => {
  if (!val) {
    glassFx.value = '';
    return;
  }
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      glassFx.value = `fx-${val.id}`;
    });
  });
});

const progress = computed(() => (result.value ? 100 : (step.value / quiz.length) * 100));
const question = computed(() => quiz[Math.min(step.value, quiz.length - 1)]);

function answer(t: string) {
  const next = { ...tally.value, [t]: (tally.value[t] || 0) + 1 };
  const nextStep = step.value + 1;
  if (nextStep < quiz.length) {
    tally.value = next;
    step.value = nextStep;
    return;
  }
  tally.value = next;
  step.value = nextStep;
  const winnerId = Object.entries(next).sort((a, b) => b[1] - a[1])[0][0];
  result.value = nenTypes.find((x) => x.id === winnerId)!;
}

function retry() {
  step.value = 0;
  tally.value = {};
  result.value = null;
  glassFx.value = '';
}

function selectType(id: string) {
  selectedType.value = id;
}

function onHexKey(e: KeyboardEvent, id: string) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    selectType(id);
  }
}
</script>

<template>
  <section class="page-head container">
    <span class="section-kicker">FORBIDDEN CURRICULUM · FLOOR 200 AND ABOVE</span>
    <h1 class="section-title">
      <span class="accent-g">Nen</span> — The Power of Life Energy
    </h1>
    <p class="page-sub">
      Every living body leaks a life energy called <strong>aura</strong>. Nen is the discipline of
      controlling it — the secret that separates floor 199 of Heavens Arena from floor 200.
    </p>
  </section>

  <section class="section container">
    <span class="section-kicker reveal">LESSON ONE</span>
    <h2 class="section-title reveal">The Four <span class="accent">Principles</span></h2>
    <div class="principles card reveal">
      <div class="aura-stage" aria-hidden="true">
        <svg
          viewBox="0 0 200 260"
          class="aura-figure"
          :data-state="principleId"
          :style="{ '--aura-color': principle.color }"
        >
          <g class="aura-layer aura-outer">
            <ellipse cx="100" cy="140" rx="78" ry="112" fill="var(--aura-color, #4fbf67)" opacity="0.10" />
          </g>
          <g class="aura-layer aura-mid">
            <ellipse cx="100" cy="140" rx="60" ry="94" fill="var(--aura-color, #4fbf67)" opacity="0.16" />
          </g>
          <g class="aura-layer aura-inner">
            <ellipse cx="100" cy="140" rx="44" ry="78" fill="var(--aura-color, #4fbf67)" opacity="0.22" />
          </g>
          <g class="hatsu-beam">
            <path d="M100 96 L172 40 l-8 22 26 -6 -34 34z" fill="var(--aura-color, #f4c95d)" opacity="0.85" />
          </g>
          <g fill="#0e1118" stroke="#39415a" stroke-width="2.5">
            <circle cx="100" cy="66" r="20" />
            <path d="M100 88 c-24 0 -34 18 -36 42 l-6 52 h16 l6 -38 4 96 h14 l2 -60 2 60 h14 l4 -96 6 38 h16 l-6 -52 c-2 -24 -12 -42 -36 -42z" />
          </g>
        </svg>
      </div>
      <div class="principles-panel">
        <div class="principle-tabs" role="tablist" aria-label="Nen principles">
          <button
            v-for="p in principles"
            :key="p.id"
            type="button"
            class="p-tab"
            :class="{ active: principleId === p.id }"
            role="tab"
            :aria-selected="principleId === p.id"
            :style="{ '--pc': p.color }"
            @click="principleId = p.id"
          >
            {{ p.name }}
          </button>
        </div>
        <div class="p-body active">
          <div class="p-jp" :style="{ color: principle.color }">{{ principle.jp }}</div>
          <p>{{ principle.desc }}</p>
        </div>
      </div>
    </div>
  </section>

  <section class="section container">
    <span class="section-kicker reveal">LESSON TWO</span>
    <h2 class="section-title reveal">The Six <span class="accent-g">Aura Types</span></h2>
    <p class="page-sub reveal">
      Everyone is born leaning toward one of six categories — drawn exactly as Wing drew it. Click a
      type: your training efficiency in the others depends on how close they sit on the chart
      (<strong>100%</strong> yours · <strong>80%</strong> adjacent · <strong>60%</strong> next ·
      <strong>40%</strong> across).
    </p>
    <div class="hex-wrap card reveal">
      <svg viewBox="0 0 400 400" class="hex-chart" role="group" aria-label="Nen type chart">
        <polygon
          points="200,42 338,122 338,278 200,358 62,278 62,122"
          fill="none"
          stroke="var(--line)"
          stroke-width="2"
        />
        <line
          v-for="t in nenTypes"
          :key="`spoke-${t.id}`"
          x1="200"
          y1="200"
          :x2="t.x"
          :y2="t.y"
          stroke="var(--line)"
          stroke-width="1"
          stroke-dasharray="3 5"
        />
        <circle cx="200" cy="200" r="4" fill="var(--text-dim)" />
        <g
          v-for="t in nenTypes"
          :key="t.id"
          class="hex-node"
          :class="{ selected: selectedType === t.id }"
          tabindex="0"
          role="button"
          :aria-label="`${t.name} Nen type`"
          :style="{ '--tc': t.color }"
          @click="selectType(t.id)"
          @keydown="onHexKey($event, t.id)"
        >
          <circle :cx="t.x" :cy="t.y" r="30" class="hex-dot" />
          <circle :cx="t.x" :cy="t.y" r="30" class="hex-ring" />
          <text :x="t.x" :y="t.y + 1" text-anchor="middle" class="hex-pct">
            {{ pctMap ? pctMap[t.id] : '·' }}
          </text>
          <text
            :x="t.x"
            :y="t.y + (t.y < 200 ? -42 : 54)"
            text-anchor="middle"
            class="hex-label"
          >
            {{ t.name }}
          </text>
        </g>
      </svg>
      <div class="hex-info">
        <p v-if="!selectedType" class="hex-hint">☝ Click any of the six types on the chart to open its file.</p>
        <template v-for="t in nenTypes" :key="`detail-${t.id}`">
          <div v-if="selectedType === t.id" class="hex-detail">
            <h3 :style="{ color: t.color }">{{ t.name }}</h3>
            <p class="hex-desc">{{ t.desc }}</p>
            <div class="hex-meta">
              <div><span class="hex-meta-k">Water test</span>{{ t.water }}</div>
              <div><span class="hex-meta-k">Personality</span>{{ t.personality }}</div>
              <div><span class="hex-meta-k">Known users</span>{{ t.users }}</div>
            </div>
            <div v-if="(faces[t.id] || []).length" class="hex-faces">
              <a
                v-for="f in faces[t.id]"
                :key="f.id"
                class="hex-face"
                :href="charactersHref"
                :style="{ '--fc': f.color }"
                :title="`${f.name} — see dossier`"
              >
                <span class="hex-face-art">
                  <img :src="f.portrait" :alt="f.name" width="80" height="80" loading="lazy" />
                </span>
                <span class="hex-face-name">{{ f.name }}</span>
              </a>
            </div>
          </div>
        </template>
      </div>
    </div>
  </section>

  <section class="section container">
    <span class="section-kicker reveal">LESSON THREE</span>
    <h2 class="section-title reveal">Water <span class="accent">Divination</span></h2>
    <p class="page-sub reveal">
      A glass of water, a floating leaf, and your Ren. Answer six questions the way Hisoka would
      profile you — then watch what your aura does to the glass.
    </p>

    <div class="divination card reveal">
      <div v-if="!result" class="quiz">
        <div class="quiz-progress">
          <div class="quiz-bar" :style="{ width: `${progress}%` }" />
        </div>
        <div>
          <p class="q-text">{{ step + 1 }} / {{ quiz.length }} — {{ question.q }}</p>
          <div class="q-answers">
            <button
              v-for="(a, i) in question.a"
              :key="`${step}-${a.t}-${i}`"
              type="button"
              class="q-answer"
              :style="{ animationDelay: `${i * 0.07}s` }"
              @click="answer(a.t)"
            >
              {{ a.text }}
            </button>
          </div>
        </div>
      </div>

      <div v-else class="result">
        <div class="glass-stage">
          <svg viewBox="0 0 220 260" class="glass-svg" :class="glassFx" aria-hidden="true">
            <defs>
              <clipPath id="glass-clip">
                <path d="M60 40 L74 220 a12 12 0 0 0 12 10 h48 a12 12 0 0 0 12 -10 L160 40 Z" />
              </clipPath>
            </defs>
            <rect x="20" y="230" width="180" height="8" rx="4" fill="#2a3040" />
            <g clip-path="url(#glass-clip)">
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
              <path d="M62 46 q-4 18 -8 26" stroke="#58b3e0" stroke-width="4" fill="none" stroke-linecap="round" />
              <path d="M158 46 q4 18 8 26" stroke="#58b3e0" stroke-width="4" fill="none" stroke-linecap="round" />
            </g>
            <path
              d="M60 40 L74 220 a12 12 0 0 0 12 10 h48 a12 12 0 0 0 12 -10 L160 40 Z"
              fill="rgba(255,255,255,0.05)"
              stroke="#8b94a8"
              stroke-width="3"
            />
            <g id="leaf">
              <ellipse cx="110" cy="120" rx="16" ry="6" fill="#4fbf67" />
              <path d="M96 120 h28" stroke="#2e7d43" stroke-width="1.5" />
            </g>
            <g id="sparkles" opacity="0" fill="#f4c95d">
              <path d="M70 80 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3z" />
              <path d="M150 70 l2.5 6 6 2.5 -6 2.5 -2.5 6 -2.5 -6 -6 -2.5 6 -2.5z" />
              <path d="M135 100 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" />
            </g>
            <g fill="none" stroke="#39415a" stroke-width="3" opacity="0.9">
              <path d="M14 150 q20 -8 34 4 M14 168 q20 -6 32 4" stroke-linecap="round" />
              <path d="M206 150 q-20 -8 -34 4 M206 168 q-20 -6 -32 4" stroke-linecap="round" />
            </g>
          </svg>
        </div>
        <div class="result-copy">
          <div class="result-kicker">YOUR AURA TYPE</div>
          <h3 class="result-name" :style="{ color: result.color }">{{ result.name }}</h3>
          <p class="result-water">💧 {{ result.water }}</p>
          <p class="result-desc">{{ result.desc }}</p>
          <p class="result-users">You share a type with: {{ result.users }}</p>
          <button type="button" class="btn btn-ghost" @click="retry">Divine Again</button>
        </div>
      </div>
    </div>
  </section>
</template>
