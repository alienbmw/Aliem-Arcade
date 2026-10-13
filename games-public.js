/*
  Cómo usarlo en tu página (Vercel):
  1. En tu HTML, dentro de la sección de juegos, pon:  <div id="games-list"></div>
  2. Antes de </body> agrega:  <script src="games-public.js"></script>
  3. Cambia API por la URL de tu API en Render.
*/
(function () {
  const API = "https://TU-API.onrender.com";
  const CACHE_KEY = "aliem_games_cache";
  const box = document.getElementById("games-list");
  if (!box) return;

  const TYPE_LABELS = { gba: "GBA", web: "Web", pc: "PC" };

  // Estilos mínimos (cámbialos a tu gusto en tu CSS usando estas clases)
  const style = document.createElement("style");
  style.textContent = `
    #games-list { display: grid; gap: 16px; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }
    .game-card { border-radius: 12px; overflow: hidden; background: rgba(255,255,255,.06); display: flex; flex-direction: column; }
    .game-card img { width: 100%; aspect-ratio: 3 / 2; object-fit: cover; display: block; }
    .game-card .body { padding: 12px 14px 16px; display: flex; flex-direction: column; gap: 8px; flex: 1; }
    .game-card h3 { margin: 0; font-size: 18px; }
    .game-card .tags { font-size: 13px; opacity: .8; }
    .game-card p { margin: 0; font-size: 14px; }
    .game-card .links { display: flex; gap: 8px; flex-wrap: wrap; margin-top: auto; }
    .game-card .links a { padding: 6px 12px; border-radius: 8px; border: 2px solid currentColor; text-decoration: none; font-weight: 700; font-size: 14px; }
    .games-msg { opacity: .8; }
  `;
  document.head.appendChild(style);

  function message(text) {
    const p = document.createElement("p");
    p.className = "games-msg";
    p.textContent = text;
    box.replaceChildren(p);
  }

  function link(text, url) {
    const a = document.createElement("a");
    a.href = url;
    a.textContent = text;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    return a;
  }

  function card(game) {
    const el = document.createElement("article");
    el.className = "game-card";

    if (game.cover_url) {
      const img = document.createElement("img");
      img.src = game.cover_url;
      img.alt = "Portada de " + game.title;
      img.loading = "lazy";
      el.appendChild(img);
    }

    const body = document.createElement("div");
    body.className = "body";

    const h3 = document.createElement("h3");
    h3.textContent = game.title;

    const tags = document.createElement("div");
    tags.className = "tags";
    tags.textContent = game.category + ", " + (TYPE_LABELS[game.type] || game.type);

    body.append(h3, tags);

    if (game.description) {
      const p = document.createElement("p");
      p.textContent = game.description;
      body.appendChild(p);
    }

    const links = document.createElement("div");
    links.className = "links";
    if (game.play_url) links.appendChild(link("Jugar", game.play_url));
    if (game.itch_url) links.appendChild(link("itch.io", game.itch_url));
    if (links.children.length) body.appendChild(links);

    el.appendChild(body);
    return el;
  }

  function render(games) {
    if (!games.length) return message("Pronto habrá juegos nuevos por aquí.");
    box.replaceChildren(...games.map(card));
  }

  // 1) Muestra al instante lo guardado la última vez (la API gratis tarda en despertar)
  let hadCache = false;
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
    if (Array.isArray(cached)) { render(cached); hadCache = true; }
  } catch (e) { /* sin caché, no pasa nada */ }
  if (!hadCache) message("Cargando juegos… puede tardar unos segundos.");

  // 2) Pide la lista actualizada y la guarda
  fetch(API + "/games")
    .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then((games) => {
      render(games);
      try { localStorage.setItem(CACHE_KEY, JSON.stringify(games)); } catch (e) {}
    })
    .catch(() => { if (!hadCache) message("No se pudieron cargar los juegos. Intenta de nuevo en un momento."); });
})();
