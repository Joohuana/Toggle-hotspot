 let currentScroll = 0;
  let questionVisible = false;
  let hotspotsVisible = false;
  let activeHotspot = null;

  const question = document.getElementById('question');
  const hotspots = document.querySelectorAll('.hotspot');
  const body = document.body;
  const cursor = document.querySelector('.custom-cursor');
  
  const scrollTriggerQuestion = window.innerHeight * 0.5;
  const scrollTriggerHotspots = window.innerHeight * 1.2;
  const scrollHideQuestion = window.innerHeight * 0.8;

  // Feste Editorial Words für jedes Element
  const fixedEditorialWords = {
    holz: ["Wachstum", "Kreativität", "Expansion", "Flexibilität", "Inspiration"],
    feuer: ["Energie", "Leidenschaft", "Transformation", "Wärme", "Begeisterung"],
    erde: ["Stabilität", "Vertrauen", "Verwurzelung", "Nährung", "Sicherheit"],
    metall: ["Struktur", "Präzision", "Klarheit", "Ordnung", "Fokus"],
    wasser: ["Reflexion", "Tiefe", "Ruhe", "Fluss", "Klarheit"]
  };

  // Stichpunkte für jedes Element
  const keywords = {
    holz: ["Kreativität", "Wachstum", "Inspiration"],
    feuer: ["Energie", "Entschlossenheit", "Leidenschaft"],
    erde: ["Stabilität", "Klarheit", "Sicherheit"],
    metall: ["Struktur", "Fokus", "Präzision"],
    wasser: ["Reflexion", "Ruhe", "Intuition"]
  };

  // Custom Cursor Bewegung
  document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    // Prüfen ob Cursor über einem Hotspot ist
    let isInsideHotspot = false;
    hotspots.forEach(hotspot => {
      if (hotspot.classList.contains('visible') && hotspot.style.opacity !== '0') {
        const rect = hotspot.getBoundingClientRect();
        const hotspotCenterX = rect.left + rect.width / 2;
        const hotspotCenterY = rect.top + rect.height / 2;
        const distance = Math.sqrt(
          Math.pow(e.clientX - hotspotCenterX, 2) + 
          Math.pow(e.clientY - hotspotCenterY, 2)
        );
        
        // Aktueller Radius des Hotspots (normal oder aktiv)
        const currentRadius = hotspot.classList.contains('active') ? 
          (40 * window.innerWidth / 100) / 2 : 
          rect.width / 2;
        
        if (distance < currentRadius) {
          isInsideHotspot = true;
        }
      }
    });
    
    // Mix-blend-mode basierend auf Position
    if (isInsideHotspot) {
      cursor.classList.add('inside-hotspot');
    } else {
      cursor.classList.remove('inside-hotspot');
    }
  });

  window.addEventListener('scroll', () => {
    currentScroll = window.scrollY;

    // Frage einblenden
    if (currentScroll >= scrollTriggerQuestion && currentScroll < scrollHideQuestion && !questionVisible) {
      questionVisible = true;
      question.style.opacity = 1;
    }
    
    // Frage ausblenden bevor Hotspots erscheinen
    if (currentScroll >= scrollHideQuestion && questionVisible) {
      questionVisible = false;
      question.style.opacity = 0;
    }
    
    // Frage ausblenden beim hochscrollen
    if (currentScroll < scrollTriggerQuestion && questionVisible) {
      questionVisible = false;
      question.style.opacity = 0;
    }

    // Hotspots einblenden (nur beim ersten Erscheinen)
    if (currentScroll >= scrollTriggerHotspots && !hotspotsVisible) {
      hotspotsVisible = true;
      hotspots.forEach((h, index) => {
        setTimeout(() => {
          h.classList.add('visible');
          h.style.opacity = 1;
        }, index * 100);
      });
    }
  });

  hotspots.forEach(hotspot => {
    // Hover Events für Cursor
    hotspot.addEventListener('mouseenter', () => {
      if (hotspotsVisible && !activeHotspot) {
        cursor.classList.add('hover', hotspot.dataset.element);
        
        const transform = getComputedStyle(hotspot).transform;
        hotspot.style.transform = transform === 'none' ? 
          (hotspot.classList.contains('erde') ? 'translate(-50%, -50%) scale(1.1)' :
           hotspot.classList.contains('wasser') || hotspot.classList.contains('feuer') ? 'translateY(-50%) scale(1.1)' :
           'translateX(-50%) scale(1.1)') : 
          transform + ' scale(1.1)';
      }
    });

    hotspot.addEventListener('mouseleave', () => {
      if (hotspotsVisible && !activeHotspot) {
        cursor.classList.remove('hover', 'holz', 'feuer', 'erde', 'metall', 'wasser');
        
        if (hotspot.classList.contains('erde')) {
          hotspot.style.transform = 'translate(-50%, -50%)';
        } else if (hotspot.classList.contains('holz') || hotspot.classList.contains('metall')) {
          hotspot.style.transform = 'translateY(-50%)';
        } else {
          hotspot.style.transform = 'translateX(-50%)';
        }
      }
    });

    // Click Event
    hotspot.addEventListener('click', () => {
      if (!hotspotsVisible) return;

      const element = hotspot.dataset.element;
      
      if (activeHotspot === hotspot) {
        // Zurücksetzen
        resetHotspot();
      } else {
        // Vorherigen aktiven Hotspot zurücksetzen
        if (activeHotspot) {
          resetHotspot();
        }
        
        activeHotspot = hotspot;
        
        // Andere Hotspots ausblenden
        hotspots.forEach(h => {
          if (h !== hotspot) {
            h.style.opacity = 0;
            h.style.pointerEvents = 'none';
          }
        });

        // Aktiven Hotspot vergrößern
        hotspot.classList.add('active');
        
        // Cursor Farbe ändern
        cursor.classList.add(hotspot.dataset.element);
        
        // Hintergrundfarbe ändern
        body.className = '';
        body.classList.add(element + '-bg');

        // Vorhandene Wörter entfernen
        document.querySelectorAll('.editorial-word').forEach(w => w.remove());
        // Vorhandene Stichpunkte entfernen
        document.querySelectorAll('.keywords-container').forEach(k => k.remove());

        // Stichpunkte anzeigen
        const keywordsContainer = document.createElement('div');
        keywordsContainer.classList.add('keywords-container');
        
        keywords[element].forEach(keyword => {
          const keywordElement = document.createElement('div');
          keywordElement.classList.add('keyword');
          keywordElement.textContent = keyword;
          keywordsContainer.appendChild(keywordElement);
        });
        
        document.querySelector('.viewport-fixed').appendChild(keywordsContainer);
        
        // Stichpunkte einblenden
        setTimeout(() => {
          keywordsContainer.style.opacity = 1;
        }, 500);

        // Feste Wörter anzeigen (nicht random)
        const words = fixedEditorialWords[element];
        const placedWords = []; // Array um positionierte Wörter zu tracken
const minDistanceBetweenWords = 100; // Mindestabstand in Pixeln zwischen Wörtern
 
 // Positionen gruppiert nach Bereichen
const positionGroups = {
  topLeft: [
    { left: 5, top: 5 }, { left: 15, top: 15 }, { left: 25, top: 10 },
    { left: 10, top: 25 }, { left: 20, top: 30 }
  ],
  topRight: [
    { left: 75, top: 5 }, { left: 85, top: 15 }, { left: 65, top: 10 },
    { left: 80, top: 25 }, { left: 70, top: 30 }
  ],
  bottomLeft: [
    { left: 5, top: 75 }, { left: 15, top: 85 }, { left: 25, top: 70 },
    { left: 10, top: 65 }, { left: 20, top: 80 }
  ],
  bottomRight: [
    { left: 75, top: 75 }, { left: 85, top: 85 }, { left: 65, top: 70 },
    { left: 80, top: 65 }, { left: 70, top: 80 }
  ],
  topCenter: [
    { left: 40, top: 5 }, { left: 50, top: 10 }, { left: 60, top: 5 }
  ],
  bottomCenter: [
    { left: 40, top: 90 }, { left: 50, top: 85 }, { left: 60, top: 90 }
  ]
};

// Wörter positionieren und anzeigen
words.forEach((word, index) => {
  const wordElement = document.createElement('div');
  wordElement.classList.add('editorial-word');
  wordElement.textContent = word;
  
  // VERGRÖSSERTE SCHRIFT
  wordElement.style.fontWeight = 400 + (index % 3) * 200;
  wordElement.style.fontSize = (1.8 + Math.random() * 0.5) + 'rem';
  
  setTimeout(() => {
    const hotspotRect = hotspot.getBoundingClientRect();
    const element = hotspot.dataset.element;
    
    // Wähle Positionen basierend auf Hotspot-Position
    let availableGroups = [];
    
    switch(element) {
      case 'holz': // Links -> Rechts und Oben/Unten rechts
        availableGroups = ['topRight', 'bottomRight', 'topCenter', 'bottomCenter'];
        break;
      case 'feuer': // Oben -> Unten und Links/Rechts unten
        availableGroups = ['bottomLeft', 'bottomRight', 'bottomCenter'];
        break;
      case 'metall': // Rechts -> Links und Oben/Unten links
        availableGroups = ['topLeft', 'bottomLeft', 'topCenter', 'bottomCenter'];
        break;
      case 'wasser': // Unten -> Oben und Links/Rechts oben
        availableGroups = ['topLeft', 'topRight', 'topCenter'];
        break;
      case 'erde': // Mitte -> Alle Ecken
        availableGroups = ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'];
        break;
    }
    
    // Sammle alle verfügbaren Positionen
    let allPositions = [];
    availableGroups.forEach(group => {
      allPositions = allPositions.concat(positionGroups[group]);
    });
    
    // Wähle Position für dieses Wort
    const positionIndex = index % allPositions.length;
    const position = allPositions[positionIndex];
    
    wordElement.style.left = position.left + '%';
    wordElement.style.top = position.top + '%';
    
  }, 100);
  
  document.querySelector('.viewport-fixed').appendChild(wordElement);
  
  setTimeout(() => {
    wordElement.style.opacity = 1;
  }, 300 + index * 150);
});
        
        
        
      }
    });
  });

  function resetHotspot() {
    if (activeHotspot) {
      activeHotspot.classList.remove('active');
    }
    
    // Cursor zurücksetzen
    cursor.classList.remove('holz', 'feuer', 'erde', 'metall', 'wasser');
    
    // Alle Hotspots wieder einblenden
    hotspots.forEach(h => {
      h.style.opacity = 1;
      h.style.pointerEvents = 'auto';
    });
    
    // Hintergrund zurücksetzen
    body.className = '';
    
    // Wörter entfernen
    document.querySelectorAll('.editorial-word').forEach(w => w.remove());
    // Stichpunkte entfernen
    document.querySelectorAll('.keywords-container').forEach(k => k.remove());
    
    activeHotspot = null;
  }
