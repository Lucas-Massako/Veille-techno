const RSS_FEEDS = [
    { name: "Google News", url: "https://news.google.com/rss/search?q=intelligence+artificielle&hl=fr&gl=FR&ceid=FR:fr" },
    { name: "Le Monde", url: "https://www.lemonde.fr/pixels/rss_full.xml" },
    { name: "League of Legends", url: "https://www.team-aaa.com/rss/portal_league-of-legends.xml" },
    { name: "hardware", url: "https://www.canardpc.com/cat%C3%A9gorie/hardware/feed" },
    { name: "news-jv", url: "https://www.canardpc.com/cat%C3%A9gorie/jeu-video/news-jeu-video/feed" },
    { name: "PSG Officiel", url: "https://www.psg.fr/rss/actualites" },
    { name: "football", url:"https://www.lequipe.fr/Football/"}
];

// Fonction générique pour récupérer et afficher les flux RSS
async function fetchRSS(categoryName, elementId, filterNames) {
    const rssFeedElement = document.getElementById(elementId);
    rssFeedElement.innerHTML = "Chargement des articles...";

    const feedsToFetch = RSS_FEEDS.filter(feed => filterNames.includes(feed.name));

    for (const feed of feedsToFetch) {
        try {
            const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(feed.url)}`);
            const data = await response.json();
            
            const parser = new DOMParser();
            const xml = parser.parseFromString(data.contents, "text/xml");

            rssFeedElement.innerHTML += `<h3>${feed.name}</h3>`;
            displayRSS(xml, rssFeedElement);
        } catch (error) {
            console.error(`Erreur lors de la récupération du flux RSS (${feed.name}) :`, error);
            rssFeedElement.innerHTML += `<p>Impossible de charger les articles de ${feed.name}.</p>`;
        }
    }
}


function displayRSS(xml, rssFeedElement) {
    const items = xml.querySelectorAll("item");
    let html = "";
    const uniqueLinks = new Set(); 

    items.forEach((item, index) => {
        if (index < 4) {
            const title = item.querySelector("title")?.textContent || "Sans titre";
            const link = item.querySelector("link")?.textContent || "#";
            const description = item.querySelector("description")?.textContent || "Pas de description";
            const image = item.querySelector("enclosure")?.getAttribute("url") || "";

            if (!uniqueLinks.has(link)) {
                uniqueLinks.add(link);
                html += `
                    <div class="article">
                        <a href="${link}" target="_blank">
                            ${image ? `<img src="${image}" alt="Image de l'article">` : ""}
                            <h3>${title}</h3>
                        </a>
                        <p>${description}</p>
                        <button onclick="saveArticle('${title}', '${link}', '${image}', '${description}')">❤️ Ajouter aux favoris</button>
                    </div>
                `;
            }
        }
    });

    rssFeedElement.innerHTML += html || "<p>Aucun article disponible.</p>";
}
function saveArticle(title, link, image, description) {
    let savedArticles = JSON.parse(localStorage.getItem("likedArticles")) || [];

    // Vérifier si l'article est déjà enregistré
    if (!savedArticles.some(article => article.link === link)) {
        savedArticles.push({ title, link, image, description });
        localStorage.setItem("likedArticles", JSON.stringify(savedArticles));
        alert("Article ajouté aux favoris !");
    } else {
        alert("Cet article est déjà dans vos favoris.");
    }
}

fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(feed.url)}`)
    .then(response => {
        if (!response.ok) {
            throw new Error("Problème de connexion avec l'API AllOrigins");
        }
        return response.json();
    })
    .then(data => { /* Traiter les données */ })
    .catch(error => {
        console.error(error);
        rssFeedElement.innerHTML += `<p>Erreur lors du chargement des articles.</p>`;
    });

// Appels des fonctions pour chaque catégorie
fetchRSS("IA", "rss-feed", ["Google News", "Le Monde"]);
fetchRSS("Jeux Vidéo", "rss-feed-jv", ["League of Legends", "hardware", "news-jv"]);
fetchRSS("PSG", "rss-feed-psg", ["PSG Officiel","football"]);
