let map;
let hospitalMarkers = new Map(); // Store unique hospitals by place_id

async function initMap() {
    const defaultLocation = { lat: 39.952305, lng: -75.193703 }; // Philadelphia

    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: defaultLocation,
        mapId: "map 1",
    });

    await google.maps.importLibrary("marker");

    findHospitals();

    map.addListener('idle', () => {
        // clearMarkers();
        findHospitals();
    });
}

function findHospitals() {
    const bounds = map.getBounds();
    if (!bounds) return;

    const service = new google.maps.places.PlacesService(map);
    const request = {
        bounds: bounds,
        type: "hospital",
        keyword: "hospital"
    };

    service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            results.forEach((place) => {
                if (isValidHospital(place) && !hospitalMarkers.has(place.place_id)) {
                    hospitalMarkers.set(place.place_id, place.geometry.location);
                    addHospitalMarker(place.geometry.location, place.name);
                }
            });
        }
    });
}

// Function to verify that the result is actually a hospital
function isValidHospital(place) {
    const validTypes = ["hospital", "health"];
    return place.name.toLowerCase().includes("hospital") &&
           place.types.some(type => validTypes.includes(type));
}

// Function to add hospital marker using AdvancedMarkerElement
function addHospitalMarker(location, title) {
    const parser = new DOMParser();
    // A marker with a custom inline SVG.
    const pinSvgString =
    '<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56" fill="none"><rect width="56" height="56" rx="28" fill="#7837FF"></rect><path d="M46.0675 22.1319L44.0601 22.7843" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11.9402 33.2201L9.93262 33.8723" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M27.9999 47.0046V44.8933" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M27.9999 9V11.1113" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M39.1583 43.3597L37.9186 41.6532" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M16.8419 12.6442L18.0816 14.3506" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M9.93262 22.1319L11.9402 22.7843" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M46.0676 33.8724L44.0601 33.2201" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M39.1583 12.6442L37.9186 14.3506" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M16.8419 43.3597L18.0816 41.6532" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M28 39L26.8725 37.9904C24.9292 36.226 23.325 34.7026 22.06 33.4202C20.795 32.1378 19.7867 30.9918 19.035 29.9823C18.2833 28.9727 17.7562 28.0587 17.4537 27.2401C17.1512 26.4216 17 25.5939 17 24.7572C17 23.1201 17.5546 21.7513 18.6638 20.6508C19.7729 19.5502 21.1433 19 22.775 19C23.82 19 24.7871 19.2456 25.6762 19.7367C26.5654 20.2278 27.34 20.9372 28 21.8649C28.77 20.8827 29.5858 20.1596 30.4475 19.6958C31.3092 19.2319 32.235 19 33.225 19C34.8567 19 36.2271 19.5502 37.3362 20.6508C38.4454 21.7513 39 23.1201 39 24.7572C39 25.5939 38.8488 26.4216 38.5463 27.2401C38.2438 28.0587 37.7167 28.9727 36.965 29.9823C36.2133 30.9918 35.205 32.1378 33.94 33.4202C32.675 34.7026 31.0708 36.226 29.1275 37.9904L28 39Z" fill="#FF7878"></path></svg>';
    const pinSvg = parser.parseFromString(
    pinSvgString,
    "image/svg+xml",
    ).documentElement;

    const advancedMarker = new google.maps.marker.AdvancedMarkerElement({
        position: location,
        map: map,
        title: title,
        content: pinSvg,
    });

    hospitalMarkers.set(title, advancedMarker);
}

// // Function to clear previous hospital markers when moving the map
// function clearMarkers() {
//     hospitalMarkers.forEach((marker) => {
//         marker.map = null; // Remove the marker from the map
//     });
//     hospitalMarkers.clear(); // Clear the marker list
// }

// Load Google Maps API with Places and Geometry libraries
const API_KEY = 'AIzaSyDc1RJKVZuU0tqeZcW4q558ltBa7W857fA';
const script = document.createElement('script');
script.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}&libraries=places,geometry&loading=async&callback=initMap`;
script.async = true;
document.head.appendChild(script);
