const RSS_FEEDS = [
    { name: "Google News", url: "https://news.google.com/rss/search?q=intelligence+artificielle&hl=fr&gl=FR&ceid=FR:fr" },
    { name: "Le Monde", url: "https://www.lemonde.fr/pixels/rss_full.xml" },
    { name: "Les Echos", url: "https://www.lesechos.fr/rss/tech-medias.xml" },
    { name: "01net", url: "https://www.01net.com/rss/actualites/technos/" }
];

async function fetchAllRSS() {
    const rssFeedElement = document.getElementById("rss-feed");
    rssFeedElement.innerHTML = "Chargement des articles...";

    for (const feed of RSS_FEEDS) {
        try {
            const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(feed.url)}`);
            const data = await response.json();

            const parser = new DOMParser();
            const xml = parser.parseFromString(data.contents, "text/xml");

            rssFeedElement.innerHTML += `<h2>${feed.name}</h2>`;
            displayRSS(xml);
        } catch (error) {
            console.error(`Erreur lors de la récupération du flux RSS (${feed.name}) :`, error);
            rssFeedElement.innerHTML += `<p>Impossible de charger les articles de ${feed.name}.</p>`;
        }
    }
}

function displayRSS(xml) {
    const items = xml.querySelectorAll("item");
    let html = "";
    const uniqueLinks = new Set(); // Pour éviter les doublons

    items.forEach((item, index) => {
        if (index < 5) {  // Limite à 5 articles par source
            const title = item.querySelector("title")?.textContent || "Sans titre";
            let link = item.querySelector("link")?.textContent || "#";
            const description = item.querySelector("description")?.textContent || "Pas de description";

            // Supprimer les liens en double (notamment pour Google News)
            if (!uniqueLinks.has(link)) {
                uniqueLinks.add(link);
                html += `
                    <div class="article">
                        <a href="${link}" target="_blank">${title}</a>
                        <p>${description}</p>
                    </div>
                `;
            }
        }
    });

    document.getElementById("rss-feed").innerHTML += html || "<p>Aucun article disponible.</p>";
}

fetchAllRSS();
