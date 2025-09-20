// scripts/youtube_api.js

// --- Configuración ---
const API_KEY = "AIzaSyBmIoNnOuHCpxVlv8PFmR5q9Be3Njv8eeI";
const CHANNEL_ID = "UCVwvHqtXyYBlnHyhlRsjkKQ";       
const MAX_RESULTS = 6;

// --- Función para cargar datos de YouTube ---
async function loadYouTube() {
  try {
    // 1. Suscriptores
    const subsRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}&key=${API_KEY}`
    );
    const subsData = await subsRes.json();
    const subsCount = subsData.items[0].statistics.subscriberCount;
    document.getElementById("subsCount").textContent = subsCount;

    // 2. Últimos videos
    const vidsRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=${MAX_RESULTS}`
    );
    const vidsData = await vidsRes.json();

    const lastVideos = document.getElementById("lastVideos");
    const youtubeList = document.getElementById("youtubeList");

    lastVideos.innerHTML = "";
    youtubeList.innerHTML = "";

    vidsData.items.forEach(item => {
      if (item.id.kind === "youtube#video") {
        const videoId = item.id.videoId;
        const title = item.snippet.title;
        const thumb = item.snippet.thumbnails.medium.url;

        const card = `
          <div class="card">
            <img src="${thumb}" alt="${title}">
            <h4>${title}</h4>
            <a href="https://www.youtube.com/watch?v=${videoId}" target="_blank">Ver</a>
          </div>`;

        // Mostrar en Home y en YouTube
        lastVideos.innerHTML += card;
        youtubeList.innerHTML += card;
      }
    });
  } catch (err) {
    console.error("Error cargando YouTube API:", err);
  }
}
