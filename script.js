// Initialize GSAP
gsap.config({ nullTargetWarn: false });

const editorialData = {
  holz: [
    { text: "Wachstum", img: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=2000" },
    { text: "Kreativität", img: "https://images.unsplash.com/photo-1490750967868-58cb807861d2?q=80&w=2000" },
    { text: "Expansion", img: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2000" },
    { text: "Flexibilität", img: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=2000" },
    { text: "Wurzeln", img: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=2000" }
  ],
  feuer: [
    { text: "Energie", img: "https://images.unsplash.com/photo-1495754149474-e54c07932677?q=80&w=2000" },
    { text: "Wille", img: "https://images.unsplash.com/photo-1599635089531-93c59436d261?q=80&w=2000" },
    { text: "Macht", img: "https://images.unsplash.com/photo-1516662209730-99f0cb5c5078?q=80&w=2000" },
    { text: "Hitze", img: "https://images.unsplash.com/photo-1605653162070-b478783c324f?q=80&w=2000" },
    { text: "Licht", img: "https://images.unsplash.com/photo-1496348047260-24885575d69c?q=80&w=2000" }
  ],
  erde: [
    { text: "Stabilität", img: "https://images.unsplash.com/photo-1465189684280-6a8fa9b19736?q=80&w=2000" },
    { text: "Nährung", img: "https://images.unsplash.com/photo-1500829243541-74b677fecc30?q=80&w=2000" },
    { text: "Vertrauen", img: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=2000" },
    { text: "Substanz", img: "https://images.unsplash.com/photo-1586348943529-beaae6c28db9?q=80&w=2000" },
    { text: "Ruhe", img: "https://images.unsplash.com/photo-1440615496137-5f6dbdfecb58?q=80&w=2000" }
  ],
  metall: [
    { text: "Klarheit", img: "https://images.unsplash.com/photo-1536617767305-c0f4921c701a?q=80&w=2000" },
    { text: "Fokus", img: "https://images.unsplash.com/photo-1501183007986-d0d080b147f9?q=80&w=2000" },
    { text: "Essenz", img: "https://images.unsplash.com/photo-1462690494211-c387e3674415?q=80&w=2000" },
    { text: "Schärfe", img: "https://images.unsplash.com/photo-1616422285623-13ff0162193c?q=80&w=2000" },
    { text: "Struktur", img: "https://images.unsplash.com/photo-1496715976403-7e36dc43f17b?q=80&w=2000" }
  ],
  wasser: [
    { text: "Fluss", img: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=2000" },
    { text: "Tiefe", img: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?q=80&w=2000" },
    { text: "Intuition", img: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2000" },
    { text: "Bewegung", img: "https://images.unsplash.com/photo-1555181126-cf4c68161710?q=80&w=2000" },
    { text: "Form", img: "https://images.unsplash.com/photo-1546484475-7f7bd55792da?q=80&w=2000" }
  ]
};

const fixedPositions = [
  { left: 8, top: 8 },
  { left: 75, top: 8 },
  { left: 8, top: 85 },
  { left: 75, top: 85 },
  { left: 42, top: 12 }
];

let currentScroll = 0;
let questionLocked = false;
let hotspotsVisible = false;
let activeHotspot = null;
let activeWordIndex = 0;
let mediaActivated = false;
let isThrottled = false;

const hotspots = document.querySelectorAll('.hotspot');
const body = document.body;
const cursor = document.querySelector('.custom-cursor');
const mediaContainer = document.getElementById('mediaContainer');
const turbulence = document.querySelector('feTurbulence');

const scrollTriggerQuestion = window.innerHeight * 0.3;
const scrollHideQuestion = window.innerHeight * 0.8;
const scrollTriggerHotspots = window.innerHeight * 1.0;

/* --- 1. CURSOR & HOVER --- */
const xTo = gsap.quickTo(cursor, "left", { duration: 0.2, ease: "power3" });
const yTo = gsap.quickTo(cursor, "top", { duration: 0.2, ease: "power3" });

document.addEventListener('mousemove', (e) => {
  xTo(e.clientX);
  yTo(e.clientY);
  if (!activeHotspot) checkHotspotHover(e.clientX, e.clientY);
});

document.addEventListener('touchmove', (e) => {
  const touch = e.touches[0];
  xTo(touch.clientX);
  yTo(touch.clientY);
}, { passive: true });

function checkHotspotHover(x, y) {
  let isInside = false;
  let hoveredElement = null;
  
  hotspots.forEach(hotspot => {
    if(hotspot.style.opacity === '0') return;
    const rect = hotspot.getBoundingClientRect();
    const dist = Math.sqrt(Math.pow(x - (rect.left + rect.width/2), 2) + Math.pow(y - (rect.top + rect.height/2), 2));
    if (dist < rect.width/2) {
      isInside = true;
      hoveredElement = hotspot.dataset.element;
    }
  });
  
  if (isInside && hoveredElement) {
    cursor.classList.add('hover', hoveredElement);
    cursor.classList.add('inside-hotspot');
  } else {
    cursor.classList.remove('hover', 'holz', 'feuer', 'erde', 'metall', 'wasser');
    cursor.classList.remove('inside-hotspot');
  }
}

/* --- 2. SCROLL & QUESTION LOGIC --- */
window.addEventListener('scroll', () => {
  if (activeHotspot) return;
  currentScroll = window.scrollY;

  if (!questionLocked) {
    if (currentScroll >= scrollTriggerQuestion && currentScroll < scrollHideQuestion) {
       gsap.to('.char', { y: 0, opacity: 1, duration: 0.8, stagger: 0.05, ease: "back.out(1.7)", overwrite: true });
    } else if (currentScroll >= scrollHideQuestion) {
       gsap.to('.char', { y: '-100%', opacity: 0, duration: 0.5, overwrite: true });
       questionLocked = true;
    }
  }

  if (currentScroll >= scrollTriggerHotspots && !hotspotsVisible) {
    hotspotsVisible = true;
    gsap.to(hotspots, { opacity: 1, duration: 1, stagger: 0.1, ease: "power2.out" });
  }
});

/* --- 3. ACTIVATION --- */
hotspots.forEach(hotspot => {
  gsap.to(hotspot, { scale: 1.05, duration: 2 + Math.random(), repeat: -1, yoyo: true, ease: "sine.inOut" });

  hotspot.addEventListener('click', (e) => {
    e.stopPropagation();
    if (!hotspotsVisible || activeHotspot) return;
    activateHotspot(hotspot);
  });
});

function activateHotspot(hotspot) {
  activeHotspot = hotspot;
  activeWordIndex = 0;
  mediaActivated = false;
  const element = hotspot.dataset.element;

  // Hide others
  hotspots.forEach(h => {
    if (h !== hotspot) gsap.to(h, { opacity: 0, scale: 0, duration: 0.5 });
  });

  // Liquid Distort
  const tl = gsap.timeline();
  tl.to(turbulence, { attr: { baseFrequency: '0.05' }, duration: 0.5 })
    .to(turbulence, { attr: { baseFrequency: '0' }, duration: 0.5 });

  // Activate & Color BG
  hotspot.classList.add('active');
  body.classList.add('locked', `${element}-mode`);
  
  // Clean Cursor
  cursor.classList.remove('hover', 'holz', 'feuer', 'erde', 'metall', 'wasser');
  cursor.classList.add('close-mode');

  // Animate Bubble
  let targetProps = {
    width: '35vw', height: '35vw', borderRadius: '50%',
    duration: 1.2, ease: "elastic.out(1, 0.75)"
  };

  if (element === 'erde') {
    targetProps.top = '50%'; targetProps.left = '50%';
    targetProps.xPercent = -50; targetProps.yPercent = -50;
    gsap.set(hotspot, { transform: 'none' });
  }

  gsap.to(hotspot, targetProps);
  
  // Prepare Media (Hidden initially)
  mediaContainer.innerHTML = '';

  // Generate Content
  setTimeout(() => generateContent(element), 300);
}

function generateContent(element) {
  const data = editorialData[element];
  
  data.forEach((item, index) => {
    // Create Image (hidden until scroll/hover)
    const img = document.createElement('img');
    img.src = item.img;
    img.className = 'bg-image';
    img.id = `img-${index}`;
    mediaContainer.appendChild(img);

    // Create Word
    const word = document.createElement('div');
    word.className = 'editorial-word dimmed';
    if(index === 0) word.classList.replace('dimmed', 'active-focus');
    word.id = `word-${index}`;
    
    const span = document.createElement('span');
    span.textContent = item.text;
    word.appendChild(span);

    const pos = fixedPositions[index % fixedPositions.length];
    word.style.left = pos.left + '%';
    word.style.top = pos.top + '%';

    word.addEventListener('mouseenter', () => {
      cursor.classList.add('on-word');
      if (!mediaActivated) enableMediaLayer();
      switchToWord(index);
    });
    word.addEventListener('mouseleave', () => cursor.classList.remove('on-word'));

    document.querySelector('.viewport-fixed').appendChild(word);
  });

  gsap.to('.editorial-word span', { y: 0, duration: 1, stagger: 0.1, ease: "power4.out", delay: 0.2 });
}

/* --- 4. INTERACTION --- */
function enableMediaLayer() {
  if (!mediaActivated) {
    mediaActivated = true;
    // We activate the FIRST image immediately when interaction starts
    document.getElementById(`img-${activeWordIndex}`).classList.add('active');
  }
}

function switchToWord(newIndex) {
  if (newIndex === activeWordIndex) return;
  
  const oldImg = document.getElementById(`img-${activeWordIndex}`);
  const newImg = document.getElementById(`img-${newIndex}`);
  
  gsap.fromTo(newImg, { opacity: 0, scale: 1.2 }, { opacity: 1, scale: 1, duration: 1, ease: "power2.out" });
  gsap.to(oldImg, { opacity: 0, duration: 0.5 });
  
  newImg.classList.add('active');
  oldImg.classList.remove('active');

  const oldWord = document.getElementById(`word-${activeWordIndex}`);
  const newWord = document.getElementById(`word-${newIndex}`);
  
  oldWord.classList.replace('active-focus', 'dimmed');
  newWord.classList.replace('dimmed', 'active-focus');

  activeWordIndex = newIndex;
}

window.addEventListener('wheel', (e) => {
  if (!activeHotspot || isThrottled) return;
  handleScroll(e.deltaY > 0 ? 1 : -1);
});

let touchStartY = 0;
window.addEventListener('touchstart', e => touchStartY = e.touches[0].clientY);
window.addEventListener('touchend', e => {
  if (!activeHotspot || isThrottled) return;
  const diff = touchStartY - e.changedTouches[0].clientY;
  if (Math.abs(diff) > 50) handleScroll(diff > 0 ? 1 : -1);
});

function handleScroll(direction) {
  isThrottled = true;
  setTimeout(() => isThrottled = false, 500);

  if (!mediaActivated) {
    enableMediaLayer();
    return;
  }

  const element = activeHotspot.dataset.element;
  const max = editorialData[element].length;
  const nextIndex = activeWordIndex + direction;

  if (nextIndex >= max && direction === 1) {
    closeLayer();
    return;
  }
  if (nextIndex >= 0 && nextIndex < max) {
    switchToWord(nextIndex);
  }
}

/* --- 5. CLOSE --- */
document.addEventListener('click', (e) => {
  if(e.target.closest('.editorial-word')) return;
  if (activeHotspot) closeLayer();
});

function closeLayer() {
  const hotspot = activeHotspot;
  const element = hotspot.dataset.element;
  activeHotspot = null;

  gsap.to('.editorial-word span', {
    y: '110%', duration: 0.5, ease: "power2.in",
    onComplete: () => document.querySelectorAll('.editorial-word').forEach(w => w.remove())
  });

  gsap.to(hotspot, {
    width: '100px', height: '100px', duration: 0.8, ease: "power3.inOut",
    onComplete: () => {
      hotspot.classList.remove('active');
      gsap.set(hotspot, { clearProps: "all" });
      hotspots.forEach(h => gsap.to(h, { opacity: 1, scale: 1, duration: 0.5 }));
    }
  });

  body.classList.remove('locked', `${element}-mode`);
  cursor.classList.remove('close-mode', 'on-word');
  // Reset media container
  mediaContainer.innerHTML = '';
}