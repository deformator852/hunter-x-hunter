// Original hand-drawn vector portraits (bust, 200x240). Flat anime-style
// illustration made for this site — no copyrighted artwork is traced or copied.

const eyes = (iris, { lidL = '', lidR = '' } = {}) => `
  <g class="pt-eyes">
    <ellipse cx="81" cy="98" rx="8.5" ry="10.5" fill="#fff"/>
    <ellipse cx="119" cy="98" rx="8.5" ry="10.5" fill="#fff"/>
    <circle cx="81" cy="99" r="5.2" fill="${iris}"/>
    <circle cx="119" cy="99" r="5.2" fill="${iris}"/>
    <circle cx="81" cy="99" r="2.3" fill="#12141a"/>
    <circle cx="119" cy="99" r="2.3" fill="#12141a"/>
    <circle cx="79" cy="96" r="1.7" fill="#fff"/>
    <circle cx="117" cy="96" r="1.7" fill="#fff"/>
    <path d="M71 91 q10 -7 20 -2" stroke="#12141a" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <path d="M109 89 q10 -5 20 0" stroke="#12141a" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    ${lidL}${lidR}
  </g>`;

const nose = (shadow) =>
  `<path d="M100 107 q3 5 0 9" stroke="${shadow}" stroke-width="2" fill="none" stroke-linecap="round"/>`;

const face = (skin, shadow) => `
  <ellipse cx="55" cy="102" rx="8" ry="12" fill="${skin}"/>
  <ellipse cx="145" cy="102" rx="8" ry="12" fill="${skin}"/>
  <path d="M86 132 h28 v24 h-28z" fill="${skin}"/>
  <path d="M86 132 h28 v9 c-9 7 -19 7 -28 0z" fill="${shadow}"/>
  <ellipse cx="100" cy="94" rx="44" ry="50" fill="${skin}"/>`;

const torso = (cloth) =>
  `<path d="M24 242 C30 192 62 164 100 164 C138 164 170 192 176 242 Z" fill="${cloth}"/>`;

export const portraits = {
  /* ============ GON ============ */
  gon: `<svg viewBox="0 0 200 240" aria-hidden="true">
    ${face('#f2c49a', '#dda878')}
    ${torso('#2e7d43')}
    <path d="M84 168 L100 186 L116 168 L100 164 Z" fill="#f5f2e8"/>
    <path d="M60 172 l24 -6 16 20 16 -20 24 6 -10 16 -30 -4 -30 4z" fill="#256637"/>
    ${eyes('#6b3d1e')}
    ${nose('#dda878')}
    <path d="M88 122 q12 9 24 0" stroke="#8c4a3c" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <path d="M69 82 q12 -6 23 -2 M108 80 q12 -4 23 2" stroke="#17301f" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M56 84 C50 62 58 40 70 40 L76 12 L90 38 L100 2 L112 38 L126 10 L132 40 C144 40 152 62 144 84
             C138 66 128 58 100 58 C72 58 62 66 56 84 Z" fill="#17301f"/>
    <path d="M74 34 L82 18 M102 30 L108 12" stroke="#2e5c40" stroke-width="3" stroke-linecap="round"/>
  </svg>`,

  /* ============ KILLUA ============ */
  killua: `<svg viewBox="0 0 200 240" aria-hidden="true">
    ${face('#f7dcc0', '#e3bf9c')}
    ${torso('#33395c')}
    <path d="M78 166 h44 l-4 12 h-36 z" fill="#f5f2e8"/>
    ${eyes('#4a7fd4', {
      lidL: '<path d="M72 93 q9 -4 18 -1" stroke="#12141a" stroke-width="1.6" fill="none"/>',
      lidR: '<path d="M110 92 q9 -3 18 1" stroke="#12141a" stroke-width="1.6" fill="none"/>',
    })}
    ${nose('#e3bf9c')}
    <path d="M90 123 q10 6 20 0" stroke="#a05a4a" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <path d="M70 83 q11 -4 22 -1 M108 82 q11 -3 22 1" stroke="#b9c2cf" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M100 4 C120 4 138 14 144 34 L162 30 L148 48 L168 56 L146 62 C150 74 146 86 142 92
             C136 72 128 56 100 54 C72 56 64 72 58 92 C54 86 50 74 54 62 L32 56 L52 48 L38 30 L56 34
             C62 14 80 4 100 4 Z" fill="#eef1f6"/>
    <path d="M78 26 L92 14 M110 16 L124 28 M64 44 L76 36" stroke="#c9d2de" stroke-width="3" stroke-linecap="round"/>
  </svg>`,

  /* ============ KURAPIKA ============ */
  kurapika: `<svg viewBox="0 0 200 240" aria-hidden="true">
    ${face('#f6d6b2', '#e2b98e')}
    ${torso('#33549c')}
    <path d="M100 166 L76 200 L68 172 Z M100 166 L124 200 L132 172 Z" fill="#e8c25c"/>
    <path d="M86 170 L100 190 L114 170" fill="none" stroke="#e8c25c" stroke-width="5"/>
    ${eyes('#cc3a4a')}
    ${nose('#e2b98e')}
    <path d="M91 123 q9 5 18 0" stroke="#a05a4a" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <path d="M71 83 q10 -4 21 -1 M108 82 q11 -3 21 1" stroke="#c9a24a" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M100 8 C130 8 148 30 148 58 C148 84 142 100 148 116 L134 108 C138 92 136 70 132 60
             C120 52 80 52 68 60 C64 70 62 92 66 108 L52 116 C58 100 52 84 52 58 C52 30 70 8 100 8 Z" fill="#f2d478"/>
    <path d="M62 60 Q100 44 138 60 L134 74 Q100 58 66 74 Z" fill="#f2d478"/>
    <path d="M74 40 Q100 32 126 40" stroke="#d9b855" stroke-width="3" fill="none" stroke-linecap="round"/>
    <circle cx="55" cy="118" r="4.5" fill="#cc3a4a"/>
    <path d="M55 122 v9" stroke="#cc3a4a" stroke-width="2.5"/>
    <circle cx="55" cy="134" r="3" fill="#cc3a4a"/>
  </svg>`,

  /* ============ LEORIO ============ */
  leorio: `<svg viewBox="0 0 200 240" aria-hidden="true">
    ${face('#e9b184', '#d1946a')}
    ${torso('#232936')}
    <path d="M84 168 L100 194 L116 168 L100 164 Z" fill="#f5f2e8"/>
    <path d="M96 172 h8 l4 34 -8 10 -8 -10 z" fill="#3563c9"/>
    ${nose('#d1946a')}
    <path d="M89 124 q11 6 22 0" stroke="#8c4a3c" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <path d="M68 80 q12 -5 24 -1 M108 79 q12 -4 24 1" stroke="#20242c" stroke-width="4.5" fill="none" stroke-linecap="round"/>
    <ellipse cx="81" cy="99" rx="7" ry="8" fill="#fff"/>
    <ellipse cx="119" cy="99" rx="7" ry="8" fill="#fff"/>
    <circle cx="81" cy="100" r="4" fill="#4a3423"/>
    <circle cx="119" cy="100" r="4" fill="#4a3423"/>
    <g fill="#9fc4e8" opacity="0.45">
      <circle cx="81" cy="99" r="13"/>
      <circle cx="119" cy="99" r="13"/>
    </g>
    <g fill="none" stroke="#2a2f3a" stroke-width="3">
      <circle cx="81" cy="99" r="13"/>
      <circle cx="119" cy="99" r="13"/>
      <path d="M94 99 h12 M68 96 L56 92 M132 96 L144 92"/>
    </g>
    <path d="M100 42 C74 42 58 58 56 78 C60 66 72 58 100 58 C128 58 140 66 144 78 C142 58 126 42 100 42 Z
             M64 56 L58 46 M84 48 L80 36 M104 46 L104 34 M122 48 L128 37" fill="#20242c" stroke="#20242c" stroke-width="5" stroke-linecap="round"/>
  </svg>`,

  /* ============ HISOKA ============ */
  hisoka: `<svg viewBox="0 0 200 240" aria-hidden="true">
    ${face('#f4d5c0', '#deb598')}
    ${torso('#f0eef2')}
    <path d="M62 190 l14 -26 8 12 z M138 190 l-14 -26 -8 12 z" fill="#d8434e"/>
    <path d="M92 176 l8 -9 8 9 -8 9 z" fill="#d8434e"/>
    <path d="M100 196 c5 -8 15 -3 9 5 l-9 9 -9 -9 c-6 -8 4 -13 9 -5z" fill="#3a3f66"/>
    ${eyes('#e0a53a', {
      lidL: '<path d="M70 95 q11 -6 22 -2" stroke="#12141a" stroke-width="2" fill="none"/>',
      lidR: '<path d="M108 93 q11 -4 22 2" stroke="#12141a" stroke-width="2" fill="none"/>',
    })}
    ${nose('#deb598')}
    <path d="M88 122 q12 8 24 1" stroke="#b0485a" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <path d="M68 80 q12 -7 24 -2 M108 78 q12 -5 24 2" stroke="#b23640" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M65 118 l3.2 6.4 7 1 -5 5 1.2 7 -6.4 -3.3 -6.4 3.3 1.2 -7 -5 -5 7 -1z" fill="#3aa8a0"/>
    <path d="M135 112 c5 7 5 13 0 15 c-5 -2 -5 -8 0 -15z" fill="#5b8fd4"/>
    <path d="M56 84 C48 60 62 30 88 24 C120 14 150 32 150 58 C150 74 146 84 144 90
             C154 84 166 74 170 62 C172 82 160 96 148 100 C142 82 132 62 100 60 C76 60 62 70 56 84 Z" fill="#d8434e"/>
    <path d="M78 40 Q94 30 112 34 M128 40 L140 34" stroke="#eb6d76" stroke-width="3" fill="none" stroke-linecap="round"/>
  </svg>`,

  /* ============ KITE ============ */
  kite: `<svg viewBox="0 0 200 240" aria-hidden="true">
    <path d="M50 96 C44 150 46 190 42 226 L66 214 C68 180 66 140 66 116 Z
             M150 96 C156 150 154 190 158 226 L134 214 C132 180 134 140 134 116 Z" fill="#eff1f0"/>
    ${face('#f2d3b8', '#dcb493')}
    ${torso('#34495c')}
    <path d="M80 166 h40 v14 h-40 z" fill="#2a3b4c"/>
    <path d="M56 100 C52 150 56 190 52 222 L70 212 C72 178 70 140 70 112 Z
             M144 100 C148 150 144 190 148 222 L130 212 C128 178 130 140 130 112 Z" fill="#f7f8f7"/>
    ${eyes('#7d93a8')}
    ${nose('#dcb493')}
    <path d="M92 124 h16" stroke="#9c5f4e" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M70 84 q11 -4 22 -1 M108 83 q11 -3 22 1" stroke="#c9cdcc" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M58 78 C58 46 76 30 100 30 C124 30 142 46 142 78 C128 66 72 66 58 78 Z" fill="#eff1f0"/>
    <path d="M52 74 C52 44 72 22 100 22 C128 22 148 44 148 74 L148 80 C130 62 70 62 52 80 Z" fill="#2c3a55"/>
    <path d="M46 80 Q100 60 154 80 L150 88 Q100 72 50 88 Z" fill="#22304a"/>
    <circle cx="100" cy="34" r="4" fill="#22304a"/>
  </svg>`,

  /* ============ CHROLLO ============ */
  chrollo: `<svg viewBox="0 0 200 240" aria-hidden="true">
    ${face('#efc9ac', '#d8ab88')}
    ${torso('#1c1f2b')}
    <path d="M28 214 C50 196 76 188 100 188 C124 188 150 196 172 214 L172 230 C148 212 124 206 100 206 C76 206 52 212 28 230 Z" fill="#6a7080"/>
    <g fill="#7d8494">
      <circle cx="40" cy="216" r="7"/><circle cx="58" cy="206" r="7"/><circle cx="78" cy="199" r="7"/>
      <circle cx="100" cy="196" r="7"/><circle cx="122" cy="199" r="7"/><circle cx="142" cy="206" r="7"/><circle cx="160" cy="216" r="7"/>
    </g>
    ${eyes('#55607a', {
      lidL: '<path d="M72 94 q9 -4 18 -1" stroke="#12141a" stroke-width="1.6" fill="none"/>',
      lidR: '<path d="M110 93 q9 -3 18 1" stroke="#12141a" stroke-width="1.6" fill="none"/>',
    })}
    ${nose('#d8ab88')}
    <path d="M92 124 h16" stroke="#9c5f4e" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M70 82 q11 -4 22 0 M108 82 q11 -4 22 0" stroke="#14171f" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M100 56 v14 M94 66 h12" stroke="#3f4658" stroke-width="3" stroke-linecap="round"/>
    <path d="M56 90 C50 52 70 24 100 24 C130 24 150 52 144 90 C142 68 132 50 100 50 C68 50 58 68 56 90 Z" fill="#14171f"/>
    <path d="M72 38 Q88 28 106 30" stroke="#2b303f" stroke-width="3" fill="none" stroke-linecap="round"/>
    <path d="M55 116 v10 M145 116 v10" stroke="#3aa8a0" stroke-width="2.5"/>
    <circle cx="55" cy="130" r="4" fill="#3aa8a0"/>
    <circle cx="145" cy="130" r="4" fill="#3aa8a0"/>
  </svg>`,

  /* ============ NETERO ============ */
  netero: `<svg viewBox="0 0 200 240" aria-hidden="true">
    ${face('#eec39b', '#d6a67c')}
    <ellipse cx="55" cy="106" rx="8" ry="16" fill="#eec39b"/>
    <ellipse cx="145" cy="106" rx="8" ry="16" fill="#eec39b"/>
    ${torso('#c9b98f')}
    <path d="M70 166 L100 196 L130 166 L136 180 L100 214 L64 180 Z" fill="#eee7d6"/>
    <path d="M100 132 C82 138 74 154 76 178 C84 198 116 198 124 178 C126 154 118 138 100 132 Z" fill="#f2f3f0"/>
    <path d="M100 176 C94 192 96 214 100 236 C104 214 106 192 100 176 Z" fill="#f2f3f0"/>
    <path d="M62 112 C66 126 78 134 88 136 M138 112 C134 126 122 134 112 136" stroke="#f2f3f0" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M74 92 q9 6 18 1 M108 93 q9 5 18 -1" stroke="#12141a" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <path d="M66 82 q12 -8 24 -3 M110 79 q12 -5 24 3" stroke="#e9ebe8" stroke-width="5" fill="none" stroke-linecap="round"/>
    ${nose('#d6a67c')}
    <path d="M80 118 q6 -4 12 -1 M108 117 q6 -3 12 1" stroke="#f2f3f0" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M96 50 C96 38 90 34 92 24 C98 30 104 30 108 22 C112 32 104 40 104 50 Z" fill="#e9ebe8"/>
    <path d="M60 64 Q100 48 140 64" stroke="#d6a67c" stroke-width="2" fill="none" opacity="0.6"/>
    <ellipse cx="84" cy="52" rx="10" ry="5" fill="#fff" opacity="0.35" transform="rotate(-18 84 52)"/>
  </svg>`,

  /* ============ GING ============ */
  ging: `<svg viewBox="0 0 200 240" aria-hidden="true">
    ${face('#e6b184', '#cf946399')}
    ${torso('#3a4048')}
    <path d="M56 176 L124 236 L146 224 L78 168 Z" fill="#8a6f4a"/>
    <path d="M96 130 C84 134 76 142 74 150 C84 146 116 146 126 150 C124 142 116 134 104 130 Z" fill="#cf9463" opacity="0.35"/>
    ${eyes('#6b4423')}
    ${nose('#cf9463')}
    <path d="M86 120 q14 11 28 1" stroke="#8c4a3c" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <path d="M94 134 q6 4 12 0" stroke="#2c3138" stroke-width="3.5" fill="none" stroke-linecap="round"/>
    <path d="M69 82 q11 -6 22 -2 M109 80 q11 -4 22 2" stroke="#1e222b" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M56 82 C50 54 60 36 72 32 L70 16 L86 28 L94 8 L104 28 L118 12 L122 30 C136 34 148 54 144 82
             C136 64 128 56 100 56 C72 56 62 64 56 82 Z" fill="#1e222b"/>
    <path d="M54 70 Q100 52 146 70 L144 84 Q100 66 56 84 Z" fill="#e8e4da"/>
    <path d="M146 74 c10 4 12 14 8 24 c-2 -8 -6 -14 -12 -18z" fill="#e8e4da"/>
  </svg>`,

  /* ============ TONPA ============ */
  tonpa: `<svg viewBox="0 0 200 240" aria-hidden="true">
    <ellipse cx="55" cy="104" rx="8" ry="12" fill="#eec39b"/>
    <ellipse cx="145" cy="104" rx="8" ry="12" fill="#eec39b"/>
    <path d="M84 130 h32 v26 h-32z" fill="#eec39b"/>
    <path d="M84 130 h32 v9 c-10 7 -22 7 -32 0z" fill="#d6a67c"/>
    <ellipse cx="100" cy="94" rx="48" ry="47" fill="#eec39b"/>
    ${torso('#3c4356')}
    <path d="M86 168 L100 188 L114 168 L100 162 Z" fill="#e9e6dc"/>
    <path d="M97 170 h6 l3 26 -6 8 -6 -8 z" fill="#7a3540"/>
    <path d="M70 96 q10 -6 20 0 M110 96 q10 -6 20 0" stroke="#12141a" stroke-width="3" fill="none" stroke-linecap="round"/>
    <ellipse cx="100" cy="112" rx="11" ry="9" fill="#e0a878"/>
    <path d="M84 128 q16 12 32 -2" stroke="#8c4a3c" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <path d="M88 130 q12 8 24 -2" stroke="#fff" stroke-width="3" fill="none" opacity="0.7"/>
    <path d="M66 84 q12 -6 24 -2 M110 82 q12 -4 24 2" stroke="#4a3423" stroke-width="4.5" fill="none" stroke-linecap="round"/>
    <path d="M58 72 C60 50 76 38 100 38 C124 38 140 50 142 72 C132 58 116 54 100 54 C84 54 68 58 58 72 Z" fill="#6a4a33"/>
    <path d="M88 44 C90 34 98 28 108 30 C104 36 102 42 102 48 Z" fill="#6a4a33"/>
    <g transform="translate(138 186) rotate(12)">
      <rect x="0" y="0" width="26" height="38" rx="4" fill="#e88c2e"/>
      <rect x="0" y="8" width="26" height="18" fill="#f5f2e8"/>
      <text x="13" y="21" text-anchor="middle" font-size="10" font-weight="bold" fill="#e88c2e" font-family="sans-serif">JUS</text>
      <path d="M20 0 L26 -12" stroke="#f5f2e8" stroke-width="3" stroke-linecap="round"/>
    </g>
  </svg>`,
};
