let siteData = {};       // Aquí guardaremos el JSON
let currentLang = "es";  // Idioma por defecto

// 1. Cargar JSON al iniciar
async function loadData() {
  try {
    const res = await fetch("data/data.json");
    siteData = await res.json();
    applyLanguage(currentLang);  // Aplicar idioma inicial
    renderGames();
    renderGallery();
  } catch (err) {
    console.error("Error cargando data.json:", err);
  }
}

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

// 3. Renderizar Juegos
function renderGames() {
    
    const itch = document.getElementById("itchGames");
    const webs = document.getElementById("webGames");
  const { itchio, web } = siteData.games;

  const itchContainer = document.createElement("div");
  const webContainer = document.createElement("div");

  itchContainer.innerHTML = "";
  webContainer.innerHTML = "";

  itchio.forEach(game => {
    itchContainer.innerHTML += `
      <div class="card">
        <img src="${game.thumb}" alt="${game.title}">
        <h4>${game.title}</h4>
        <a href="${game.link}" target="_blank">Jugar</a>
      </div>`;
  });

  web.forEach(game => {
    webContainer.innerHTML += `
      <div class="card">
        <img src="${game.thumb}" alt="${game.title}">
        <h4>${game.title}</h4>
        <a href="${game.link}" target="_blank">Jugar</a>
      </div>`;
  });
    
  webContainer.append.child(webs);
  itchContainer.append.child(itch);
}

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

// 🚀 Iniciar
loadData();
