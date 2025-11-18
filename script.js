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

  // Texte für jedes Element als einzelne Wörter
  const editorialWords = {
    wasser: ["Reflexion", "Tiefe", "Ruhe", "Fluss", "Klarheit", "Gelassenheit", "Intuition", "Stille", "Weichheit"],
    holz: ["Wachstum", "Kreativität", "Expansion", "Flexibilität", "Inspiration", "Vitalität", "Entwicklung", "Grün", "Aufbruch"],
    feuer: ["Energie", "Leidenschaft", "Transformation", "Wärme", "Begeisterung", "Intensität", "Licht", "Dynamik", "Herz"],
    metall: ["Struktur", "Präzision", "Klarheit", "Ordnung", "Fokus", "Reinheit", "Disziplin", "Schärfe", "Grenze"],
    erde: ["Stabilität", "Vertrauen", "Verwurzelung", "Nährung", "Sicherheit", "Balance", "Geborgenheit", "Festigkeit", "Zentriertheit"]
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

        // 5 zufällige Wörter auswählen
        const words = [...editorialWords[element]];
        const selectedWords = [];
        
        while (selectedWords.length < 5 && words.length > 0) {
          const randomIndex = Math.floor(Math.random() * words.length);
          selectedWords.push(words[randomIndex]);
          words.splice(randomIndex, 1);
        }

        // Wörter positionieren und anzeigen
        selectedWords.forEach((word, index) => {
          const wordElement = document.createElement('div');
          wordElement.classList.add('editorial-word');
          wordElement.textContent = word;
          wordElement.style.fontWeight = 400 + (index % 3) * 100;
          wordElement.style.fontSize = (1.1 + Math.random() * 0.3) + 'rem';
          
          // Zufällige Positionierung im Viewport
          const left = 5 + Math.random() * 90;
          const top = 5 + Math.random() * 90;
          
          wordElement.style.left = left + '%';
          wordElement.style.top = top + '%';
          
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
