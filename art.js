'use strict';
/* Ilustrações originais geradas em SVG: criaturas, cenários, retratos e ícones. */
const ART = (() => {
  const INK = '#160b1c';
  const O = `stroke="${INK}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"`;
  const O1 = `stroke="${INK}" stroke-width="1.2" stroke-linejoin="round" stroke-linecap="round"`;
  const N = 'stroke="none"';
  const p = (d, f, x = O) => `<path d="${d}" fill="${f}" ${x}/>`;
  const ci = (cx, cy, r, f, x = O) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${f}" ${x}/>`;
  const el = (cx, cy, rx, ry, f, x = O) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${f}" ${x}/>`;
  const ln = (d, c, w = 2, x = '') => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" ${x}/>`;
  const stops = cs => cs.map((c, i) => `<stop offset="${cs.length === 1 ? 0 : i / (cs.length - 1)}" stop-color="${c}"/>`).join('');
  const lg = (id, ...cs) => `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1">${stops(cs)}</linearGradient>`;
  const rg = (id, ...cs) => `<radialGradient id="${id}" cx=".4" cy=".32" r=".8">${stops(cs)}</radialGradient>`;
  const mir = (s, w) => `<g transform="translate(${w},0) scale(-1,1)">${s}</g>`;
  const sym = (s, w) => s + mir(s, w);
  const glow = (s, big) => `<g filter="url(#${big ? 'gl2' : 'gl'})">${s}</g>${s}`;
  const hi = (d, o = 0.28) => p(d, '#fff', `${N} opacity="${o}"`);
  const eye = (x, y, r, c = '#fff', pc = INK) => ci(x, y, r, c, O1) + el(x, y, r * 0.4, r * 0.82, pc, N) + ci(x - r * 0.32, y - r * 0.4, r * 0.28, '#fff', N);
  const geye = (x, y, rx, ry, c) => glow(el(x, y, rx, ry, c, N)) + el(x, y, rx * 0.25, ry * 0.9, INK, N);
  const star = (x, y, r, c = '#fff') => p(`M${x} ${y - r}L${x + r * 0.25} ${y - r * 0.25}L${x + r} ${y}L${x + r * 0.25} ${y + r * 0.25}L${x} ${y + r}L${x - r * 0.25} ${y + r * 0.25}L${x - r} ${y}L${x - r * 0.25} ${y - r * 0.25}Z`, c, N);
  const rng = seed => { let a = 0; for (const ch of seed) a = (a * 31 + ch.charCodeAt(0)) >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; };
  const uri = svg => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
  const FILT = `<filter id="gl" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="2.2"/></filter><filter id="gl2" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="5"/></filter>`;

  /* ---------- cenários por tipo ---------- */
  const BG = {
    fogo(w, r) {
      let s = lg('bg', '#1c0508', '#7a1d08', '#ff8a2a') + '|';
      s += `<rect width="${w}" height="120" fill="url(#bg)"/>`;
      s += p(`M${w * 0.02} 92L${w * 0.3} 38L${w * 0.42} 42L${w * 0.66} 92Z`, '#2c0b0b', N) + p(`M${w * 0.5} 92L${w * 0.8} 54L${w * 1.05} 92Z`, '#3a100c', N);
      s += glow(el(w * 0.36, 40, w * 0.06 + 2, 3, '#ffc24a', N), 1);
      s += ln(`M${w * 0.35} 42Q${w * 0.3} 62 ${w * 0.22} 80`, '#ff7a1a', 1.6, 'opacity=".8"');
      s += p(`M0 98Q${w / 2} 88 ${w} 98V120H0Z`, '#170607', N);
      s += glow(ln(`M0 112L${w * 0.25} 106L${w * 0.45} 114L${w * 0.7} 107L${w} 113`, '#ff8a1a', 1.4));
      for (let i = 0; i < 14; i++) s += ci(r() * w, r() * 95, 0.5 + r() * 1.2, '#ffd27a', `${N} opacity="${0.4 + r() * 0.6}"`);
      return s;
    },
    agua(w, r) {
      let s = lg('bg', '#8feaf5', '#1a80c8', '#082a66', '#04143a') + '|';
      s += `<rect width="${w}" height="120" fill="url(#bg)"/>`;
      s += p(`M${w * 0.15} 0L${w * 0.4} 0L${w * 0.2} 120L${-w * 0.1} 120Z`, '#fff', `${N} opacity=".09"`) + p(`M${w * 0.6} 0L${w * 0.75} 0L${w * 0.7} 120L${w * 0.45} 120Z`, '#fff', `${N} opacity=".07"`);
      s += p(`M0 104Q${w * 0.25} 94 ${w * 0.5} 103T${w} 100V120H0Z`, '#051634', N);
      for (let i = 0; i < 4; i++) { const x = r() * w; s += ln(`M${x} 110Q${x - 4} 100 ${x + 2} 92Q${x + 5} 86 ${x} 80`, '#0c4a4a', 2.2, 'opacity=".8"'); }
      for (let i = 0; i < 12; i++) s += ci(r() * w, r() * 100, 0.8 + r() * 2, 'none', `stroke="#dff" stroke-width=".6" opacity="${0.3 + r() * 0.5}"`);
      return s;
    },
    planta(w, r) {
      let s = lg('bg', '#0b2415', '#2f7d3c', '#c4e87a') + '|';
      s += `<rect width="${w}" height="120" fill="url(#bg)"/>`;
      for (let i = 0; i < 5; i++) { const x = r() * w, t = 3 + r() * 6; s += `<rect x="${x}" y="0" width="${t}" height="104" fill="#06180e" opacity="${0.25 + r() * 0.3}"/>`; }
      s += p(`M${w * 0.3} 0L${w * 0.55} 0L${w * 0.35} 120L${w * 0.05} 120Z`, '#f4ffb0', `${N} opacity=".1"`);
      s += el(w * 0.2, 4, w * 0.4, 18, '#082012', `${N} opacity=".9"`) + el(w * 0.8, 0, w * 0.4, 16, '#0a2a16', `${N} opacity=".9"`);
      s += p(`M0 100Q${w / 2} 92 ${w} 100V120H0Z`, '#0a2410', N);
      for (let i = 0; i < 10; i++) { const x = r() * w; s += ln(`M${x} 104L${x + (r() * 4 - 2)} ${96 + r() * 4}`, '#3d8a2e', 1.2); }
      for (let i = 0; i < 9; i++) s += glow(ci(r() * w, 20 + r() * 80, 0.9, '#eaff8a', N));
      return s;
    },
    raio(w, r) {
      let s = lg('bg', '#0d0a2c', '#3b2f86', '#c2a4f5') + '|';
      s += `<rect width="${w}" height="120" fill="url(#bg)"/>`;
      const bx = w * (0.15 + r() * 0.7);
      s += glow(ln(`M${bx} 14L${bx - 6} 34L${bx + 3} 36L${bx - 8} 60L${bx + 1} 62L${bx - 5} 84`, '#f4eaff', 1.3, 'opacity=".55"'), 1);
      for (let i = 0; i < 6; i++) s += el(r() * w, 4 + r() * 12, 16 + r() * 18, 8 + r() * 5, i % 2 ? '#0a0722' : '#171040', N);
      for (let i = 0; i < 16; i++) { const x = r() * w, y = r() * 100; s += ln(`M${x} ${y}l-2 7`, '#dcd0ff', 0.6, 'opacity=".3"'); }
      s += p(`M0 101L${w * 0.2} 96L${w * 0.45} 102L${w * 0.7} 95L${w} 100V120H0Z`, '#0c0824', N);
      return s;
    },
    pedra(w, r) {
      let s = lg('bg', '#33241a', '#96643a', '#f3d090') + '|';
      s += `<rect width="${w}" height="120" fill="url(#bg)"/>`;
      s += glow(ci(w * 0.75, 30, 9, '#fff0c0', N), 1);
      s += p(`M0 96V56L${w * 0.12} 54L${w * 0.16} 40L${w * 0.34} 40L${w * 0.38} 60L${w * 0.5} 62V96Z`, '#5b3a22', `${N} opacity=".85"`);
      s += p(`M${w * 0.55} 96V66L${w * 0.68} 64L${w * 0.72} 50L${w * 0.92} 50L${w} 62V96Z`, '#6a4428', `${N} opacity=".8"`);
      s += p(`M0 100Q${w / 2} 92 ${w} 100V120H0Z`, '#24170e', N);
      for (let i = 0; i < 6; i++) { const x = r() * w, y = 104 + r() * 12; s += p(`M${x} ${y}l3 -4l4 1l2 4z`, '#3d2a1a', N); }
      for (let i = 0; i < 10; i++) s += ci(r() * w, r() * 100, 0.6 + r(), '#ffe8b0', `${N} opacity="${0.2 + r() * 0.3}"`);
      return s;
    },
    sombra(w, r) {
      let s = lg('bg', '#05030c', '#1e0f45', '#5c3494') + '|';
      s += `<rect width="${w}" height="120" fill="url(#bg)"/>`;
      for (let i = 0; i < 22; i++) s += ci(r() * w, r() * 70, 0.3 + r() * 0.7, '#fff', `${N} opacity="${0.3 + r() * 0.7}"`);
      s += glow(ci(w * 0.74, 26, 11, '#f1e6ff', N), 1) + ci(w * 0.74 + 4, 23, 2.4, '#cdbdf0', N) + ci(w * 0.74 - 4, 30, 1.6, '#cdbdf0', N);
      const tx = w * 0.12;
      s += ln(`M${tx} 104V58M${tx} 76L${tx - 8} 62M${tx} 68L${tx + 9} 54M${tx + 9} 54L${tx + 8} 44`, '#07040f', 2.4);
      s += p(`M0 101Q${w / 2} 94 ${w} 101V120H0Z`, '#07040f', N);
      for (let i = 0; i < 4; i++) s += el(r() * w, 98 + r() * 10, 24 + r() * 20, 4, '#b79cff', `${N} opacity=".12"`);
      return s;
    },
  };

  /* ---------- criaturas ---------- */
  // pequenas: 60x120 · médias: 120x120 · grandes: 180x120
  const CR = {
    brasinha: () => [rg('a', '#fffbd0', '#ffc02a', '#f2600c', '#b8260a'),
      el(23, 103, 6, 3.4, '#3b1a12') + el(37, 103, 6, 3.4, '#3b1a12') +
      sym(p('M13 80C5 76 4 68 8 62C9 69 13 71 16 73Z', '#f2600c'), 60) +
      glow(p('M30 26C38 42 51 52 49 76C48 93 39 101 30 101C21 101 12 93 11 76C10 61 18 57 20 46C24 53 27 52 27 46C27 38 28 33 30 26Z', 'url(#a)', N), 1) +
      p('M30 26C38 42 51 52 49 76C48 93 39 101 30 101C21 101 12 93 11 76C10 61 18 57 20 46C24 53 27 52 27 46C27 38 28 33 30 26Z', 'url(#a)') +
      p('M30 58C37 66 41 74 40 84C39 93 34 97 30 97C26 97 21 93 20 84C19 74 25 68 30 58Z', '#fff4a8', `${N} opacity=".85"`) +
      el(24, 78, 3.2, 4.4, INK, N) + el(36, 78, 3.2, 4.4, INK, N) + ci(23, 76.4, 1.2, '#fff', N) + ci(35, 76.4, 1.2, '#fff', N) +
      ln('M26 88Q30 92 34 88', INK, 1.6) + ci(18, 30, 1.6, '#ffd27a', N) + ci(42, 22, 1.2, '#ffd27a', N) + ci(44, 38, 1, '#fff2b0', N)],

    fornalhito: () => [lg('a', '#8a5a44', '#2a1510') + rg('b', '#fffbd0', '#ffb02a', '#e0400a'),
      ln('M13 62L3 55M11 76L1 78M14 88L5 97', INK, 4) + ln('M47 62L57 55M49 76L59 78M46 88L55 97', INK, 4) +
      ln('M13 62L3 55M11 76L1 78M14 88L5 97', '#5a3426', 2) + ln('M47 62L57 55M49 76L59 78M46 88L55 97', '#5a3426', 2) +
      sym(p('M23 42C15 35 16 26 24 22C22 30 25 35 28 39Z', '#c9b08a'), 60) +
      el(30, 46, 12, 9, '#4a2a20') + el(30, 74, 21, 25, 'url(#a)') + ln('M30 50V98', INK, 1.4) +
      hi('M14 66C14 56 20 52 26 51C20 56 18 62 17 70Z') +
      glow(`<rect x="20" y="64" width="20" height="18" rx="5" fill="url(#b)"/>`, 1) + `<rect x="20" y="64" width="20" height="18" rx="5" fill="none" ${O}/>` +
      ln('M25.5 65V81M30 65V81M34.5 65V81', INK, 1.6) +
      geye(25, 45, 2.6, 2.6, '#ffb02a') + geye(35, 45, 2.6, 2.6, '#ffb02a') +
      ci(24, 28, 3, '#777', `${N} opacity=".35"`) + ci(30, 18, 4, '#888', `${N} opacity=".25"`) + ci(38, 10, 5, '#999', `${N} opacity=".15"`)],

    gotinha: () => [lg('a', '#b4f1ff', '#3aa8ee', '#12589e'),
      p('M30 88C22 96 15 101 12 109C21 107 27 103 30 98C33 103 39 107 48 109C45 101 38 96 30 88Z', '#1565b0') +
      sym(p('M17 68C8 68 4 75 5 84C12 82 17 77 20 73Z', '#1f7fd0'), 60) +
      p('M30 30C45 44 50 64 44 80C39 91 21 91 16 80C10 64 15 44 30 30Z', 'url(#a)') +
      el(30, 78, 10, 7, '#e4faff', `${N} opacity=".7"`) + ln('M24 42C19 49 18 56 19 62', '#fff', 2.2, 'opacity=".65"') +
      p('M30 30C33 22 38 20 42 22C38 24 36 28 35 34Z', '#1f7fd0') +
      eye(23, 63, 5.4) + eye(37, 63, 5.4) + ln('M27 74Q30 77 33 74', INK, 1.5) +
      ci(10, 40, 3, 'none', 'stroke="#dff" stroke-width="1" opacity=".8"') + ci(50, 30, 2, 'none', 'stroke="#dff" stroke-width="1" opacity=".8"') + ci(47, 46, 1.4, '#dff', `${N} opacity=".7"`)],

    conchudo: () => [lg('a', '#fff0dc', '#f0a884', '#b85a48') + lg('b', '#ff9a6a', '#c9482a'),
      sym(p('M13 99C5 96 2 103 6 108C11 111 17 107 18 102Z', 'url(#b)'), 60) +
      p('M22 46L26 32L32 44L40 30L42 48L52 42L50 58Z', '#d98a6a') +
      p('M30 44C49 44 55 61 53 77C51 93 41 100 28 100C14 100 7 90 7 77C7 59 16 44 30 44Z', 'url(#a)') +
      ln('M30 53C43 55 47 67 45 77C43 87 34 91 27 89C20 87 17 79 20 73C23 67 31 65 34 71C36 75 33 79 29 78', '#8f4636', 2.2) +
      hi('M14 70C14 60 20 52 28 50C20 56 18 64 18 72Z', 0.4) +
      el(30, 98, 14, 6, '#231020') + geye(25, 97, 2.6, 2.6, '#8ff0ff') + geye(35, 97, 2.6, 2.6, '#8ff0ff') +
      ci(12, 34, 2, 'none', 'stroke="#dff" stroke-width="1" opacity=".7"') + ci(50, 24, 3, 'none', 'stroke="#dff" stroke-width="1" opacity=".7"')],

    brotinho: () => [lg('a', '#d8f78a', '#74c23c', '#35782a') + lg('b', '#8fe05a', '#2f8a2a'),
      ln('M22 100C18 106 14 107 11 110M38 100C42 106 46 107 49 110', '#6a4426', 3) +
      ln('M30 62C29 54 31 48 30 40', '#2f6a1e', 4) +
      p('M30 42C18 41 8 31 6 18C19 18 30 27 30 42Z', 'url(#b)') + p('M30 42C42 41 52 31 54 18C41 18 30 27 30 42Z', 'url(#b)') +
      ln('M30 42C24 34 16 26 9 20M30 42C36 34 44 26 51 20', '#1f5a1a', 1.2) +
      p('M30 60C45 60 49 75 47 88C45 99 37 104 30 104C23 104 15 99 13 88C11 75 15 60 30 60Z', 'url(#a)') +
      ln('M22 64C19 74 19 88 23 99M38 64C41 74 41 88 37 99', '#4f9a2a', 1.4, 'opacity=".7"') + hi('M17 80C16 72 19 66 24 64C21 70 20 76 20 84Z', 0.45) +
      eye(24, 82, 4.8) + eye(36, 82, 4.8) + el(18, 90, 3, 1.8, '#ff9a8a', `${N} opacity=".6"`) + el(42, 90, 3, 1.8, '#ff9a8a', `${N} opacity=".6"`) +
      ln('M27 92Q30 95 33 92', INK, 1.5)],

    cogumelino: () => [lg('a', '#ff9aca', '#d43a8a', '#7a1a56') + lg('b', '#fff6de', '#d8c098'),
      p('M20 66C17 84 17 96 22 104H38C43 96 43 84 40 66Z', 'url(#b)') +
      el(30, 67, 21, 6, '#5e143e') +
      p('M5 63C5 40 17 28 30 28C43 28 55 40 55 63C55 69 44 71 30 71C16 71 5 69 5 63Z', 'url(#a)') +
      el(18, 46, 5, 4, '#fff3dc', O1) + el(38, 40, 6, 5, '#fff3dc', O1) + el(46, 56, 4, 3.4, '#fff3dc', O1) + el(26, 58, 3, 2.6, '#fff3dc', O1) +
      hi('M10 56C10 44 16 36 24 32C17 40 14 48 14 58Z', 0.35) +
      el(25, 85, 2.8, 3.8, INK, N) + el(35, 85, 2.8, 3.8, INK, N) + ci(24.2, 83.6, 1, '#fff', N) + ci(34.2, 83.6, 1, '#fff', N) + ln('M27 93Q30 96 33 93', INK, 1.5) +
      glow(ci(8, 24, 1.6, '#c8ff7a', N)) + glow(ci(50, 18, 1.2, '#c8ff7a', N)) + glow(ci(44, 84, 1.4, '#c8ff7a', N)) + glow(ci(12, 88, 1, '#c8ff7a', N))],

    zumbizap: () => [lg('a', '#fff27a', '#f2b020') + lg('b', '#4a3a78', '#1e1638'),
      `<g opacity=".7">` + el(13, 52, 15, 6, '#cff6ff', 'stroke="#fff" stroke-width="1" transform="rotate(-24 13 52)"') + el(47, 52, 15, 6, '#cff6ff', 'stroke="#fff" stroke-width="1" transform="rotate(24 47 52)"') +
      el(15, 66, 11, 4.5, '#cff6ff', 'stroke="#fff" stroke-width="1" transform="rotate(14 15 66)"') + el(45, 66, 11, 4.5, '#cff6ff', 'stroke="#fff" stroke-width="1" transform="rotate(-14 45 66)"') + `</g>` +
      p('M30 66C43 68 45 84 39 95L33 104L36 105L29 115L31 106L27 106L21 95C15 84 17 68 30 66Z', 'url(#a)') +
      p('M19 76Q30 81 41 76L41.5 83Q30 88 18.500 83Z', '#2a2046', N) + p('M21 90Q30 94 39 90L36 96Q30 99 24 96Z', '#2a2046', N) +
      el(30, 59, 9, 9, 'url(#b)') + ci(30, 43, 10, 'url(#b)') +
      glow(ln('M25 35L21 28L24 27L19 19', '#ffe24a', 1.6)) + glow(ln('M35 35L39 28L36 27L41 19', '#ffe24a', 1.6)) +
      glow(el(25, 43, 4, 5.4, '#7ff5ff', N)) + glow(el(35, 43, 4, 5.4, '#7ff5ff', N)) + ci(24, 41, 1.2, '#fff', N) + ci(34, 41, 1.2, '#fff', N) +
      glow(ln('M6 86L10 92L7 93L11 100', '#ffe24a', 1.4)) + glow(ln('M52 80L49 86L53 87L50 94', '#ffe24a', 1.4))],

    voltagato: () => [lg('a', '#8f84ff', '#4034a8', '#1c1650'),
      glow(p('M41 98L52 87L47 85L56 71L50 71L58 54L43 75L49 77L39 91Z', '#ffe24a', N)) + p('M41 98L52 87L47 85L56 71L50 71L58 54L43 75L49 77L39 91Z', '#ffe24a', O1) +
      p('M17 102C11 85 15 67 30 65C45 67 49 85 43 102Z', 'url(#a)') +
      p('M30 72L26 80L30 80L27 90L34 78L30 78L33 72Z', '#ffe24a', O1) +
      el(23, 102, 6, 3.6, '#5a4ed0') + el(37, 102, 6, 3.6, '#5a4ed0') +
      sym(p('M19 46L15 26L28 40Z', '#4034a8') + p('M20 42L18 32L25 40Z', '#ffe24a', N), 60) +
      ci(30, 52, 14.5, 'url(#a)') + hi('M19 50C19 43 24 39 29 38C24 42 22 46 22 52Z', 0.3) +
      glow(el(24, 52, 4, 5, '#ffe24a', N)) + glow(el(36, 52, 4, 5, '#ffe24a', N)) + el(24, 52, 1.1, 4.4, INK, N) + el(36, 52, 1.1, 4.4, INK, N) +
      p('M28.500 58L31.500 58L30 60Z', '#ff9ab8', N) + ln('M30 60Q27 63 25 61M30 60Q33 63 35 61', INK, 1.1) +
      ln('M17 56L8 54L11 57L5 58M43 56L52 54L49 57L55 58', '#ffe24a', 1.1)],

    seixote: () => [lg('a', '#cdb89c', '#8a7058', '#4a382a') + lg('b', '#d8ffff', '#4fd0d8', '#1a7a8a'),
      glow(p('M13 78L8 52L22 70ZM22 70L25 40L33 66ZM33 66L42 44L43 70ZM43 72L54 54L49 80Z', 'url(#b)', N)) +
      p('M13 78L8 52L22 70Z', 'url(#b)') + p('M22 70L25 40L33 66Z', 'url(#b)') + p('M33 66L42 44L43 70Z', 'url(#b)') + p('M43 72L54 54L49 80Z', 'url(#b)') +
      hi('M25 40L27 66L22 70Z', 0.5) + hi('M42 44L39 67L33 66Z', 0.4) +
      el(20, 104, 6, 3.4, '#4a382a') + el(40, 104, 6, 3.4, '#4a382a') +
      p('M7 102C5 82 15 66 30 66C45 66 55 82 53 102C46 106 14 106 7 102Z', 'url(#a)') +
      ln('M14 76L19 82L16 88M44 74L41 80L45 84', '#3a2a1e', 1.2) + hi('M11 92C10 82 14 74 20 70C16 78 15 86 15 94Z', 0.3) +
      eye(23, 88, 4.4) + eye(37, 88, 4.4) + el(30, 96, 3, 2, INK, N) + ln('M26 100Q30 103 34 100', INK, 1.4)],

    cristalim: () => [lg('a', '#f0feff', '#6ad4f0', '#2a68b0') + rg('b', '#ffffff', '#ff8ae0', '#8a1a9a'),
      glow(p('M30 26L45 50L39 92L30 104L21 92L15 50Z', '#8fe8ff', N), 1) +
      p('M8 60L12 48L16 66L11 78Z', 'url(#a)') + p('M49 68L53 56L56 74L52 84Z', 'url(#a)') + p('M46 36L50 28L52 40L49 46Z', 'url(#a)') +
      p('M30 26L45 50L39 92L30 104L21 92L15 50Z', 'url(#a)') +
      p('M30 26L15 50L30 60Z', '#fff', `${N} opacity=".45"`) + p('M30 60L45 50L39 92L30 104Z', '#12408a', `${N} opacity=".35"`) +
      ln('M30 26V104M15 50L30 60L45 50', '#e8fbff', 0.9, 'opacity=".8"') +
      ci(30, 72, 7.5, '#fff', O1) + ci(30, 72, 4.4, 'url(#b)', N) + el(30, 72, 1.3, 3.6, INK, N) + ci(28, 69.500, 1.4, '#fff', N) +
      star(10, 30, 4) + star(50, 100, 3) + star(8, 96, 2.4) + el(30, 110, 12, 2.6, '#000', `${N} opacity=".35"`)],

    morceguim: () => [lg('a', '#8a66c8', '#3a2268', '#1c0f38') + lg('b', '#5a3a94', '#241244'),
      sym(p('M23 56L3 34C2 48 4 56 7 60C5 65 7 71 11 73C11 78 15 82 22 78Z', 'url(#b)') + ln('M23 57L7 60M23 60L11 73', INK, 1), 60) +
      el(30, 68, 9.500, 13, 'url(#a)') + el(30, 72, 5, 7, '#b79ae8', `${N} opacity=".5"`) +
      ln('M26 80L25 88M34 80L35 88', INK, 2) +
      sym(p('M23 44L19 26L30 41Z', '#3a2268') + p('M23.500 41L22 32L27.500 40Z', '#e89ac0', N), 60) +
      ci(30, 50, 10.500, 'url(#a)') +
      geye(25.500, 49, 2.8, 2.4, '#ff4a70') + geye(34.500, 49, 2.8, 2.4, '#ff4a70') +
      p('M27 54L28 58L29.200 54ZM30.800 54L32 58L33 54Z', '#fff', N) + el(30, 52.500, 1.2, 0.8, INK, N)],

    corvonoite: () => [lg('a', '#5c5c98', '#24244e', '#0c0c1e') + lg('b', '#ffd27a', '#c98a1a'),
      ln('M0 104C20 100 40 104 60 100', '#3a2618', 5) + ln('M26 98V104M36 98V104', '#c98a1a', 2) +
      p('M30 94L24 114L31 106L35 116L39 96Z', '#16163a') +
      p('M22 96C11 84 13 62 26 54C39 48 47 60 45 77C44 89 37 97 30 99Z', 'url(#a)') +
      p('M30 60C43 64 46 80 39 95C32 87 28 75 30 60Z', '#191940') + ln('M33 68C38 72 40 80 38 88M31 72C34 78 35 84 35 90', '#5c5c98', 1) +
      p('M33 38L41 24L38 38ZM28 36L32 22L33 37Z', '#24244e') +
      ci(29, 46, 11.500, 'url(#a)') + p('M20 44L3 52L20 55Z', 'url(#b)') + ln('M20 49.500L8 51.500', INK, 0.9) +
      glow(ci(27, 43, 3.4, '#d9a8ff', N)) + ci(27, 43, 1.3, INK, N) + hi('M21 40C22 36 26 34 30 34C26 37 24 40 23 44Z', 0.25)],

    salamagma: () => [lg('a', '#6a4246', '#2c161c', '#12080c') + rg('b', '#fffbd0', '#ffb02a', '#e0400a'),
      p('M92 80C110 82 116 66 108 54C103 47 94 50 97 57C101 64 99 70 90 70Z', 'url(#a)') + p('M104 50L112 44L112 56L104 58Z', '#3a2026') +
      p('M36 90L28 104H44L46 92Z', '#241216') + p('M78 90L74 104H90L88 90Z', '#241216') +
      glow(p('M40 60L45 46L51 58ZM54 58L60 42L66 58ZM68 60L76 46L80 64Z', '#ff8a1a', N)) + p('M40 60L45 46L51 58ZM54 58L60 42L66 58ZM68 60L76 46L80 64Z', 'url(#b)', O1) +
      p('M24 84C24 66 44 56 66 58C84 60 96 70 96 82C96 90 88 94 76 94H36C28 94 24 90 24 84Z', 'url(#a)') +
      glow(el(50, 72, 5, 4, 'url(#b)', N)) + glow(el(66, 70, 6.500, 5, 'url(#b)', N)) + glow(el(82, 76, 4, 3.4, 'url(#b)', N)) + glow(el(58, 84, 3, 2.4, 'url(#b)', N)) +
      p('M8 74C8 61 21 55 34 60C43 64 43 81 34 87C23 91 8 87 8 74Z', 'url(#a)') + hi('M13 68C15 62 22 59 29 61C22 62 18 66 16 72Z', 0.25) +
      glow(ln('M10 80Q21 85 33 80', '#ff8a1a', 1.8)) + geye(22, 69, 4.4, 3.6, '#ffe24a') + p('M15 64L28 63L26 66Z', INK, N) +
      ci(8, 62, 3, '#888', `${N} opacity=".3"`) + ci(4, 52, 4, '#999', `${N} opacity=".2"`) +
      el(60, 106, 44, 4, '#000', `${N} opacity=".4"`)],

    marolo: () => [lg('a', '#a8eaff', '#3a98e0', '#134a94'),
      p('M0 104C20 90 40 96 60 104C80 112 100 98 120 104V120H0Z', '#1668b8', `${N} opacity=".85"`) + ln('M4 102C20 92 38 96 54 103M70 106C86 108 100 100 116 103', '#e8fbff', 1.6, 'opacity=".8"') +
      p('M108 50C99 38 79 32 60 40C40 49 27 66 21 86L7 98L22 96L27 110L33 92C45 76 61 65 79 63C91 62 102 58 108 50Z', 'url(#a)') +
      p('M33 92C45 76 61 65 79 63C89 62 99 59 106 52C97 56 87 56 77 57C59 59 43 73 33 92Z', '#e6faff', `${N} opacity=".85"`) +
      p('M55 43C50 28 59 19 71 21C65 26 65 34 69 39Z', '#eafcff') +
      p('M70 63C69 76 61 82 53 83C58 76 60 70 61 65Z', '#1f6ec0') +
      hi('M96 44C86 38 72 38 62 43C74 40 86 42 96 47Z', 0.4) +
      eye(92, 48, 3.6) + ln('M97 54Q103 55 107 51', INK, 1.3) +
      ci(16, 78, 2, '#e8fbff', N) + ci(10, 68, 1.4, '#e8fbff', N) + ci(40, 104, 1.6, '#e8fbff', N) + ci(24, 60, 1.2, '#e8fbff', N)],

    espinheira: () => [lg('a', '#a4e87a', '#4a9a3a', '#1e5a26') + lg('b', '#ffa8d0', '#e0408a'),
      el(60, 104, 34, 5, '#000', `${N} opacity=".4"`) +
      p('M43 74C30 74 23 65 23 52C23 45 34 45 34 52C34 59 38 61 43 61Z', 'url(#a)') + p('M77 66C91 66 97 57 97 43C97 36 86 36 86 43C86 52 82 54 77 54Z', 'url(#a)') +
      p('M43 102C39 80 39 50 45 40C52 29 68 29 75 40C81 50 81 80 77 102Z', 'url(#a)') +
      ln('M52 36C49 56 49 80 51 100M68 36C71 56 71 80 69 100M60 32V100', '#2a6a2a', 1.2, 'opacity=".7"') + hi('M44 70C43 54 45 44 49 38C47 50 47 62 47 74Z', 0.35) +
      ln('M40 50l-5-2M40 84l-5 2M80 78l5-2M80 46l5-3M24 58l-5 0M28 46l-4-4M96 50l5 0M92 38l4-4M46 36l-3-5M74 36l3-5M40 66l-5 0M80 92l5 2', '#fffbe0', 1.3) +
      [0, 72, 144, 216, 288].map(a => el(60, 21, 4, 7, 'url(#b)', `${O1} transform="rotate(${a} 60 28)"`)).join('') + ci(60, 28, 3.4, '#ffe24a', O1) +
      p('M48 56L58 60L48 63Z', INK, N) + p('M72 56L62 60L72 63Z', INK, N) + geye(53, 61, 3, 2.6, '#ff5a4a') + geye(67, 61, 3, 2.6, '#ff5a4a') +
      p('M50 76L54 81L58 76L62 81L66 76L70 81L70 84L50 84Z', '#16300f', O1)],

    trovoave: () => [lg('a', '#6a7cff', '#2a36c0', '#141a5a') + lg('b', '#fff7a0', '#ffc02a'),
      p('M52 84L45 106L56 95L60 110L64 95L75 106L68 84Z', '#1c2690') +
      sym(p('M50 56C36 42 20 38 4 44C11 49 13 54 11 60C18 58 22 63 20 69C28 65 32 71 30 78C40 72 46 70 50 68Z', 'url(#a)') +
        glow(ln('M8 46C20 44 34 50 46 60M14 58C24 56 34 60 44 66', '#ffe24a', 1.2)), 120) +
      p('M60 44C73 44 77 60 73 79C69 91 51 91 47 79C43 60 47 44 60 44Z', 'url(#a)') +
      glow(p('M61 58L55 70L60 70L57 82L67 66L61 66L65 58Z', 'url(#b)', N)) +
      ln('M54 88L52 96M66 88L68 96', '#ffc02a', 2.4) +
      glow(p('M55 31L50 12L59 23L63 8L66 29Z', 'url(#b)', N)) + p('M55 31L50 12L59 23L63 8L66 29Z', 'url(#b)', O1) +
      ci(60, 40, 11.500, 'url(#a)') + p('M55.500 44L60 55L64.500 44Z', '#ffb02a') +
      p('M48 34L58 38L49 40Z', INK, N) + p('M72 34L62 38L71 40Z', INK, N) + geye(54, 39, 3, 2.4, '#fff7a0') + geye(66, 39, 3, 2.4, '#fff7a0')],

    cascudo: () => [lg('a', '#d8c09a', '#8e6e4a', '#4a3624') + lg('b', '#b4d07a', '#5a7a34', '#2e4a1e') + lg('c', '#d8ffff', '#4fd0d8'),
      el(62, 104, 46, 4.500, '#000', `${N} opacity=".4"`) +
      p('M104 80C112 80 116 86 114 90L102 88Z', 'url(#b)') +
      p('M30 82H47V96C47 101 29 101 29 96Z', 'url(#b)') + p('M80 82H98V96C98 101 80 101 80 96Z', 'url(#b)') +
      p('M24 78C11 78 3 71 5 62C7 53 20 53 27 61L30 78Z', 'url(#b)') + eye(13, 63, 3.2) + ln('M6 70Q12 73 18 71', INK, 1.3) +
      glow(p('M52 40L56 22L64 38ZM70 38L78 26L80 42Z', 'url(#c)', N)) + p('M52 40L56 22L64 38Z', 'url(#c)') + p('M70 38L78 26L80 42Z', 'url(#c)') +
      p('M22 80C22 52 44 37 64 37C86 37 106 53 106 80Z', 'url(#a)') +
      ln('M44 44L50 60L38 72M50 60H74L82 44M74 60L88 72L104 68M38 72L44 80M88 72L84 80M24 70L38 72', '#4a3624', 1.6) +
      hi('M30 72C32 56 42 46 54 42C44 50 38 60 36 74Z', 0.3) +
      el(40, 46, 7, 3, '#5a9a3a', O1) + el(92, 58, 6, 2.6, '#5a9a3a', O1) +
      `<rect x="17" y="77" width="93" height="8" rx="4" fill="#7a5a3c" ${O}/>`],

    espectrolho: () => [lg('a', '#c8a4ff', '#6a3ab8', '#2a1058') + rg('b', '#ffd0f4', '#ff4ac8', '#6a0a70'),
      glow(p('M60 20C85 20 97 41 97 64C97 80 101 92 105 103C97 99 90 99 86 105C82 99 76 97 72 105C68 99 62 97 58 105C54 99 48 97 44 105C40 99 32 97 21 103C26 91 23 80 23 64C23 41 35 20 60 20Z', '#8a5ae0', `${N} opacity=".5"`), 1) +
      sym(p('M26 62C13 60 7 68 9 80C15 73 21 73 26 75Z', 'url(#a)'), 120) +
      p('M60 20C85 20 97 41 97 64C97 80 101 92 105 103C97 99 90 99 86 105C82 99 76 97 72 105C68 99 62 97 58 105C54 99 48 97 44 105C40 99 32 97 21 103C26 91 23 80 23 64C23 41 35 20 60 20Z', 'url(#a)') +
      hi('M32 58C32 42 40 30 52 26C42 34 38 46 38 60Z', 0.3) +
      el(60, 56, 21, 17, '#fff8ff', O) + ci(60, 57, 11.500, 'url(#b)', O1) + el(60, 57, 3, 9.500, INK, N) + ci(55, 51, 3, '#fff', N) +
      p('M38 50C44 36 76 36 82 50C74 42 46 42 38 50Z', '#3a1870', N) +
      ln('M50 84Q60 90 70 84', INK, 1.8) +
      glow(ci(14, 36, 2.4, '#e0a8ff', N)) + glow(ci(104, 44, 1.8, '#e0a8ff', N)) + glow(ci(100, 24, 1.4, '#e0a8ff', N))],

    dracovulcao: () => [lg('a', '#7a4448', '#32181e', '#12080c') + rg('b', '#fffbd0', '#ffb02a', '#e0400a') + lg('c', '#fff0d0', '#b8946a'),
      p('M118 70L127 42L137 66Z', 'url(#a)') + p('M138 68L151 46L157 74Z', 'url(#a)') + p('M156 78L171 60L171 90Z', 'url(#a)') +
      glow(p('M124.500 50L127 42L130 50ZM147.500 52L151 46L153 53ZM166.500 66L171 60L171 67Z', '#ffb02a', N)) +
      p('M68 120C73 96 92 80 112 70C136 60 165 72 177 100L180 120Z', 'url(#a)') +
      glow(ln('M94 104L106 94L117 102L130 91L144 100L157 93L168 104', '#ff8a1a', 2)) + glow(ln('M117 102L120 114M144 100L141 112', '#ff8a1a', 1.6)) +
      p('M70 38C76 25 87 18 98 18C89 25 85 32 83 41Z', 'url(#c)') + p('M84 43C96 30 113 27 126 33C113 34 103 43 99 53Z', 'url(#c)') +
      glow(p('M24 70C11 65 2 71 0 82C6 77 12 79 14 84C18 79 23 79 27 83Z', 'url(#b)', N), 1) + p('M24 70C11 65 2 71 0 82C6 77 12 79 14 84C18 79 23 79 27 83Z', 'url(#b)', N) +
      p('M20 62C24 51 40 42 60 38C81 34 101 44 103 60C105 74 97 84 85 87C70 91 50 93 36 91C30 90 26 87 26 83L58 74L22 70Z', 'url(#a)') +
      glow(p('M26 83L58 74L22 70C22 75 23 80 26 83Z', 'url(#b)', N)) +
      p('M27 71L30 76.500L33 71.800ZM36 72.500L39 77.500L42 73ZM45 73.200L48 77.500L51 73.600Z', '#fff8e0', N) + p('M32 81L34.500 76.500L37.500 79.500ZM42 78.500L44.500 74.500L47.500 77Z', '#fff8e0', N) +
      hi('M32 54C42 46 56 42 70 42C56 46 44 52 36 60Z', 0.2) +
      p('M48 47L76 50L73 43Z', INK, N) + geye(63, 55, 6, 4.4, '#ffe24a') +
      glow(ln('M78 70L86 64L92 72', '#ff8a1a', 1.6)) + ci(30, 58, 1.6, INK, N)],

    abissal: () => [lg('a', '#5a8ae8', '#1a3a98', '#080f3a') + lg('b', '#f0feff', '#8adcf0'),
      p('M90 35L97 16L105 37Z', 'url(#b)') + p('M108 39L119 22L123 43Z', 'url(#b)') + p('M126 44L134 34L137 49Z', 'url(#b)') +
      p('M70 88C76 105 90 112 101 110C93 103 89 95 87 88Z', '#12287a') +
      p('M12 70C12 46 44 32 84 34C120 36 146 50 160 66L178 48L172 76L179 98L158 82C140 96 108 102 76 100C40 98 12 90 12 70Z', 'url(#a)') +
      p('M14 77C30 92 60 98 92 98C70 91 40 86 14 77Z', '#b4dcff', `${N} opacity=".5"`) + ln('M22 84C40 92 62 95 84 96M30 82C46 88 64 91 80 92', '#dff', 0.8, 'opacity=".5"') +
      hi('M24 58C36 44 60 38 84 38C60 42 40 50 30 62Z', 0.22) +
      ln('M12 72C30 81 50 81 64 74', INK, 1.8) +
      [58, 72, 86, 100, 114, 128, 142].map((x, i) => glow(ci(x, 60 + Math.sin(i) * 3 + i, 2.2 - i * 0.12, '#7ff5ff', N))).join('') +
      geye(40, 63, 4.4, 4, '#7ff5ff') +
      ln('M32 46C26 30 15 27 9 34', INK, 3.4) + ln('M32 46C26 30 15 27 9 34', '#3a6ad0', 1.6) + glow(ci(9, 36, 4.500, '#b4ffff', N), 1) +
      ci(22, 20, 2.4, 'none', 'stroke="#dff" stroke-width="1" opacity=".7"') + ci(150, 30, 3, 'none', 'stroke="#dff" stroke-width="1" opacity=".6"') + ci(166, 108, 2, 'none', 'stroke="#dff" stroke-width="1" opacity=".6"')],

    carvalhao: () => {
      const cs = [[48, 42, 25], [90, 28, 29], [132, 42, 25], [68, 54, 17], [112, 54, 17]];
      return [lg('a', '#9a6a44', '#5a3822', '#2a180e') + rg('b', '#a8ee6a', '#3f9a3a', '#165022'),
        ln('M66 82C48 78 34 84 24 97M24 97L15 92M24 97L16 103M24 97L27 107', INK, 10) + ln('M66 82C48 78 34 84 24 97M24 97L15 92M24 97L16 103M24 97L27 107', '#6a4428', 6.500) +
        ln('M114 82C132 78 146 84 156 97M156 97L165 92M156 97L164 103M156 97L153 107', INK, 10) + ln('M114 82C132 78 146 84 156 97M156 97L165 92M156 97L164 103M156 97L153 107', '#6a4428', 6.500) +
        p('M62 120C54 113 44 114 36 120ZM118 120C126 113 136 114 144 120Z', '#3a2214') +
        p('M64 120C70 98 66 78 60 60L78 66L89 54L101 66L120 60C114 78 110 98 116 120Z', 'url(#a)') +
        ln('M72 74C72 90 70 104 68 116M108 74C108 90 110 104 112 116M90 66V74', '#2a180e', 1.2, 'opacity=".7"') +
        cs.map(c => ci(c[0], c[1], c[2], '#0f3a18', `stroke="${INK}" stroke-width="4"`)).join('') + cs.map(c => ci(c[0], c[1], c[2], 'url(#b)', N)).join('') +
        hi('M32 36C36 24 46 18 56 20C46 24 40 30 38 40ZM70 20C76 8 90 2 102 4C90 8 80 14 76 24Z', 0.3) +
        [[40, 50], [76, 36], [106, 20], [128, 52], [96, 56], [60, 26]].map(c => glow(ci(c[0], c[1], 2.6, '#d07aff', N))).join('') +
        p('M70 78L86 83L72 87Z', INK, N) + p('M110 78L94 83L108 87Z', INK, N) + geye(79, 86, 4.400, 4, '#e8ff6a') + geye(101, 86, 4.400, 4, '#e8ff6a') +
        p('M77 101Q90 111 103 101Q90 104 77 101Z', '#160b0a', O1) +
        el(72, 112, 4, 2.4, '#ff9a6a', O1) + ln('M72 113V118', '#fff0d8', 2)];
    },

    tempestouro: () => [lg('a', '#7a8ac8', '#34407e', '#141838') + lg('b', '#e0e6ff', '#7a84b0') + lg('c', '#fff7a0', '#ffc02a'),
      el(100, 113, 62, 4.500, '#000', `${N} opacity=".4"`) +
      ln('M158 70C172 64 177 76 172 88', INK, 4.400) + ln('M158 70C172 64 177 76 172 88', '#34407e', 2.2) + glow(p('M172 86L177 94L173 94L176 102L167 92L171 92Z', 'url(#c)', N)) +
      p('M84 92L84 113H95L95 94Z', '#1a2048') + p('M116 94L114 113H125L127 94Z', '#1a2048') +
      p('M66 90L59 113H71L77 92Z', '#242c60') + p('M132 90L139 113H151L147 88Z', '#242c60') +
      p('M52 60C70 46 110 44 136 52C154 58 163 72 159 88L150 92C140 97 100 99 76 95C60 93 50 85 48 74Z', 'url(#a)') +
      hi('M62 62C78 52 104 50 126 54C104 54 82 58 68 68Z', 0.2) +
      [[80, 46, 13], [100, 39, 16], [122, 46, 13]].map(c => ci(c[0], c[1], c[2], '#141838', `stroke="${INK}" stroke-width="4"`)).join('') + [[80, 46, 13], [100, 39, 16], [122, 46, 13]].map(c => ci(c[0], c[1], c[2], 'url(#b)', N)).join('') +
      glow(ln('M88 60L84 68L89 68L85 78M114 60L118 67L113 68L117 76', '#ffe24a', 1.5)) +
      glow(p('M46 52L40 38L45 40L40 24L54 42L48 42L54 52Z', 'url(#c)', N)) + p('M46 52L40 38L45 40L40 24L54 42L48 42L54 52Z', 'url(#c)', O1) +
      p('M22 70C22 56 36 48 50 52C60 56 62 70 58 82C54 92 40 96 30 92C24 88 22 80 22 70Z', 'url(#a)') +
      glow(p('M32 54L24 40L30 42L22 24L39 44L33 44L41 54Z', 'url(#c)', N)) + p('M32 54L24 40L30 42L22 24L39 44L33 44L41 54Z', 'url(#c)', O1) +
      el(31, 84, 9, 7, '#a8b4e8') + el(27.500, 84, 1.4, 2, INK, N) + el(34, 85, 1.4, 2, INK, N) + ci(30, 91, 3.4, 'none', 'stroke="#ffc02a" stroke-width="1.6"') +
      p('M34 60L48 63L45 57Z', INK, N) + geye(42, 66, 3.600, 3, '#fff7a0') +
      ln('M20 78L10 76M21 84L12 86', '#e0e6ff', 1.2, 'opacity=".7"')],

    golemonte: () => [lg('a', '#cbb89e', '#857460', '#3e342c') + lg('b', '#d8ffff', '#4fd0d8', '#1a7a8a'),
      el(90, 116, 70, 4, '#000', `${N} opacity=".4"`) +
      glow(p('M34 46L30 24L44 42ZM146 46L152 22L138 42Z', 'url(#b)', N)) + p('M34 46L30 24L44 42Z', 'url(#b)') + p('M146 46L152 22L138 42Z', 'url(#b)') +
      p('M58 120C54 96 56 70 66 58H114C124 70 126 96 122 120Z', 'url(#a)') +
      sym(p('M30 66L36 46L56 40L70 54L66 76L44 82Z', 'url(#a)') + hi('M36 62L40 49L54 45L44 54Z', 0.3) +
        p('M24 82L46 82L52 108L40 120H18L11 104Z', 'url(#a)') + ln('M20 104H44M28 104V118M36 104V118', '#3e342c', 1.4) + el(46, 44, 8, 3, '#5a9a3a', O1), 180) +
      p('M71 58C69 40 77 29 90 29C103 29 111 40 109 58Z', 'url(#a)') + hi('M76 52C76 42 80 35 87 33C82 38 80 44 80 52Z', 0.3) +
      glow(`<rect x="77" y="43" width="9" height="4.500" rx="1" fill="#8ff8ff"/><rect x="94" y="43" width="9" height="4.500" rx="1" fill="#8ff8ff"/>`) +
      ln('M84 53H96', '#3e342c', 1.6) +
      glow(ln('M90 70L101 84L90 98L79 84Z', '#8ff8ff', 2.2), 1) + glow(ci(90, 84, 3, '#d8ffff', N)) +
      glow(ln('M66 96L74 104L70 114M114 92L108 102L112 112', '#8ff8ff', 1.2)) +
      ln('M62 76L70 80L66 88M118 70L112 76', '#3e342c', 1.2)],

    devorador: () => {
      const tent = (d, sk) => ln(d, INK, 10.500) + ln(d, 'url(#c)', 7) + sk.map(s => ci(s[0], s[1], 1.3, '#f0b8ff', N)).join('');
      const side = tent('M62 70C42 76 24 66 15 50C11 43 18 37 22 44', [[48, 73], [36, 69], [26, 61], [19, 51]]) +
        tent('M66 79C50 96 30 101 13 93C6 89 9 80 15 85', [[55, 90], [43, 96], [30, 97], [19, 93]]) +
        tent('M78 84C72 100 60 110 45 115', [[73, 96], [65, 105], [55, 111]]) + tent('M86 86C84 98 87 108 82 118', [[85, 98], [85, 108]]);
      return [lg('a', '#b074f0', '#5a2a9a', '#220c40') + lg('c', '#8a4ad0', '#3a1870'),
        sym(side, 180) +
        glow(p('M90 12C117 12 131 35 127 60C125 75 112 84 90 84C68 84 55 75 53 60C49 35 63 12 90 12Z', '#7a3ad0', `${N} opacity=".5"`), 1) +
        p('M90 12C117 12 131 35 127 60C125 75 112 84 90 84C68 84 55 75 53 60C49 35 63 12 90 12Z', 'url(#a)') +
        hi('M62 48C62 32 72 20 84 17C74 24 68 36 68 50Z', 0.28) +
        el(104, 30, 5, 3.4, '#d8a8ff', `${N} opacity=".4"`) + el(112, 44, 3, 2.2, '#d8a8ff', `${N} opacity=".4"`) + el(96, 22, 2.4, 1.8, '#d8a8ff', `${N} opacity=".4"`) +
        glow(ln('M84 28L90 22L96 28M90 22V36', '#7ff5ff', 1.4)) +
        p('M64 50L84 55L66 58Z', INK, N) + p('M116 50L96 55L114 58Z', INK, N) +
        glow(el(76, 60, 7.500, 5.400, '#ffe24a', N)) + glow(el(104, 60, 7.500, 5.400, '#ffe24a', N)) +
        `<rect x="70" y="58.600" width="12" height="2.800" rx="1.4" fill="${INK}"/><rect x="98" y="58.600" width="12" height="2.800" rx="1.4" fill="${INK}"/>` +
        p('M84 74L90 82L96 74Z', '#160b1c', O1)];
    },
  };

  const cache = {};
  function card(def) {
    if (cache[def.id]) return cache[def.id];
    const w = def.size * 60, r = rng(def.id);
    const [bgDefs, bgBody] = BG[def.type](w, r).split('|');
    const [d, s] = CR[def.id]();
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} 120" preserveAspectRatio="xMidYMid slice"><defs>${FILT}${bgDefs}${d}
      <radialGradient id="spot" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".34"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
      <radialGradient id="vig" cx=".5" cy=".5" r=".72"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".62"/></radialGradient></defs>
      ${bgBody}<ellipse cx="${w / 2}" cy="64" rx="${w * 0.6}" ry="50" fill="url(#spot)"/>${s}<rect width="${w}" height="120" fill="url(#vig)"/></svg>`;
    return cache[def.id] = uri(svg);
  }

  /* ---------- retratos ---------- */
  function portrait(seed, hero) {
    const key = 'p:' + seed + (hero ? 'h' : '');
    if (cache[key]) return cache[key];
    const r = rng('pt' + seed);
    const hue = hero ? 178 : Math.floor(r() * 360), v = hero ? 0 : Math.floor(r() * 3);
    const c1 = `hsl(${hue} 55% 48%)`, c2 = `hsl(${hue} 60% 20%)`, eyeC = hero ? '#ffe27a' : `hsl(${(hue + 150) % 360} 100% 72%)`, trim = '#e8bc4a';
    let s = `<rect width="100" height="100" fill="url(#bg)"/>` + ci(50, 44, 40, `hsl(${hue} 80% 70%)`, `${N} opacity=".18" filter="url(#gl2)"`);
    s += p('M6 100C8 78 28 68 50 68C72 68 92 78 94 100Z', 'url(#a)');
    if (v === 0) {
      s += p('M50 10C74 10 82 34 80 57C78 72 67 80 50 80C33 80 22 72 20 57C18 34 26 10 50 10Z', 'url(#a)') + el(50, 51, 19, 23, '#120a18') +
        ln('M31 50C31 34 38 22 50 22C62 22 69 34 69 50', trim, 2) + hi('M26 46C26 30 32 18 44 14C36 22 32 34 32 48Z', 0.25) +
        glow(el(42, 51, 4.400, 2.600, eyeC, N)) + glow(el(58, 51, 4.400, 2.600, eyeC, N)) + p('M44 80L50 90L56 80Z', trim);
    } else if (v === 1) {
      s += el(50, 54, 16, 19, '#e8b890') + p('M34 62C38 76 62 76 66 62L66 74C60 84 40 84 34 74Z', c1) +
        p('M28 36C28 12 72 12 72 36Z', 'url(#a)') + el(50, 36, 42, 8, c2) + ln('M30 32H70', trim, 3) +
        el(43, 52, 2.4, 3, '#120a18', N) + el(57, 52, 2.4, 3, '#120a18', N) + ln('M38 46L47 48M62 46L53 48', '#120a18', 1.8) + p('M66 20C76 8 86 10 88 18C82 16 76 20 72 28Z', eyeC);
    } else {
      s += sym(p('M28 34C14 30 8 18 12 6C18 18 26 22 34 24Z', '#f0e2c4'), 100) +
        p('M24 60C22 30 32 14 50 14C68 14 78 30 76 60C76 72 66 80 50 80C34 80 24 72 24 60Z', 'url(#a)') +
        p('M32 46H68V56C60 60 54 60 50 66C46 60 40 60 32 56Z', '#120a18') + ln('M50 14V44', trim, 2.4) + hi('M30 50C30 32 36 22 46 18C38 26 35 38 35 52Z', 0.25) +
        glow(el(41, 51, 4.400, 2.400, eyeC, N)) + glow(el(59, 51, 4.400, 2.400, eyeC, N));
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs>${FILT}${lg('bg', `hsl(${hue} 45% 22%)`, `hsl(${hue} 60% 8%)`)}${lg('a', c1, c2)}</defs>${s}</svg>`;
    return cache[key] = uri(svg);
  }

  /* ---------- cenário de fundo ---------- */
  function scene() {
    const r = rng('scene');
    let s = `<rect width="1600" height="900" fill="url(#sky)"/>`;
    for (let i = 0; i < 170; i++) s += ci(r() * 1600, r() * 520, 0.5 + r() * 1.5, '#fff', `${N} opacity="${0.25 + r() * 0.75}"`);
    s += `<circle cx="1280" cy="150" r="130" fill="#b9a4ff" opacity=".16" filter="url(#gl2)"/>` + ci(1280, 150, 56, '#f3ebff', N) + ci(1262, 136, 12, '#d9cdf2', N) + ci(1300, 170, 8, '#d9cdf2', N) + ci(1292, 128, 5, '#d9cdf2', N);
    let d = 'M0 600'; for (let x = 0; x <= 1600; x += 80) d += `L${x} ${470 + r() * 110}`;
    s += p(d + 'L1600 900L0 900Z', '#1d1740', N);
    d = 'M0 680'; for (let x = 0; x <= 1600; x += 60) d += `L${x} ${590 + r() * 70}`;
    s += p(d + 'L1600 900L0 900Z', '#130f2c', N);
    const tent = (x, y, w, h, c) => {
      let t = p(`M${x - w / 2} ${y}L${x} ${y - h}L${x + w / 2} ${y}Z`, c, N);
      for (let i = 0; i < 3; i++) { const a = x - w / 2 + (w / 6) * (i * 2 + 0.5), b = a + w / 6; t += p(`M${a} ${y}L${x} ${y - h}L${b} ${y}Z`, '#000', `${N} opacity=".25"`); }
      t += `<rect x="${x - w * 0.42}" y="${y}" width="${w * 0.84}" height="${h * 0.7}" fill="#0b0918"/>`;
      t += `<rect x="${x - w * 0.12}" y="${y + h * 0.15}" width="${w * 0.24}" height="${h * 0.55}" fill="#ffb347" opacity=".85"/>`;
      t += `<circle cx="${x}" cy="${y + h * 0.3}" r="${w * 0.42}" fill="#ff9a3a" opacity=".22" filter="url(#gl2)"/>`;
      t += ln(`M${x} ${y - h}V${y - h - 22}`, '#0b0918', 3) + p(`M${x} ${y - h - 22}l18 6l-18 6z`, c, N);
      return t;
    };
    s += tent(150, 700, 240, 120, '#7a2434') + tent(400, 730, 180, 90, '#2a5a7a') + tent(1230, 730, 190, 96, '#6a4a1a') + tent(1470, 700, 250, 124, '#4a2a7a');
    s += ln('M30 560Q400 660 800 580T1570 560', '#0b0918', 2);
    for (let i = 0; i <= 24; i++) { const t = i / 24, x = 30 + t * 1540, y = 560 + Math.sin(t * Math.PI * 2) * 46 + (t < 0.5 ? 40 : -6) * Math.sin(t * Math.PI); s += `<circle cx="${x}" cy="${y + 8}" r="5" fill="${['#ffcf5a', '#ff7a5a', '#7ad0ff', '#b8ff7a'][i % 4]}"/><circle cx="${x}" cy="${y + 8}" r="16" fill="${['#ffcf5a', '#ff7a5a', '#7ad0ff', '#b8ff7a'][i % 4]}" opacity=".25" filter="url(#gl2)"/>`; }
    s += `<rect y="800" width="1600" height="100" fill="#0a0816"/>`;
    return uri(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice"><defs><filter id="gl2" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="14"/></filter>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#060821"/><stop offset=".4" stop-color="#1b1548"/><stop offset=".62" stop-color="#4b2a5e"/><stop offset=".76" stop-color="#b45f3c"/><stop offset="1" stop-color="#1a1020"/></linearGradient></defs>${s}</svg>`);
  }

  /* ---------- ícones ---------- */
  const IC = {
    coin: '<circle cx="12" cy="12" r="10" fill="#f6c93a" stroke="#7a4e08" stroke-width="1.6"/><circle cx="12" cy="12" r="6.200" fill="none" stroke="#a8740e" stroke-width="1.4"/><path d="M12 8.500l3 3.500-3 3.500-3-3.500z" fill="#a8740e"/><path d="M6 8a7.500 7.500 0 015-3.400" stroke="#fff6c0" stroke-width="1.6" fill="none" stroke-linecap="round"/>',
    heart: '<path d="M12 21C4 14.500 2 10.500 2 7.500a5.200 5.200 0 0110-1.800 5.200 5.200 0 0110 1.800c0 3-2 7-10 13.500z" fill="currentColor" stroke="#0008" stroke-width="1.2"/>',
    crown: '<path d="M3 18.500h18l1.500-11-5.500 4.500-5-8-5 8L1.500 7.500z" fill="currentColor" stroke="#0008" stroke-width="1.2" stroke-linejoin="round"/>',
    dmg: '<path d="M20.500 2l1.500 1.500-1 3.500-9 9 1.800 1.800-1.800 1.800-2.200-2.200-3.600 3.600-2.400-2.400 3.600-3.600-2.200-2.200 1.800-1.800 1.800 1.800 9-9z" fill="currentColor"/>',
    shield: '<path d="M12 2l8.500 3v6.500c0 5-3.700 8.800-8.500 10.500-4.800-1.700-8.500-5.500-8.500-10.500V5z" fill="currentColor"/>',
    heal: '<path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6z" fill="currentColor"/>',
    burn: '<path d="M12.500 1.500c.8 4.200 6 6.500 6 12.500a6.500 6.500 0 01-13 0c0-3 2-4.500 2.200-7.500 2 .8 3 2.200 3.200 4.200 1.200-2.700 1.800-5.700 1.600-9.200z" fill="currentColor"/>',
    poison: '<path d="M12 1.500c4 6 7.500 9.300 7.500 13.500a7.500 7.500 0 01-15 0c0-4.200 3.500-7.500 7.500-13.500z" fill="currentColor"/><circle cx="9.500" cy="14" r="1.600" fill="#0006"/><circle cx="14.500" cy="14" r="1.600" fill="#0006"/>',
    haste: '<path d="M13.500 1.500L4 14h6.500l-1.200 8.500L19 10h-6.500z" fill="currentColor"/>',
    freeze: '<path d="M12 2v20M3.300 7l17.400 10M20.700 7L3.300 17M12 6l-2.500-2.500M12 6l2.500-2.500M12 18l-2.500 2.500M12 18l2.500 2.500" stroke="currentColor" stroke-width="2.200" fill="none" stroke-linecap="round"/>',
    slow: '<path d="M6 2h12v4.500l-4.200 5.500 4.200 5.500V22H6v-4.500l4.200-5.500L6 6.500z" fill="currentColor"/>',
    clock: '<circle cx="12" cy="12" r="9.500" fill="none" stroke="currentColor" stroke-width="2.400"/><path d="M12 6.500V12l4 2.500" stroke="currentColor" stroke-width="2.400" fill="none" stroke-linecap="round"/>',
    refresh: '<path d="M20 12a8 8 0 11-2.400-5.700M20 3v5.500h-5.500" stroke="currentColor" stroke-width="2.600" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
    skip: '<path d="M4 4l10 8-10 8zM16 4h4v16h-4z" fill="currentColor"/>',
    bag: '<path d="M5.500 8.500h13L20.500 21h-17zM9 8.500V6.500a3 3 0 016 0v2" fill="none" stroke="currentColor" stroke-width="2.200" stroke-linejoin="round"/>',
    sun: '<circle cx="12" cy="12" r="4.600" fill="currentColor"/><path d="M12 1.500v3.500M12 19v3.500M1.500 12H5M19 12h3.500M4.500 4.500L7 7M17 17l2.500 2.500M19.500 4.500L17 7M7 17l-2.500 2.500" stroke="currentColor" stroke-width="2.200" stroke-linecap="round"/>',
    buff: '<path d="M12 3l8 9h-5v9H9v-9H4z" fill="currentColor"/>',
    charge: '<path d="M4 5l8 7-8 7zM12 5l8 7-8 7z" fill="currentColor"/>',
    fogo: '<path d="M12.500 1.500c.8 4.200 6 6.500 6 12.500a6.500 6.500 0 01-13 0c0-3 2-4.500 2.200-7.500 2 .8 3 2.200 3.200 4.200 1.200-2.700 1.800-5.700 1.600-9.200z" fill="currentColor"/>',
    agua: '<path d="M12 1.500c4 6 7.500 9.300 7.500 13.500a7.500 7.500 0 01-15 0c0-4.200 3.500-7.500 7.500-13.500z" fill="currentColor"/>',
    planta: '<path d="M3.500 20.500C3.500 10 10 3.500 20.500 3.500 20.500 14 14 20.500 3.500 20.500z" fill="currentColor"/><path d="M4 20L14 10" stroke="#0006" stroke-width="1.600"/>',
    raio: '<path d="M13.500 1.500L4 14h6.500l-1.200 8.500L19 10h-6.500z" fill="currentColor"/>',
    pedra: '<path d="M7 3.500h10l5.500 8.500-5.500 8.500H7L1.500 12z" fill="currentColor"/><path d="M7 3.500l5 8.500 5-8.500M12 12v8.500" stroke="#0005" stroke-width="1.400" fill="none"/>',
    sombra: '<path d="M20.500 14.500A9.500 9.500 0 119.500 3.500a7.500 7.500 0 0011 11z" fill="currentColor"/>',
  };
  const icon = (n, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true">${IC[n]}</svg>`;

  return { card, portrait, scene, icon };
})();
