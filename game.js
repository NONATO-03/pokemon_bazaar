'use strict';
/* Bazar de Monstros — auto-batalha de cartas com loja, tabuleiro e recargas. */

const $ = s => document.querySelector(s);
const R = n => Math.floor(Math.random() * n);
const pick = a => a[R(a.length)];
const I = ART.icon;

const TYPES = {
  fogo: { n: 'Fogo', c: '#ff6a1a' }, agua: { n: 'Água', c: '#3aa8ff' }, planta: { n: 'Planta', c: '#6ade5a' },
  raio: { n: 'Raio', c: '#ffe24a' }, pedra: { n: 'Pedra', c: '#d9b888' }, sombra: { n: 'Sombra', c: '#b07aff' },
};
const TIERS = ['Bronze', 'Prata', 'Ouro', 'Diamante'];
const MULT = [1, 2, 4, 8];
const BOARD_CAP = 10, BAG_CAP = 5, WINS_GOAL = 10, START_LIVES = 5;

/* ---------- cartas ---------- */
const DEFS = [];
const C = (id, name, type, size, cd, fx, ally) => DEFS.push({ id, name, type, size, cd, fx, ally, cost: size * 3 });

C('brasinha', 'Brasinha', 'fogo', 1, 4, [{ k: 'burn', v: 3 }]);
C('fornalhito', 'Fornalhito', 'fogo', 1, 5, [{ k: 'buff', t: 'adj', v: 3 }]);
C('salamagma', 'Salamagma', 'fogo', 2, 6, [{ k: 'dmg', v: 20 }, { k: 'burn', v: 4 }]);
C('dracovulcao', 'Dracovulcão', 'fogo', 3, 9, [{ k: 'dmg', v: 60 }, { k: 'burn', v: 8 }], { type: 'fogo', fx: [{ k: 'charge', t: 'self', d: 1 }] });
C('gotinha', 'Gotinha', 'agua', 1, 4, [{ k: 'heal', v: 10 }]);
C('conchudo', 'Conchudo', 'agua', 1, 5, [{ k: 'shield', v: 15 }]);
C('marolo', 'Marolo', 'agua', 2, 5, [{ k: 'dmg', v: 15 }, { k: 'slow', n: 1, d: 2 }]);
C('abissal', 'Abissal', 'agua', 3, 10, [{ k: 'dmg', v: 50 }, { k: 'shield', v: 40 }, { k: 'freeze', n: 2, d: 3 }]);
C('brotinho', 'Brotinho', 'planta', 1, 5, [{ k: 'poison', v: 2 }]);
C('cogumelino', 'Cogumelino', 'planta', 1, 6, [{ k: 'poison', v: 1 }, { k: 'heal', v: 8 }]);
C('espinheira', 'Espinheira', 'planta', 2, 6, [{ k: 'dmg', v: 12 }, { k: 'poison', v: 3 }]);
C('carvalhao', 'Carvalhão', 'planta', 3, 8, [{ k: 'poison', v: 4 }, { k: 'heal', v: 30 }, { k: 'shield', v: 20 }]);
C('zumbizap', 'Zumbizap', 'raio', 1, 3, [{ k: 'dmg', v: 6 }]);
C('voltagato', 'Voltagato', 'raio', 1, 5, [{ k: 'haste', t: 'adj', d: 2 }]);
C('trovoave', 'Trovoave', 'raio', 2, 5, [{ k: 'dmg', v: 18 }, { k: 'charge', t: 'adj', d: 1 }]);
C('tempestouro', 'Tempestouro', 'raio', 3, 7, [{ k: 'dmg', v: 35 }, { k: 'haste', t: 'all', d: 2 }]);
C('seixote', 'Seixote', 'pedra', 1, 5, [{ k: 'shield', v: 12 }, { k: 'dmg', v: 5 }]);
C('cristalim', 'Cristalim', 'pedra', 1, 5, [{ k: 'dmg', v: 5 }, { k: 'buff', t: 'self', v: 3 }]);
C('cascudo', 'Cascudo', 'pedra', 2, 7, [{ k: 'shield', v: 35 }]);
C('golemonte', 'Golemonte', 'pedra', 3, 10, [{ k: 'shield', v: 30 }, { k: 'dmg', scale: true }]);
C('morceguim', 'Morceguim', 'sombra', 1, 4, [{ k: 'dmg', v: 7, ls: true }]);
C('corvonoite', 'Corvonoite', 'sombra', 1, 5, [{ k: 'dmg', v: 10, crit: 0.4 }]);
C('espectrolho', 'Espectrolho', 'sombra', 2, 6, [{ k: 'dmg', v: 14 }, { k: 'slow', n: 2, d: 2 }]);
C('devorador', 'Devorador', 'sombra', 3, 8, [{ k: 'dmg', v: 30, ls: true }, { k: 'buff', t: 'self', v: 10 }]);

const TG = { self: 'esta carta', adj: 'as cartas vizinhas', all: 'suas outras cartas' };
const num = (k, v) => `<b class="k-${k}">${v}</b>`;
function fxText(x, m) {
  switch (x.k) {
    case 'dmg': return (x.scale ? `Causa dano igual ao seu ${num('shield', 'escudo')}` : `Causa ${num('dmg', x.v * m)} de dano`) +
      (x.crit ? ` (${x.crit * 100}% de chance de dobrar)` : '') + (x.ls ? ` e ${num('heal', 'cura')} o mesmo valor` : '');
    case 'shield': return `Ganha ${num('shield', x.v * m)} de escudo`;
    case 'heal': return `Cura ${num('heal', x.v * m)} de vida`;
    case 'burn': return `Aplica ${num('burn', x.v * m)} de queimadura`;
    case 'poison': return `Aplica ${num('poison', x.v * m)} de veneno`;
    case 'haste': return `Acelera ${TG[x.t]} por ${num('haste', x.d + 's')}`;
    case 'slow': return `Deixa ${x.n} carta${x.n > 1 ? 's' : ''} inimiga${x.n > 1 ? 's' : ''} lenta${x.n > 1 ? 's' : ''} por ${num('freeze', x.d + 's')}`;
    case 'freeze': return `Congela ${x.n} carta${x.n > 1 ? 's' : ''} inimiga${x.n > 1 ? 's' : ''} por ${num('freeze', x.d + 's')}`;
    case 'charge': return `Adianta ${TG[x.t]} em ${num('haste', x.d + 's')}`;
    case 'buff': return `Dá ${num('dmg', '+' + x.v * m)} de dano para ${TG[x.t]}`;
  }
}
const price = c => c.d.cost * MULT[c.t];
const sellValue = c => Math.max(1, Math.floor(price(c) / 2));

/* ---------- batalha (simulação) ---------- */
function mkSide(id, name, hp, cards) {
  const cnt = {};
  cards.forEach(c => cnt[c.d.type] = (cnt[c.d.type] || 0) + 1);
  return {
    id, name, hp, max: hp, shield: 0, burn: 0, poison: 0,
    cards: cards.map(c => ({
      def: c.d, tier: c.t, cd: c.d.cd * (cnt[c.d.type] >= 3 ? 0.85 : 1),
      prog: 0, bonus: 0, haste: 0, slow: 0, freeze: 0, flash: 0,
    })),
  };
}
function mkBattle(a, b) { return { a, b, t: 0, half: 0, sec: 0, storm: 0, ev: [], over: null }; }

function hit(B, src, f, d, ls, cls) {
  d = Math.round(d);
  if (d <= 0) return;
  const ab = Math.min(f.shield, d);
  f.shield -= ab; f.hp -= d - ab;
  B.ev.push({ side: f.id, txt: '-' + d, cls: cls || 'd', big: d >= f.max * 0.06 });
  if (ls && src) heal(B, src, d);
}
function heal(B, s, v) {
  v = Math.round(v);
  const before = s.hp;
  s.hp = Math.min(s.max, s.hp + v);
  if (s.hp > before) B.ev.push({ side: s.id, txt: '+' + (s.hp - before), cls: 'h' });
}
function targets(s, c, t) {
  const i = s.cards.indexOf(c);
  if (t === 'self') return [c];
  if (t === 'adj') return [s.cards[i - 1], s.cards[i + 1]].filter(Boolean);
  return s.cards.filter(o => o !== c);
}
function randomCards(f, n, key) {
  const pool = f.cards.slice().sort((x, y) => (x[key] - y[key]) || (Math.random() - 0.5));
  return pool.slice(0, n);
}
const FXCOL = { burn: '#ff7a1a', poison: '#b05aff', shield: '#f5d76e', heal: '#5aff8a', slow: '#9fe8ff', freeze: '#9fe8ff' };
function apply(B, s, f, c, x, m) {
  if (x.k === 'dmg' || FXCOL[x.k]) B.ev.push({ k: 'proj', side: s.id, i: s.cards.indexOf(c), to: x.k === 'shield' || x.k === 'heal' ? s.id : f.id, col: x.k === 'dmg' ? TYPES[c.def.type].c : FXCOL[x.k] });
  switch (x.k) {
    case 'dmg': {
      let d = (x.scale ? s.shield : x.v * m) + c.bonus;
      if (x.crit && Math.random() < x.crit) d *= 2;
      hit(B, s, f, d, x.ls); break;
    }
    case 'shield': s.shield += x.v * m; B.ev.push({ side: s.id, txt: '+' + x.v * m, cls: 's' }); break;
    case 'heal': heal(B, s, x.v * m); break;
    case 'burn': f.burn += x.v * m; break;
    case 'poison': f.poison += x.v * m; break;
    case 'haste': targets(s, c, x.t).forEach(o => o.haste = Math.max(o.haste, x.d)); break;
    case 'slow': randomCards(f, x.n, 'slow').forEach(o => o.slow = Math.max(o.slow, x.d)); break;
    case 'freeze': randomCards(f, x.n, 'freeze').forEach(o => o.freeze = Math.max(o.freeze, x.d)); break;
    case 'charge': targets(s, c, x.t).forEach(o => o.prog += x.d); break;
    case 'buff': targets(s, c, x.t).forEach(o => o.bonus += x.v * m); break;
  }
}
function fire(B, s, f, c) {
  c.flash = 0.2;
  for (const x of c.def.fx) apply(B, s, f, c, x, MULT[c.tier]);
  for (const o of s.cards)
    if (o !== c && o.def.ally && o.def.ally.type === c.def.type)
      for (const x of o.def.ally.fx) apply(B, s, f, o, x, MULT[o.tier]);
}
function step(B, dt) {
  if (B.over) return;
  B.t += dt;
  for (const [s, f] of [[B.a, B.b], [B.b, B.a]]) {
    for (const c of s.cards) {
      const rate = c.freeze > 0 ? 0 : (c.haste > 0 ? 2 : 1) * (c.slow > 0 ? 0.5 : 1);
      c.haste = Math.max(0, c.haste - dt); c.slow = Math.max(0, c.slow - dt);
      c.freeze = Math.max(0, c.freeze - dt); c.flash = Math.max(0, c.flash - dt);
      c.prog += dt * rate;
      let guard = 0;
      while (c.prog >= c.cd - 1e-9 && guard++ < 3) { c.prog -= c.cd; fire(B, s, f, c); }
    }
  }
  B.half += dt;
  if (B.half >= 0.5 - 1e-9) {
    B.half -= 0.5;
    for (const s of [B.a, B.b]) if (s.burn > 0) { hit(B, null, s, s.burn, false, 'b'); s.burn -= 1; }
    if (B.t >= 30) { B.storm++; for (const s of [B.a, B.b]) hit(B, null, s, B.storm * 3); }
  }
  B.sec += dt;
  if (B.sec >= 1 - 1e-9) {
    B.sec -= 1;
    for (const s of [B.a, B.b]) if (s.poison > 0) { s.hp -= s.poison; B.ev.push({ side: s.id, txt: '-' + s.poison, cls: 'p' }); }
  }
  const da = B.a.hp <= 0, db = B.b.hp <= 0;
  if (da || db) B.over = da && db ? 'draw' : da ? 'lose' : 'win';
}

/* ---------- oponentes ---------- */
const RIVALS = ['Domadora Lívia', 'Domador Caio', 'Mestre Bento', 'Caçadora Íris', 'Velho Tomé', 'Capitã Dora',
  'Andarilho Zeca', 'Bruxa Maré', 'Duque Ferrão', 'Campeã Aurora'];
function goldByDay(d) { let g = 12; for (let i = 2; i <= d; i++) g += income(i); return g; }
function genEnemy(day) {
  let budget = Math.round(goldByDay(day) * Math.min(1.1, 0.8 + 0.03 * day));
  const fav = [pick(Object.keys(TYPES)), pick(Object.keys(TYPES))];
  const cards = [];
  let used = 0;
  for (let i = 0; i < 300 && budget >= 3; i++) {
    const pool = Math.random() < 0.75 ? DEFS.filter(d => fav.includes(d.type)) : DEFS;
    const d = pick(pool);
    if (used + d.size <= BOARD_CAP && d.cost <= budget && Math.random() < 0.6) {
      cards.splice(R(cards.length + 1), 0, { d, t: 0 }); used += d.size; budget -= d.cost;
    } else if (cards.length) {
      const c = pick(cards);
      if (c.t < 3 && price(c) <= budget) { budget -= price(c); c.t++; }
    }
  }
  if (!cards.length) cards.push({ d: DEFS[0], t: 0 });
  return { name: RIVALS[(day - 1) % RIVALS.length], hp: baseHp(day), cards };
}
const baseHp = d => 300 + 75 * (d - 1);
const income = d => Math.min(15, 6 + d);

/* ---------- estado da run ---------- */
let G, B, timer = null, speed = 1, introT = null;

function newRun() {
  G = { day: 1, wins: 0, lives: START_LIVES, gold: 12, bonusHp: 0, board: [], bag: [], shop: [], sel: null, msg: '', screen: 'shop', modal: null };
  rollShop();
  render();
}
const maxHp = () => baseHp(G.day) + G.bonusHp;
const boardUsed = () => G.board.reduce((s, c) => s + c.d.size, 0);

function tierRoll() {
  const d = G.day, r = Math.random();
  if (d <= 2) return 0;
  if (d <= 5) return r < 0.3 ? 1 : 0;
  if (d <= 8) return r < 0.15 ? 2 : r < 0.65 ? 1 : 0;
  return r < 0.08 ? 3 : r < 0.43 ? 2 : r < 0.88 ? 1 : 0;
}
function rollShop() {
  let tot;
  do { G.shop = [0, 1, 2, 3].map(() => ({ d: pick(DEFS), t: tierRoll() })); tot = G.shop.reduce((s, c) => s + c.d.size, 0); } while (tot > 8);
}
function evolveMsg(c) { G.msg = `${c.d.name} evoluiu para ${TIERS[c.t]}!`; }
function tryMerge(card) {
  for (;;) {
    if (card.t >= 3) return;
    const twin = G.board.concat(G.bag).find(o => o !== card && o.d === card.d && o.t === card.t);
    if (!twin) return;
    G.board = G.board.filter(o => o !== twin); G.bag = G.bag.filter(o => o !== twin);
    card.t++; evolveMsg(card);
  }
}
function gain(card, pref = 'board', idx) {
  const twin = G.board.concat(G.bag).find(o => o.d === card.d && o.t === card.t && o.t < 3);
  if (twin) { twin.t++; evolveMsg(twin); tryMerge(twin); return true; }
  const fits = boardUsed() + card.d.size <= BOARD_CAP, room = G.bag.length < BAG_CAP;
  if (pref === 'board' && fits) { G.board.splice(idx === undefined ? G.board.length : idx, 0, card); return true; }
  if (room && (pref === 'bag' || !fits)) { G.bag.push(card); if (pref !== 'bag') G.msg = 'Tabuleiro cheio: a carta foi para a mochila.'; return true; }
  if (fits) { G.board.push(card); return true; }
  G.msg = 'Sem espaço! Venda ou guarde alguma carta.';
  return false;
}
function buy(i, pref, idx) {
  const c = G.shop[i];
  if (!c) return;
  if (G.gold < price(c)) { G.msg = 'Ouro insuficiente.'; return; }
  G.msg = '';
  if (gain({ d: c.d, t: c.t }, pref, idx)) { G.gold -= price(c); G.shop[i] = null; G.sel = null; }
}
function sell(z, i) { const c = G[z].splice(i, 1)[0]; G.gold += sellValue(c); G.sel = null; G.msg = `Vendeu ${c.d.name} por ${sellValue(c)} de ouro.`; }

const ACT = {
  buy() { buy(G.sel.i); },
  reroll() { if (G.gold >= 1) { G.gold--; rollShop(); G.sel = null; G.msg = ''; } },
  move(dir) {
    const i = G.sel.i, j = i + dir;
    if (j < 0 || j >= G.board.length) return;
    [G.board[i], G.board[j]] = [G.board[j], G.board[i]]; G.sel.i = j;
  },
  sell() { sell(G.sel.z, G.sel.i); },
  stash() {
    if (G.bag.length >= BAG_CAP) { G.msg = 'Mochila cheia.'; return; }
    G.bag.push(G.board.splice(G.sel.i, 1)[0]); G.sel = null;
  },
  place() {
    const c = G.bag[G.sel.i];
    if (boardUsed() + c.d.size > BOARD_CAP) { G.msg = 'Sem espaço no tabuleiro.'; return; }
    G.bag.splice(G.sel.i, 1); G.board.push(c); G.sel = { z: 'board', i: G.board.length - 1 };
  },
  fight() { startBattle(); return true; },
  speed(v) { speed = v; document.querySelectorAll('[data-a=speed]').forEach(b => b.classList.toggle('on', +b.dataset.v === speed)); return true; },
  skip() { clearTimeout(introT); const vs = $('.vs'); if (vs) vs.remove(); while (!B.over) step(B, 0.05); B.ev = []; drawBattle(); endBattle(); return true; },
  reward(i) { G.modal.opts[i].fn(); nextDay(); },
  newrun() { newRun(); return true; },
};

/* ---------- cartas na tela ---------- */
function badges(d, t) {
  const m = MULT[t], out = [];
  for (const x of d.fx) {
    if (x.k === 'dmg') out.push(['dmg', x.scale ? '=' : x.v * m]);
    else if (x.k === 'shield' || x.k === 'heal' || x.k === 'burn' || x.k === 'poison') out.push([x.k, x.v * m]);
  }
  return out.slice(0, d.size === 1 ? 2 : 3).map(([k, v]) => `<span class="bd b-${k}" data-k="${k}">${v}</span>`).join('');
}
function cardHtml(c, z, i, id) {
  const sel = G.sel && G.sel.z === z && G.sel.i === i ? ' sel' : '';
  return `<div class="card tier${c.t} t-${c.d.type}${sel}" style="--s:${c.d.size}" data-z="${z}" data-i="${i}" ${id ? `id="${id}"` : ''}>
    <div class="art"><img src="${ART.card(c.d)}" alt="${c.d.name}" draggable="false"><div class="sweep"></div><div class="ice"></div></div>
    <div class="frame"></div><div class="badges">${badges(c.d, c.t)}</div>
    <div class="cdtag">${c.d.cd}</div><div class="gem"></div><div class="stat"></div></div>`;
}
function getCard(z, i) {
  if (z === 'shop') return G.shop[i];
  if (z === 'ba' || z === 'bb') { const c = B[z[1]].cards[i]; return c && { d: c.def, t: c.tier }; }
  return G[z][i];
}

/* ---------- painel de detalhes ---------- */
const FXICON = { dmg: 'dmg', shield: 'shield', heal: 'heal', burn: 'burn', poison: 'poison', haste: 'haste', slow: 'slow', freeze: 'freeze', charge: 'charge', buff: 'buff' };
function showPop(el, c, z, i, acts) {
  const pop = $('#pop'), T = TYPES[c.d.type], m = MULT[c.t];
  const row = x => `<li>${I(FXICON[x.k], 'k-' + (x.k === 'charge' ? 'haste' : x.k === 'slow' ? 'freeze' : x.k === 'buff' ? 'dmg' : x.k))}<span>${fxText(x, m)}.</span></li>`;
  let btn = '';
  if (acts && z === 'shop') btn = `<button class="btn gold" data-a="buy" ${G.gold < price(c) ? 'disabled' : ''}>Comprar ${I('coin')}${price(c)}</button>`;
  if (acts && z === 'board') btn = `<button class="btn" data-a="move" data-v="-1" ${i === 0 ? 'disabled' : ''}>&#9664;</button><button class="btn" data-a="move" data-v="1" ${i === G.board.length - 1 ? 'disabled' : ''}>&#9654;</button>
    <button class="btn" data-a="stash">${I('bag')}Guardar</button><button class="btn" data-a="sell">Vender ${I('coin')}${sellValue(c)}</button>`;
  if (acts && z === 'bag') btn = `<button class="btn" data-a="place">Colocar</button><button class="btn" data-a="sell">Vender ${I('coin')}${sellValue(c)}</button>`;
  pop.innerHTML = `<div class="pop-art tier${c.t}" style="aspect-ratio:${c.d.size * 60}/120"><img src="${ART.card(c.d)}" alt=""></div>
    <div class="pop-body"><div class="pop-name">${c.d.name}</div>
    <div class="pop-meta"><span class="tag" style="--tc:${T.c}">${I(c.d.type)}${T.n}</span><span class="tag tier${c.t}">${TIERS[c.t]}</span><span class="tag">${I('clock')}${c.d.cd}s</span><span class="tag">Tam. ${c.d.size}</span></div>
    <ul class="fxl">${c.d.fx.map(row).join('')}</ul>
    ${c.d.ally ? `<div class="pop-ally">Quando outra carta de ${T.n} sua é usada: ${c.d.ally.fx.map(x => fxText(x, m)).join('. ').toLowerCase()}.</div>` : ''}
    ${c.t < 3 ? `<div class="pop-hint">Junte duas iguais para evoluir para ${TIERS[c.t + 1]}.</div>` : ''}
    ${btn ? `<div class="acts">${btn}</div>` : ''}</div>`;
  pop.className = 'show' + (acts ? ' acts-on' : '');
  const r = el.getBoundingClientRect(), pw = pop.offsetWidth, ph = pop.offsetHeight, W = innerWidth, H = innerHeight;
  let x = r.left + r.width / 2 - pw / 2, y = r.top - ph - 12;
  if (y < 6) y = r.bottom + 12;
  if (y + ph > H - 6) { y = Math.max(6, Math.min(H - ph - 6, r.top + r.height / 2 - ph / 2)); x = r.right + 12; if (x + pw > W - 6) x = r.left - pw - 12; }
  pop.style.left = Math.max(6, Math.min(W - pw - 6, x)) + 'px'; pop.style.top = Math.max(6, y) + 'px';
}
function hidePop() { const p = $('#pop'); if (p) p.className = ''; }

/* ---------- loja ---------- */
function pips(n, tot, ic, cls) { let s = ''; for (let i = 0; i < tot; i++) s += I(ic, i < n ? cls : cls + ' off'); return s; }
function hpBar(hp, max) { return `<div class="hp"><div class="hpf" style="width:${hp / max * 100}%"></div><div class="shf"></div><span class="hpt">${hp} / ${max}</span></div>`; }
function renderShop() {
  const offers = G.shop.map((c, i) => c
    ? `<div class="offer${G.gold < price(c) ? ' poor' : ''}">${cardHtml(c, 'shop', i)}<div class="price">${I('coin')}${price(c)}</div></div>`
    : `<div class="offer sold"><div class="soldslot">Vendido</div></div>`).join('');
  return `<div class="screen shop">
    <header class="topbar"><div class="logo">Bazar <i>de</i> Monstros</div>
      <div class="track"><div class="chip">${I('sun', 'c-gold')}Dia <b>${G.day}</b></div>
        <div class="chip pips" title="Vitórias">${pips(G.wins, WINS_GOAL, 'crown', 'c-gold')}</div>
        <div class="chip pips" title="Vidas">${pips(G.lives, START_LIVES, 'heart', 'c-red')}</div></div></header>
    <section class="merchant">
      <div class="mhead"><div class="port sm"><img src="${ART.portrait('merc' + G.day)}" alt=""></div>
        <div class="mtxt"><b>Mercado do dia ${G.day}</b><span>Arraste uma carta para o tabuleiro ou toque para ver os detalhes.</span></div>
        <button class="btn" data-a="reroll" ${G.gold < 1 ? 'disabled' : ''}>${I('refresh')}Trocar ${I('coin')}1</button></div>
      <div class="offers" data-drop="shop">${offers}</div></section>
    <section class="table"><div class="tlabel">Tabuleiro <b>${boardUsed()}/${BOARD_CAP}</b></div>
      <div class="board" data-drop="board">${G.board.map((c, i) => cardHtml(c, 'board', i)).join('') || '<div class="empty">Seu tabuleiro está vazio</div>'}</div></section>
    <div class="msg">${G.msg}</div>
    <footer class="hudrow">
      <div class="box bagbox" data-drop="bag"><div class="lbl">${I('bag')}Mochila <b>${G.bag.length}/${BAG_CAP}</b></div>
        <div class="bagrow">${G.bag.map((c, i) => cardHtml(c, 'bag', i)).join('')}</div></div>
      <div class="box herobox"><div class="port"><img src="${ART.portrait('hero', true)}" alt=""></div>
        <div class="hinfo"><div class="hname">Você</div>${hpBar(maxHp(), maxHp())}
          <button class="btn fight" data-a="fight" ${G.board.length ? '' : 'disabled'}>${I('dmg')}Batalhar</button></div></div>
      <div class="box goldbox" data-drop="sell">${I('coin', 'big')}<b>${G.gold}</b><span>+${income(G.day + 1)} amanhã</span><em>Solte aqui para vender</em></div>
    </footer></div>`;
}

/* ---------- batalha ---------- */
function hudHtml(s, src) {
  return `<div class="hud ${s.id === 'a' ? 'me' : 'foe'}" id="hud-${s.id}"><div class="port"><img src="${src}" alt=""></div>
    <div class="hinfo"><div class="hname">${s.name}</div><div class="hp"><div class="hpf"></div><div class="shf"></div><span class="hpt"></span></div>
    <div class="dots"><span class="dot k-shield">${I('shield')}<b></b></span><span class="dot k-burn">${I('burn')}<b></b></span><span class="dot k-poison">${I('poison')}<b></b></span></div></div></div>`;
}
function rowHtml(s) { return `<section class="table"><div class="board" id="row-${s.id}">${s.cards.map((c, i) => cardHtml({ d: c.def, t: c.tier }, 'b' + s.id, i, `bc-${s.id}-${i}`)).join('')}</div></section>`; }
function startBattle() {
  G.sel = null; G.msg = ''; G.screen = 'battle'; hidePop();
  const en = genEnemy(G.day), ep = ART.portrait('rival' + G.day), hp = ART.portrait('hero', true);
  B = mkBattle(mkSide('a', 'Você', maxHp(), G.board), mkSide('b', en.name, en.hp, en.cards));
  $('#app').innerHTML = `<div class="screen battle">${hudHtml(B.b, ep)}${rowHtml(B.b)}
    <div class="ctl"><span class="chip">${I('sun', 'c-gold')}Dia <b>${G.day}</b></span><span class="chip clock" id="clock"></span>
      ${[1, 2, 4].map(v => `<button class="btn sq${v === speed ? ' on' : ''}" data-a="speed" data-v="${v}">${v}x</button>`).join('')}
      <button class="btn" data-a="skip">${I('skip')}Pular</button></div>
    ${rowHtml(B.a)}${hudHtml(B.a, hp)}
    <div class="vs"><div class="vsp"><img src="${hp}" alt=""><b>Você</b></div><span>VS</span><div class="vsp"><img src="${ep}" alt=""><b>${en.name}</b></div></div>
    <div id="fx"></div><div id="ovl"></div></div>`;
  drawBattle();
  clearInterval(timer); clearTimeout(introT);
  introT = setTimeout(() => {
    const vs = $('.vs'); if (vs) vs.remove();
    timer = setInterval(() => {
      for (let i = 0; i < speed && !B.over; i++) step(B, 0.05);
      drawBattle();
      if (B.over) endBattle();
    }, 50);
  }, 1300);
}
function center(el) { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }
function spawnProj(ev) {
  const fx = $('#fx'), from = $(`#bc-${ev.side}-${ev.i}`), to = $(`#hud-${ev.to} .port`);
  if (!fx || !from || !to || fx.childElementCount > 16) return;
  const [x0, y0] = center(from), [x1, y1] = center(to);
  const d = document.createElement('div');
  d.className = 'proj'; d.style.setProperty('--c', ev.col);
  fx.appendChild(d);
  const mx = (x0 + x1) / 2 + (R(80) - 40), my = (y0 + y1) / 2 + (R(40) - 20);
  d.animate([{ transform: `translate(${x0}px,${y0}px) scale(.5)` }, { transform: `translate(${mx}px,${my}px) scale(1.2)`, offset: 0.5 }, { transform: `translate(${x1}px,${y1}px) scale(.8)` }],
    { duration: 340 / speed, easing: 'ease-in' }).onfinish = () => {
    d.remove();
    to.animate([{ filter: 'brightness(2.4)', transform: 'scale(1.08)' }, { filter: 'brightness(1)', transform: 'scale(1)' }], 220);
  };
}
function drawBattle() {
  for (const s of [B.a, B.b]) {
    const el = $('#hud-' + s.id);
    if (!el) return;
    el.querySelector('.hpf').style.width = Math.max(0, s.hp / s.max * 100) + '%';
    el.querySelector('.shf').style.width = Math.min(100, s.shield / s.max * 100) + '%';
    el.querySelector('.hpt').textContent = `${Math.max(0, Math.round(s.hp))} / ${s.max}`;
    for (const [k, v] of [['shield', s.shield], ['burn', s.burn], ['poison', s.poison]]) {
      const d = el.querySelector('.dot.k-' + k); d.classList.toggle('on', v > 0); d.lastChild.textContent = Math.round(v);
    }
    s.cards.forEach((c, i) => {
      const ce = $(`#bc-${s.id}-${i}`);
      ce.querySelector('.sweep').style.height = Math.min(100, c.prog / c.cd * 100) + '%';
      ce.classList.toggle('fire', c.flash > 0);
      ce.classList.toggle('frozen', c.freeze > 0);
      ce.classList.toggle('slowed', c.slow > 0 && c.freeze <= 0);
      ce.classList.toggle('hasted', c.haste > 0);
      const st = (c.freeze > 0 ? 'freeze' : c.slow > 0 ? 'slow' : c.haste > 0 ? 'haste' : '');
      if (ce.dataset.st !== st) { ce.dataset.st = st; ce.querySelector('.stat').innerHTML = st ? I(st) : ''; }
      const bd = ce.querySelector('.b-dmg');
      if (bd) { const x = c.def.fx.find(f => f.k === 'dmg'); const v = Math.round((x.scale ? s.shield : x.v * MULT[c.tier]) + c.bonus); if (bd.textContent !== '' + v) { bd.textContent = v; bd.classList.toggle('up', c.bonus > 0); } }
    });
  }
  const shown = { a: 0, b: 0 };
  for (const ev of B.ev) {
    if (ev.k === 'proj') { spawnProj(ev); continue; }
    const hud = $('#hud-' + ev.side);
    if (ev.big) hud.animate([{ transform: 'translate(0,0)' }, { transform: 'translate(-6px,3px)' }, { transform: 'translate(5px,-3px)' }, { transform: 'translate(0,0)' }], 180);
    if (shown[ev.side]++ >= 4) continue;
    const f = document.createElement('div');
    f.className = 'fl ' + ev.cls + (ev.big ? ' big' : ''); f.textContent = ev.txt;
    f.style.left = (20 + R(60)) + '%';
    hud.querySelector('.hinfo').appendChild(f);
    setTimeout(() => f.remove(), 900);
  }
  B.ev = [];
  const ck = $('#clock');
  if (ck) { ck.innerHTML = (B.t >= 30 ? I('haste', 'c-red') + 'Tempestade ' : I('clock')) + B.t.toFixed(1) + 's'; ck.classList.toggle('storm', B.t >= 30); }
}

function endBattle() {
  clearInterval(timer); timer = null;
  const res = B.over;
  let title, text, cls = res;
  if (res === 'win') { G.wins++; G.gold += 2; title = 'Vitória'; text = `Você derrotou ${B.b.name}. +2 de ouro de bônus.`; }
  else if (res === 'lose') { G.lives--; title = 'Derrota'; text = `${B.b.name} venceu. Você perdeu 1 vida.`; }
  else { title = 'Empate'; text = 'Os dois caíram ao mesmo tempo.'; }

  if (G.wins >= WINS_GOAL) return showModal('win', 'Campeão do Bazar', `${WINS_GOAL} vitórias em ${G.day} dias, com ${G.lives} vida${G.lives > 1 ? 's' : ''} sobrando.`, [{ ic: 'refresh', label: 'Nova jornada', a: 'newrun' }]);
  if (G.lives <= 0) return showModal('lose', 'Fim da jornada', `Você chegou ao dia ${G.day} com ${G.wins} vitória${G.wins === 1 ? '' : 's'}.`, [{ ic: 'refresh', label: 'Tentar de novo', a: 'newrun' }]);

  const all = [
    { ic: 'coin', label: '+6 de ouro', fn: () => G.gold += 6 },
    { ic: 'heart', label: '+80 de vida máxima', fn: () => G.bonusHp += 80 },
    { ic: 'buff', label: 'Evoluir uma carta aleatória do tabuleiro', fn: () => { const p = G.board.filter(c => c.t < 3); if (p.length) { const c = pick(p); c.t++; evolveMsg(c); tryMerge(c); } else G.gold += 6; } },
    { ic: 'bag', label: 'Uma carta aleatória de graça', fn: () => { const c = { d: pick(DEFS), t: tierRoll() }; if (gain(c)) { if (!G.msg) G.msg = `Você ganhou ${c.d.name}!`; } else { G.gold += 4; G.msg = 'Sem espaço para a carta: +4 de ouro.'; } } },
  ];
  all.splice(R(all.length), 1);
  G.modal = { opts: all };
  showModal(cls, title, text + ' Escolha uma recompensa:', all.map((o, i) => ({ ic: o.ic, label: o.label, a: 'reward', v: i })));
}
function showModal(cls, title, text, btns) {
  $('#ovl').innerHTML = `<div class="overlay"><div class="modal ${cls}"><h3>${title}</h3><p>${text}</p><div class="opts">
    ${btns.map(b => `<button class="btn opt" data-a="${b.a}" ${b.v !== undefined ? `data-v="${b.v}"` : ''}>${I(b.ic, b.ic === 'heart' ? 'c-red' : 'c-gold')}<span>${b.label}</span></button>`).join('')}</div></div></div>`;
}
function nextDay() {
  G.day++; G.gold += income(G.day); G.modal = null; G.screen = 'shop'; G.sel = null;
  rollShop();
}
function render() {
  if (G.screen !== 'shop') return;
  $('#app').innerHTML = renderShop();
  const el = G.sel && $(`.card[data-z="${G.sel.z}"][data-i="${G.sel.i}"]`);
  if (el) showPop(el, getCard(G.sel.z, G.sel.i), G.sel.z, G.sel.i, true); else { G.sel = null; hidePop(); }
}

/* ---------- entrada: clique, hover e arrastar ---------- */
let drag = null, ghost = null, suppress = false;
document.addEventListener('click', e => {
  if (suppress) return;
  const a = e.target.closest('[data-a]');
  if (a) { if (a.disabled) return; const v = a.dataset.v; if (!ACT[a.dataset.a](v !== undefined ? +v : undefined)) render(); return; }
  const ce = e.target.closest('.card[data-z]');
  if (ce) {
    const z = ce.dataset.z, i = +ce.dataset.i;
    if (G.screen === 'shop') { G.sel = G.sel && G.sel.z === z && G.sel.i === i ? null : { z, i }; G.msg = ''; render(); }
    else showPop(ce, getCard(z, i), z, i, false);
    return;
  }
  if (!e.target.closest('#pop')) { if (G.sel) { G.sel = null; render(); } else hidePop(); }
});
document.addEventListener('pointerover', e => {
  if (e.pointerType !== 'mouse' || drag || (G.sel && G.screen === 'shop')) return;
  const ce = e.target.closest('.card[data-z]');
  if (ce) { const c = getCard(ce.dataset.z, +ce.dataset.i); if (c) showPop(ce, c, ce.dataset.z, +ce.dataset.i, false); }
});
document.addEventListener('pointerout', e => {
  if (e.pointerType !== 'mouse' || (G.sel && G.screen === 'shop')) return;
  if (e.target.closest('.card[data-z]')) hidePop();
});
document.addEventListener('pointerdown', e => {
  const ce = e.target.closest('.card[data-z]');
  if (!ce || G.screen !== 'shop' || e.button > 0) return;
  drag = { el: ce, z: ce.dataset.z, i: +ce.dataset.i, x: e.clientX, y: e.clientY, on: false };
});
const zoneAt = (x, y) => { const el = document.elementFromPoint(x, y); const z = el && el.closest('[data-drop]'); return z ? z.dataset.drop : null; };
function boardIndexAt(x) { let n = 0; document.querySelectorAll('.board .card:not(.dragging)').forEach(el => { const r = el.getBoundingClientRect(); if (r.left + r.width / 2 < x) n++; }); return n; }
function endDrag() {
  if (ghost) ghost.remove(); ghost = null;
  if (drag && drag.el) drag.el.classList.remove('dragging');
  document.body.classList.remove('dragmode');
  document.querySelectorAll('.over').forEach(el => el.classList.remove('over'));
  drag = null;
}
document.addEventListener('pointermove', e => {
  if (!drag) return;
  if (!drag.on) {
    if (Math.hypot(e.clientX - drag.x, e.clientY - drag.y) < 8) return;
    drag.on = true; G.sel = null; hidePop();
    document.querySelectorAll('.card.sel').forEach(el => el.classList.remove('sel'));
    const r = drag.el.getBoundingClientRect();
    ghost = drag.el.cloneNode(true); ghost.classList.add('ghost');
    ghost.style.cssText += `;width:${r.width}px;height:${r.height}px;--u:${r.width / drag.el.style.getPropertyValue('--s')}px`;
    drag.ox = e.clientX - r.left; drag.oy = e.clientY - r.top;
    document.body.appendChild(ghost);
    drag.el.classList.add('dragging'); document.body.classList.add('dragmode');
    document.body.dataset.from = drag.z;
  }
  ghost.style.transform = `translate(${e.clientX - drag.ox}px,${e.clientY - drag.oy}px) rotate(4deg) scale(1.06)`;
  const z = zoneAt(e.clientX, e.clientY);
  document.querySelectorAll('[data-drop]').forEach(el => el.classList.toggle('over', el.dataset.drop === z && z !== drag.z || (z === 'board' && el.dataset.drop === 'board')));
});
document.addEventListener('pointerup', e => {
  if (!drag) return;
  if (drag.on) {
    const { z, i } = drag, to = zoneAt(e.clientX, e.clientY), idx = boardIndexAt(e.clientX);
    G.msg = '';
    if (z === 'shop' && (to === 'board' || to === 'bag')) buy(i, to, idx);
    else if (z === 'board' && to === 'board') { const c = G.board.splice(i, 1)[0]; G.board.splice(idx, 0, c); }
    else if (z === 'board' && to === 'bag') { if (G.bag.length < BAG_CAP) G.bag.push(G.board.splice(i, 1)[0]); else G.msg = 'Mochila cheia.'; }
    else if (z === 'bag' && to === 'board') { const c = G.bag[i]; if (boardUsed() + c.d.size <= BOARD_CAP) { G.bag.splice(i, 1); G.board.splice(idx, 0, c); } else G.msg = 'Sem espaço no tabuleiro.'; }
    else if (to === 'sell' && z !== 'shop') sell(z, i);
    suppress = true; setTimeout(() => suppress = false, 0);
    endDrag(); render();
  } else drag = null;
});
document.addEventListener('pointercancel', endDrag);
addEventListener('scroll', () => { if (!G.sel) hidePop(); }, true);
addEventListener('resize', () => { if (G.screen === 'shop') render(); });

document.documentElement.style.setProperty('--scene', `url("${ART.scene()}")`);
newRun();
