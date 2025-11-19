// --- CONFIGURATION ---


const elements = [
  {
    id: 'wood', name: 'WOOD', vibe: "ORGANIC GROWTH",
    c1: '#2b3a2b', c2: '#8f9e8a',
    dist: 0.3, freq: 2.0, speed: 0.1, shape: 'sphere', type: 0,
    words: [
      { text: "Growth", img: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&q=80" },
      { text: "Roots", img: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800&q=80" },
      { text: "Flexibility", img: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800&q=80" },
      { text: "Nature", img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80" },
      { text: "Expansion", img: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&q=80" }
    ]
  },
  {
    id: 'fire', name: 'FIRE', vibe: "RADICAL CHANGE",
    c1: '#3d0e0e', c2: '#b56d65',
    dist: 0.7, freq: 1.2, speed: 0.5, shape: 'sphere', type: 1,
    words: [
      { text: "Passion", img: "https://images.unsplash.com/photo-1495754149474-e54c07932677?w=800&q=80" },
      { text: "Transformation", img: "https://images.unsplash.com/photo-1605653162070-b478783c324f?w=800&q=80" },
      { text: "Heat", img: "https://images.unsplash.com/photo-1516662209730-99f0cb5c5078?w=800&q=80" },
      { text: "Light", img: "https://images.unsplash.com/photo-1496348047260-24885575d69c?w=800&q=80" },
      { text: "Will", img: "https://images.unsplash.com/photo-1599635089531-93c59436d261?w=800&q=80" }
    ]
  },
  {
    id: 'earth', name: 'EARTH', vibe: "FOUNDATION",
    c1: '#302b26', c2: '#8c8176',
    dist: 0.0, freq: 0.0, speed: 0.0, shape: 'cube', type: 2,
    words: [
      { text: "Stability", img: "https://images.unsplash.com/photo-1465189684280-6a8fa9b19736?w=800&q=80" },
      { text: "Foundation", img: "https://images.unsplash.com/photo-1500829243541-74b677fecc30?w=800&q=80" },
      { text: "Substance", img: "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=800&q=80" },
      { text: "Gravity", img: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&q=80" },
      { text: "Core", img: "https://images.unsplash.com/photo-1440615496137-5f6dbdfecb58?w=800&q=80" }
    ]
  },
  {
    id: 'metal', name: 'METAL', vibe: "PRECISION",
    c1: '#444444', c2: '#ffffff', // Chrome: Dark Grey to White
    dist: 0.0, freq: 0.0, speed: 0.0, shape: 'octa', type: 3,
    words: [
      { text: "Clarity", img: "https://images.unsplash.com/photo-1536617767305-c0f4921c701a?w=800&q=80" },
      { text: "Precision", img: "https://images.unsplash.com/photo-1501183007986-d0d080b147f9?w=800&q=80" },
      { text: "Focus", img: "https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=800&q=80" },
      { text: "Structure", img: "https://images.unsplash.com/photo-1496715976403-7e36dc43f17b?w=800&q=80" },
      { text: "Essence", img: "https://images.unsplash.com/photo-1462690494211-c387e3674415?w=800&q=80" }
    ]
  },
  {
    id: 'water', name: 'WATER', vibe: "ADAPTATION",
    c1: '#0a1521', c2: '#4a6fa5',
    dist: 0.0, freq: 0.0, speed: 0.0, shape: 'water', type: 4,
    words: [
      { text: "Flow", img: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800&q=80" },
      { text: "Depth", img: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=80" },
      { text: "Intuition", img: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80" },
      { text: "Motion", img: "https://images.unsplash.com/photo-1555181126-cf4c68161710?w=800&q=80" },
      { text: "Adaptation", img: "https://images.unsplash.com/photo-1546484475-7f7bd55792da?w=800&q=80" }
    ]
  }
];

const imgPlaceholder = "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&q=80";

// --- THREE.JS ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 6;
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.getElementById('canvas-container').appendChild(renderer.domElement);

// --- SHADERS (Simplified for performance/stability) ---
const vertexShader = `
  varying vec2 vUv;
  varying float vNoise;
  varying vec3 vNormal;
  uniform float uTime;
  uniform float uDistortion;
  uniform float uFrequency;
  uniform float uSpeed;
  uniform float uShape;
  uniform float uTransition;

  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute( permute( permute(
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    float n_ = 0.142857142857;
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
  }

  void main() {
    vUv = uv;
    vNormal = normal;
    float noise = snoise(position * uFrequency + uTime * uSpeed);
    vNoise = noise;
    vec3 pos = position;
    if (uShape > 0.5 && uShape < 1.5) {
       vec3 spherePos = normalize(position) * 1.4; 
       pos = mix(position, spherePos, 0.65); 
    }
    vec3 newPos = pos + normal * noise * uDistortion;
    if (uTransition > 0.0) {
       float wave = sin(pos.y * 5.0 - uTime * 10.0) * uTransition * 0.4;
       newPos += normal * wave;
    }
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  varying float vNoise;
  varying vec3 vNormal;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform float uTransition;
  uniform float uType;

  void main() {
    float mixValue = smoothstep(-0.6, 0.6, vNoise);
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    float fresnel = pow(1.0 - dot(vNormal, viewDir), 3.0);
    vec3 color = mix(uColor1, uColor2, mixValue);
    if (abs(uType - 3.0) < 0.1) { // Metal Chrome
        float reflect = smoothstep(-0.1, 0.1, vNormal.y);
        vec3 chrome = mix(vec3(0.2), vec3(0.9), reflect);
        color = mix(color, chrome, 0.5);
        fresnel *= 1.5;
    }
    color += fresnel * 0.3;
    float alpha = 1.0 - uTransition;
    gl_FragColor = vec4(color, alpha);
  }
`;

const mat = new THREE.ShaderMaterial({
  vertexShader, fragmentShader,
  uniforms: {
    uTime: { value: 0.0 },
    uDistortion: { value: 0.3 },
    uFrequency: { value: 1.5 },
    uSpeed: { value: 0.1 },
    uShape: { value: 0.0 },
    uTransition: { value: 0.0 },
    uType: { value: 0.0 },
    uColor1: { value: new THREE.Color(elements[0].c1) },
    uColor2: { value: new THREE.Color(elements[0].c2) }
  },
  wireframe: false,
  transparent: true,
  side: THREE.DoubleSide
});

// Meshes
const meshSphere = new THREE.Mesh(new THREE.IcosahedronGeometry(1.6, 100), mat);
scene.add(meshSphere);

const meshCube = new THREE.Mesh(new THREE.BoxGeometry(2.0, 2.0, 2.0, 60, 60, 60), mat);
scene.add(meshCube);
meshCube.visible = false;

const meshOcta = new THREE.Mesh(new THREE.OctahedronGeometry(1.6, 0), mat);
scene.add(meshOcta);
meshOcta.visible = false;

const waterGroup = new THREE.Group();
const dropGeo = new THREE.SphereGeometry(0.35, 32, 32);
const dCore = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), mat.clone());
const d1 = new THREE.Mesh(dropGeo, mat.clone());
const d2 = new THREE.Mesh(dropGeo, mat.clone());
waterGroup.add(dCore, d1, d2);
scene.add(waterGroup);
waterGroup.visible = false;



// --- STATE ---
let scrollPos = 0;
let currentIndex = 0;
let introActive = true;
let isEditorialMode = false;
let currentWordIndex = 0;
let mouseX = 0, mouseY = 0;
let lastMouseX = 0, lastMouseY = 0;
let mouseVel = 0;
let isThrottled = false;

// DOM Refs
const labelEl = document.getElementById('elementLabel');
const vibeEl = document.getElementById('vibeLabel');
const tunerNeedle = document.getElementById('tunerNeedle');
const mainUI = document.getElementById('mainUI');
const editorialLayer = document.getElementById('editorialLayer');
const wordContainer = document.getElementById('wordContainer');
const progressFill = document.getElementById('progressFill');
const pageNumber = document.getElementById('pageNumber');
const edSubject = document.getElementById('ed-subject');
const statusSquare = document.getElementById('statusSquare');
const cursorFollower = document.getElementById('cursorFollower');
const activeThumb = document.getElementById('activeThumb');
const canvasEl = document.querySelector('canvas');
const canvasContainer = document.getElementById('canvas-container');
const introOverlay = document.getElementById('introOverlay');

// --- FUNCTIONS ---
function updateElement() {
  const idx = Math.round(scrollPos);
  if (idx === currentIndex) return;
  
  currentIndex = idx;
  const config = elements[currentIndex];

  // Update Text
  labelEl.style.opacity = 0;
  vibeEl.style.opacity = 0;
  setTimeout(() => {
    labelEl.textContent = config.name;
    vibeEl.textContent = config.vibe;
    labelEl.style.opacity = 1;
    vibeEl.style.opacity = 0.7;
  }, 200);

  // Move Needle
  tunerNeedle.style.left = `${(currentIndex / 4) * 80 + 10}%`;

  // 3D Logic
  meshSphere.visible = false;
  meshCube.visible = false;
  meshOcta.visible = false;
  waterGroup.visible = false;
  mat.uniforms.uShape.value = 0.0;

  if (config.shape === 'cube') {
      meshCube.visible = true;
      mat.uniforms.uShape.value = 1.0;
  } else if (config.shape === 'octa') {
      meshOcta.visible = true;
      mat.uniforms.uShape.value = 2.0;
  } else if (config.shape === 'water') {
      waterGroup.visible = true;
      waterGroup.children.forEach(m => {
          gsap.to(m.material.uniforms.uColor1.value, { r: new THREE.Color(config.c1).r, g: new THREE.Color(config.c1).g, b: new THREE.Color(config.c1).b, duration: 0.5 });
          gsap.to(m.material.uniforms.uColor2.value, { r: new THREE.Color(config.c2).r, g: new THREE.Color(config.c2).g, b: new THREE.Color(config.c2).b, duration: 0.5 });
          m.material.uniforms.uType.value = 4.0;
          m.material.uniforms.uDistortion.value = 0.0;
      });
  } else {
      meshSphere.visible = true;
  }

  mat.uniforms.uType.value = config.type;
  gsap.to(mat.uniforms.uColor1.value, { r: new THREE.Color(config.c1).r, g: new THREE.Color(config.c1).g, b: new THREE.Color(config.c1).b, duration: 0.5 });
  gsap.to(mat.uniforms.uColor2.value, { r: new THREE.Color(config.c2).r, g: new THREE.Color(config.c2).g, b: new THREE.Color(config.c2).b, duration: 0.5 });
  gsap.to(mat.uniforms.uDistortion, { value: config.dist, duration: 0.5 });
  gsap.to(mat.uniforms.uFrequency, { value: config.freq, duration: 0.5 });
}

function openEditorial() {
  isEditorialMode = true;
  const config = elements[currentIndex];
  const words = config.words; // Changed from editorialData

  document.getElementById('ed-subject').textContent = config.name;
  document.getElementById('statusSquare').style.backgroundColor = config.c2;

  mainUI.style.opacity = 0;
  mainUI.style.pointerEvents = 'none';
  
  // Ripple
  gsap.to(mat.uniforms.uTransition, { value: 1.0, duration: 1.0, ease: "power2.inOut" });
  if(waterGroup.visible) waterGroup.children.forEach(m => gsap.to(m.material.uniforms.uTransition, { value: 1.0, duration: 1.0 }));
  canvasEl.classList.add('faded');

  setTimeout(() => editorialLayer.classList.add('active'), 600);
  
  wordContainer.innerHTML = '';
  currentWordIndex = 0;
  activeThumb.src = words[0].img; // Set first image

  words.forEach((wordObj, i) => {
    const div = document.createElement('div');
    div.className = 'editorial-word';
    div.textContent = wordObj.text; // Changed from txt to wordObj.text
    div.id = `word-${i}`;
    if(i===0) div.classList.add('visible');
    wordContainer.appendChild(div);
  });
  
  // Setup Cursor follower start pos
  gsap.set(cursorFollower, { left: mouseX * 200 + window.innerWidth/2, top: mouseY * 200 + window.innerHeight/2 });
  gsap.to(cursorFollower, { opacity: 1, delay: 0.5 });
  
  updateHUD(0, words.length);
}



function closeEditorial() {
  isEditorialMode = false;
  editorialLayer.classList.remove('active');
  gsap.to(cursorFollower, { opacity: 0 });

  setTimeout(() => {
    mainUI.style.opacity = 1;
    mainUI.style.pointerEvents = 'auto';
    
    mat.uniforms.uTransition.value = 0.0;
    if(waterGroup.visible) {
        waterGroup.children.forEach(m => m.material.uniforms.uTransition.value = 0.0);
    }
    gsap.to(canvasEl, { opacity: 1, duration: 0.8 });
  }, 600);
}

function updateHUD(index, total) {
  if(progressFill) {
    const pct = ((index + 1) / total) * 100;
    progressFill.style.width = `${pct}%`;
  }
  if(pageNumber) pageNumber.textContent = `0${index + 1} / 0${total}`;
}

function switchEditorialWord(dir) {
  const config = elements[currentIndex];
  const words = config.words; // Changed from editorialData
  const next = currentWordIndex + dir;
  if(next < 0 || next >= words.length) return;

  document.getElementById(`word-${currentWordIndex}`).classList.remove('visible');
  document.getElementById(`word-${next}`).classList.add('visible');
  currentWordIndex = next;
  
  // UPDATE THUMBNAIL IMAGE
  activeThumb.src = words[next].img;
  
  updateHUD(next, words.length);
}



// --- INPUTS ---
const cursorX = gsap.quickTo(cursorFollower, "left", { duration: 0.4 });
const cursorY = gsap.quickTo(cursorFollower, "top", { duration: 0.4 });

document.addEventListener('mousemove', (e) => {
  const dx = e.clientX - lastMouseX;
  const dy = e.clientY - lastMouseY;
  mouseVel = Math.sqrt(dx*dx + dy*dy);
  lastMouseX = e.clientX;
  lastMouseY = e.clientY;

  mouseX = (e.clientX - window.innerWidth/2) / 400;
  mouseY = (e.clientY - window.innerHeight/2) / 400;

  if(isEditorialMode) {
    cursorX(e.clientX);
    cursorY(e.clientY);
  }
});


window.addEventListener('wheel', (e) => {
  // INTRO LOGIC
  if (introActive) {
    introActive = false;
    introOverlay.style.opacity = 0;
    introOverlay.style.pointerEvents = 'none';
    introOverlay.style.display = 'none';
    canvasContainer.classList.remove('faded-start');
    mainUI.classList.remove('hidden');
    return;
  }

  const dir = Math.sign(e.deltaY);

  // EDITORIAL MODE (always use throttle here)
  if (isEditorialMode) {
    if (!document.body.dataset.scrolling) {
      document.body.dataset.scrolling = true;
      setTimeout(() => delete document.body.dataset.scrolling, 400);
      switchEditorialWord(dir);
    }
    return;
  }

  // MAIN TUNER MODE - CENTER ZONE CHECK
  const zone = window.innerWidth * 0.25; // 25% on each side = 50% center zone
  const inCenter = (e.clientX > zone && e.clientX < window.innerWidth - zone);
  
  if (!inCenter) {
    // User is in side zones - allow normal page scroll
    return;
  }

  // User is in center zone - prevent default scroll and morph elements
  e.preventDefault();
  
  if (isThrottled) return;
  isThrottled = true;
  setTimeout(() => isThrottled = false, 600);

  // Jump directly to next/prev element instead of incremental scrolling
  let next = currentIndex + dir;
  if (next < 0) next = elements.length - 1;
  if (next >= elements.length) next = 0;
  
  scrollPos = next; // Set scrollPos to the target index
  updateElement();
}, { passive: false });

document.getElementById('centerStage').addEventListener('click', openEditorial);
document.getElementById('closeBtn').addEventListener('click', closeEditorial);


// --- ANIMATE ---
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const time = clock.getElapsedTime();
  mat.uniforms.uTime.value = time;
  if(waterGroup.visible) waterGroup.children.forEach(m => m.material.uniforms.uTime.value = time);



  // WATER PHYSICS
  if (waterGroup.visible && !isEditorialMode) {
     mouseVel *= 0.92; 
     let sep = Math.min(mouseVel * 0.04, 1.5); 

     // Core follows mouse
     dCore.position.x += (mouseX * 3.0 - dCore.position.x) * 0.05;
     dCore.position.y += (mouseY * -3.0 - dCore.position.y) * 0.05;
     
     // D1 Orbit
     const t1 = time * 0.8;
     const x1 = Math.cos(t1) * (0.6 + sep);
     const y1 = Math.sin(t1) * (0.5 + sep);
     d1.position.lerp(new THREE.Vector3(dCore.position.x + x1, dCore.position.y + y1, Math.sin(time)*sep), 0.1);
     
     // D2 Orbit
     const t2 = time * 0.5 + 2.0;
     const x2 = Math.sin(t2) * (0.7 + sep);
     const y2 = Math.cos(t2) * (0.7 + sep);
     d2.position.lerp(new THREE.Vector3(dCore.position.x + x2, dCore.position.y + y2, Math.cos(time)*sep), 0.1);
  }
  
  // General Rotation
  const activeGroup = waterGroup.visible ? waterGroup : (meshSphere.visible ? meshSphere : (meshCube.visible ? meshCube : meshOcta));
  if (!waterGroup.visible) {
      activeGroup.rotation.y += 0.002;
      activeGroup.rotation.x += (mouseY - activeGroup.rotation.x) * 0.05;
      activeGroup.rotation.y += (mouseX - (activeGroup.rotation.y % (Math.PI*2))) * 0.05;
  }

  
  renderer.render(scene, camera);
}

updateElement(); // Init
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});