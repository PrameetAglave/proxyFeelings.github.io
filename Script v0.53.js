// ========= sizing / ui =========
const A4 = { w: 2480, h: 3508 };
const SQ = { w: 1024, h: 1024 };
const PREVIEW = { w: 1024, h: 1024 };
let targetSize = SQ;

const elText = document.getElementById('moodText');
const elA4 = document.getElementById('btnA4');
const elSq = document.getElementById('btnSquare');
const elPreview = document.getElementById('btnPreview');
const elGen = document.getElementById('btnGenerate');
const elDl = document.getElementById('btnDownload');
const elSeedLock = document.getElementById('seedLock');
const elSeedOverride = document.getElementById('overrideSeed');
const elCMYK = document.getElementById('cmykSafe');
const elGuide = document.getElementById('showGuide');
const elRand = document.getElementById('btnRandom');
const elDerived = document.getElementById('derived');

elA4.onclick = () => { targetSize = A4; elA4.classList.add('primary'); elSq.classList.remove('primary'); regen(); };
elSq.onclick = () => { targetSize = SQ; elSq.classList.add('primary'); elA4.classList.remove('primary'); regen(); };
elPreview.onclick = () => quickPreview();
elGen.onclick = () => regen();
elDl.onclick = () => saveCanvas(currentCanvas, filename() + '.png');
elRand.onclick = () => { elSeedLock.checked = false; regen(); };

// ========= state =========
let currentCanvas;
let derived = null;

// ========= p5 global =========
function setup(){
  currentCanvas = createCanvas(targetSize.w, targetSize.h);
  currentCanvas.parent('canvasHolder');
  pixelDensity(1);
  noLoop();
  regen();
}

function draw(){
  if (!derived) return;

  randomSeed(derived.seed);
  noiseSeed(derived.seed);

  backgroundLayer(derived);
  if (elGuide.checked) drawGuides();

  const famA = derived.top2[0];
  const famB = derived.top2[1];

  const gA = createGraphics(width, height);
  const gB = createGraphics(width, height);

  renderFamilyLayer(gA, famA, 0, derived);
  renderFamilyLayer(gB, famB, 1, derived);

  image(gA, 0, 0);
  blend(gB, 0, 0, width, height, 0, 0, width, height, SOFT_LIGHT);

  gA.remove();
  gB.remove();

  postFX(derived);
}

// ========= derivation =========
function regen(){
  derived = deriveFromText(elText.value || "");
  let s = derived.seed;
  const os = elSeedOverride.value.trim();
  if (os!=="") s = parseInt(os,10);
  if (!elSeedLock.checked || Number.isNaN(s)) s = floor(random(2**31));
  derived.seed = s;

  updateInfo();
  resizeIfNeeded();
  redraw();
}
function quickPreview(){
  const old = targetSize;
  targetSize = PREVIEW; resizeCanvas(PREVIEW.w, PREVIEW.h); regen();
  setTimeout(()=>{ targetSize = old; resizeIfNeeded(); }, 30);
}
function resizeIfNeeded(){
  const s = (targetSize===A4)?A4: (targetSize===SQ?SQ:targetSize);
  resizeCanvas(s.w, s.h);
}
function updateInfo(){
  elDerived.innerHTML = `
    <div class="pill">families: <span class="family">${derived.top2.join(' + ')}</span></div>
    <div class="pill">valence: ${fmt(derived.valence)}</div>
    <div class="pill">arousal: ${fmt(derived.arousal)}</div>
    <div class="pill">intensity: ${fmt(derived.intensity)}</div>
    <div class="pill">seed: ${derived.seed}</div>
    ${derived.keywords?.length? `<div class="pill">hits: ${derived.keywords.join(', ')}</div>`: "" }
  `;
}
function filename(){
  const slug = (elText.value||"mood").toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'').slice(0,64);
  return `${slug}_${derived.top2.join('+')}_seed-${derived.seed}_${width}x${height}`;
}

// text -> families/params
function deriveFromText(text){
  const t = (text||"").toLowerCase().trim();
  const tokens = t.split(/\s+/).filter(Boolean);
  const families = MOOD_DATA.families || [];
  const lex = MOOD_DATA.familyLexicon || {};
  const scores = {};
  families.forEach(f=>scores[f]=0);

  const hits = [];
  for (const f of families){
    const L = lex[f]||[];
    for (const {k,w} of L){ if (t.includes(k)){ scores[f]+= (w||1); hits.push(k); } }
  }
  const sorted = Object.entries(scores).sort((a,b)=>b[1]-a[1]);

  const fam1 = sorted[0]?.[0] || "Serenity";
  const score1 = sorted[0]?.[1] || 0;
  const fam2Raw = sorted[1]?.[0];
  const score2 = sorted[1]?.[1] || 0;

// if there is no meaningful second family, reuse family 1
const fam2 = (!fam2Raw || score2 <= 0) ? fam1 : fam2Raw;

const top2 = [fam1, fam2];
const s1 = score1, s2 = score2;


  const pos = (MOOD_DATA.sentiment?.positive)||[];
  const neg = (MOOD_DATA.sentiment?.negative)||[];
  let polarity = 0;
  for (const w of pos) if (t.includes(w)) polarity += 1;
  for (const w of neg) if (t.includes(w)) polarity -= 1;

  const negators = new Set(["not","no","never","hardly","barely"]);
  for (let i=0;i<tokens.length;i++){
    if (negators.has(tokens[i])){
      const win = tokens.slice(i+1,i+3).join(" ");
      for (const w of pos) if (win.includes(w)) polarity -= 0.75;
      for (const w of neg) if (win.includes(w)) polarity += 0.75;
    }
  }
  let valence = constrain(Math.tanh((polarity/3)*1.1), -1, 1);

  const high = (MOOD_DATA.arousalCues?.high)||[];
  const low  = (MOOD_DATA.arousalCues?.low)||[];
  const hi = high.reduce((a,w)=>a+(t.includes(w)?1:0),0);
  const lo = low.reduce((a,w)=>a+(t.includes(w)?1:0),0);
  let arousal = constrain(0.35 + (hi*0.08) - (lo*0.06), 0, 1);

  const wordCount = Math.max(5, Math.min(30, tokens.length));
  const expectedMax = Math.max(1, s1 + s2 + (wordCount/10));
  let intensity = constrain((s1 + s2) / expectedMax, 0, 1);
  intensity = constrain(0.6*intensity + 0.2*Math.abs(valence) + 0.2*arousal, 0, 1);

  const seed = hash(t.length ? t : String(Math.random()));
  return { top2, scores, valence, arousal, intensity, seed, keywords:[...new Set(hits)] };
}

// ========= BACKGROUND with 2 families =========
function backgroundLayer(d){
  const famA = d.top2[0];
  const famB = d.top2[1];

  // base neutral
  const base = elCMYK.checked ? color(22,22,20) : color(16,16,18);
  background(base);

  // deterministic backgrounds per family
  const bgA = makeBackgroundForFamily(famA, d, 0);
  const bgB = makeBackgroundForFamily(famB, d, 1);

  // family 1 = base
  image(bgA, 0, 0);

  // family 2 overlay opacity from parameters
  const overlayAlpha = computeBgOverlayAlpha(d); // 0–1
  push();
  tint(255, overlayAlpha * 255);
  image(bgB, 0, 0);
  pop();

  bgA.remove();
  bgB.remove();
}

function computeBgOverlayAlpha(d){
  // Base transparency influenced by intensity & valence & arousal
  let a = 0.25 + 0.35*d.intensity + 0.25*Math.abs(d.valence);
  a = constrain(a, 0.25, 0.9);
  a *= (0.7 + 0.3*d.arousal);    // higher arousal = stronger second bg
  return constrain(a, 0.2, 0.9);
}

function makeBackgroundForFamily(fam, d, index){
  const g = createGraphics(width, height);
  const sets = (MOOD_DATA.bgPalettes && MOOD_DATA.bgPalettes[fam]) || null;

  if (sets && sets.length){
    // choose palette set deterministically from seed + family + index
    randomSeed(d.seed + hash(fam)*17 + index*7919);
    const palSet = random(sets); // [[r,g,b], [r,g,b], [r,g,b]?]
    const c0 = color(...palSet[0]);
    const c1 = color(...(palSet[1] || palSet[0]));
    const c2 = palSet[2] ? color(...palSet[2]) : null;

    // vertical gradient
    for (let y=0;y<height;y++){
      const t = y/height;
      const c = lerpColor(c0, c1, t);
      g.stroke(c);
      g.line(0,y,width,y);
    }

    // big soft radial wash using the 3rd colour (or mix of first two)
    let glow = c2 || lerpColor(c0,c1,0.5);
    const cx = width* (0.3 + 0.4*noise(hash(fam)*0.013));
    const cy = height*(0.3 + 0.4*noise(hash(fam)*0.017));
    g.noStroke();
    const R = max(width,height)*0.9;
    for (let r=0;r<R;r+=5){
      const t = r/R;
      const a = 140*(1-t);
      g.fill(red(glow),green(glow),blue(glow),a);
      g.circle(cx,cy,r*2);
    }
  } else {
    // fallback to old bgVibes gradient
    const vibe = MOOD_DATA.bgVibes?.[fam] || {dark:[16,16,18], light:[44,44,46]};
    const dark = color(...vibe.dark);
    const light = color(...vibe.light);
    for (let y=0;y<height;y++){
      const t = y/height;
      const c = lerpColor(light, dark, t);
      g.stroke(c); g.line(0,y,width,y);
    }
  }

  return g;
}

// ========= family styles (same as previous version) =========
// … all the style* and helper functions from before …

// ---- family style routing ----
function renderFamilyLayer(g, family, variantIndex, d){
  g.pixelDensity(1);
  g.clear();
  const pal = paletteFor(family, d.seed, variantIndex);
  const styles = MOOD_DATA.familyStyles[family] || ["generic"];
  randomSeed(d.seed + variantIndex*7919 + hash(family)*13);
  const styleName = random(styles);

  const focal = {
    x: width* (0.3 + 0.4*noise(hash(family+variantIndex)*0.01)),
    y: height* (0.3 + 0.4*noise(hash(family+variantIndex)*0.02))
  };

  switch(family){
    case "Serenity":  styleSerenity(g, pal, d, styleName, focal); break;
    case "Tension":   styleTension(g, pal, d, styleName, focal);  break;
    case "Sorrow":    styleSorrow(g, pal, d, styleName, focal);   break;
    case "Joy":       styleJoy(g, pal, d, styleName, focal);      break;
    case "Anger":     styleAnger(g, pal, d, styleName, focal);    break;
    case "Memory":    styleMemory(g, pal, d, styleName, focal);   break;
    case "Aspiration":styleAspiration(g, pal, d, styleName, focal);break;
    case "Fear":      styleFear(g, pal, d, styleName, focal);     break;
    case "Apathy":    styleApathy(g, pal, d, styleName, focal);   break;
    case "Ecstasy":   styleEcstasy(g, pal, d, styleName, focal);  break;
    default:          styleGeneric(g, pal, d, styleName, focal);  break;
  }
}

/* ------------- ALL THE STYLE IMPLEMENTATIONS -------------
   Below is exactly the same as the last working painterly version:
   - wetWash, wetWashNarrow, patinaWash, etc.
   - styleSerenity/styleTension/... styleEcstasy
   - modeBurst/modeFlow, etc.

   I’m keeping them unchanged, so you can paste your previous
   style functions here without modification.

   For brevity in this message I won’t re-paste the entire block again,
   but in your file you should keep everything from:

     // ========= painterly primitives =========

   down to just before postFX(d).

   If you prefer, you can just leave your current style code as-is —
   only the background and postFX parts needed changes.
----------------------------------------------------------- */
// ---- per-family style functions ----
function styleSerenity(g, pal, d, variant, focal){
  // always wet wash
  wetWash(g, pal, d, "Serenity");

  if (variant === "serenity_horizon"){
    // horizontal colour fields + gentle ripples
    glazeHorizon(g, pal, d);
    modeRippleSerene(g, pal, d, focal);
  } else if (variant === "serenity_center"){
    centerGlow(g, pal, d, focal);
    modeRippleSerene(g, pal, d, focal);
  } else { // drift
    softDriftRibbons(g, pal, d);
  }
  sereneStars(g, pal, d);
}

function styleTension(g, pal, d, variant, focal){
  wetWashNarrow(g, pal, d);
  if (variant === "tension_knots"){
    tangledFlow(g, pal, d, focal);
  } else if (variant === "tension_burst"){
    modeBurstSharp(g, pal, d, focal);
  } else {
    tightGrid(g, pal, d);
    tangledFlow(g, pal, d, focal);
  }
  tensionScratches(g, pal, d);
}

function styleSorrow(g, pal, d, variant, focal){
  wetWash(g, pal, d, "Sorrow");
  if (variant === "sorrow_vertical"){
    verticalImpasto(g, pal, d);
  } else if (variant === "sorrow_mist"){
    mistVeil(g, pal, d);
    softFlowDown(g, pal, d, focal);
  } else {
    poolOfColor(g, pal, d);
    softFlowDown(g, pal, d, focal);
  }
  sorrowDrips(g, pal, d);
}

function styleJoy(g, pal, d, variant, focal){
  wetWash(g, pal, d, "Joy");
  if (variant === "joy_radial"){
    modeBurstJoy(g, pal, d, focal);
  } else if (variant === "joy_ribbons"){
    joyfulRibbons(g, pal, d, focal);
  } else {
    joyfulConfettiField(g, pal, d);
  }
  joySparkles(g, pal, d);
}

function styleAnger(g, pal, d, variant, focal){
  darkBurnBase(g, pal, d);
  if (variant === "anger_slash"){
    angrySlashes(g, pal, d);
  } else if (variant === "anger_explosion"){
    modeBurstAnger(g, pal, d, focal);
  } else {
    shatterStorm(g, pal, d);
  }
  angerScratches(g, pal, d);
}

function styleMemory(g, pal, d, variant, focal){
  patinaWash(g, pal, d);
  if (variant === "memory_patina"){
    patinaBlocks(g, pal, d);
  } else if (variant === "memory_blocks"){
    memoryGrid(g, pal, d);
  } else {
    tapeEdges(g, pal, d);
  }
  dustSpecks(g, pal, d);
}

function styleAspiration(g, pal, d, variant, focal){
  wetWash(g, pal, d, "Aspiration");
  if (variant === "aspiration_rise"){
    upwardFlows(g, pal, d);
  } else if (variant === "aspiration_arc"){
    aspirationArcs(g, pal, d, focal);
  } else {
    aspirationBeams(g, pal, d);
  }
  starPoints(g, pal, d);
}

function styleFear(g, pal, d, variant, focal){
  darkFog(g, pal, d);
  if (variant === "fear_vortex"){
    fearVortex(g, pal, d, focal);
  } else if (variant === "fear_echo"){
    echoRings(g, pal, d, focal);
  } else {
    fragmentField(g, pal, d);
  }
  noiseVeil(g, pal, d);
}

function styleApathy(g, pal, d, variant, focal){
  flatFog(g, pal, d);
  if (variant === "apathy_flat"){
    dullBands(g, pal, d);
  } else if (variant === "apathy_blocks"){
    apathyBlocks(g, pal, d);
  } else {
    apathyFade(g, pal, d);
  }
  lowNoise(g, pal, d);
}

function styleEcstasy(g, pal, d, variant, focal){
  neonWash(g, pal, d);
  if (variant === "ecstasy_bloom"){
    ecstasyBloom(g, pal, d, focal);
  } else if (variant === "ecstasy_comet"){
    ecstasyComets(g, pal, d, focal);
  } else {
    overloadBursts(g, pal, d, focal);
  }
  denseConfetti(g, pal, d);
}

function styleGeneric(g, pal, d, variant, focal){
  wetWash(g, pal, d, "Generic");
  modeFlow(g, pal, d, focal);
}

// ========= painterly primitives =========

// common wet wash
function wetWash(g, pal, d, family){
  const layers = round(map(d.intensity,0,1, 2, 5));
  for (let i=0;i<layers;i++){
    const c = random(pal);
    const alpha = 40 + i*10;
    const tex = maskedBloom(colorWithA(c, alpha), map(d.valence,-1,1, 0.9, 1.3));
    const sx = random(-width*0.1, width*0.1);
    const sy = random(-height*0.1, height*0.1);
    g.image(tex, sx, sy, width, height);
  }
}
function wetWashNarrow(g, pal, d){
  const layers = round(map(d.intensity,0,1, 1, 3));
  for (let i=0;i<layers;i++){
    const c = random(pal);
    const alpha = 60 + i*20;
    const tex = maskedBloom(colorWithA(c, alpha), 0.8);
    const sx = random(-width*0.05,width*0.05);
    const sy = random(-height*0.05,height*0.05);
    g.image(tex, sx, sy, width, height);
  }
}
function patinaWash(g, pal, d){
  const layers = 3;
  for (let i=0;i<layers;i++){
    const c = pal[i%pal.length];
    const alpha = 40 + i*20;
    const tex = maskedBloom(colorWithA(c, alpha), 1.0);
    g.image(tex, random(-40,40), random(-40,40), width, height);
  }
}

// serenity-specific helpers
function glazeHorizon(g,pal,d){
  const bands = 4;
  for (let i=0;i<bands;i++){
    const c = colorWithA(pal[i%pal.length], 70);
    const tex = maskedBloom(c, 0.9);
    const y = map(i,0,bands-1,height*0.2,height*0.8);
    g.image(tex, 0, y-height*0.25, width, height*0.5);
  }
}
function modeRippleSerene(g,pal,d,focal){
  g.push(); g.translate(focal.x, focal.y);
  const rings = round(map(d.intensity,0,1, 6, 16));
  for (let i=0;i<rings;i++){
    const r = (i+1)*width*0.03*random(0.9,1.3);
    g.noFill(); g.stroke(colorWithA(pal[3], 120)); g.strokeWeight(random(1.0, 2.0));
    g.circle(0,0,r*2);
  }
  g.pop();
}
function centerGlow(g,pal,d,focal){
  const tex = maskedBloom(colorWithA(pal[0], 110), 1.2);
  g.image(tex, focal.x-width*0.5, focal.y-height*0.5, width, height);
}
function softDriftRibbons(g,pal,d){
  const strands = round(map(d.intensity,0,1, 40, 120));
  for (let i=0;i<strands;i++){
    const x0 = random(width), y0 = random(height);
    let x=x0, y=y0;
    const steps = round(map(d.arousal,0,1, 120, 260));
    const col = colorWithA(random(pal), random(120,180));
    g.noFill(); g.stroke(col); g.strokeWeight(random(0.8,1.6));
    g.beginShape();
    for (let s=0;s<steps;s++){
      const a = noise(x*0.0015,y*0.0015)*TWO_PI*1.5;
      x += cos(a)*1.1; y += sin(a)*1.1;
      g.vertex(x,y);
    }
    g.endShape();
  }
}
function sereneStars(g,pal,d){
  const n = round(map(d.arousal,0,1, 150, 400));
  g.noStroke();
  for (let i=0;i<n;i++){
    const c = colorWithA(pal[3], random(120,220));
    g.fill(c); g.circle(random(width), random(height), random(0.8,2.0));
  }
}

// tension helpers
function tangledFlow(g,pal,d,focal){
  const strands = round(map(d.intensity,0,1, 120, 260));
  for (let i=0;i<strands;i++){
    let x=random(width), y=random(height);
    const steps = round(map(d.arousal,0,1, 100, 220));
    const col = colorWithA(random([pal[0],pal[1],pal[2]]), random(160,220));
    g.noFill(); g.stroke(col); g.strokeWeight(random(1.2,2.4));
    g.beginShape();
    for (let s=0;s<steps;s++){
      const n = noise(x*0.006,y*0.006);
      const a = n*TWO_PI*3.0 + atan2(focal.y-y,focal.x-x)*0.2;
      x += cos(a)*1.8; y += sin(a)*1.8;
      g.vertex(x,y);
    }
    g.endShape();
  }
}
function modeBurstSharp(g,pal,d,focal){
  g.push(); g.translate(focal.x, focal.y);
  const rays = round(map(d.arousal,0,1, 25, 90));
  for (let i=0;i<rays;i++){
    const ang = random(TWO_PI);
    const len = random(width*0.12, width*0.45)*(0.7+d.intensity);
    const thick = random(2,8);
    g.noStroke(); g.fill(colorWithA(random([pal[0],pal[1]]), random(180,230)));
    g.push(); g.rotate(ang); g.rect(0,-thick/2,len,thick,1); g.pop();
  }
  g.pop();
}
function tightGrid(g,pal,d){
  const cols = 14, rows=14;
  const w=width/cols, h=height/rows;
  g.noStroke();
  for (let r=0;r<rows;r++){
    for (let c=0;c<cols;c++){
      if (random()>0.5) continue;
      const x=c*w, y=r*h;
      g.fill(colorWithA(random([pal[1],pal[2]]), random(150,210)));
      g.rect(x+random(-2,2), y+random(-2,2), w*random(0.4,1.0), h*random(0.4,1.0));
    }
  }
}
function tensionScratches(g,pal,d){
  g.stroke(colorWithA(pal[2],220)); g.strokeWeight(1);
  const n = 120 + d.intensity*180;
  for (let i=0;i<n;i++){
    const x1=random(width),y1=random(height);
    const x2=x1+random(-40,40),y2=y1+random(-40,40);
    g.line(x1,y1,x2,y2);
  }
}

// sorrow helpers
function verticalImpasto(g,pal,d){
  const strokes = round(map(d.intensity,0,1, 10, 30));
  for (let i=0;i<strokes;i++){
    const col = colorWithA(random([pal[1],pal[2]]), random(150,220));
    const tex = impastoTexture(col);
    const w = random(width*0.05,width*0.18);
    const h = random(height*0.3,height*0.7);
    const x = random(-50,width-50), y=random(-40,40);
    g.push(); g.translate(x,y); g.rotate(random(-0.1,0.1));
    g.image(tex,0,0,w,h);
    g.pop();
  }
}
function mistVeil(g,pal,d){
  const tex = maskedBloom(colorWithA(pal[3],80),1.5);
  g.image(tex,-width*0.05,-height*0.05,width*1.1,height*1.1);
}
function poolOfColor(g,pal,d){
  const tex = maskedBloom(colorWithA(pal[1],110),1.2);
  const h = height*0.55;
  g.image(tex,-width*0.1,height-h*0.8,width*1.2,h);
}
function softFlowDown(g,pal,d,focal){
  const strands = round(map(d.intensity,0,1, 50, 140));
  for (let i=0;i<strands;i++){
    let x=random(width), y=random(-40, height*0.3);
    const steps=round(map(d.arousal,0,1, 80,200));
    const col=colorWithA(random(pal), random(120,190));
    g.noFill(); g.stroke(col); g.strokeWeight(random(0.8,1.8));
    g.beginShape();
    for (let s=0;s<steps;s++){
      const a = noise(x*0.001,y*0.002)*TWO_PI*0.8 + 0.4;
      x += cos(a)*0.6; y += sin(a)*2.0;
      g.vertex(x,y);
    }
    g.endShape();
  }
}
function sorrowDrips(g,pal,d){
  g.stroke(colorWithA(pal[2],210)); g.strokeWeight(1.2);
  const n = 60 + d.intensity*120;
  for (let i=0;i<n;i++){
    const x = random(width), y1 = random(height*0.2);
    const y2 = y1 + random(20, 140);
    g.line(x,y1,x,y2);
  }
}

// joy helpers
function modeBurstJoy(g,pal,d,focal){
  modeBurst(g,pal,d,focal, true);
}
function joyfulRibbons(g,pal,d,focal){
  modeFlow(g,pal,d,focal, {thick:true,curvy:true});
}
function joyfulConfettiField(g,pal,d){
  const cols=8,rows=10,w=width/cols,h=height/rows;
  g.noStroke();
  for (let r=0;r<rows;r++){
    for (let c=0;c<cols;c++){
      if (random()>0.75) continue;
      const xx=c*w+random(-10,10),yy=r*h+random(-10,10);
      g.fill(colorWithA(random(pal),random(160,230)));
      g.rect(xx,yy,w*random(0.3,1.1),h*random(0.3,1.1),random(2,10));
    }
  }
}
function joySparkles(g,pal,d){
  const n = 500 + d.intensity*800;
  g.noStroke();
  for (let i=0;i<n;i++){
    const c=colorWithA(random(pal),random(150,230));
    g.fill(c); g.circle(random(width),random(height),random(1,3));
  }
}

// anger helpers
function darkBurnBase(g,pal,d){
  const tex = maskedBloom(colorWithA(pal[2],110),1.2);
  g.image(tex,-width*0.05,-height*0.05,width*1.1,height*1.1);
}
function angrySlashes(g,pal,d){
  g.strokeWeight(random(4,9));
  const n=40+ d.intensity*60;
  for (let i=0;i<n;i++){
    const col=colorWithA(random([pal[0],pal[1]]),random(190,240));
    g.stroke(col);
    const x1=random(-width*0.1,width*1.1),y1=random(height);
    const x2=x1+random(-80,80),y2=y1+random(-140,-40);
    g.line(x1,y1,x2,y2);
  }
}
function modeBurstAnger(g,pal,d,focal){
  modeBurst(g,pal,d,focal,false,true);
}
function shatterStorm(g,pal,d){
  const pieces = round(map(d.intensity,0,1, 50, 140));
  g.noStroke();
  for (let i=0;i<pieces;i++){
    const cx=random(width),cy=random(height);
    const ang=random(TWO_PI),rad=random(18,120);
    g.fill(colorWithA(random([pal[0],pal[1],pal[2]]),random(180,240)));
    g.beginShape();
    for (let k=0;k<5;k++){
      const a=ang+k*TWO_PI/5+random(-0.3,0.3);
      g.vertex(cx+cos(a)*rad*random(0.4,1.0), cy+sin(a)*rad*random(0.4,1.0));
    }
    g.endShape(CLOSE);
  }
}
function angerScratches(g,pal,d){
  g.stroke(colorWithA(pal[2],240)); g.strokeWeight(0.9);
  const n = 260 + d.intensity*280;
  for (let i=0;i<n;i++){
    const x1=random(width),y1=random(height);
    const x2=x1+random(-30,30),y2=y1+random(-30,30);
    g.line(x1,y1,x2,y2);
  }
}

// memory helpers
function patinaBlocks(g,pal,d){
  const cols=8,rows=10,w=width/cols,h=height/rows;
  g.noStroke();
  for (let r=0;r<rows;r++){
    for (let c=0;c<cols;c++){
      if (random()>0.55) continue;
      const x=c*w+random(-10,10),y=r*h+random(-10,10);
      const col=colorWithA(random(pal), random(130,200));
      g.fill(col);
      g.rect(x,y,w*random(0.5,1.1),h*random(0.4,1.0));
    }
  }
}
function memoryGrid(g,pal,d){
  g.noFill();
  g.stroke(colorWithA(pal[2],160)); g.strokeWeight(1);
  const cols=10,rows=14,w=width/cols,h=height/rows;
  for (let c=0;c<cols;c++) g.line(c*w,0,c*w,height);
  for (let r=0;r<rows;r++) g.line(0,r*h,width,r*h);
}
function tapeEdges(g,pal,d){
  g.noStroke();
  const col=colorWithA(pal[3],140);
  const w=width*0.22,h=height*0.18;
  g.fill(col);
  g.rect(width*0.06,height*0.1,w,h);
  g.rect(width*0.7,height*0.6,w*0.9,h*0.9);
}
function dustSpecks(g,pal,d){
  const n=300+d.intensity*300;
  g.noStroke();
  for (let i=0;i<n;i++){
    const a=random(80,200);
    g.fill(colorWithA(pal[3],a));
    g.circle(random(width),random(height),random(0.8,1.6));
  }
}

// aspiration helpers
function upwardFlows(g,pal,d){
  const strands = round(map(d.intensity,0,1, 40, 140));
  for (let i=0;i<strands;i++){
    let x=random(width), y=height+random(0,60);
    const steps=round(map(d.arousal,0,1, 120,260));
    const col=colorWithA(random(pal), random(150,230));
    g.noFill(); g.stroke(col); g.strokeWeight(random(1.2,2.6));
    g.beginShape();
    for (let s=0;s<steps;s++){
      const a = noise(x*0.002,y*0.002)*TWO_PI*1.2 - HALF_PI;
      x += cos(a)*1.2; y += sin(a)*2.0;
      g.vertex(x,y);
      if (y<-80) break;
    }
    g.endShape();
  }
}
function aspirationArcs(g,pal,d,focal){
  const tex = maskedBloom(colorWithA(pal[0],120),1.1);
  g.image(tex,-width*0.05,-height*0.05,width*1.1,height*1.1);
  modeFlow(g,pal,d,focal,{arcUp:true});
}
function aspirationBeams(g,pal,d){
  const beams=round(map(d.intensity,0,1, 6,16));
  g.noStroke();
  for (let i=0;i<beams;i++){
    const x=width*random(0.15,0.85);
    const col=colorWithA(random([pal[0],pal[2]]),random(180,230));
    g.fill(col);
    g.rect(x,height*0.6, random(width*0.01,width*0.04), -height*random(0.3,0.7));
  }
}
function starPoints(g,pal,d){
  const n=220+d.intensity*260;
  g.noStroke();
  for (let i=0;i<n;i++){
    const c=colorWithA(random(pal),random(160,240));
    g.fill(c);
    g.circle(random(width),random(height*0.75),random(0.8,1.8));
  }
}

// fear helpers
function darkFog(g,pal,d){
  const tex = maskedBloom(colorWithA(pal[2],140),1.5);
  g.image(tex,-width*0.1,-height*0.1,width*1.2,height*1.2);
}
function fearVortex(g,pal,d,focal){
  g.push(); g.translate(focal.x,focal.y);
  const rings=round(map(d.intensity,0,1, 14,32));
  for (let i=0;i<rings;i++){
    const r=(i+1)*width*0.03;
    g.noFill(); g.stroke(colorWithA(pal[1],160)); g.strokeWeight(1.4);
    g.beginShape();
    for (let a=0;a<TWO_PI;a+=0.1){
      const rr = r + noise(i*0.1,a*0.2)*14;
      g.vertex(cos(a)*rr,sin(a)*rr);
    }
    g.endShape(CLOSE);
  }
  g.pop();
}
function echoRings(g,pal,d,focal){
  g.push(); g.translate(focal.x,focal.y);
  const rings=10;
  for (let i=0;i<rings;i++){
    const r=(i+1)*width*0.04;
    g.noFill(); g.stroke(colorWithA(pal[1],130)); g.strokeWeight(0.8);
    g.circle(0,0,r*2);
  }
  g.pop();
}
function fragmentField(g,pal,d){
  const pieces=round(map(d.intensity,0,1, 40,120));
  g.noStroke();
  for (let i=0;i<pieces;i++){
    const x=random(width),y=random(height);
    const w=random(18,60),h=random(18,60);
    g.fill(colorWithA(random([pal[1],pal[2]]),random(150,220)));
    g.rect(x,y,w,h);
  }
}
function noiseVeil(g,pal,d){
  const n=800+d.intensity*1200;
  g.noStroke();
  for (let i=0;i<n;i++){
    const col=colorWithA(pal[2],random(40,140));
    g.fill(col);
    g.rect(random(width),random(height),1,1);
  }
}

// apathy helpers
function flatFog(g,pal,d){
  const tex = maskedBloom(colorWithA(pal[1],90),1.2);
  g.image(tex,-width*0.05,-height*0.05,width*1.1,height*1.1);
}
function dullBands(g,pal,d){
  const bands=6;
  const h=height/bands;
  g.noStroke();
  for (let i=0;i<bands;i++){
    const col=colorWithA(pal[1],140-i*10);
    g.fill(col);
    g.rect(0,i*h,width,h);
  }
}
function apathyBlocks(g,pal,d){
  const cols=6,rows=8,w=width/cols,h=height/rows;
  g.noStroke();
  for (let r=0;r<rows;r++){
    for (let c=0;c<cols;c++){
      if (random()>0.4) continue;
      g.fill(colorWithA(pal[2],160));
      g.rect(c*w,r*h,w*random(0.6,1.0),h*random(0.4,0.9));
    }
  }
}
function apathyFade(g,pal,d){
  const tex = maskedBloom(colorWithA(pal[3],70),1.4);
  drawWithBlur(g,tex,-width*0.05,-height*0.05,width*1.1,height*1.1,2.5);
}
function lowNoise(g,pal,d){
  const n=300;
  g.noStroke();
  for (let i=0;i<n;i++){
    const col=colorWithA(pal[2],random(40,120));
    g.fill(col);
    g.rect(random(width),random(height),1,1);
  }
}

// ecstasy helpers
function neonWash(g,pal,d){
  const layers=3;
  for (let i=0;i<layers;i++){
    const c = colorWithA(pal[i%pal.length], 80+20*i);
    const tex = maskedBloom(c,1.3);
    g.image(tex,random(-40,40),random(-40,40),width,height);
  }
}
function ecstasyBloom(g,pal,d,focal){
  const tex = maskedBloom(colorWithA(pal[0],150),1.5);
  g.image(tex,focal.x-width*0.5,focal.y-height*0.5,width,height);
}
function ecstasyComets(g,pal,d,focal){
  const comets=round(map(d.intensity,0,1, 18,40));
  for (let i=0;i<comets;i++){
    const col=colorWithA(random(pal),random(180,240));
    const tex=impastoTexture(col);
    const w=random(width*0.15,width*0.35),h=random(height*0.05,height*0.16);
    const x=random(-100,width-100),y=random(-40,height*0.8);
    g.push(); g.translate(x,y); g.rotate(random(-0.5,0.5));
    g.image(tex,0,0,w,h);
    g.pop();
  }
}
function overloadBursts(g,pal,d,focal){
  modeBurst(g,pal,d,focal,true,true);
}
function denseConfetti(g,pal,d){
  const n=1300+d.intensity*2000;
  g.noStroke();
  for (let i=0;i<n;i++){
    const col=colorWithA(random(pal),random(160,255));
    g.fill(col);
    g.circle(random(width),random(height),random(0.8,3.2));
  }
}

// generic burst/flow primitives reused with different configs
function modeBurst(g,pal,d,focal,isJoy=false,isAnger=false){
  g.push(); g.translate(focal.x,focal.y);
  const rays = round(map(d.arousal,0,1, isAnger?40:30, isAnger?160:120));
  for (let i=0;i<rays;i++){
    const ang = random(TWO_PI);
    const len = random(width*0.18,width*0.6)*(0.8+d.intensity);
    const thick = random(isJoy?3:4, isAnger?14:10);
    const base = isAnger?[pal[0],pal[1]]: (isJoy?[pal[0],pal[1],pal[3]]:pal);
    g.noStroke(); g.fill(colorWithA(random(base),random(180,240)));
    g.push(); g.rotate(ang); g.rect(0,-thick/2,len,thick, isAnger?0:3); g.pop();
  }
  g.pop();
}
function modeFlow(g,pal,d,focal,opt){
  const thick = opt?.thick||false;
  const arcUp = opt?.arcUp||false;
  const strands = round(map(d.intensity,0,1, thick?80:140, thick?200:260));
  for (let i=0;i<strands;i++){
    let x=random(width), y=random(height);
    const steps = round(map(d.arousal,0,1, 120,320));
    const col = colorWithA(random(pal), random(140,220));
    g.noFill(); g.stroke(col); g.strokeWeight(random(thick?2.0:0.8, thick?4.0:2.2));
    g.beginShape();
    for (let s=0;s<steps;s++){
      const n=noise(x*0.0012,y*0.0012);
      let a=n*TWO_PI*2.4;
      if (arcUp) a -= HALF_PI*0.3;
      const toward=atan2(focal.y-y,focal.x-x);
      a = lerp(a,toward,0.25);
      x += cos(a)*1.6; y += sin(a)*1.6;
      g.vertex(x,y);
      if (x<-40||x>width+40||y<-40||y>height+40) break;
    }
    g.endShape();
  }
}

// ========= textures (same as before, no WebGL filter) =========
function maskedBloom(col, scale=1.0){
  const pg = createGraphics(width, height);
  pg.noStroke();
  const blobs = 1200;
  for (let i=0;i<blobs;i++){
    const r = random(8, 60)*scale;
    const x = random(width), y = random(height);
    const a = alpha(col) * random(0.05, 0.22);
    pg.fill(red(col), green(col), blue(col), a);
    pg.circle(x,y,r);
  }
  const snap = pg.get(); pg.remove();
  return snap;
}
function impastoTexture(col){
  const w = 512, h = 256;
  const pg = createGraphics(w, h);
  pg.noStroke();
  pg.background(0,0);
  const baseA = alpha(col);
  for (let y=0;y<h;y++){
    const off = noise(y*0.01, 0.5)*20;
    for (let x=0;x<w;x+=8){
      const a = baseA * (0.35 + 0.55*noise(x*0.02, y*0.05));
      pg.fill(red(col)+random(-8,8), green(col)+random(-8,8), blue(col)+random(-8,8), a);
      pg.rect(x+off, y, random(6,16), 6, 3);
    }
  }
  const snap = pg.get(); pg.remove();
  return snap;
}

// ========= post fx (blur softened) =========
function postFX(d){
  // valence -> saturation
  saturationCanvas(map(d.valence,-1,1, 0.7, 1.35));

  // arousal -> blur (softer now)
  let b = (1 - d.arousal) * 1.5;      // was 2.6 earlier
  b = constrain(b, 0, 1.6);
  if (b > 0.01){
    const snap = get();
    clear();
    drawWithBlur(this, snap, 0, 0, width, height, b); // was b*2.0
  }

  // intensity -> CA + grain
  chromaticAberration(map(d.intensity,0,1, 0.0, 1.6));
  filmGrain(map(d.intensity,0,1, 6, 18));
  vignetteCanvas(0.35 + d.intensity*0.2);
}

function saturationCanvas(f){
  loadPixels();
  for (let i=0;i<pixels.length;i+=4){
    const r=pixels[i], g=pixels[i+1], b=pixels[i+2];
    const gray=0.299*r+0.587*g+0.114*b;
    pixels[i]  = gray + (r-gray)*f;
    pixels[i+1]= gray + (g-gray)*f;
    pixels[i+2]= gray + (b-gray)*f;
  }
  updatePixels();
}
function filmGrain(strength){
  loadPixels();
  for (let i=0;i<pixels.length;i+=4){
    const n = (random()*2-1)*strength;
    pixels[i]   = constrain(pixels[i]+n,0,255);
    pixels[i+1] = constrain(pixels[i+1]+n,0,255);
    pixels[i+2] = constrain(pixels[i+2]+n,0,255);
  }
  updatePixels();
}
function chromaticAberration(px){
  if (px<=0.2) return;
  const snap = get();
  push(); blendMode(SCREEN);
  tint(255,0,0,160); image(snap,  px, 0);
  tint(0,255,0,160); image(snap, -px, 0);
  tint(0,0,255,160); image(snap,  0, px);
  pop(); noTint();
}
function vignetteCanvas(str){
  noFill();
  const steps = 80;
  for (let i=0;i<steps;i++){
    const t=i/steps;
    stroke(0, 0, 0, 255*str*t);
    rect(t*8, t*8, width-t*16, height-t*16);
  }
}

// ========= misc helpers =========
function drawGuides(){
  push(); stroke(255,30); strokeWeight(1);
  line(width/3,0,width/3,height); line(2*width/3,0,2*width/3,height);
  line(0,height/3,width,height/3); line(0,2*height/3,width,2*height/3);
  pop();
}
function paletteFor(fam, seed, variantIndex){
  const baseSeed = seed ?? (derived ? derived.seed : 0);
  const idx = variantIndex ?? 0;

  // Prefer multi-set drawPalettes if available
  const sets = MOOD_DATA.drawPalettes && MOOD_DATA.drawPalettes[fam];
  if (sets && sets.length){
    randomSeed(baseSeed + hash(fam)*31 + idx*101);
    const chosen = random(sets); // one 4-colour palette
    return chosen.map(rgb => color(rgb[0], rgb[1], rgb[2]));
  }

  // Fallback to single legacy palette
  const arr = (MOOD_DATA.palettes && MOOD_DATA.palettes[fam]) ||
              [[200,200,200],[160,160,160],[80,80,80],[240,240,240]];
  return arr.map(rgb => color(rgb[0], rgb[1], rgb[2]));
}

function colorWithA(col, a){ return color(red(col), green(col), blue(col), a); }

// 2D blur draw: no WebGL
function drawWithBlur(target, img, x, y, w, h, px){
  const g = target || this;
  const ctx = g.drawingContext;
  const old = ctx.filter;
  ctx.filter = `blur(${(px||0).toFixed(2)}px)`;
  g.image(img, x||0, y||0, w||img.width, h||img.height);
  ctx.filter = old || 'none';
}

function fmt(n){ return (Math.round(n*100)/100).toFixed(2); }
function hash(str){ let h=0; for (let i=0;i<str.length;i++){ h=(h<<5)-h+str.charCodeAt(i); h|=0; } return Math.abs(h); }
