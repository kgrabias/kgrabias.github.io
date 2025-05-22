const GPX_FILES = ['1-1.gpx', '1-2.gpx', '1-4.gpx'];
const markersLayer = L.layerGroup().addTo(map);
let trackLayer = null;

// Konfiguracje ikon
const iconConfigs = {
	firstLastMarker: {
		iconUrl: '/assets/start.png',
		iconSize: [54, 66],
		iconAnchor: [1, 65],
		popupAnchor: [1, -34]
	},
	regularMarker: {
		iconUrl: '/assets/marker.png',
		iconSize: [39, 60],
		iconAnchor: [19, 59],
		popupAnchor: [1, -34]
	}
};

// SVG ikony
const svgIcons = {
	arrowLeft: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="black" class="bi bi-arrow-left-short" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M12 8a.5.5 0 0 1-.5.5H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5a.5.5 0 0 1 .5.5"/></svg>`,
	arrowRight: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-right-short" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8"/></svg>`,
	arrowUp: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up-short" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 12a.5.5 0 0 0 .5-.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 .5.5"/></svg>`,
	arrowDown: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-short" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 4a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5A.5.5 0 0 1 8 4"/></svg>`
};

// Inicjalizacja mapy
function initMap() {
	map.invalidateSize();
}

// Obsługa przycisku sidebar
function setupSidebarToggle() {
	const sidebarBtn = document.getElementById('sidebar-btn');
	const appContainer = document.querySelector('.main-layout');
	const arrowIcon = document.getElementById('arrow-icon');

	sidebarBtn.addEventListener('click', () => {
		const isHidden = appContainer.classList.toggle('sidebar-hidden');
		appContainer.classList.toggle('sidebar-visible', !isHidden);
		arrowIcon.innerHTML = isHidden ? svgIcons.arrowRight : svgIcons.arrowLeft;
		setTimeout(initMap, 310);
	});
}

// Obsługa mobilnego przycisku sidebar
function setupMobileSidebarToggle() {
	const mobileSidebarBtn = document.getElementById('mobile-sidebar-button');
	const mobileArrowIcon = document.getElementById('mobile-arrow');
	const appContainer = document.querySelector('.main-layout');

	mobileSidebarBtn.addEventListener('click', () => {
		const isHidden = appContainer.classList.toggle('mobile-sidebar-hidden');
		mobileArrowIcon.innerHTML = isHidden ? svgIcons.arrowUp : svgIcons.arrowDown;
		setTimeout(initMap, 310);
	});
}

// Obliczanie odległości między punktami
function calculateDistance(lat1, lon1, lat2, lon2) {
	const R = 6371e3;
	const toRad = (deg) => deg * Math.PI / 180;

	const lat1Rad = toRad(lat1);
	const lat2Rad = toRad(lat2);
	const deltaLat = toRad(lat2 - lat1);
	const deltaLon = toRad(lon2 - lon1);
	const x = deltaLon * Math.cos((lat1Rad + lat2Rad) / 2);
	const y = deltaLat;
	return Math.sqrt(x * x + y * y) * R;
}

// Tworzenie znaczników dla punktów trasy
function createWaypointMarkers(waypoints, filename) {
	const filenameForURL = filename.slice(0, -4);

	waypoints.forEach((wpt, i) => {
		const lat = parseFloat(wpt.getAttribute('lat'));
		const lon = parseFloat(wpt.getAttribute('lon'));
		const latLng = L.latLng(lat, lon);
		const name = wpt.querySelector('name')?.textContent || '';
		const desc = wpt.querySelector('desc')?.textContent || '';

		const isFirst = i === 0;
		const icon = L.icon(isFirst ? iconConfigs.firstLastMarker : iconConfigs.regularMarker);

		let popupContent = isFirst ? `<b>Start: </b>` : `<b>Punkt ${i + 1}: </b>`;
		if (name) popupContent += `<b>${name}</b>`;
		if (desc) popupContent += `<br>${desc}`;

		if (filenameForURL && desc) {
			popupContent += `<br><a href="/szlak/${filenameForURL}/punkt/${i + 1}" target="_blank">Pokaż więcej</a>`;
		}

		const marker = L.marker(latLng, { icon }).bindPopup(popupContent).openPopup();
		markersLayer.addLayer(marker);
	});
}

// Obliczanie statystyk trasy
function calculateTrackStats(trackPoints) {
	let distance = 0;
	let elevGain = 0;
	let elevLoss = 0;
	let lastEle = null;
	let lastPoint = null;

	trackPoints.forEach(trkpt => {
		const lat = parseFloat(trkpt.getAttribute('lat'));
		const lon = parseFloat(trkpt.getAttribute('lon'));
		const ele = parseFloat(trkpt.querySelector('ele').textContent);

		if (lastPoint) {
			distance += calculateDistance(lastPoint.lat, lastPoint.lon, lat, lon);
		}

		if (lastEle !== null) {
			const difference = ele - lastEle;
			if (difference > 0) {
				elevGain += difference;
			} else {
				elevLoss += Math.abs(difference);
			}
		}

		lastPoint = { lat, lon };
		lastEle = ele;
	});
	if(Math.abs(elevGain-elevLoss)<2){
		elevGain = elevLoss; //przy tworzeniu trasy w formacie gpx nie przejmowaliśmy się, żeby koniec był DOKŁADNIE w tym samym miejscu co początek, więc ElevGain nie równało się ElevLoss w przypadku pętli, a powinno
	}
	return {
	distance: (distance / 1000).toFixed(2),
	elevGain: elevGain.toFixed(0),
	elevLoss: elevLoss.toFixed(0)
	};
}

//Tworzenie szczegółów trasy
function createTrackDetails(filename, stats, hours, minutes) {
	return `
		<div class="track-details">
			<div class="track-distance">
				<p>
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-signpost-2" viewBox="0 0 16 16">
						<path d="M7 1.414V2H2a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h5v1H2.5a1 1 0 0 0-.8.4L.725 8.7a.5.5 0 0 0 0 .6l.975 1.3a1 1 0 0 0 .8.4H7v5h2v-5h5a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1H9V6h4.5a1 1 0 0 0 .8-.4l.975-1.3a.5.5 0 0 0 0-.6L14.3 2.4a1 1 0 0 0-.8-.4H9v-.586a1 1 0 0 0-2 0M13.5 3l.75 1-.75 1H2V3zm.5 5v2H2.5l-.75-1 .75-1z"/>
					</svg> ${stats.distance} km
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clock" viewBox="0 0 16 16">
						<path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
						<path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"/>
					</svg> ${hours} godz ${minutes} min
				</p>
			</div>
			<div class="track-arrow">
				<p>
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up-right" viewBox="0 0 16 16">
						<path fill-rule="evenodd" d="M14 2.5a.5.5 0 0 0-.5-.5h-6a.5.5 0 0 0 0 1h4.793L2.146 13.146a.5.5 0 0 0 .708.708L13 3.707V8.5a.5.5 0 0 0 1 0z"/>
					</svg> ${stats.elevGain} m
					<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down-right" viewBox="0 0 16 16">
						<path fill-rule="evenodd" d="M14 13.5a.5.5 0 0 1-.5.5h-6a.5.5 0 0 1 0-1h4.793L2.146 2.854a.5.5 0 1 1 .708-.708L13 12.293V7.5a.5.5 0 0 1 1 0z"/>
					</svg> ${stats.elevLoss} m
				</p>
			</div>
		</div>
	`;
}

// Ładowanie i wyświetlanie trasy
function loadAndDisplayTrack(filename) {
	if (trackLayer) {
		map.removeLayer(trackLayer);
		markersLayer.clearLayers();
	}

	trackLayer = new L.GPX(`paths/${filename}`, {
		async: true,
		marker_options: { startIconUrl: null, endIconUrl: null, shadowUrl: null },
		polyline_options: {
			color: '#ff6162',
			dashArray: '5 20',
			weight: '12',
			opacity: '0.8'
		}
	}).on('loaded', e => {
		map.fitBounds(e.target.getBounds());
	}).addTo(map);

	fetch(`paths/${filename}`)
		.then(res => res.text())
		.then(gpxText => {
			const parser = new DOMParser();
			const xml = parser.parseFromString(gpxText, 'application/xml');
			const trackPoints = xml.querySelectorAll('trkpt');
			const waypoints = xml.querySelectorAll('wpt');

			const stats = calculateTrackStats(trackPoints);
			createWaypointMarkers(waypoints, filename);

			return fetch('/paths/time.json')
				.then(response => response.json())
				.then(data => {
					const timeData = data[filename] || { hours: 0, minutes: 0 };
					return { stats, ...timeData };
				});
		})
		.then(({ stats, hours, minutes }) => {
			const detailsCont = document.querySelector('.track-button.selected + .track-details-cont');
			if (detailsCont) {
				detailsCont.innerHTML = createTrackDetails(filename, stats, hours, minutes);
			}
		});
}

// Ładowanie listy tras
function loadTrackList() {
    const list = document.getElementById('track-list');
    list.innerHTML = '';

    // Najpierw pobierz wszystkie dane i nazwy tras
    const trackPromises = GPX_FILES.map(filename => {
        return fetch(`paths/${filename}`)
            .then(res => res.text())
            .then(xmlText => {
                const parser = new DOMParser();
                const xml = parser.parseFromString(xmlText, 'application/xml');
                const trackName = xml.querySelector('trk > name')?.textContent || filename;
                return { filename, trackName };
            });
    });

    // Poczekaj na wszystkie obietnice, posortuj i wyświetl
    Promise.all(trackPromises)
        .then(tracks => {
            // Sortowanie alfabetyczne po nazwie trasy
            tracks.sort((a, b) => a.trackName.localeCompare(b.trackName));
            
            // Wyświetl posortowane trasy
            tracks.forEach(({ filename, trackName }) => {
                const li = document.createElement('li');
                const btn = document.createElement('button');
                btn.textContent = trackName;
                btn.classList.add('track-button');

                const detailsCont = document.createElement('div');
                detailsCont.classList.add('track-details-cont');

                btn.addEventListener('click', () => {
                    document.querySelectorAll('.track-button').forEach(b => b.classList.remove('selected'));
                    btn.classList.add('selected');
                    document.querySelectorAll('.track-details-cont').forEach(container => {
                        container.innerHTML = '';
                    });
                    loadAndDisplayTrack(filename);
                });

                li.appendChild(btn);
                li.appendChild(detailsCont);
                list.appendChild(li);
            });
        });
}

// Zmiana zawartości panelu
function changeSidebarContent(buttonId) {
	const buttons = document.querySelectorAll('.sidebar-buttons button');
	const sidebarContent = document.querySelector('.sidebar-content');

	buttons.forEach(btn => btn.classList.remove('active'));
	document.getElementById(buttonId).classList.add('active');

	if (buttonId === 'button_trasyAK') {
		sidebarContent.innerHTML = `<ul id="track-list"></ul>`;
		loadTrackList();
	} else if (buttonId === 'button_planowanie') {
		sidebarContent.innerHTML = `<h3>Ta funkcjonalność</h3><p>nadejdzie niebawem</p><p>boooogie woooogie ahoj</p>`;
	}
}

//Inicjalizacja
function initSidebar() {
	setupSidebarToggle();
	setupMobileSidebarToggle();

	document.querySelectorAll('.sidebar-buttons button').forEach(button => {
		button.addEventListener('click', function() {
			changeSidebarContent(this.id);
		});
	});

	window.addEventListener('DOMContentLoaded', () => {
		changeSidebarContent('button_trasyAK');
		document.querySelector('.main-layout').classList.add('sidebar-visible');
	});
}

initSidebar();