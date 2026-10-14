let siteData = {};       // Aquí guardaremos el JSON
let currentLang = "es";  // Idioma por defecto

//app
// 1. Cargar datos del JSON
async function loadData() {
  try {
    const res = await fetch("data/data.json");
    siteData = await res.json();
    applyLanguage(currentLang);  // Aplicar idioma inicial
    renderGallery();
  } catch (err) {
    console.error("Error cargando data.json:", err);
  }
}

// Temporal: aquí iba tu código de YouTube (ver nota abajo)
//function loadYouTube() {}

// 2. Cambiar idioma dinámicamente
function applyLanguage(lang) {
  currentLang = lang;
  const langData = siteData.languages[lang];

  if (!langData) return;

  // Navegación
  const navItems = document.querySelectorAll("#mainNav li a");
  langData.nav.forEach((txt, i) => {
    if (navItems[i]) navItems[i].textContent = txt;
  });

  // Hero
  document.querySelector(".hero-text p").textContent = langData.home.welcome;
  document.querySelector(".hero-text .hero-cta").dataset.cta = langData.home.cta;

  // Sobre mí
  document.getElementById("aboutText").textContent = langData.about;

  // Contacto
  document.getElementById("name").placeholder = langData.contact.name;
  document.getElementById("email").placeholder = langData.contact.email;
  document.getElementById("message").placeholder = langData.contact.message;
  document.querySelector("#contactForm button").textContent = langData.contact.send;

  // Botón de idioma
  document.getElementById("langToggle").textContent = lang.toUpperCase();
}

// render


// 4. Renderizar Galería
function renderGallery() {
  const galleryGrid = document.getElementById("galleryGrid");
  galleryGrid.innerHTML = "";
  siteData.gallery.forEach(img => {
    galleryGrid.innerHTML += `<img src="${img}" alt="gallery item">`;
  });
}

// 5. Cambio de idioma desde el botón
document.getElementById("langToggle").addEventListener("click", () => {
  const nextLang = currentLang === "es" ? "en" : "es";
  applyLanguage(nextLang);
});

// --- Navegación de secciones ---
function routeTo(sectionId) {
  // Ocultar todas las secciones
  document.querySelectorAll(".section").forEach(sec => {
    sec.classList.add("hidden");
  });

  // Mostrar solo la sección seleccionada
  const section = document.querySelector(sectionId);
  if (section) section.classList.remove("hidden");
}

// --- Configurar navegación desde los enlaces ---
function setupNavigation() {
  const navLinks = document.querySelectorAll("#mainNav a, .hero-cta a");

  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const target = link.getAttribute("href");
      routeTo(target);
    });
  });
}

loadData().then(() => {
  setupNavigation();
  routeTo("#home");
  loadYouTube(); // 🚀 ya lo tienes conectado
});

