// --- DATA ---
const elements = [
  {
    id: 'wood', name: 'WOOD',
    c1: '#2b3a2b', c2: '#8f9e8a',
    dist: 0.3, freq: 2.0, speed: 0.1, shape: 'sphere',
    words: [
      { text: "Growth", img: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=800&q=80" },
      { text: "Roots", img: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800&q=80" },
      { text: "Flexibility", img: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=800&q=80" },
      { text: "Nature", img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80" },
      { text: "Expansion", img: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&q=80" }
    ]
  },
  {
    id: 'fire', name: 'FIRE',
    c1: '#3d0e0e', c2: '#b56d65',
    dist: 0.7, freq: 1.2, speed: 0.5, shape: 'sphere',
    words: [
      { text: "Passion", img: "https://images.unsplash.com/photo-1495754149474-e54c07932677?w=800&q=80" },
      { text: "Transformation", img: "https://images.unsplash.com/photo-1605653162070-b478783c324f?w=800&q=80" },
      { text: "Heat", img: "https://images.unsplash.com/photo-1516662209730-99f0cb5c5078?w=800&q=80" },
      { text: "Light", img: "https://images.unsplash.com/photo-1496348047260-24885575d69c?w=800&q=80" },
      { text: "Will", img: "https://images.unsplash.com/photo-1599635089531-93c59436d261?w=800&q=80" }
    ]
  },
  {
    id: 'earth', name: 'EARTH',
    c1: '#302b26', c2: '#8c8176',
    dist: 0.15, freq: 3.0, speed: 0.05, shape: 'cube',
    words: [
      { text: "Stability", img: "https://images.unsplash.com/photo-1465189684280-6a8fa9b19736?w=800&q=80" },
      { text: "Foundation", img: "https://images.unsplash.com/photo-1500829243541-74b677fecc30?w=800&q=80" },
      { text: "Substance", img: "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?w=800&q=80" },
      { text: "Gravity", img: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&q=80" },
      { text: "Core", img: "https://images.unsplash.com/photo-1440615496137-5f6dbdfecb58?w=800&q=80" }
    ]
  },
  {
    id: 'metal', name: 'METAL',
    c1: '#aaaaaa', c2: '#ffffff',
    dist: 0.1, freq: 0.5, speed: 0.1, shape: 'sphere',
    words: [
      { text: "Clarity", img: "https://images.unsplash.com/photo-1536617767305-c0f4921c701a?w=800&q=80" },
      { text: "Precision", img: "https://images.unsplash.com/photo-1501183007986-d0d080b147f9?w=800&q=80" },
      { text: "Focus", img: "https://images.unsplash.com/photo-1616422285623-13ff0162193c?w=800&q=80" },
      { text: "Structure", img: "https://images.unsplash.com/photo-1496715976403-7e36dc43f17b?w=800&q=80" },
      { text: "Essence", img: "https://images.unsplash.com/photo-1462690494211-c387e3674415?w=800&q=80" }
    ]
  },
  {
    id: 'water', name: 'WATER',
    c1: '#0a1521', c2: '#4a6fa5',
    dist: 0.4, freq: 1.0, speed: 0.3, shape: 'sphere',
    words: [
      { text: "Flow", img: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=800&q=80" },
      { text: "Depth", img: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=80" },
      { text: "Intuition", img: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80" },
      { text: "Motion", img: "https://images.unsplash.com/photo-1555181126-cf4c68161710?w=800&q=80" },
      { text: "Adaptation", img: "https://images.unsplash.com/photo-1546484475-7f7bd55792da?w=800&q=80" }
    ]
  }
];

// --- THREE.JS ---
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xE0E1E3); 
scene.fog = new THREE.FogExp2(0xE0E1E3, 0.003);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 6;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.getElementById('canvas-container').appendChild(renderer.domElement);

// --- SHADERS ---
const vertexShader = `
  varying vec2 vUv;
  varying float vNoise;
  varying vec3 vNormal;
  uniform float uTime;
  uniform float uDistortion;
  uniform float uFrequency;
  uniform float uSpeed;
  
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
    vec3 newPos = position + normal * noise * uDistortion;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  varying float vNoise;
  varying vec3 vNormal;
  uniform vec3 uColor1;
  uniform vec3 uColor2;

  void main() {
    float mixValue = smoothstep(-0.6, 0.6, vNoise);
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    float fresnel = pow(1.0 - dot(vNormal, viewDir), 3.0);
    vec3 color = mix(uColor1, uColor2, mixValue);
    color += fresnel * 0.3;
    gl_FragColor = vec4(color, 1.0);
  }
`;

const mat = new THREE.ShaderMaterial({
  vertexShader, fragmentShader,
  uniforms: {
    uTime: { value: 0.0 },
    uDistortion: { value: 0.3 },
    uFrequency: { value: 1.5 },
    uSpeed: { value: 0.1 },
    uColor1: { value: new THREE.Color(elements[0].c1) },
    uColor2: { value: new THREE.Color(elements[0].c2) }
  },
  wireframe: false
});

const geoSphere = new THREE.IcosahedronGeometry(1.6, 100);
const meshSphere = new THREE.Mesh(geoSphere, mat);
scene.add(meshSphere);

const geoCube = new THREE.BoxGeometry(2.2, 2.2, 2.2, 64, 64, 64);
const meshCube = new THREE.Mesh(geoCube, mat);
scene.add(meshCube);
meshCube.visible = false;

// --- STATE ---
let currentIndex = 0;
let isThrottled = false;
let isEditorialMode = false;
let currentWordIndex = 0;

let mouseX = 0;
let mouseY = 0;
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

// REFS
const labelEl = document.getElementById('elementLabel');
const dots = document.querySelectorAll('.dot');
const mainUI = document.getElementById('mainUI');
const editorialLayer = document.getElementById('editorialLayer');
const wordContainer = document.getElementById('wordContainer');
const progressFill = document.getElementById('progressFill');
const pageNumber = document.getElementById('pageNumber');
const edSubject = document.getElementById('ed-subject');
const canvasEl = document.querySelector('canvas');
const cursorFollower = document.getElementById('cursorFollower');
const activeThumb = document.getElementById('activeThumb');

// --- FUNCTIONS ---
function updateElement(index) {
  const config = elements[index];
  
  labelEl.style.opacity = 0;
  setTimeout(() => {
    labelEl.textContent = config.name;
    labelEl.style.opacity = 1;
  }, 300);

  dots.forEach((d, i) => d.classList.toggle('active', i === index));

  if (config.shape === 'cube') {
    meshSphere.visible = false;
    meshCube.visible = true;
  } else {
    meshCube.visible = false;
    meshSphere.visible = true;
  }

  const c1 = new THREE.Color(config.c1);
  const c2 = new THREE.Color(config.c2);

  gsap.to(mat.uniforms.uColor1.value, { r: c1.r, g: c1.g, b: c1.b, duration: 1.2 });
  gsap.to(mat.uniforms.uColor2.value, { r: c2.r, g: c2.g, b: c2.b, duration: 1.2 });
  gsap.to(mat.uniforms.uDistortion, { value: config.dist, duration: 1.5 });
  gsap.to(mat.uniforms.uFrequency, { value: config.freq, duration: 1.5 });
  gsap.to(mat.uniforms.uSpeed, { value: config.speed, duration: 1 });
}

function openEditorial() {
  isEditorialMode = true;
  currentWordIndex = 0;
  const config = elements[currentIndex];
  
  edSubject.textContent = config.name;
  mainUI.style.opacity = 0;
  mainUI.style.pointerEvents = 'none';
  canvasEl.classList.add('faded');

  editorialLayer.classList.add('active');
  wordContainer.innerHTML = '';

  // Setup Follower Logic
  // Snap to mouse initially
  gsap.set(cursorFollower, { left: mouseX * window.innerWidth + windowHalfX, top: mouseY * window.innerHeight + windowHalfY });
  gsap.to(cursorFollower, { opacity: 1, duration: 0.5, delay: 0.2 });
  
  // Set initial image
  activeThumb.src = config.words[0].img;

  // Create Words
  config.words.forEach((w, i) => {
    const word = document.createElement('div');
    word.className = 'editorial-word';
    word.textContent = w.text;
    word.id = `word-${i}`;
    if(i === 0) word.classList.add('visible');
    wordContainer.appendChild(word);
  });
  
  updateHUD(0, config.words.length);
}

function closeEditorial() {
  isEditorialMode = false;
  mainUI.style.opacity = 1;
  mainUI.style.pointerEvents = 'auto';
  canvasEl.classList.remove('faded');

  editorialLayer.classList.remove('active');
  
  // Fade out follower
  gsap.to(cursorFollower, { opacity: 0, duration: 0.3 });

  setTimeout(() => {
    wordContainer.innerHTML = '';
  }, 1000);
}

function updateHUD(index, total) {
  const pct = ((index + 1) / total) * 100;
  progressFill.style.width = `${pct}%`;
  pageNumber.textContent = `0${index + 1} / 0${total}`;
}

function switchEditorialWord(direction) {
  const config = elements[currentIndex];
  const max = config.words.length;
  const next = currentWordIndex + direction;

  if (next < 0 || next >= max) return;

  // Change Image Source Directly
  activeThumb.src = config.words[next].img;

  document.getElementById(`word-${currentWordIndex}`).classList.remove('visible');
  document.getElementById(`word-${next}`).classList.add('visible');

  currentWordIndex = next;
  updateHUD(next, max);
}

// --- INPUTS ---
const cursorX = gsap.quickTo(cursorFollower, "left", { duration: 0.5, ease: "power3" });
const cursorY = gsap.quickTo(cursorFollower, "top", { duration: 0.5, ease: "power3" });

document.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX - windowHalfX) / 400;
  mouseY = (event.clientY - windowHalfY) / 400;
  
  if (isEditorialMode) {
    cursorX(event.clientX);
    cursorY(event.clientY);
  }
});

// Stop following if mouse leaves (prevent glitch)
document.addEventListener('mouseleave', () => {
    if(isEditorialMode) gsap.to(cursorFollower, { opacity: 0 });
});
document.addEventListener('mouseenter', () => {
    if(isEditorialMode) gsap.to(cursorFollower, { opacity: 1 });
});

window.addEventListener('wheel', (e) => {
  if (isThrottled) return;
  isThrottled = true;
  setTimeout(() => isThrottled = false, 600);
  
  const dir = e.deltaY > 0 ? 1 : -1;
  if (isEditorialMode) {
    switchEditorialWord(dir);
  } else {
    let next = currentIndex + dir;
    if (next < 0) next = elements.length - 1;
    if (next >= elements.length) next = 0;
    currentIndex = next;
    updateElement(currentIndex);
  }
});

document.getElementById('centerStage').addEventListener('click', openEditorial);
document.getElementById('closeBtn').addEventListener('click', closeEditorial);

const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const time = clock.getElapsedTime();
  mat.uniforms.uTime.value = time;
  
  const activeMesh = meshSphere.visible ? meshSphere : meshCube;
  activeMesh.rotation.y += 0.002;
  activeMesh.rotation.x += (mouseY - activeMesh.rotation.x) * 0.05;
  activeMesh.rotation.y += (mouseX - (activeMesh.rotation.y % (Math.PI*2))) * 0.05;

  renderer.render(scene, camera);
}

updateElement(0);
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});