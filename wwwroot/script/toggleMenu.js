function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const btn = document.getElementById('menu-button');
    
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    
    if (sidebar.classList.contains('active')) {
        btn.style.display = 'none';
    } else {
        btn.style.display = 'block';
    }
}

const coords1 = [-19.9320, -43.9380];
let fullMap;

document.addEventListener("DOMContentLoaded", () => {
    const miniMapElement = document.getElementById('mini-map-post1');
    if (miniMapElement) {
        const miniMap = L.map('mini-map-post1', {
            zoomControl: false,
            attributionControl: false
        }).setView(coords1, 15);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(miniMap);
        L.circleMarker(coords1, {
            radius: 10,     
            fillColor: "#069E6E", 
            color: "#fff",       
            weight: 2,           
            opacity: 1,
            fillOpacity: 0.8     
        }).addTo(miniMap);
            }
});

function expandMap(postId, lat, lng) {
    const container = document.getElementById(`expanded-map-${postId}`);
    container.style.display = 'block';

    if (!fullMap) {
        fullMap = L.map(`full-map-${postId}`).setView([lat, lng], 16);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(fullMap);
        L.circleMarker([lat, lng], {
            radius: 10,     
            fillColor: "#069E6E", 
            color: "#fff",       
            weight: 2,           
            opacity: 1,
            fillOpacity: 0.8     
        }).addTo(fullMap);
    } else {
        fullMap.invalidateSize();
    }
}

function closeMap(postId) {
    document.getElementById(`expanded-map-${postId}`).style.display = 'none';
}