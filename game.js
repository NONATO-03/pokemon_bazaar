'use strict';
/* Bazar de Monstros — auto-batalha de cartas com loja, tabuleiro e recargas. */

const $ = s => document.querySelector(s);
const R = n => Math.floor(Math.random() * n);
const pick = a => a[R(a.length)];

const TYPES = {
  fogo: { n: 'Fogo', e: '🔥' }, agua: { n: 'Água', e: '💧' }, planta: { n: 'Planta', e: '🌿' },
  raio: { n: 'Raio', e: '⚡' }, pedra: { n: 'Pedra', e: '🪨' }, sombra: { n: 'Sombra', e: '🌑' },
};
const TIERS = ['Bronze', 'Prata', 'Ouro', 'Diamante'];
const MULT = [1, 2, 4, 8];
const BOARD_CAP = 10, BAG_CAP = 5, WINS_GOAL = 10, START_LIVES = 5;

/* ---------- cartas ---------- */
const DEFS = [];
const C = (id, name, emoji, type, size, cd, fx, ally) =>
  DEFS.push({ id, name, emoji, type, size, cd, fx, ally, cost: size * 3 });

C('brasinha', 'Brasinha', '🦊', 'fogo', 1, 4, [{ k: 'burn', v: 3 }]);
C('fornalhito', 'Fornalhito', '🐞', 'fogo', 1, 5, [{ k: 'buff', t: 'adj', v: 3 }]);
C('salamagma', 'Salamagma', '🦎', 'fogo', 2, 6, [{ k: 'dmg', v: 20 }, { k: 'burn', v: 4 }]);
C('dracovulcao', 'Dracovulcão', '🐉', 'fogo', 3, 9, [{ k: 'dmg', v: 60 }, { k: 'burn', v: 8 }],
  { type: 'fogo', fx: [{ k: 'charge', t: 'self', d: 1 }] });

C('gotinha', 'Gotinha', '🐟', 'agua', 1, 4, [{ k: 'heal', v: 10 }]);
C('conchudo', 'Conchudo', '🐚', 'agua', 1, 5, [{ k: 'shield', v: 15 }]);
C('marolo', 'Marolo', '🐬', 'agua', 2, 5, [{ k: 'dmg', v: 15 }, { k: 'slow', n: 1, d: 2 }]);
C('abissal', 'Abissal', '🐋', 'agua', 3, 10, [{ k: 'dmg', v: 50 }, { k: 'shield', v: 40 }, { k: 'freeze', n: 2, d: 3 }]);

C('brotinho', 'Brotinho', '🌱', 'planta', 1, 5, [{ k: 'poison', v: 2 }]);
C('cogumelino', 'Cogumelino', '🍄', 'planta', 1, 6, [{ k: 'poison', v: 1 }, { k: 'heal', v: 8 }]);
C('espinheira', 'Espinheira', '🌵', 'planta', 2, 6, [{ k: 'dmg', v: 12 }, { k: 'poison', v: 3 }]);
C('carvalhao', 'Carvalhão', '🌳', 'planta', 3, 8, [{ k: 'poison', v: 4 }, { k: 'heal', v: 30 }, { k: 'shield', v: 20 }]);

C('zumbizap', 'Zumbizap', '🐝', 'raio', 1, 3, [{ k: 'dmg', v: 6 }]);
C('voltagato', 'Voltagato', '🐈', 'raio', 1, 5, [{ k: 'haste', t: 'adj', d: 2 }]);
C('trovoave', 'Trovoave', '🦅', 'raio', 2, 5, [{ k: 'dmg', v: 18 }, { k: 'charge', t: 'adj', d: 1 }]);
C('tempestouro', 'Tempestouro', '🐂', 'raio', 3, 7, [{ k: 'dmg', v: 35 }, { k: 'haste', t: 'all', d: 2 }]);

C('seixote', 'Seixote', '🦔', 'pedra', 1, 5, [{ k: 'shield', v: 12 }, { k: 'dmg', v: 5 }]);
C('cristalim', 'Cristalim', '💎', 'pedra', 1, 5, [{ k: 'dmg', v: 5 }, { k: 'buff', t: 'self', v: 3 }]);
C('cascudo', 'Cascudo', '🐢', 'pedra', 2, 7, [{ k: 'shield', v: 35 }]);
C('golemonte', 'Golemonte', '🗿', 'pedra', 3, 10, [{ k: 'shield', v: 30 }, { k: 'dmg', scale: true }]);

C('morceguim', 'Morceguim', '🦇', 'sombra', 1, 4, [{ k: 'dmg', v: 7, ls: true }]);
C('corvonoite', 'Corvonoite', '🐦', 'sombra', 1, 5, [{ k: 'dmg', v: 10, crit: 0.4 }]);
C('espectrolho', 'Espectrolho', '👻', 'sombra', 2, 6, [{ k: 'dmg', v: 14 }, { k: 'slow', n: 2, d: 2 }]);
C('devorador', 'Devorador', '🦑', 'sombra', 3, 8, [{ k: 'dmg', v: 30, ls: true }, { k: 'buff', t: 'self', v: 10 }]);

const TG = { self: 'esta carta', adj: 'as cartas adjacentes', all: 'suas outras cartas' };
function fxText(x, m) {
  switch (x.k) {
    case 'dmg': return (x.scale ? 'Causa dano igual ao seu escudo' : `Causa ${x.v * m} de dano`) +
      (x.crit ? ` (${x.crit * 100}% de chance de dobrar)` : '') + (x.ls ? ' e cura o mesmo valor' : '');
    case 'shield': return `Ganha ${x.v * m} de escudo`;
    case 'heal': return `Cura ${x.v * m}`;
    case 'burn': return `Aplica ${x.v * m} de queimadura`;
    case 'poison': return `Aplica ${x.v * m} de veneno`;
    case 'haste': return `Acelera ${TG[x.t]} por ${x.d}s`;
    case 'slow': return `Deixa ${x.n} carta(s) inimiga(s) lenta(s) por ${x.d}s`;
    case 'freeze': return `Congela ${x.n} carta(s) inimiga(s) por ${x.d}s`;
    case 'charge': return `Adianta ${TG[x.t]} em ${x.d}s`;
    case 'buff': return `Dá +${x.v * m} de dano para ${TG[x.t]}`;
  }
}
function cardText(d, t) {
  let s = d.fx.map(x => fxText(x, MULT[t])).join('. ') + '.';
  if (d.ally) s += ` Quando outra carta de ${TYPES[d.ally.type].n} sua é usada: ${d.ally.fx.map(x => fxText(x, MULT[t])).join('. ').toLowerCase()}.`;
  return s;
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

function hit(B, src, f, d, ls) {
  d = Math.round(d);
  if (d <= 0) return;
  const ab = Math.min(f.shield, d);
  f.shield -= ab; f.hp -= d - ab;
  B.ev.push({ side: f.id, txt: '-' + d, cls: 'd' });
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
function apply(B, s, f, c, x, m) {
  switch (x.k) {
    case 'dmg': {
      let d = (x.scale ? s.shield : x.v * m) + c.bonus;
      if (x.crit && Math.random() < x.crit) d *= 2;
      hit(B, s, f, d, x.ls); break;
    }
    case 'shield': s.shield += x.v * m; B.ev.push({ side: s.id, txt: '+' + x.v * m + '🛡', cls: 's' }); break;
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
    for (const s of [B.a, B.b]) if (s.burn > 0) { hit(B, null, s, s.burn); s.burn -= 1; }
    if (B.t >= 30) { B.storm++; for (const s of [B.a, B.b]) hit(B, null, s, B.storm * 3); }
  }
  B.sec += dt;
  if (B.sec >= 1 - 1e-9) {
    B.sec -= 1;
    for (const s of [B.a, B.b]) if (s.poison > 0) { s.hp -= s.poison; B.ev.push({ side: s.id, txt: '-' + s.poison + '☠', cls: 'd' }); }
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
let G, B, timer = null, speed = 1;

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
function rollShop() { G.shop = [0, 1, 2, 3].map(() => ({ d: pick(DEFS), t: tierRoll() })); }

function tryMerge(card) {
  // duas cartas iguais do mesmo nível viram uma do nível seguinte
  for (;;) {
    if (card.t >= 3) return;
    const all = G.board.concat(G.bag);
    const twin = all.find(o => o !== card && o.d === card.d && o.t === card.t);
    if (!twin) return;
    G.board = G.board.filter(o => o !== twin); G.bag = G.bag.filter(o => o !== twin);
    card.t++;
    G.msg = `✨ ${card.d.name} evoluiu para ${TIERS[card.t]}!`;
  }
}
function gain(card) {
  const twin = G.board.concat(G.bag).find(o => o.d === card.d && o.t === card.t && o.t < 3);
  if (twin) { twin.t++; G.msg = `✨ ${twin.d.name} evoluiu para ${TIERS[twin.t]}!`; tryMerge(twin); return true; }
  if (boardUsed() + card.d.size <= BOARD_CAP) { G.board.push(card); return true; }
  if (G.bag.length < BAG_CAP) { G.bag.push(card); G.msg = 'Sem espaço no tabuleiro: foi para a mochila.'; return true; }
  G.msg = 'Sem espaço! Venda ou guarde alguma carta.';
  return false;
}

const ACT = {
  sel(z, i) { G.sel = G.sel && G.sel.z === z && G.sel.i === i ? null : { z, i }; G.msg = ''; },
  buy() {
    const c = G.shop[G.sel.i];
    if (!c) return;
    if (G.gold < price(c)) { G.msg = 'Ouro insuficiente.'; return; }
    G.msg = '';
    if (gain({ d: c.d, t: c.t })) { G.gold -= price(c); G.shop[G.sel.i] = null; G.sel = null; }
  },
  reroll() { if (G.gold >= 1) { G.gold--; rollShop(); G.sel = null; G.msg = ''; } },
  move(dir) {
    const i = G.sel.i, j = i + dir;
    if (j < 0 || j >= G.board.length) return;
    [G.board[i], G.board[j]] = [G.board[j], G.board[i]]; G.sel.i = j;
  },
  sell() {
    const arr = G[G.sel.z], c = arr[G.sel.i];
    G.gold += sellValue(c); arr.splice(G.sel.i, 1); G.sel = null; G.msg = `Vendeu ${c.d.name}.`;
  },
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
  speed(v) { speed = +v; document.querySelectorAll('[data-a=speed]').forEach(b => b.classList.toggle('on', +b.dataset.v === speed)); return true; },
  skip() { while (!B.over) step(B, 0.05); B.ev = []; drawBattle(); endBattle(); return true; },
  reward(i) { G.modal.opts[i].fn(); nextDay(); },
  newrun() { newRun(); return true; },
};

document.addEventListener('click', e => {
  const el = e.target.closest('[data-a]');
  if (!el || el.disabled) return;
  const a = el.dataset.a;
  const skipRender = a === 'sel' ? ACT.sel(el.dataset.z, +el.dataset.i) : ACT[a](el.dataset.v !== undefined ? +el.dataset.v : undefined);
  if (!skipRender) render();
});

/* ---------- telas ---------- */
function cardHtml(c, z, i, battleId) {
  const sel = G.sel && G.sel.z === z && G.sel.i === i ? ' sel' : '';
  const attrs = battleId ? `id="${battleId}"` : `data-a="sel" data-z="${z}" data-i="${i}"`;
  return `<div class="card t-${c.d.type} tier${c.t}${sel}" style="--s:${c.d.size}" ${attrs} title="${c.d.name}">
    <div class="em">${c.d.emoji}</div><div class="nm">${c.d.name}</div>
    ${battleId ? '<span class="st"></span><span class="bn"></span><div class="cdb"><i></i></div>' : ''}</div>`;
}
function topBar() {
  return `<div class="top">
    <div class="stat">📅 Dia <b>${G.day}</b></div>
    <div class="stat">🏆 <b>${G.wins}</b>/${WINS_GOAL}</div>
    <div class="stat">❤️ <b>${G.lives}</b> vidas</div>
    <div class="stat">💚 <b>${maxHp()}</b> PV</div>
    <div class="stat gold">🪙 <b>${G.gold}</b></div></div>`;
}
function infoPanel() {
  if (!G.sel) return `<div class="info"><div class="tx" style="color:var(--dim)">Toque em uma carta para ver os detalhes e as ações.</div></div>`;
  const { z, i } = G.sel;
  const c = z === 'shop' ? G.shop[i] : G[z][i];
  if (!c) return '<div class="info"></div>';
  const T = TYPES[c.d.type];
  let acts = '';
  if (z === 'shop') acts = `<button data-a="buy" ${G.gold < price(c) ? 'disabled' : ''}>Comprar por 🪙${price(c)}</button>`;
  if (z === 'board') acts = `<button data-a="move" data-v="-1" ${i === 0 ? 'disabled' : ''}>◀ Mover</button>
    <button data-a="move" data-v="1" ${i === G.board.length - 1 ? 'disabled' : ''}>Mover ▶</button>
    <button data-a="stash">🎒 Guardar</button><button data-a="sell">Vender +🪙${sellValue(c)}</button>`;
  if (z === 'bag') acts = `<button data-a="place">Colocar no tabuleiro</button><button data-a="sell">Vender +🪙${sellValue(c)}</button>`;
  return `<div class="info"><div class="ttl">${c.d.emoji} ${c.d.name}</div>
    <div class="meta">${T.e} ${T.n} · ${TIERS[c.t]} · tamanho ${c.d.size} · recarga ${c.d.cd}s</div>
    <div class="tx">${cardText(c.d, c.t)}</div><div class="acts">${acts}</div></div>`;
}
function renderShop() {
  const offers = G.shop.map((c, i) => {
    if (!c) return '<div class="offer empty">vendido</div>';
    const sel = G.sel && G.sel.z === 'shop' && G.sel.i === i ? ' sel' : '';
    return `<div class="offer tier${c.t}${sel}" style="border-color:var(--tc)" data-a="sel" data-z="shop" data-i="${i}">
      <div class="price">🪙${price(c)}</div><div class="em">${c.d.emoji}</div><div class="nm">${c.d.name}</div>
      <div class="meta">${TYPES[c.d.type].e} ${TYPES[c.d.type].n} · ${TIERS[c.t]} · tam. ${c.d.size} · ${c.d.cd}s</div>
      <div class="tx">${cardText(c.d, c.t)}</div></div>`;
  }).join('');
  return `<h1>🛒 Bazar de Monstros</h1>${topBar()}
    <h2><span>Loja</span><button class="small" data-a="reroll" ${G.gold < 1 ? 'disabled' : ''}>🔄 Trocar ofertas (🪙1)</button></h2>
    <div class="shop">${offers}</div>
    <h2><span>Tabuleiro</span><span>${boardUsed()}/${BOARD_CAP} espaços</span></h2>
    <div class="row">${G.board.map((c, i) => cardHtml(c, 'board', i)).join('') || '<span class="hint">Compre cartas para montar seu time</span>'}</div>
    <h2><span>Mochila</span><span>${G.bag.length}/${BAG_CAP}</span></h2>
    <div class="row bag">${G.bag.map((c, i) => cardHtml(c, 'bag', i)).join('') || '<span class="hint">vazia</span>'}</div>
    ${infoPanel()}
    <div class="msg">${G.msg}</div>
    <div class="fight"><button class="primary" data-a="fight" ${G.board.length ? '' : 'disabled'}>⚔️ Batalhar (Dia ${G.day})</button></div>
    <div class="help">
      <b>Como jogar:</b> compre monstros na loja e arrume-os no tabuleiro (10 espaços). Na batalha, cada carta dispara sozinha quando a recarga enche.
      Duas cartas iguais do mesmo nível se fundem e evoluem (Bronze → Prata → Ouro → Diamante).
      Ter 3+ cartas do mesmo tipo deixa a recarga delas 15% mais rápida. A posição importa: várias cartas afetam as vizinhas.
      Queimadura causa dano a cada 0,5s e vai diminuindo; veneno causa dano a cada 1s, ignora escudo e não diminui.
      Depois de 30s começa uma tempestade que machuca os dois lados cada vez mais.
      Vença ${WINS_GOAL} batalhas antes de perder ${START_LIVES} vidas.
    </div>`;
}

function sideHtml(s) {
  return `<div class="side" id="side-${s.id}"><div class="who"><span>${s.name}</span></div>
    <div class="bar"><div class="hpf"></div><div class="shf"></div><span></span></div><div class="dots"></div>
    <div class="row">${s.cards.map((c, i) => cardHtml({ d: c.def, t: c.tier }, '', -1, `bc-${s.id}-${i}`)).join('')}</div></div>`;
}
function startBattle() {
  G.sel = null; G.msg = ''; G.screen = 'battle';
  const en = genEnemy(G.day);
  B = mkBattle(mkSide('a', 'Você', maxHp(), G.board), mkSide('b', en.name, en.hp, en.cards));
  $('#app').innerHTML = `<h1>⚔️ Dia ${G.day} — ${en.name}</h1>${sideHtml(B.b)}
    <div class="ctl"><span class="clock" id="clock"></span>
      ${[1, 2, 4].map(v => `<button class="small${v === speed ? ' on' : ''}" data-a="speed" data-v="${v}">${v}x</button>`).join('')}
      <button class="small" data-a="skip">⏭ Pular</button></div>
    ${sideHtml(B.a)}<div id="ovl"></div>`;
  drawBattle();
  clearInterval(timer);
  timer = setInterval(() => {
    for (let i = 0; i < speed && !B.over; i++) step(B, 0.05);
    drawBattle();
    if (B.over) endBattle();
  }, 50);
}
function drawBattle() {
  for (const s of [B.a, B.b]) {
    const el = $('#side-' + s.id);
    if (!el) return;
    const hp = Math.max(0, Math.round(s.hp));
    el.querySelector('.hpf').style.width = Math.max(0, s.hp / s.max * 100) + '%';
    el.querySelector('.shf').style.width = Math.min(100, s.shield / s.max * 100) + '%';
    el.querySelector('.bar span').textContent = `${hp} / ${s.max}` + (s.shield > 0 ? `  🛡${Math.round(s.shield)}` : '');
    el.querySelector('.dots').textContent = (s.burn > 0 ? `🔥 queimadura ${s.burn}   ` : '') + (s.poison > 0 ? `☠ veneno ${s.poison}` : '');
    s.cards.forEach((c, i) => {
      const ce = $(`#bc-${s.id}-${i}`);
      ce.querySelector('.cdb i').style.width = Math.min(100, c.prog / c.cd * 100) + '%';
      ce.classList.toggle('flash', c.flash > 0);
      ce.classList.toggle('frozen', c.freeze > 0);
      ce.querySelector('.st').textContent = (c.freeze > 0 ? '❄️' : '') + (c.slow > 0 ? '🐌' : '') + (c.haste > 0 ? '⚡' : '');
      ce.querySelector('.bn').textContent = c.bonus ? '+' + c.bonus : '';
    });
  }
  const shown = { a: 0, b: 0 };
  for (const ev of B.ev) {
    if (shown[ev.side]++ >= 3) continue;
    const f = document.createElement('div');
    f.className = 'fl ' + ev.cls; f.textContent = ev.txt;
    f.style.right = (14 + R(120)) + 'px';
    $('#side-' + ev.side).appendChild(f);
    setTimeout(() => f.remove(), 800);
  }
  B.ev = [];
  const ck = $('#clock');
  if (ck) ck.textContent = B.t >= 30 ? `🌪 tempestade ${B.t.toFixed(1)}s` : `⏱ ${B.t.toFixed(1)}s`;
}

function endBattle() {
  clearInterval(timer); timer = null;
  const res = B.over;
  let title, text;
  if (res === 'win') { G.wins++; G.gold += 2; title = '🏆 Vitória!'; text = `Você derrotou ${B.b.name}. +🪙2 de bônus.`; }
  else if (res === 'lose') { G.lives--; title = '💀 Derrota'; text = `${B.b.name} venceu. Você perdeu 1 vida.`; }
  else { title = '🤝 Empate'; text = 'Os dois caíram ao mesmo tempo. Ninguém ganha nada.'; }

  if (G.wins >= WINS_GOAL) return showModal('👑 Você zerou a run!', `${WINS_GOAL} vitórias em ${G.day} dias, com ${G.lives} vida(s) sobrando.`, [{ label: '🔁 Nova run', a: 'newrun' }]);
  if (G.lives <= 0) return showModal('☠️ Fim da run', `Você chegou ao dia ${G.day} com ${G.wins} vitória(s).`, [{ label: '🔁 Tentar de novo', a: 'newrun' }]);

  const all = [
    { label: '🪙 +6 de ouro', fn: () => G.gold += 6 },
    { label: '💚 +80 de vida máxima', fn: () => G.bonusHp += 80 },
    { label: '⬆️ Evoluir uma carta aleatória do tabuleiro', fn: () => { const p = G.board.filter(c => c.t < 3); if (p.length) { const c = pick(p); c.t++; tryMerge(c); G.msg = `✨ ${c.d.name} evoluiu para ${TIERS[c.t]}!`; } else G.gold += 6; } },
    { label: '🎁 Uma carta aleatória de graça', fn: () => { const c = { d: pick(DEFS), t: tierRoll() }; if (gain(c)) { if (!G.msg) G.msg = `🎁 Você ganhou ${c.d.name}!`; } else { G.gold += 4; G.msg = 'Sem espaço para a carta: +🪙4.'; } } },
  ];
  all.splice(R(all.length), 1);
  G.modal = { opts: all };
  showModal(title, text + ' Escolha uma recompensa:', all.map((o, i) => ({ label: o.label, a: 'reward', v: i })));
}
function showModal(title, text, btns) {
  $('#ovl').innerHTML = `<div class="overlay"><div class="modal"><h3>${title}</h3><p>${text}</p><div class="opts">
    ${btns.map(b => `<button data-a="${b.a}" ${b.v !== undefined ? `data-v="${b.v}"` : ''}>${b.label}</button>`).join('')}</div></div></div>`;
}
function nextDay() {
  G.day++; G.gold += income(G.day); G.modal = null; G.screen = 'shop'; G.sel = null;
  rollShop();
}

function render() {
  if (G.screen === 'shop') $('#app').innerHTML = renderShop();
}

newRun();
