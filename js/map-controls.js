L.control.zoom({
  position: 'topright'
}).addTo(map);

var lc = L.control.locate({
  position: 'topright',
  drawCircle: true,
  follow: true,
  setView: 'untilPanOrZoom',
  keepCurrentZoomLevel: false,
  circleStyle: {
      className: "leaflet-control-locate-circle",
      color: "#136AEC",
      fillColor: "#136AEC",
      fillOpacity: 0.15,
      weight: 0
  },
  markerStyle: {
      className: "leaflet-control-locate-marker",
      color: "#fff",
      fillColor: "#2A93EE",
      fillOpacity: 1,
      weight: 3,
      opacity: 1,
      radius: 9
  },
  icon: 'bi bi-crosshair',
  iconElementTag: 'svg',
  iconLoading: 'bi bi-crosshair',
  locateOptions: {
      maxZoom: 19,
      watch: true,
      enableHighAccuracy: true,
      maximumAge: 10000,
      timeout: 10000
  }
}).addTo(map);

var locateButton = document.querySelector('.leaflet-control-locate a');
locateButton.style.display = 'flex';
locateButton.style.alignItems = 'center';
locateButton.style.justifyContent = 'center';
locateButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-crosshair" viewBox="0 0 16 16" style="margin-top: -2px;">
  <path d="M8.5.5a.5.5 0 0 0-1 0v.518A7 7 0 0 0 1.018 7.5H.5a.5.5 0 0 0 0 1h.518A7 7 0 0 0 7.5 14.982v.518a.5.5 0 0 0 1 0v-.518A7 7 0 0 0 14.982 8.5h.518a.5.5 0 0 0 0-1h-.518A7 7 0 0 0 8.5 1.018zm-6.48 7A6 6 0 0 1 7.5 2.02v.48a.5.5 0 0 0 1 0v-.48a6 6 0 0 1 5.48 5.48h-.48a.5.5 0 0 0 0 1h.48a6 6 0 0 1-5.48 5.48v-.48a.5.5 0 0 0-1 0v.48A6 6 0 0 1 2.02 8.5h.48a.5.5 0 0 0 0-1zM8 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4"/>
</svg>`;

// Layer Controls
var mapLayersSelectedImageId = 'classicMapBaseLayer';
var areHikingTrailsSelected = false;
var areCyclingTrailsSelected = false;
var areTrainsTrailsSelected = false;

function selectImage(imageId) {
  document.querySelectorAll('.selectable').forEach(img => {
      img.classList.remove('selected');
  });
  const mapLayersSelectedImage = document.getElementById(imageId);
  if (mapLayersSelectedImage) {
      mapLayersSelectedImage.classList.add('selected');
      mapLayersSelectedImageId = imageId;
      loadMap(); 
  }
}

document.querySelectorAll('.selectable').forEach(img => {
  img.addEventListener('click', function() {
      selectImage(this.id);
  });
});

document.getElementById('layer-btn').addEventListener('click', function(e) {
  e.stopPropagation();
  const popup = document.getElementById('layer-popup');
  popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
});

document.addEventListener('click', function(event) {
  const popup = document.getElementById('layer-popup');
  const button = document.getElementById('layer-btn');
  const isClickInside = popup.contains(event.target) || button.contains(event.target);
  if (!isClickInside) {
      popup.style.display = 'none';
  }
});

document.getElementById('layer-checkbox-1').addEventListener('change', function(e) {
  areHikingTrailsSelected = e.target.checked;
  loadMap();
});

document.getElementById('layer-checkbox-2').addEventListener('change', function(e) {
  areCyclingTrailsSelected = e.target.checked;
  loadMap();
});

document.getElementById('layer-checkbox-3').addEventListener('change', function(e) {
  areTrainsTrailsSelected = e.target.checked;
  loadMap();
});

window.addEventListener('DOMContentLoaded', () => {
  selectImage('classicMapBaseLayer');

  if (window.innerWidth <= 991) {
    const mapOptions = document.querySelector('.map-options');
    const locateControl = document.querySelector('.leaflet-control-locate');

    if (mapOptions && locateControl) {
      mapOptions.prepend(locateControl);
    }

  }
});