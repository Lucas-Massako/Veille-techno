
const RSS_URL = "https://www.sciencedaily.com/rss/computers_math/artificial_intelligence.xml";


async function fetchRSS() {
    try {
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(RSS_URL)}`);
        const data = await response.json();

        const parser = new DOMParser();
        const xml = parser.parseFromString(data.contents, "text/xml");

        displayRSS(xml);
    } catch (error) {
        console.error("Erreur lors de la récupération du flux RSS :", error);
        document.getElementById("rss-feed").innerHTML = "Impossible de charger les articles.";
    }
}

function displayRSS(xml) {
    const items = xml.querySelectorAll("item");
    let html = "";

    items.forEach(item => {
        const title = item.querySelector("title").textContent;
        const link = item.querySelector("link").textContent;
        const description = item.querySelector("description").textContent;

        html += `
            <div class="article">
                <a href="${link}" target="_blank">${title}</a>
                <p>${description}</p>
            </div>
        `;
    });

    document.getElementById("rss-feed").innerHTML = html;
}

fetchRSS();
