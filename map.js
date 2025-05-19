var map = L.map('main-map', {
    zoomControl: false
}).setView([51.66, 20.66], 12);
var corner_SW = L.latLng(48.8500,16.0000); //skrajne punkty Polski 49.0000,14.1167
var corner_NE = L.latLng(51.0000,22.2500); 
var bounds = L.latLngBounds(corner_SW, corner_NE);
map.setMaxBounds(bounds);

// Kontrolki w prawym górnym rogu
var geocoder = L.Control.geocoder({
    position: 'topright',
    defaultMarkGeocode: false
}).on('markgeocode', function(e) {
    var latlng = e.geocode.center;
    L.marker(latlng).addTo(map).bindPopup(e.geocode.name).openPopup();
    map.setView(latlng, 15);
}).addTo(map);


var linkToTileProvider = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var mapAttribution = '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
var currentTileLayer;
var WaymarkedTrails_hiking;
var WaymarkedTrails_cycling;
var OpenRailwayMap;

function loadMap(){
    if (currentTileLayer) map.removeLayer(currentTileLayer);
    if (WaymarkedTrails_hiking) map.removeLayer(WaymarkedTrails_hiking);
    if (WaymarkedTrails_cycling) map.removeLayer(WaymarkedTrails_cycling);
    if (OpenRailwayMap) map.removeLayer(OpenRailwayMap); 
    
    let maxZooms = [];
    switch(mapLayersSelectedImageId){
        case "classicMapBaseLayer":
            linkToTileProvider = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
            mapAttribution = '&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
            maxZooms.push(19); 
            break;
        case "sateliteMapBaseLayer":
            linkToTileProvider = 'https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}{r}.{ext}';
            apikey: 'a87d0adf-4a83-4b58-b893-93939f25db13';
            mapAttribution ='&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
            maxZooms.push(20);
            break;
        case "topographicMapBaseLayer":
            linkToTileProvider ='https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
            mapAttribution ='Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)';
            maxZooms.push(17);
            break;
    }

    if (areHikingTrailsSelected) maxZooms.push(18);
    if (areCyclingTrailsSelected) maxZooms.push(18);
    if (areTrainsTrailsSelected) maxZooms.push(19);

    const minMaxZoom = Math.min(...maxZooms); // 3 kropki to operator spread - rozpakowywuje tablicę na pojedyńcze elementy

    currentTileLayer = L.tileLayer(linkToTileProvider, {
        maxZoom: minMaxZoom, 
        minZoom: 9,
        maxBoundsViscosity: 1.0,
        attribution: mapAttribution,
        ext: 'jpg',
    }).addTo(map);

    if (areHikingTrailsSelected) {
        WaymarkedTrails_hiking = L.tileLayer('https://tile.waymarkedtrails.org/hiking/{z}/{x}/{y}.png', {
            maxZoom: minMaxZoom, 
            minZoom: 9,
            attribution: 'Hiking data © waymarkedtrails.org (CC-BY-SA)'
        }).addTo(map);
    }

    if (areCyclingTrailsSelected) {
        WaymarkedTrails_cycling = L.tileLayer('https://tile.waymarkedtrails.org/cycling/{z}/{x}/{y}.png', {
            maxZoom: minMaxZoom, 
            minZoom: 9,
            attribution: 'Cycling data © waymarkedtrails.org (CC-BY-SA)'
        }).addTo(map);
    }

    if (areTrainsTrailsSelected) {
        OpenRailwayMap = L.tileLayer('https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png', {
            maxZoom: minMaxZoom, 
            minZoom: 9,
            attribution: 'Railway data © OpenRailwayMap (CC-BY-SA)'
        }).addTo(map);
    }

    map.setMaxZoom(minMaxZoom);
}