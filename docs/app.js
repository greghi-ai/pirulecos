/* Pirulecos · protótipo funcional (tudo salvo no navegador da pessoa) */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var LS = {
    get: function (k, d) { try { var v = localStorage.getItem('pz-' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('pz-' + k, JSON.stringify(v)); } catch (e) { toast('Sem espaço para salvar no navegador'); } }
  };
  var RESERVA_MIN = 15;
  var money = function (n) { return 'R$ ' + n.toFixed(2).replace('.', ','); };
  var esc = function (s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

  /* ícones */
  var I = {
    user: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>',
    bag: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 8h14l-1.2 12.2a1 1 0 0 1-1 .8H7.2a1 1 0 0 1-1-.8z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>',
    menu: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    x: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    search: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6E5A45" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
    check: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l4 4 10-10"/></svg>',
    clock: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M9 2h6"/></svg>',
    chev: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>',
    gift: '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 11h16v10H4zM2 7h20v4H2zM12 7v14"/><path d="M12 7c-2-4-6-4-6-1s6 1 6 1 6 2 6-1-4-3-6 1"/></svg>',
    trash: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>'
  };
  var ART = {
    dress: 'M24 8 L26 18 L14 54 L50 54 L38 18 L40 8 M26 18 C30 21 34 21 38 18',
    tee: 'M22 10 L12 16 L6 28 L14 32 L18 26 L18 54 L46 54 L46 26 L50 32 L58 28 L52 16 L42 10 C40 15 24 15 22 10 Z',
    pants: 'M18 8 L46 8 L50 56 L37 56 L32 26 L27 56 L14 56 Z M18 14 L46 14',
    body: 'M22 8 L12 14 L8 24 L16 27 L20 22 L20 44 L26 54 L38 54 L44 44 L44 22 L48 27 L56 24 L52 14 L42 8 C40 13 24 13 22 8 Z',
    jacket: 'M22 8 L12 12 L4 46 L12 48 L18 26 L18 56 L46 56 L46 26 L52 48 L60 46 L52 12 L42 8 L32 16 Z M32 16 L32 56'
  };
  var TINTS = { rosa: ['#FCE1EC', '#A42E5E'], amarelo: ['#FFF1C2', '#8A6A00'], azul: ['#DCEBFA', '#1F5F99'], verde: ['#DFF2DA', '#2B6E33'], lilas: ['#ECE5FA', '#5B3E9E'], laranja: ['#FDE7CF', '#A84A0A'] };
  function art(p, size) {
    if (p.photo) return '<img class="photo" src="' + p.photo + '" alt="Foto: ' + esc(p.name) + '">';
    var t = TINTS[p.tint] || TINTS.rosa;
    return '<svg width="' + (size || 120) + '" height="' + (size || 120) + '" viewBox="0 0 64 64" fill="none" stroke="' + t[1] + '" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round" role="img" aria-label="' + esc(p.name) + '"><path d="' + (ART[p.kind] || ART.tee) + '"/></svg>';
  }
  function tintBg(p) { return (TINTS[p.tint] || TINTS.rosa)[0]; }

  /* catálogo */
  var SIZES = ['RN', '0–3m', '3–6m', '6–9m', '9–12m', '1', '2', '3', '4', '6', '8', '10', '12', '14'];
  function groupOf(size) {
    if (/m$|RN/.test(size)) return 'Bebê';
    var n = parseInt(size, 10);
    if (n <= 2) return '1–2 anos'; if (n <= 4) return '3–4 anos'; if (n <= 8) return '6–8 anos'; return '10+ anos';
  }
  var BASE = [
    { id: 'p1', m1: '32 cm', m2: '58 cm', m3: '30 cm', name: 'Vestido de malha florido', size: '4', cat: 'Menina', cond: 'Ótimo estado', price: 39.9, kind: 'dress', tint: 'rosa', desc: 'Malha macia, estampa de florzinhas e alcinha regulável. Sem manchas nem furos.' },
    { id: 'p2', name: 'Body manga longa listrado', size: '6–9m', cat: 'Bebê', cond: 'Como novo', price: 19.9, kind: 'body', tint: 'amarelo', desc: 'Algodão, abertura com botões de pressão. Usado poucas vezes.', soldBase: true },
    { id: 'p3', m1: '38 cm', m2: '44 cm', m3: '—', name: 'Jaqueta jeans com forro', size: '6', cat: 'Menino', cond: 'Ótimo estado', price: 59.9, kind: 'jacket', tint: 'azul', desc: 'Forro quentinho, bolsos na frente. Perfeita para meia-estação.' },
    { id: 'p4', m1: '30 cm', m2: '40 cm', m3: '—', name: 'Camiseta dinossauro', size: '2', cat: 'Menino', cond: 'Bom estado', price: 24.9, kind: 'tee', tint: 'verde', desc: 'Estampa de dinossauro, gola canelada. Leve desbotado na barra.' },
    { id: 'p5', name: 'Calça de moletom', size: '3', cat: 'Menina', cond: 'Ótimo estado', price: 29.9, kind: 'pants', tint: 'lilas', desc: 'Cós com elástico e cordão. Moletom flanelado por dentro.', soldBase: true },
    { id: 'p6', name: 'Macacão de plush', size: '3–6m', cat: 'Bebê', cond: 'Como novo', price: 34.9, kind: 'body', tint: 'laranja', desc: 'Plush fofinho com zíper. Ideal para os dias frios.' },
    { id: 'p7', m1: '36 cm', m2: '70 cm', m3: '32 cm', name: 'Vestido de festa em tule', size: '8', cat: 'Menina', cond: 'Como novo', price: 69.9, kind: 'dress', tint: 'lilas', desc: 'Saia de tule em camadas e laço nas costas. Usado uma vez.' },
    { id: 'p8', name: 'Camisa polo', size: '10', cat: 'Menino', cond: 'Bom estado', price: 27.9, kind: 'tee', tint: 'azul', desc: 'Piquet de algodão, três botões. Pequeno sinal de uso na gola.' },
    { id: 'p9', name: 'Conjunto moletom rosa', size: '1', cat: 'Menina', cond: 'Ótimo estado', price: 44.9, kind: 'pants', tint: 'rosa', desc: 'Blusa e calça combinando. Macio e quentinho.' },
    { id: 'p10', name: 'Body regata algodão', size: 'RN', cat: 'Bebê', cond: 'Como novo', price: 14.9, kind: 'body', tint: 'verde', desc: 'Algodão orgânico, costuras macias. Para os primeiros dias.' },
    { id: 'p11', name: 'Jaqueta corta-vento', size: '12', cat: 'Menino', cond: 'Ótimo estado', price: 54.9, kind: 'jacket', tint: 'laranja', desc: 'Capuz embutido e punhos com elástico. Resistente à garoa.' },
    { id: 'p12', name: 'Camiseta arco-íris', size: '4', cat: 'Menina', cond: 'Bom estado', price: 22.9, kind: 'tee', tint: 'amarelo', desc: 'Estampa de arco-íris com glitter. Pequenas marcas de lavagem.' }
  ];
  function products() {
    var extra = LS.get('extra', []);
    var removed = LS.get('removed', []);
    var sold = LS.get('sold', null);
    if (sold === null) { sold = BASE.filter(function (p) { return p.soldBase; }).map(function (p) { return p.id; }); LS.set('sold', sold); }
    return extra.concat(BASE).filter(function (p) { return removed.indexOf(p.id) < 0; }).map(function (p) {
      return Object.assign({}, p, { group: groupOf(p.size), sold: sold.indexOf(p.id) >= 0 });
    });
  }
  function byId(id) { return products().filter(function (p) { return p.id === id; })[0]; }
  function markSold(ids) { var s = LS.get('sold', []); ids.forEach(function (i) { if (s.indexOf(i) < 0) s.push(i); }); LS.set('sold', s); }

  /* sacola */
  function cart() {
    var now = Date.now(), c = LS.get('cart', []), live = c.filter(function (x) { return now - x.at < RESERVA_MIN * 60000 && byId(x.id) && !byId(x.id).sold; });
    if (live.length !== c.length) { LS.set('cart', live); if (c.length > live.length) setTimeout(function () { toast('Uma reserva venceu e a peça voltou para a vitrine'); }, 400); }
    return live;
  }
  function inCart(id) { return cart().some(function (x) { return x.id === id; }); }
  function addToCart(id, fromEl) {
    var p = byId(id); if (!p || p.sold) return;
    if (inCart(id)) { location.href = 'sacola.html'; return; }
    var c = cart(); c.push({ id: id, at: Date.now() }); LS.set('cart', c);
    fly(fromEl, tintBg(p));
    setTimeout(function () { updateBadge(true); }, 650);
    toast(I.clock + ' Reservada para você por 15 minutos');
  }
  function removeFromCart(id) { LS.set('cart', cart().filter(function (x) { return x.id !== id; })); updateBadge(); }

  /* contas */
  function users() { return LS.get('users', {}); }
  function me() { var e = LS.get('session', null); return e ? users()[e] || null : null; }
  function saveMe(u) { var all = users(); all[u.email] = u; LS.set('users', all); }
  function signup(data) {
    var all = users(), email = data.email.trim().toLowerCase();
    if (all[email]) return 'Esse e-mail já tem conta. Entre com sua senha.';
    var u = { name: data.name.trim(), email: email, pass: data.pass, kids: data.kids || [], used: [], orders: [], optin: !!data.optin, created: Date.now() };
    all[email] = u; LS.set('users', all); LS.set('session', email); LS.set('seen-invite', true); return null;
  }
  function login(email, pass) {
    var u = users()[email.trim().toLowerCase()];
    if (!u || u.pass !== pass) return 'E-mail ou senha não conferem.';
    LS.set('session', u.email); return null;
  }
  function logout() { LS.set('session', null); }
  function daysToBirthday(iso) {
    if (!iso) return null; var d = new Date(iso + 'T00:00:00'), now = new Date(); now.setHours(0, 0, 0, 0);
    var next = new Date(now.getFullYear(), d.getMonth(), d.getDate()); if (next < now) next.setFullYear(now.getFullYear() + 1);
    return Math.round((next - now) / 86400000);
  }
  function ageNext(iso) { var d = new Date(iso + 'T00:00:00'), n = new Date(); var a = n.getFullYear() - d.getFullYear(); var b = new Date(n.getFullYear(), d.getMonth(), d.getDate()); if (b < n) a++; return a; }

  /* cupons */
  function coupons(u) {
    var list = [{ code: 'FRETEPIRU', label: 'Frete grátis no PAC acima de R$ 150', type: 'ship', min: 150 }, { code: 'KIT3', label: '15% levando 3 peças', type: 'pct', pct: 15, minItems: 3 }];
    if (u) {
      if (u.used.indexOf('BEMVINDO10') < 0) list.unshift({ code: 'BEMVINDO10', label: '10% na primeira compra', type: 'pct', pct: 10, mine: true });
      (u.kids || []).forEach(function (k) {
        var dd = daysToBirthday(k.birth);
        var code = 'NIVER-' + k.name.toUpperCase().normalize('NFD').replace(/[^A-Z]/g, '').slice(0, 10);
        if (dd !== null && dd <= 30 && u.used.indexOf(code) < 0) list.unshift({ code: code, label: '15% de presente pelo aniversário de ' + k.name, type: 'pct', pct: 15, mine: true });
      });
    }
    return list;
  }
  function checkCoupon(code, u, items, subtotal) {
    code = (code || '').trim().toUpperCase(); if (!code) return { err: '' };
    if (code === 'BEMVINDO10' && !u) return { err: 'Crie sua conta para usar esse cupom.' };
    var c = coupons(u).filter(function (x) { return x.code === code; })[0];
    if (!c) return { err: 'Cupom não encontrado ou já usado.' };
    if (c.minItems && items < c.minItems) return { err: 'Esse cupom vale levando ' + c.minItems + ' peças.' };
    if (c.min && subtotal < c.min) return { err: 'Esse cupom vale para compras acima de ' + money(c.min) + '.' };
    return { ok: c };
  }

  /* frete (simulado) */
  function frete(cep, items) {
    var d = String(cep).replace(/\D/g, ''); if (d.length !== 8) return null;
    var r = parseInt(d[0], 10), base = 14 + r * 1.6 + (items - 1) * 2.5;
    return [{ id: 'pac', name: 'PAC', price: Math.round(base * 100) / 100, days: (4 + Math.round(r / 2)) + ' a ' + (7 + Math.round(r / 2)) + ' dias úteis' },
            { id: 'sedex', name: 'SEDEX', price: Math.round(base * 1.75 * 100) / 100, days: (1 + Math.round(r / 4)) + ' a ' + (3 + Math.round(r / 4)) + ' dias úteis' }];
  }

  /* ui: topo, menu, rodapé */
  function header(active) {
    var links = [['index.html#vitrine', 'Novidades', ''], ['index.html?cat=Bebê#vitrine', 'Bebê', 'Bebê'], ['index.html?cat=Menina#vitrine', 'Menina', 'Menina'], ['index.html?cat=Menino#vitrine', 'Menino', 'Menino']];
    var u = me();
    var h = '<div class="ticker" aria-hidden="true"><div class="ticker-track">' + ['Envio para todo o Brasil pelos Correios', 'Cadastre-se e ganhe 10% na primeira compra', 'Peças únicas, revisadas e higienizadas', 'Pix ou cartão no site', 'Presente no aniversário do seu pequeno'].map(function (t) { return '<span>✦ ' + t + '</span>'; }).join('').repeat(2) + '</div></div>' +
      '<header class="header" id="hdr"><div class="wrap header-in">' +
      '<button class="ibtn burger" id="burger" aria-label="Abrir menu" aria-expanded="false">' + I.menu + '</button>' +
      '<a class="logo" href="index.html" aria-label="Pirulecos, página inicial"><img src="assets/logo-nome.webp" alt="Pirulecos brechó infantil"></a>' +
      '<nav class="nav" aria-label="Categorias">' + links.map(function (l) { return '<a href="' + l[0] + '"' + (active === l[2] && active ? ' class="on"' : '') + '>' + l[1] + '</a>'; }).join('') + '<a class="cupom" href="cupons.html">Cupons</a></nav>' +
      '<form class="search" role="search" action="index.html#vitrine"><label class="sr" for="q">Buscar peças</label>' + I.search + '<input id="q" name="q" type="search" placeholder="Buscar vestido, body…"></form>' +
      '<div class="icons"><a class="ibtn acc-ic" href="conta.html" aria-label="' + (u ? 'Minha conta' : 'Entrar ou criar conta') + '">' + I.user + '</a>' +
      '<a class="ibtn cart" id="cartBtn" href="sacola.html" aria-label="Sacola">' + I.bag + '<span class="badge" id="badge">0</span></a></div>' +
      '</div></header>' +
      '<div class="drawer" id="drawer" aria-hidden="true"><div class="shade" data-close></div><nav class="panel" aria-label="Menu">' +
      '<div class="drawer-top"><img src="assets/logo-nome.webp" alt="Pirulecos" style="height:40px"><button class="ibtn" data-close aria-label="Fechar menu">' + I.x + '</button></div>' +
      (u ? '<div class="box" style="display:flex;gap:12px;align-items:center;padding:14px;margin-bottom:8px"><span class="avatar" style="width:44px;height:44px;font-size:20px">' + esc(u.name[0] || '?').toUpperCase() + '</span><div><b>Oi, ' + esc(u.name.split(' ')[0]) + '!</b><br><small style="color:#6E5A45">Seus cupons estão na conta</small></div></div>' : '<a class="btn block" href="conta.html#criar" style="margin-bottom:8px">Criar conta e ganhar 10%</a>') +
      links.concat([['cupons.html', 'Cupons', ''], ['conta.html', u ? 'Minha conta' : 'Entrar', ''], ['sacola.html', 'Sacola', ''], ['loja.html', 'Área da loja', '']]).map(function (l, i) { return '<a class="item" href="' + l[0] + '" style="transition-delay:' + (0.05 + i * 0.04) + 's">' + l[1] + I.chev + '</a>'; }).join('') +
      '</nav></div>';
    document.body.insertAdjacentHTML('afterbegin', h);
    var dr = $('#drawer'), bg = $('#burger');
    var open = function (v) { dr.classList.toggle('open', v); dr.setAttribute('aria-hidden', !v); bg.setAttribute('aria-expanded', v); document.body.style.overflow = v ? 'hidden' : ''; };
    bg.addEventListener('click', function () { open(true); });
    $$('[data-close]', dr).forEach(function (b) { b.addEventListener('click', function () { open(false); }); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') open(false); });
    var hdr = $('#hdr'); window.addEventListener('scroll', function () { hdr.classList.toggle('scrolled', window.scrollY > 10); }, { passive: true });
    var q = new URLSearchParams(location.search).get('q'); if (q) $('#q').value = q;
    updateBadge();
  }
  function footer() {
    document.body.insertAdjacentHTML('beforeend', '<footer class="footer"><div class="wrap">' +
      '<div class="col"><img src="assets/logo-nome.webp" alt="Pirulecos brechó infantil" style="height:52px;width:auto;filter:brightness(0) invert(1);opacity:.95;align-self:flex-start"><small>Roupa boa não precisa ter um dono só.</small></div>' +
      '<div class="col"><b>Loja</b><a href="index.html#vitrine">Novidades</a><a href="cupons.html">Cupons</a><a href="conta.html">Minha conta</a></div>' +
      '<div class="col"><b>Pagamento e envio</b><small>Pix e cartão de crédito</small><small>Correios: PAC e SEDEX</small><small>7 dias para desistir da compra</small></div>' +
      '<div class="col"><b>Fale com a gente</b><a href="#">Instagram</a><a href="#">WhatsApp</a><a href="loja.html">Área da loja</a></div>' +
      '</div><p class="footnote">Protótipo: cadastros, compras e pagamentos são simulados e ficam salvos só neste navegador.</p></footer><div class="toasts" id="toasts" aria-live="polite"></div>');
  }
  function updateBadge(bump) {
    var b = $('#badge'); if (!b) return; var n = cart().length;
    b.textContent = n; b.classList.toggle('show', n > 0);
    if (bump) { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
  }
  function toast(html, ms) {
    var box = $('#toasts'); if (!box) return;
    var t = document.createElement('div'); t.className = 'toast'; t.innerHTML = html; box.appendChild(t);
    setTimeout(function () { t.classList.add('out'); setTimeout(function () { t.remove(); }, 300); }, ms || 2600);
  }
  function fly(from, color) {
    var to = $('#cartBtn'); if (!from || !to) return;
    var a = from.getBoundingClientRect(), b = to.getBoundingClientRect();
    var d = document.createElement('div'); d.className = 'flyer'; d.style.background = color;
    d.style.left = (a.left + a.width / 2 - 22) + 'px'; d.style.top = (a.top + a.height / 2 - 22) + 'px'; document.body.appendChild(d);
    var dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2);
    d.animate([{ transform: 'translate(0,0) scale(1)', opacity: 1 }, { transform: 'translate(' + dx * 0.5 + 'px,' + (dy - 120) + 'px) scale(1.1)', opacity: 1, offset: 0.5 }, { transform: 'translate(' + dx + 'px,' + dy + 'px) scale(.3)', opacity: .6 }], { duration: 700, easing: 'cubic-bezier(.5,0,.3,1)' }).onfinish = function () { d.remove(); };
  }
  function confetti() {
    var cs = ['#F6A63B', '#E86BB0', '#4FB3D9', '#7BC67E', '#9B6BD6', '#F06A5A'];
    for (var i = 0; i < 80; i++) {
      var c = document.createElement('div'); c.className = 'confetti'; c.style.background = cs[i % cs.length];
      c.style.left = (window.innerWidth / 2) + 'px'; c.style.top = (window.innerHeight * 0.4) + 'px'; document.body.appendChild(c);
      var ang = Math.random() * Math.PI * 2, dist = 200 + Math.random() * 360;
      (function (c) {
        c.animate([{ transform: 'translate(0,0) rotate(0)', opacity: 1 }, { transform: 'translate(' + Math.cos(ang) * dist + 'px,' + (Math.sin(ang) * dist + 400) + 'px) rotate(' + (Math.random() * 720) + 'deg)', opacity: 0 }], { duration: 1400 + Math.random() * 800, easing: 'cubic-bezier(.2,.6,.4,1)' }).onfinish = function () { c.remove(); };
      })(c);
    }
  }
  function reveal(root) {
    var els = $$('.rv:not(.in)', root);
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (e, i) { e.style.transitionDelay = (e.dataset.d || (i % 4) * 0.07) + 's'; io.observe(e); });
  }
  function modal(html, onClose) {
    var m = document.createElement('div'); m.className = 'modal'; m.innerHTML = '<div class="sheet" role="dialog" aria-modal="true"><button class="xbtn" aria-label="Fechar">' + I.x + '</button>' + html + '</div>';
    var close = function () { m.remove(); document.body.style.overflow = ''; onClose && onClose(); };
    m.addEventListener('click', function (e) { if (e.target === m) close(); }); $('.xbtn', m).addEventListener('click', close);
    document.body.appendChild(m); document.body.style.overflow = 'hidden'; return { el: m, close: close };
  }

  /* cartão de produto */
  function card(p, i) {
    var c = inCart(p.id);
    return '<article class="pcard rv' + (p.sold ? ' sold' : '') + '" data-d="' + ((i % 4) * 0.07) + '">' +
      '<a class="pimg" href="peca.html?id=' + p.id + '" style="background:' + tintBg(p) + '"><div class="art">' + art(p, 120) + '</div>' +
      (p.sold ? '<span class="stamp">VENDIDO</span>' : '<span class="ptag' + (p.isNew ? ' new' : '') + '">' + (p.isNew ? 'Novidade' : 'Peça única') + '</span>') + '</a>' +
      '<div class="pbody"><a class="pname" href="peca.html?id=' + p.id + '">' + esc(p.name) + '</a><div class="pmeta">Tam. ' + esc(p.size) + ' · ' + esc(p.cond) + '</div>' +
      '<div class="prow"><span class="price">' + money(p.price) + '</span>' +
      (p.sold ? '<span class="pmeta" style="font-weight:700">Já foi para casa nova</span>' : '<button class="btn sm' + (c ? ' incart' : '') + '" data-add="' + p.id + '">' + (c ? I.check + ' Na sacola' : 'Quero essa') + '</button>') +
      '</div></div></article>';
  }
  function bindAdd(root, rerender) {
    $$('[data-add]', root).forEach(function (b) {
      b.addEventListener('click', function (e) { e.preventDefault(); var id = b.dataset.add; var was = inCart(id); addToCart(id, b); if (!was) { b.classList.add('incart'); b.innerHTML = I.check + ' Na sacola'; } rerender && setTimeout(rerender, 900); });
    });
  }

  window.PZ = { $: $, $$: $$, LS: LS, I: I, money: money, esc: esc, art: art, tintBg: tintBg, SIZES: SIZES, groupOf: groupOf, products: products, byId: byId, markSold: markSold,
    cart: cart, inCart: inCart, addToCart: addToCart, removeFromCart: removeFromCart, me: me, saveMe: saveMe, signup: signup, login: login, logout: logout,
    daysToBirthday: daysToBirthday, ageNext: ageNext, coupons: coupons, checkCoupon: checkCoupon, frete: frete, header: header, footer: footer, updateBadge: updateBadge,
    toast: toast, confetti: confetti, reveal: reveal, modal: modal, card: card, bindAdd: bindAdd, TINTS: TINTS, BASE: BASE };
})();
