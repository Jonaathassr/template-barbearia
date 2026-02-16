// =======================
// FAQ - Acordeão
// =======================
document.querySelectorAll(".faq-question").forEach((button) => {
  button.addEventListener("click", () => {
    const answer = button.nextElementSibling;

    // Fecha todos os outros abertos
    document.querySelectorAll(".faq-answer").forEach((item) => {
      if (item !== answer) {
        item.style.maxHeight = null;
        item.previousElementSibling.classList.remove("active");
      }
    });

    // Alterna o item clicado
    if (answer.style.maxHeight) {
      answer.style.maxHeight = null;
      button.classList.remove("active");
    } else {
      answer.style.maxHeight = answer.scrollHeight + "px";
      button.classList.add("active");
    }
  });
});

const canvas = document.getElementById("cta-particles-canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const particles = [];
const particleCount = 60;
const particlesColor = getComputedStyle(document.documentElement)
  .getPropertyValue("--cta-particles-color")
  .trim() || "#d4af37";

function hexToRgb(hex) {
  const clean = hex.replace("#", "").trim();
  if (clean.length === 3) {
    const r = clean[0] + clean[0];
    const g = clean[1] + clean[1];
    const b = clean[2] + clean[2];
    return `${parseInt(r, 16)},${parseInt(g, 16)},${parseInt(b, 16)}`;
  }
  if (clean.length === 6) {
    const r = clean.slice(0, 2);
    const g = clean.slice(2, 4);
    const b = clean.slice(4, 6);
    return `${parseInt(r, 16)},${parseInt(g, 16)},${parseInt(b, 16)}`;
  }
  return "212,175,55";
}

for (let i = 0; i < particleCount; i++) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 3 + 1,
    speedX: (Math.random() - 0.5) * 0.7,
    speedY: (Math.random() - 0.5) * 0.7,
    alpha: Math.random() * 0.7 + 0.3
  });
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  particles.forEach(p => {
    p.x += p.speedX;
    p.y += p.speedY;

    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    const rgb = particlesColor.startsWith("#")
      ? hexToRgb(particlesColor)
      : particlesColor;
    ctx.fillStyle = `rgba(${rgb},${p.alpha})`;
    ctx.fill();
  });

  requestAnimationFrame(animateParticles);
}

animateParticles();

// Carrossel
const track = document.querySelector('.carousel-track');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

if (track && prevBtn && nextBtn) {
  let items = Array.from(track.querySelectorAll('.carousel-item'));
  const gap = parseFloat(window.getComputedStyle(track).gap) || 20;

  // Detecta tipo de dispositivo
  function deviceType() {
    if (window.innerWidth <= 768) return "mobile";
    if (window.innerWidth <= 1024) return "tablet";
    return "desktop";
  }

  // Quantos cards visíveis em cada caso
  function visibleCards() {
    switch (deviceType()) {
      case "mobile": return 1;
      case "tablet": return 2;
      default: return 4; // desktop
    }
  }

  function moveCarousel(index) {
    const itemWidth = items[0].getBoundingClientRect().width;
    const shift = index * (itemWidth + gap);
    track.style.transition = "transform 0.5s ease";
    track.style.transform = `translateX(${-shift}px)`;
  }

  // Configura clones só para desktop
  function setupLoop() {
    // Remove clones antigos sempre que mudar de tamanho
    track.querySelectorAll('.clone').forEach(clone => clone.remove());

    if (deviceType() === "desktop") {
      const clones = items.slice(0, visibleCards()).map(item => {
        const clone = item.cloneNode(true);
        clone.classList.add('clone');
        track.appendChild(clone);
        return clone;
      });
      items = Array.from(track.querySelectorAll('.carousel-item'));
    } else {
      // Mobile e tablet usam apenas os itens originais
      items = Array.from(track.querySelectorAll('.carousel-item:not(.clone)'));
    }
  }

  let index = 0;
  setupLoop();
  moveCarousel(index);

  nextBtn.addEventListener('click', () => {
    index++;
    if (index > items.length - visibleCards()) {
      index = 0; // loop contínuo
    }
    moveCarousel(index);
  });

  prevBtn.addEventListener('click', () => {
    index--;
    if (index < 0) {
      index = items.length - visibleCards();
    }
    moveCarousel(index);
  });

  window.addEventListener('resize', () => {
    setupLoop();
    moveCarousel(index);
  });
}





// menu mobile
const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");

menuToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active");
  menuToggle.classList.toggle("active"); // ativa/desativa o "X"
});

navMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
    menuToggle.classList.remove("active");
  });
});


// Bloqueia clique com botão direito (desktop)
document.addEventListener("contextmenu", function(e) {
  e.preventDefault();
});

// Bloqueia arrastar imagens
document.addEventListener("dragstart", function(e) {
  e.preventDefault();
});

// Bloqueia long-press no celular
document.addEventListener("touchstart", function(e) {
  if (e.target.tagName === "IMG") {
    e.preventDefault();
  }
});