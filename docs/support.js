/* Motor mínimo para rodar as telas .dc.html fora do editor (GitHub Pages).
   Suporta: {{caminho}} em texto e atributos, <sc-for>, <sc-if>, onClick e setState. */
(function () {
  class DCLogic {
    constructor(props) { this.props = props || {}; this.state = {}; }
    setState(patch) { Object.assign(this.state, typeof patch === 'function' ? patch(this.state) : patch); this.__render && this.__render(); }
    forceUpdate() { this.__render && this.__render(); }
  }
  window.DCLogic = DCLogic;

  const HOLE = /\{\{\s*([^}]+?)\s*\}\}/g;
  const WHOLE = /^\{\{\s*([^}]+?)\s*\}\}$/;

  function lookup(path, scope) {
    path = path.trim();
    if (path === 'true') return true;
    if (path === 'false') return false;
    if (/^-?\d+(\.\d+)?$/.test(path)) return Number(path);
    return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), scope);
  }
  function interp(str, scope) {
    return str.replace(HOLE, (_, p) => { const v = lookup(p, scope); return v == null ? '' : String(v); });
  }

  function build(node, scope, out) {
    if (node.nodeType === 3) { out.appendChild(document.createTextNode(interp(node.nodeValue, scope))); return; }
    if (node.nodeType !== 1) return;
    const tag = node.localName.toLowerCase();
    if (tag === 'sc-for') {
      const list = lookup((node.getAttribute('list') || '').replace(/[{}]/g, ''), scope) || [];
      const as = node.getAttribute('as') || 'item';
      list.forEach((item, i) => {
        const s = Object.create(scope); s[as] = item; s.$index = i;
        node.childNodes.forEach((c) => build(c, s, out));
      });
      return;
    }
    if (tag === 'sc-if') {
      const v = lookup((node.getAttribute('value') || '').replace(/[{}]/g, ''), scope);
      if (v) node.childNodes.forEach((c) => build(c, scope, out));
      return;
    }
    const el = node.cloneNode(false);
    for (const attr of Array.from(node.attributes)) {
      const name = attr.name, val = attr.value;
      if (name.startsWith('hint-')) { el.removeAttribute(name); continue; }
      const whole = val.match(WHOLE);
      if (/^on[a-z]+$/i.test(name)) {
        el.removeAttribute(name);
        const fn = whole ? lookup(whole[1], scope) : null;
        if (typeof fn === 'function') el.addEventListener(name.slice(2).toLowerCase(), (e) => fn(e));
        continue;
      }
      if (val.indexOf('{{') !== -1) {
        const v = whole ? lookup(whole[1], scope) : interp(val, scope);
        if (v === false || v == null) el.removeAttribute(name); else el.setAttribute(name, String(v));
      }
    }
    node.childNodes.forEach((c) => build(c, scope, el));
    out.appendChild(el);
  }

  function start() {
    const host = document.querySelector('x-dc');
    if (!host) return;
    const helmet = host.querySelector('helmet');
    if (helmet) { Array.from(helmet.children).forEach((c) => document.head.appendChild(c)); helmet.remove(); }
    const tpl = document.createElement('div');
    while (host.firstChild) tpl.appendChild(host.firstChild);
    const scriptEl = document.querySelector('script[data-dc-script]');
    let props = {};
    try {
      const decl = JSON.parse(scriptEl.getAttribute('data-props') || '{}');
      Object.keys(decl).forEach((k) => { if (k[0] !== '$' && 'default' in decl[k]) props[k] = decl[k].default; });
    } catch (e) {}
    const Component = new Function('DCLogic', scriptEl.textContent + '\nreturn Component;')(DCLogic);
    const comp = new Component(props);
    comp.__render = function () {
      const frag = document.createDocumentFragment();
      const vals = comp.renderVals ? comp.renderVals() : {};
      tpl.childNodes.forEach((c) => build(c, vals, frag));
      host.replaceChildren(frag);
    };
    comp.__render();
    if (comp.componentDidMount) comp.componentDidMount();
    // Telas de celular: centraliza na janela do computador
    const root = host.firstElementChild;
    if (root && /width:\s*390px/.test(root.getAttribute('style') || '') && window.innerWidth > 500) {
      document.body.style.cssText += ';background:#EDE6DA;display:flex;justify-content:center;padding:32px 0';
      root.style.boxShadow = '0 20px 60px rgba(59,42,26,.25)';
      root.style.borderRadius = '32px';
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
