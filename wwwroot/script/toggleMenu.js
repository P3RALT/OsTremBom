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
const fullMaps = {};
function expandMap(postId, lat, lng) {
    const container = document.getElementById(`expanded-map-${postId}`);

    container.style.display = 'block';

    if (!fullMaps[postId]) {

        const map = L.map(`full-map-${postId}`)
            .setView([lat, lng], 16);

        L.tileLayer(
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
                attribution: '© OpenStreetMap'
            }
        ).addTo(map);

        L.circleMarker([lat, lng], {
            radius: 10,
            fillColor: "#069E6E",
            color: "#fff",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(map);

        fullMaps[postId] = map;

        setTimeout(() => {
            map.invalidateSize();
        }, 100);

    } else {

        setTimeout(() => {
            fullMaps[postId].invalidateSize();
        }, 100);

    }
}
function closeMap(postId) {
    document.getElementById(
        `expanded-map-${postId}`
    ).style.display = 'none';
}