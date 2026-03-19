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

// =======================
// Status de funcionamento
// =======================
const statusBadge = document.getElementById("status-badge");

function updateStatusBadge() {
  if (!statusBadge) return;

  const now = new Date();
  const day = now.getDay(); // 0 = domingo, 1 = segunda, ...
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const openMinutes = 9 * 60;
  const closeMinutes = 18 * 60;
  const isSunday = day === 0;
  const isOpen = !isSunday && currentMinutes >= openMinutes && currentMinutes < closeMinutes;

  let message = "";

  if (isOpen) {
    message = "Aberto • Fecha às 18h";
  } else if (isSunday) {
    message = "Fechado • Abre Segunda às 09h";
  } else if (currentMinutes < openMinutes) {
    message = "Fechado • Abre às 09h";
  } else {
    const tomorrow = (day + 1) % 7;
    message = tomorrow === 0
      ? "Fechado • Abre Segunda às 09h"
      : "Fechado • Abre amanhã às 09h";
  }

  statusBadge.textContent = message;
  statusBadge.classList.remove("status-badge--open", "status-badge--closed");
  statusBadge.classList.add(isOpen ? "status-badge--open" : "status-badge--closed");
}

updateStatusBadge();
setInterval(updateStatusBadge, 60000);

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

const mapFrame = document.querySelector(".localizacao-mapa iframe[data-src]");
if (mapFrame) {
  const loadMap = () => {
    const src = mapFrame.getAttribute("data-src");
    if (src) {
      mapFrame.setAttribute("src", src);
      mapFrame.removeAttribute("data-src");
    }
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        if (entries[0].isIntersecting) {
          loadMap();
          obs.disconnect();
        }
      },
      { rootMargin: "200px 0px" }
    );
    observer.observe(mapFrame);
  } else {
    loadMap();
  }
}

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

// =======================
// Modal WhatsApp
// =======================
const GOOGLE_API_KEY = "AIzaSyB_iqfhsqfkDkGMcPWYJC_53DmHJw6JUE4";
const GOOGLE_CALENDAR_ID = "e680e3e4e2c2d89c8f4536df82e373335bc5d192b3b9aa9d2a20140dcda1c601@group.calendar.google.com";


const BARBER_START_HOUR = 9;
const BARBER_END_HOUR = 18;
const SLOT_INTERVAL_HOURS = 1;

const modal = document.getElementById("whatsapp-modal");
const modalClose = modal?.querySelector(".modal__close");
const modalForm = document.getElementById("whatsapp-form");
const serviceSelect = document.getElementById("whatsapp-service");
const dateInput = document.getElementById("whatsapp-date");
const timeSelect = document.getElementById("whatsapp-time");
const submitButton = modalForm?.querySelector('button[type="submit"]');
let activeWaLink = null;
let availabilityRequestId = 0;
let lastLoadedDate = "";

function isGoogleCalendarConfigured() {
  return Boolean(GOOGLE_API_KEY && GOOGLE_CALENDAR_ID);
}

function getBaseTimeSlots() {
  const slots = [];
  for (let hour = BARBER_START_HOUR; hour < BARBER_END_HOUR; hour += SLOT_INTERVAL_HOURS) {
    slots.push(`${String(hour).padStart(2, "0")}:00`);
  }
  return slots;
}

function clearTimeSelectWithPlaceholder(text = "Selecione o horario") {
  if (!timeSelect) return;
  timeSelect.innerHTML = "";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = text;
  placeholder.selected = true;
  timeSelect.appendChild(placeholder);
}

function populateTimeSelect(times) {
  if (!timeSelect) return;
  clearTimeSelectWithPlaceholder("Selecione o horario");

  times.forEach((time) => {
    const option = document.createElement("option");
    option.value = time;
    option.textContent = time;
    timeSelect.appendChild(option);
  });

  timeSelect.disabled = false;
}

function setNoAvailabilityState() {
  if (!timeSelect) return;
  clearTimeSelectWithPlaceholder("Não há horários disponíveis para esta data.");
  timeSelect.disabled = true;
}

function setSubmitEnabled(enabled) {
  if (!submitButton) return;
  submitButton.disabled = !enabled;
}

function getDayRangeInIso(selectedDateValue) {
  const [year, month, day] = selectedDateValue.split("-").map(Number);
  const dayStartLocal = new Date(year, month - 1, day, 0, 0, 0, 0);
  const dayEndLocal = new Date(year, month - 1, day, 23, 59, 59, 999);
  return {
    timeMin: dayStartLocal.toISOString(),
    timeMax: dayEndLocal.toISOString()
  };
}

function dateToIsoDay(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function extractOccupiedSlots(events, selectedDateValue) {
  const occupied = new Set();

  events.forEach((eventItem) => {
    if (eventItem?.status !== "confirmed") return;
    const dateTime = eventItem?.start?.dateTime;
    if (!dateTime) return;

    const startDate = new Date(dateTime);
    if (Number.isNaN(startDate.getTime())) return;
    if (dateToIsoDay(startDate) !== selectedDateValue) return;

    const hourSlot = `${String(startDate.getHours()).padStart(2, "0")}:00`;
    occupied.add(hourSlot);
  });

  return occupied;
}

async function fetchCalendarEventsForDate(selectedDateValue) {
  const { timeMin, timeMax } = getDayRangeInIso(selectedDateValue);
  const calendarIdEncoded = encodeURIComponent(GOOGLE_CALENDAR_ID);
  const endpoint = `https://www.googleapis.com/calendar/v3/calendars/${calendarIdEncoded}/events`;

  const params = new URLSearchParams({
    key: GOOGLE_API_KEY,
    timeMin,
    timeMax,
    singleEvents: "true",
    orderBy: "startTime",
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });

  const response = await fetch(`${endpoint}?${params.toString()}`);
  if (!response.ok) {
    throw new Error(`Google Calendar API retornou ${response.status}`);
  }

  const data = await response.json();
  return Array.isArray(data.items) ? data.items : [];
}

async function updateAvailableTimesForDate(selectedDateValue) {
  if (!timeSelect || !selectedDateValue) return;

  const requestId = ++availabilityRequestId;
  const baseSlots = getBaseTimeSlots();

  if (!isGoogleCalendarConfigured()) {
    populateTimeSelect(baseSlots);
    setSubmitEnabled(true);
    lastLoadedDate = selectedDateValue;
    return;
  }

  clearTimeSelectWithPlaceholder("Carregando horários...");
  timeSelect.disabled = true;
  setSubmitEnabled(false);

  try {
    const events = await fetchCalendarEventsForDate(selectedDateValue);
    if (requestId !== availabilityRequestId) return;

    const occupiedSlots = extractOccupiedSlots(events, selectedDateValue);
    let availableSlots = baseSlots.filter((slot) => !occupiedSlots.has(slot));

    // Remove horários já passados para o dia atual (calendário local)
    const today = new Date();
    const selectedDate = parseDateInputValue(selectedDateValue);
    if (selectedDate && selectedDate.toDateString() === today.toDateString()) {
      const currentHour = today.getHours();
      availableSlots = availableSlots.filter((slot) => {
        const slotHour = Number(slot.split(":")[0]);
        return slotHour > currentHour;
      });
    }

    if (availableSlots.length === 0) {
      setNoAvailabilityState();
      setSubmitEnabled(false);
    } else {
      populateTimeSelect(availableSlots);
      setSubmitEnabled(true);
    }

    lastLoadedDate = selectedDateValue;
  } catch (error) {
    if (requestId !== availabilityRequestId) return;
    console.error("Falha ao consultar Google Calendar:", error);
    populateTimeSelect(baseSlots);
    setSubmitEnabled(true);
    lastLoadedDate = selectedDateValue;
  }
}

const FIXED_HOLIDAYS_BR = new Set([
  "01-01", // Confraternização Universal
  "04-21", // Tiradentes
  "05-01", // Dia do Trabalho
  "09-07", // Independência
  "10-12", // Nossa Senhora Aparecida
  "11-02", // Finados
  "11-15", // Proclamação da República
  "11-20", // Consciência Negra
  "12-25"  // Natal
]);

function getEasterDate(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month - 1, day);
}

function addDays(date, amount) {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
}

function toMonthDay(date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${month}-${day}`;
}

function isHolidayDate(date) {
  const easter = getEasterDate(date.getFullYear());
  const goodFriday = addDays(easter, -2);
  const corpusChristi = addDays(easter, 60);
  const holidayTimestamps = new Set([
    goodFriday.setHours(0, 0, 0, 0),
    corpusChristi.setHours(0, 0, 0, 0)
  ]);

  const current = new Date(date);
  current.setHours(0, 0, 0, 0);

  return FIXED_HOLIDAYS_BR.has(toMonthDay(current)) || holidayTimestamps.has(current.getTime());
}

function isClosedDate(date) {
  return date.getDay() === 0 || isHolidayDate(date);
}

function setTodayMinDate() {
  if (!dateInput) return;
  const now = new Date();
  const minDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  while (isClosedDate(minDate)) {
    minDate.setDate(minDate.getDate() + 1);
  }

  const minISO = formatDateToISO(minDate);
  dateInput.min = minISO;

  if (!dateInput.value) {
    dateInput.value = minISO;
  }
}

function formatDateToISO(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function parseDateInputValue(value) {
  if (!value) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function validateDateIsOpenDay(showAlert = false) {
  if (!dateInput || !dateInput.value) return true;

  const selectedDate = parseDateInputValue(dateInput.value);
  if (!selectedDate) return true;
  if (!isClosedDate(selectedDate)) return true;

  if (showAlert) {
    const isSunday = selectedDate.getDay() === 0;
    const message = isSunday
      ? "Domingo é dia fechado. Selecione uma data de segunda a sábado."
      : "Essa data é feriado e a barbearia estará fechada. Escolha outro dia.";
    window.alert(message);
  }

  dateInput.value = "";
  dateInput.focus();
  return false;
}

function openModal(link) {
  if (!modal) return;
  activeWaLink = link;
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  setTodayMinDate();
  clearTimeSelectWithPlaceholder("Selecione o horario");
  setSubmitEnabled(true);
}

function closeModal() {
  if (!modal) return;
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function formatDateBr(value) {
  const parts = value.split("-");
  if (parts.length !== 3) return value;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

document.querySelectorAll(".js-whatsapp-modal").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    openModal(link);
  });
});

dateInput?.addEventListener("change", () => {
  if (!validateDateIsOpenDay(true)) {
    clearTimeSelectWithPlaceholder("Selecione o horario");
    timeSelect.disabled = false;
    setSubmitEnabled(false);
    lastLoadedDate = "";
    return;
  }

  updateAvailableTimesForDate(dateInput.value);
});

modal?.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

modalClose?.addEventListener("click", closeModal);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal?.getAttribute("aria-hidden") === "false") {
    closeModal();
  }
});

modalForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!serviceSelect.value || !dateInput.value || !timeSelect.value) {
    return;
  }

  if (!validateDateIsOpenDay(true)) {
    return;
  }

  if (lastLoadedDate !== dateInput.value) {
    await updateAvailableTimesForDate(dateInput.value);
  }

  if (!timeSelect.value || timeSelect.disabled) {
    return;
  }

  const service = serviceSelect.value;
  const date = formatDateBr(dateInput.value);
  const time = timeSelect.value;
  const message = `Olá, gostaria de agendar ${service} no dia ${date} às ${time}.`;

  const fallback = "https://wa.me/5588993370497";
  const waHref = activeWaLink?.getAttribute("href") || fallback;
  const waUrl = new URL(waHref, window.location.origin);
  const target = `${waUrl.origin}${waUrl.pathname}?text=${encodeURIComponent(message)}`;

  window.open(target, "_blank");
  closeModal();
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