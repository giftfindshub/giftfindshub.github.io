// Template A: full-bleed photo + overlay headline. Template C: minimal text card. 1000x1500.
window.loadImg = window.loadImg || ((src) => new Promise((res, rej) => { const i = new Image(); i.crossOrigin = 'anonymous'; i.onload = () => res(i); i.onerror = rej; i.src = src; }));
window.SANS = "'Segoe UI', 'Inter', Arial, sans-serif", SERIF = "Georgia, serif";
window._wrap = function(x, t, m) { const ws = t.split(' '), L = []; let cur = ''; for (const w of ws) { const tt = cur ? cur + ' ' + w : w; if (x.measureText(tt).width > m && cur) { L.push(cur); cur = w; } else cur = tt; } if (cur) L.push(cur); return L; }
window._hl = function(x, c, lines, L, y, hs, P) { const hi = new Set((c.headline.match(/\*([^*]+)\*/g) || []).flatMap(s => s.replace(/\*/g, '').split(' '))); for (const line of lines) { y += hs * 1.04; let cx = L; for (const w of line.split(' ')) { x.fillStyle = hi.has(w) ? P.accent : P.text; x.fillText(w, cx, y); cx += x.measureText(w + ' ').width; } } return y; }

window.drawFullBleed = async function (c) {
  const W = 1000, H = 1500, cv = document.createElement('canvas'); cv.width = W; cv.height = H; const x = cv.getContext('2d'); const P = c.palette;
  const img = await loadImg(c.photo); const s = Math.max(W / img.naturalWidth, H / img.naturalHeight);
  const iw = img.naturalWidth * s, ih = img.naturalHeight * s; x.drawImage(img, (W - iw) / 2, (H - ih) * (c.focusY ?? 0.5), iw, ih);
  const g = x.createLinearGradient(0, H * 0.45, 0, H); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(0.55, 'rgba(0,0,0,.55)'); g.addColorStop(1, 'rgba(0,0,0,.85)');
  x.fillStyle = g; x.fillRect(0, 0, W, H);
  const L = 72, CW = W - 2 * L; const hs = c.hSize || 104; x.font = `900 ${hs}px ${SANS}`;
  const lines = _wrap(x, c.headline.replace(/\*/g, ''), CW); x.font = `500 40px ${SANS}`; const subL = c.sub ? _wrap(x, c.sub, CW) : [];
  let y = H - 230 - lines.length * hs * 1.04 - subL.length * 52 - 20;
  // small label
  x.font = `700 28px ${SANS}`; x.fillStyle = P.accent; x.fillText(c.tag.toUpperCase().split('').join(String.fromCharCode(8202)), L, y); y += 10;
  x.font = `900 ${hs}px ${SANS}`; x.save(); x.shadowColor = 'rgba(0,0,0,.4)'; x.shadowBlur = 18; y = _hl(x, c, lines, L, y, hs, P); x.restore();
  y += 12; x.font = `500 40px ${SANS}`; x.fillStyle = 'rgba(255,255,255,.9)'; for (const l of subL) { y += 52; x.fillText(l, L, y); }
  x.font = `800 36px ${SANS}`; const ct = c.cta + '  →'; const cw = x.measureText(ct).width + 76;
  x.beginPath(); x.roundRect(L, H - 165, cw, 80, 40); x.fillStyle = P.accent; x.fill();
  x.fillStyle = P.ctaText || '#111'; x.textBaseline = 'middle'; x.fillText(ct, L + 38, H - 125); x.textBaseline = 'alphabetic';
  x.fillStyle = '#fff'; x.font = `italic 600 30px ${SERIF}`; x.textAlign = 'right'; x.fillText('Gift Finds Hub', W - L, H - 112); x.textAlign = 'left';
  return cv;
};

window.drawMinimal = function (c) {
  const W = 1000, H = 1500, cv = document.createElement('canvas'); cv.width = W; cv.height = H; const x = cv.getContext('2d'); const P = c.palette;
  x.fillStyle = P.bg; x.fillRect(0, 0, W, H);
  // big soft circle + emoji illustration
  x.fillStyle = P.circle; x.beginPath(); x.arc(W / 2, 430, 270, 0, 7); x.fill();
  x.font = `230px 'Segoe UI Emoji','Noto Color Emoji',sans-serif`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(c.emoji, W / 2, 445);
  x.textBaseline = 'alphabetic';
  x.font = `700 28px ${SANS}`; x.fillStyle = P.accent; x.fillText(c.tag.toUpperCase().split('').join(String.fromCharCode(8202)), W / 2, 790);
  const hs = c.hSize || 96; x.font = `900 ${hs}px ${SANS}`; const lines = _wrap(x, c.headline.replace(/\*/g, ''), W - 160);
  const hi = new Set((c.headline.match(/\*([^*]+)\*/g) || []).flatMap(s => s.replace(/\*/g, '').split(' ')));
  let y = 800; for (const line of lines) { y += hs * 1.05; const ww = line.split(' '); const full = x.measureText(line).width; let cx = W / 2 - full / 2; x.textAlign = 'left';
    for (const w of ww) { x.fillStyle = hi.has(w) ? P.accent : P.text; x.fillText(w, cx, y); cx += x.measureText(w + ' ').width; } }
  x.textAlign = 'center'; x.font = `500 40px ${SANS}`; x.fillStyle = P.muted; y += 30; for (const l of _wrap(x, c.sub, W - 200)) { y += 52; x.fillText(l, W / 2, y); }
  x.font = `800 36px ${SANS}`; const ct = c.cta + '  →'; const cw = x.measureText(ct).width + 76;
  x.beginPath(); x.roundRect(W / 2 - cw / 2, H - 200, cw, 80, 40); x.fillStyle = P.accent; x.fill();
  x.fillStyle = P.ctaText || '#fff'; x.textBaseline = 'middle'; x.fillText(ct, W / 2, H - 160); x.textBaseline = 'alphabetic';
  x.fillStyle = P.text; x.font = `italic 600 30px ${SERIF}`; x.fillText('Gift Finds Hub', W / 2, H - 70); x.textAlign = 'left';
  return cv;
};

window.FB_PAL = { gold: { accent: '#ffc857', ctaText: '#1a1a1a', text: '#ffffff' }, pink: { accent: '#ff9fb2', ctaText: '#3a0d18', text: '#ffffff' }, mint: { accent: '#7fe0c0', ctaText: '#0d2a22', text: '#ffffff' } };
window.MIN_PAL = {
  cream: { bg: '#f7efe3', circle: '#efd9bd', accent: '#c0513a', ctaText: '#fff', text: '#2e2118', muted: '#6e5a4c' },
  sky: { bg: '#eaf3fb', circle: '#cfe3f5', accent: '#1f5f99', ctaText: '#fff', text: '#13283d', muted: '#4f6478' },
  blush: { bg: '#fbecee', circle: '#f6d2d8', accent: '#b23a5a', ctaText: '#fff', text: '#3a1420', muted: '#7a5560' }
};
window.showCv = (cv) => { const im = document.createElement('img'); im.className = '__prev'; im.src = cv.toDataURL('image/jpeg', .8);
  const n = document.querySelectorAll('.__prev').length; im.style.cssText = `position:fixed;top:0;left:${n * 34}vh;height:100vh;z-index:999999`; document.body.appendChild(im); };

// Photo pin renderer: free stock photo on top, text panel below. 1000x1500.
window.loadImg = (src) => new Promise((res, rej) => { const i = new Image(); i.crossOrigin = 'anonymous'; i.onload = () => res(i); i.onerror = rej; i.src = src; });
window.drawPhotoPin = async function (c) {
  const W = 1000, H = 1500, PH = c.photoH || 860;
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const x = cv.getContext('2d');
  const SANS = "'Segoe UI', 'Inter', Arial, sans-serif", SERIF = "Georgia, serif";
  const P = c.palette;
  const img = await loadImg(c.photo);
  // cover-fit photo into top area
  const s = Math.max(W / img.naturalWidth, PH / img.naturalHeight);
  const iw = img.naturalWidth * s, ih = img.naturalHeight * s;
  x.drawImage(img, (W - iw) / 2, (PH - ih) * (c.focusY ?? 0.5), iw, ih);
  // panel
  x.fillStyle = P.bg; x.fillRect(0, PH, W, H - PH);
  const fade = x.createLinearGradient(0, PH - 160, 0, PH);
  fade.addColorStop(0, 'rgba(0,0,0,0)'); fade.addColorStop(1, P.bg);
  x.fillStyle = fade; x.fillRect(0, PH - 160, W, 160);
  const rr = (X, Y, w, h, r) => { x.beginPath(); x.roundRect(X, Y, w, h, r); };
  const wrap = (t, m) => { const ws = t.split(' '), L = []; let cur = ''; for (const w of ws) { const tt = cur ? cur + ' ' + w : w; if (x.measureText(tt).width > m && cur) { L.push(cur); cur = w; } else cur = tt; } if (cur) L.push(cur); return L; };
  const L = 70, CW = W - 2 * L;
  // tag pill on photo
  x.font = `700 26px ${SANS}`;
  const tag = c.tag.toUpperCase().split('').join(String.fromCharCode(8202));
  const tw = x.measureText(tag).width;
  x.save(); x.shadowColor = 'rgba(0,0,0,.3)'; x.shadowBlur = 20;
  x.fillStyle = P.accent; rr(L, 60, tw + 52, 56, 28); x.fill(); x.restore();
  x.fillStyle = P.tagText || P.bg; x.textBaseline = 'middle'; x.fillText(tag, L + 26, 89); x.textBaseline = 'alphabetic';
  // headline
  let y = PH - 30;
  const hs = c.hSize || 96; x.font = `900 ${hs}px ${SANS}`;
  const hl = c.headline.replace(/\*/g, '');
  const hi = new Set((c.headline.match(/\*([^*]+)\*/g) || []).flatMap(s => s.replace(/\*/g, '').split(' ')));
  for (const line of wrap(hl, CW)) { y += hs * 1.03; let cx = L; for (const w of line.split(' ')) { x.fillStyle = hi.has(w) ? P.accent2 : P.text; x.fillText(w, cx, y); cx += x.measureText(w + ' ').width; } }
  y += 26;
  x.font = `500 38px ${SANS}`; x.fillStyle = P.muted;
  for (const line of wrap(c.sub, CW)) { y += 50; x.fillText(line, L, y); }
  // CTA button
  x.font = `800 38px ${SANS}`; const ct = c.cta + '  →'; const cw = x.measureText(ct).width + 80;
  rr(L, H - 175, cw, 84, 42); x.fillStyle = P.accent; x.fill();
  x.fillStyle = P.tagText || P.bg; x.textBaseline = 'middle'; x.fillText(ct, L + 40, H - 132); x.textBaseline = 'alphabetic';
  x.fillStyle = P.text; x.font = `italic 600 30px ${SERIF}`; x.textAlign = 'right'; x.fillText('Gift Finds Hub', W - L, H - 120); x.textAlign = 'left';
  return cv;
};
window.PPAL = {
  berry: { bg: '#4a1428', accent: '#ffc46b', accent2: '#ffc46b', tagText: '#4a1428', text: '#fff4ee', muted: '#f3d3d6' },
  navy: { bg: '#14253d', accent: '#e9c46a', accent2: '#e9c46a', tagText: '#14253d', text: '#f6efe4', muted: '#cfd7e3' },
  pine: { bg: '#163a2f', accent: '#f2c14e', accent2: '#ffd166', tagText: '#163a2f', text: '#f3f5ef', muted: '#cfe0d6' },
  cream: { bg: '#f3e9da', accent: '#b5543c', accent2: '#b5543c', tagText: '#fff7ef', text: '#3b2a20', muted: '#6e5a4c' }
};

// Template D: elegant gift-guide collage (Janie-inspired, our own design). 1000x1500.
window.loadImg = window.loadImg || ((src) => new Promise((res, rej) => { const i = new Image(); i.crossOrigin = 'anonymous'; i.onload = () => res(i); i.onerror = rej; i.src = src; }));
window.drawCollage = async function (c) {
  const W = 1000, H = 1500, cv = document.createElement('canvas'); cv.width = W; cv.height = H; const x = cv.getContext('2d');
  const P = c.palette, SANS = "'Segoe UI', Arial, sans-serif", SCRIPT = "'Brush Script MT','Segoe Script','Lucida Handwriting',cursive", SERIF = "Georgia, serif";
  // background
  x.fillStyle = P.bg; x.fillRect(0, 0, W, H);
  const g = x.createRadialGradient(W * .8, 120, 0, W * .8, 120, 700); g.addColorStop(0, P.glow); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, W, H);
  // header
  x.textAlign = 'center';
  x.fillStyle = P.accent; x.font = `700 28px ${SANS}`; x.fillText(c.kicker.toUpperCase().split('').join(String.fromCharCode(8202)), W / 2, 92);
  x.fillStyle = P.text; x.font = `italic 400 ${c.scriptSize || 112}px ${SCRIPT}`; x.fillText(c.script, W / 2, 210);
  x.font = `800 ${c.titleSize || 74}px ${SANS}`; x.fillText(c.title, W / 2, 292);
  x.fillStyle = P.muted; x.font = `500 34px ${SANS}`; x.fillText(c.sub, W / 2, 348);
  // 2x2 photo grid
  const imgs = await Promise.all(c.photos.map(p => loadImg(p.src)));
  const gx = 60, gy = 392, gap = 18, cw = (W - 2 * gx - gap) / 2, ch = 400;
  imgs.forEach((im, i) => {
    const col = i % 2, row = Math.floor(i / 2), X = gx + col * (cw + gap), Y = gy + row * (ch + gap);
    x.save(); x.beginPath(); x.roundRect(X, Y, cw, ch, 26); x.clip();
    const s = Math.max(cw / im.naturalWidth, ch / im.naturalHeight), iw = im.naturalWidth * s, ih = im.naturalHeight * s;
    x.drawImage(im, X + (cw - iw) / 2, Y + (ch - ih) * (c.photos[i].fy ?? .5), iw, ih);
    const lg = x.createLinearGradient(0, Y + ch - 120, 0, Y + ch); lg.addColorStop(0, 'rgba(0,0,0,0)'); lg.addColorStop(1, 'rgba(0,0,0,.65)'); x.fillStyle = lg; x.fillRect(X, Y + ch - 120, cw, 120);
    x.restore();
    // number badge + label
    x.fillStyle = P.accent; x.beginPath(); x.arc(X + 38, Y + 38, 24, 0, 7); x.fill();
    x.fillStyle = P.badgeText; x.font = `800 26px ${SANS}`; x.textBaseline = 'middle'; x.fillText(String(i + 1), X + 38, Y + 39); x.textBaseline = 'alphabetic';
    x.fillStyle = '#fff'; x.font = `700 32px ${SANS}`; x.fillText(c.photos[i].label, X + cw / 2, Y + ch - 28);
  });
  // CTA
  const by = gy + 2 * ch + gap + 46;
  x.font = `800 38px ${SANS}`; const ct = c.cta + '  →'; const bw = x.measureText(ct).width + 90;
  x.fillStyle = P.accent; x.beginPath(); x.roundRect(W / 2 - bw / 2, by, bw, 86, 43); x.fill();
  x.fillStyle = P.badgeText; x.textBaseline = 'middle'; x.fillText(ct, W / 2, by + 44); x.textBaseline = 'alphabetic';
  x.fillStyle = P.muted; x.font = `500 26px ${SANS}`; x.fillText('giftfindshub.github.io', W / 2, H - 52);
  x.fillStyle = P.text; x.font = `italic 600 30px ${SERIF}`; x.fillText('Gift Finds Hub', W / 2, H - 92);
  x.textAlign = 'left';
  return cv;
};
window.COL_PAL = {
  forest: { bg: '#173b2f', glow: 'rgba(242,193,78,.28)', accent: '#f2c14e', badgeText: '#173b2f', text: '#fbf6ea', muted: '#cfe0d6' },
  wine: { bg: '#4a1428', glow: 'rgba(255,196,107,.25)', accent: '#ffc46b', badgeText: '#4a1428', text: '#fff4ee', muted: '#f3d3d6' },
  navy: { bg: '#14253d', glow: 'rgba(233,196,106,.28)', accent: '#e9c46a', badgeText: '#14253d', text: '#f6efe4', muted: '#cfd7e3' }
};


window.showCv = (cv) => { document.querySelectorAll('.__prev').forEach(e=>e.remove()); cv = cv || window.__cv; const im = document.createElement('img'); im.className = '__prev'; im.src = cv.toDataURL('image/jpeg', .8); im.style.cssText = 'position:fixed;top:0;left:0;height:100vh;z-index:999999'; document.body.appendChild(im); };
window.attachFile = (f) => { document.querySelectorAll('.__prev').forEach(e=>e.remove()); const inp = document.querySelector('input[type=file]'); const dt = new DataTransfer(); dt.items.add(f); inp.files = dt.files; inp.dispatchEvent(new Event('change', { bubbles: true })); return f.size; };
window.attachCv = async (name) => { const blob = await new Promise(r => window.__cv.toBlob(r, 'image/png')); return attachFile(new File([blob], name + '.png', { type: 'image/png' })); };
window.U = (id, w=1400) => 'https://images.unsplash.com/photo-' + id + '?w=' + w + '&q=85';
window.render = async (s) => { const c = Object.assign({}, s.c);
  if (s.t === 'min') { c.palette = MIN_PAL[c.palette]; window.__cv = drawMinimal(c); }
  else if (s.t === 'fb') { c.palette = FB_PAL[c.palette]; window.__cv = await drawFullBleed(c); }
  else if (s.t === 'pp') { c.palette = PPAL[c.palette]; window.__cv = await drawPhotoPin(c); }
  else if (s.t === 'col') { c.palette = COL_PAL[c.palette]; window.__cv = await drawCollage(c); }
  showCv(); return 'rendered ' + s.id; };
// video: slides with slow zoom + text, recorded from canvas
window.makeVideo = async (slides, secPer = 1.8) => {
  const W = 720, H = 1280, cv = document.createElement('canvas'); cv.width = W; cv.height = H; const x = cv.getContext('2d');
  const imgs = await Promise.all(slides.map(s => s.photo ? loadImg(s.photo) : null));
  const mime = ['video/mp4;codecs=avc1', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm'].find(m => MediaRecorder.isTypeSupported(m));
  const st = cv.captureStream(30); const rec = new MediaRecorder(st, { mimeType: mime, videoBitsPerSecond: 6e6 }); const chunks = [];
  rec.ondataavailable = e => e.data.size && chunks.push(e.data);
  const draw = (i, p) => { const s = slides[i], im = imgs[i]; x.fillStyle = s.bg || '#173b2f'; x.fillRect(0, 0, W, H);
    if (im) { const z = 1.08 + 0.10 * p; const sc = Math.max(W / im.naturalWidth, H / im.naturalHeight) * z; const iw = im.naturalWidth * sc, ih = im.naturalHeight * sc; x.drawImage(im, (W - iw) / 2, (H - ih) / 2, iw, ih);
      const g = x.createLinearGradient(0, H * .4, 0, H); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,.85)'); x.fillStyle = g; x.fillRect(0, 0, W, H); }
    const a = Math.min(1, p * 4); x.globalAlpha = a; x.textAlign = 'center';
    if (s.kicker) { x.font = `700 26px ${SANS}`; x.fillStyle = '#f2c14e'; x.fillText(s.kicker.toUpperCase(), W / 2, H - 330); }
    x.font = `900 ${s.size || 78}px ${SANS}`; x.fillStyle = '#fff'; let y = H - 330 + 20; for (const l of _wrap(x, s.text, W - 100)) { y += (s.size || 78) * 1.08; x.fillText(l, W / 2, y); }
    if (s.sub) { x.font = `500 34px ${SANS}`; x.fillStyle = 'rgba(255,255,255,.9)'; y += 30; for (const l of _wrap(x, s.sub, W - 120)) { y += 44; x.fillText(l, W / 2, y); } }
    x.globalAlpha = 1; x.font = `italic 600 26px ${SERIF}`; x.fillStyle = '#fff'; x.fillText('Gift Finds Hub', W / 2, H - 40); x.textAlign = 'left'; };
  draw(0, 0); rec.start(200); const t0 = performance.now(), total = slides.length * secPer * 1000;
  await new Promise(res => { const tick = () => { const t = performance.now() - t0; if (t >= total) return res(); const i = Math.min(slides.length - 1, Math.floor(t / (secPer * 1000))); draw(i, (t - i * secPer * 1000) / (secPer * 1000)); requestAnimationFrame(tick); }; tick(); });
  rec.stop(); await new Promise(r => rec.onstop = r); const blob = new Blob(chunks, { type: mime.split(';')[0] }); window.__vid = blob; window.__vidMime = mime; return mime + ' ' + blob.size; };
window.KIT_OK = 1;
window.SPECS = [
 {id:'blanket', t:'min', c:{palette:'blush', emoji:'🛋️', tag:'Gifts for Her', headline:'Her Favorite Spot This *Winter*', sub:'A heated throw blanket with 6 heat levels and auto shut-off.', cta:'See the blanket'}},
 {id:'g325', t:'pp', c:{photo:U('1610041321420-a596dd14ebc9'), palette:'navy', tag:'Gifts for Gamers', headline:'No Cords. *Just* Game.', sub:'The Logitech G325 wireless headset — works with PC, PlayStation and more.', cta:'See the headset'}},
 {id:'basket', t:'min', c:{palette:'cream', emoji:'🧺', tag:'Teacher & Coworker Gifts', headline:'Say Thank You With *One* Box', sub:'A gift-boxed 10-piece thank-you basket — perfect for teachers, nurses and coworkers.', cta:'See teacher gifts'}},
 {id:'stanley', t:'min', c:{palette:'sky', emoji:'🥤', tag:'Gifts for Teens', headline:'Hydrated & *Aesthetic*', sub:'The Stanley Quencher with handle and straw lid — in tons of colors.', cta:'See the tumbler'}},
 {id:'dogseat', t:'fb', c:{photo:U('1559190394-df5a28aab5c5'), palette:'mint', tag:'Gifts for Dog Lovers', headline:'Road Trips *Without* the Fur', sub:'A waterproof hammock seat cover with 47,000+ reviews.', cta:'See the seat cover'}},
 {id:'stocking', t:'fb', c:{photo:U('1611690889004-c009a7e03712'), palette:'gold', tag:'Stocking Stuffers 2026', headline:'Little Gifts, *Big* Smiles', sub:'Stocking stuffers people use every day — lip balm, socks, hand warmers and more.', cta:'See all stocking stuffers'}},
 {id:'himguide', t:'pp', c:{photo:U('1650307535558-fa2b39ed16eb'), palette:'pine', tag:'Gifts for Him 2026', headline:'Shopping for *Dad?*', sub:'Practical gifts with thousands of reviews — no guessing.', cta:'See gifts for him'}},
 {id:'herguide', t:'col', c:{palette:'wine', kicker:'Amazon Gift Guide 2026', script:'Gifts for Her', title:"She'll Actually Use", sub:'17 cozy, beauty & sentimental picks', photos:[{src:U('1590925862651-2112d98d9ae0',700),label:'Cozy Blanket'},{src:U('1678695692040-e9a39502c357',700),label:'Makeup Brushes'},{src:U('1723522938827-aeaecb5d913b',700),label:'Bracelets'},{src:U('1762444015432-bf564dc27613',700),label:'Christmas Pajamas'}], cta:'See all 17 gifts'}},
 {id:'warmers', t:'min', c:{palette:'cream', emoji:'🔥', tag:'Gifts for Him', headline:'Warm Hands *All* Winter', sub:'A rechargeable 2-pack of hand warmers — a stocking stuffer he will use daily.', cta:'See the hand warmers'}},
 {id:'kindle', t:'min', c:{palette:'sky', emoji:'📖', tag:'Gifts for Readers', headline:'For the Friend Who *Reads* Everywhere', hSize:88, sub:'Kindle Paperwhite: a glare-free screen and room for a huge library.', cta:'See the Kindle'}},
];
window.VIDEO = [
 {photo:U('1607883567304-8ac65a46c331',900), kicker:'Amazon Gift Guide 2026', text:'Christmas Gifts People Actually Use', size:74},
 {photo:U('1590925862651-2112d98d9ae0',900), kicker:'Cozy', text:'Heated Throw Blanket'},
 {photo:U('1650307535558-fa2b39ed16eb',900), kicker:'For Him', text:'Memory Foam Slippers'},
 {photo:U('1712599162206-f371c437022b',900), kicker:'For Kids', text:'Squishmallows 3-Pack'},
 {photo:U('1610041321420-a596dd14ebc9',900), kicker:'For Gamers', text:'Wireless Gaming Headset'},
 {photo:U('1513885535751-8b9238bd345a',900), kicker:'See all gifts', text:'Full Guide at Gift Finds Hub', sub:'giftfindshub.github.io', size:70},
];
