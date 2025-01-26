let map;
let buildings = {
    "hospital": [],
    "restaurant": [],
    "school": [],
    "office": [],
    "store": [],
    "home": []
};
let hospitalMarkers = new Map(); // Store unique hospitals by place_id

async function initMap() {
    const center = { lat: 39.952305, lng: -75.193703 }; // Philadelphia

    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 15,
        center: center,
        mapId: "e442d3b4191ab219",
        disableDefaultUI: false, // Set to true to remove all controls
        zoomControl: false,      // Remove zoom buttons (+, -)
        fullscreenControl: false, // Remove fullscreen button
        streetViewControl: false, // Remove Pegman (Street View control)
        mapTypeControl: false,    // Remove map type control
    });
    const service = new google.maps.places.PlacesService(map);
    const types = {
        'hospital': ['hospital'], 
        'restaurant': ['restaurant'], 
        'school': ['school', 'university', 'secondary_school', 'primary_school'], 
        'office': ['corporate_office', 'bank', 'government_office', 'post_office', 'library'], 
        'store': ['store'], 
        'home': ['apartment_building', 'apartment_complex', 'condominium_complex', 'housing_complex']
    };
    Object.entries(types).forEach(([key, value]) => {
        const request = {
            location: map.getCenter(),
            radius: 5000,
            types: value 
        };
        if (key === 'home') {
            console.log("Home request:", request);
        }
        service.nearbySearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                const filteredResults = results.filter(place => 
                    place.types.some(item => value.includes(item)) && !place.types.includes('doctor')
                );
                const filteredBuildings = filteredResults.map(place => ({
                    name: place.name,
                    building_id: place.place_id,
                    types: place.types,
                }));
                console.log(`Results for ${key}:`, filteredBuildings);
                buildings[key].push(filteredBuildings);
            } else {
                console.error(`Error fetching places for ${key}:`, status);
            }
        });
    });
    console.log("All buildings:", buildings);
    alert("Map Init!");
}

function startSimulation() {
    if (buildings.length === 0) {
        alert("No building data available!");
        return;
    }
    fetch('http://[::]:8000/run-simulation', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(buildings)
    })
    .then(response => response.json())
    .then(data => {
        console.log("Simulation result:", data);
    })
    .catch(error => console.error("Error running simulation:", error));
    initializeSIRGraph();
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
    return place.name.toLowerCase().includes("hospital") && place.types.some(type => validTypes.includes(type));
}

// Function to add hospital marker using AdvancedMarkerElement
// function addHospitalMarker(location, title) {
//     const parser = new DOMParser();
//     // A marker with a custom inline SVG.
//     const pinSvgString =
//     '<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56" viewBox="0 0 56 56" fill="none"><rect width="56" height="56" rx="28" fill="#7837FF"></rect><path d="M46.0675 22.1319L44.0601 22.7843" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11.9402 33.2201L9.93262 33.8723" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M27.9999 47.0046V44.8933" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M27.9999 9V11.1113" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M39.1583 43.3597L37.9186 41.6532" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M16.8419 12.6442L18.0816 14.3506" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M9.93262 22.1319L11.9402 22.7843" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M46.0676 33.8724L44.0601 33.2201" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M39.1583 12.6442L37.9186 14.3506" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M16.8419 43.3597L18.0816 41.6532" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M28 39L26.8725 37.9904C24.9292 36.226 23.325 34.7026 22.06 33.4202C20.795 32.1378 19.7867 30.9918 19.035 29.9823C18.2833 28.9727 17.7562 28.0587 17.4537 27.2401C17.1512 26.4216 17 25.5939 17 24.7572C17 23.1201 17.5546 21.7513 18.6638 20.6508C19.7729 19.5502 21.1433 19 22.775 19C23.82 19 24.7871 19.2456 25.6762 19.7367C26.5654 20.2278 27.34 20.9372 28 21.8649C28.77 20.8827 29.5858 20.1596 30.4475 19.6958C31.3092 19.2319 32.235 19 33.225 19C34.8567 19 36.2271 19.5502 37.3362 20.6508C38.4454 21.7513 39 23.1201 39 24.7572C39 25.5939 38.8488 26.4216 38.5463 27.2401C38.2438 28.0587 37.7167 28.9727 36.965 29.9823C36.2133 30.9918 35.205 32.1378 33.94 33.4202C32.675 34.7026 31.0708 36.226 29.1275 37.9904L28 39Z" fill="#FF7878"></path></svg>';
//     const pinSvg = parser.parseFromString(
//     pinSvgString,
//     "image/svg+xml",
//     ).documentElement;

//     const advancedMarker = new google.maps.marker.AdvancedMarkerElement({
//         position: location,
//         map: map,
//         title: title,
//         content: pinSvg,
//     });

//     hospitalMarkers.set(title, advancedMarker);
// }

function updateLocation() {
    const address = document.getElementById("locationInput").value;
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ address: address }, (results, status) => {
        if (status === "OK") {
            const location = results[0].geometry.location;
            map.setCenter(location);
            map.setZoom(15);
            searchNearbyPlaces(location);
        } else {
            alert("Location not found: " + status);
        }
    });
}

let allResults = {
    hospitals: [],
    restaurants: [],
    schools: [],
    offices: [],
    stores: []
};

function searchNearbyPlaces(bounds) {
    const service = new google.maps.places.PlacesService(map);
    const types = ['hospital', 'restaurant', 'school', 'office', 'store'];

    types.forEach(type => {
        allResults[type + 's'] = []; // Reset results for each type
        const request = {
            bounds: bounds,  // Search within the drawn box
            type: type
        };
        
        getAllPlaces(service, request, type);
    });
}

function getAllPlaces(service, request, type, resultsArray = []) {
    service.nearbySearch(request, (results, status, pagination) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
            results.forEach(place => {
                if (!place.types.includes('doctor')) {  // Exclude unwanted types
                    resultsArray.push({
                        name: place.name,
                        type: place.types,
                        latitude: place.geometry.location.lat(),
                        longitude: place.geometry.location.lng()
                    });
                }
            });

            // If there are more pages, fetch the next page recursively
            if (pagination && pagination.hasNextPage) {
                setTimeout(() => {
                    pagination.nextPage();
                }, 2000);  // Delay to avoid hitting API limits
            } else {
                // Store the final results once all pages are retrieved
                allResults[type + 's'] = resultsArray;
                console.log(`All ${type}s found within the box:`, resultsArray);
            }
        } else {
            console.error(`Error fetching places for ${type}:`, status);
        }
    });
}

    function drawPeople() {
        fetch('http://[::]:8000/tick', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())
        .then(data => {
            console.log('Simulation data:', data);
    
            data.building_counts.forEach(building => {
                if (hospitalMarkers.has(building.id)) {
                    const hospitalLocation = hospitalMarkers.get(building.id);
                    placeSusceptibleDots(hospitalLocation, building.S);
                    placeInfectedDots(hospitalLocation, building.R);
                    placeRecoveredDots(hospitalLocation, building.R);

                }
            });
        })
        .catch(error => console.error("Error running simulation:", error));
    }
    
    function placeSusceptibleDots(center, count) {
        const radius = 0.0003;  // Approx 30 meters, adjust as needed
        for (let i = 0; i < count; i++) {
            const randomLat = center.lat() + (Math.random() * 2 - 1) * radius;
            const randomLng = center.lng() + (Math.random() * 2 - 1) * radius;
    
            new google.maps.Marker({
                position: { lat: randomLat, lng: randomLng },
                map: map,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 4,
                    fillColor: 'yellow',
                    fillOpacity: 0.8,
                    strokeWeight: 0,
                }
            });
        }
    }
    function placeRecoveredDots(center, count) {
        const radius = 0.0003;  // Approx 30 meters, adjust as needed
        for (let i = 0; i < count; i++) {
            const randomLat = center.lat() + (Math.random() * 2 - 1) * radius;
            const randomLng = center.lng() + (Math.random() * 2 - 1) * radius;
    
            new google.maps.Marker({
                position: { lat: randomLat, lng: randomLng },
                map: map,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 4,
                    fillColor: 'blue',
                    fillOpacity: 0.8,
                    strokeWeight: 0,
                }
            });
        }
    }
    function placeInfectedDots(center, count) {
        const radius = 0.0003;  // Approx 30 meters, adjust as needed
        for (let i = 0; i < count; i++) {
            const randomLat = center.lat() + (Math.random() * 2 - 1) * radius;
            const randomLng = center.lng() + (Math.random() * 2 - 1) * radius;
    
            new google.maps.Marker({
                position: { lat: randomLat, lng: randomLng },
                map: map,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 4,
                    fillColor: 'red',
                    fillOpacity: 0.8,
                    strokeWeight: 0,
                }
            });
        }
    }


    let currentRectangle = null;

    function drawBoundingBox() {
        const verticalKm = parseFloat(document.getElementById("verticalDistance").value) || 0;
        const horizontalKm = parseFloat(document.getElementById("horizontalDistance").value) || 0;
    
        if (verticalKm === 0 || horizontalKm === 0) {
            alert("Please enter valid distances.");
            return;
        }
    
        // Remove existing rectangle if present
        if (currentRectangle) {
            currentRectangle.setMap(null);
        }
    
        // Conversion factors: 1 km ≈ 0.009 degrees latitude, 1 km ≈ 0.0113 degrees longitude
        const kmToLat = 0.009;
        const kmToLng = 0.0113;
    
        const currentCenter = map.getCenter();
        const latCenter = currentCenter.lat();
        const lngCenter = currentCenter.lng();
    
        // Calculate the rectangle bounds based on the distances in kilometers
        const northLat = latCenter + (verticalKm / 2) * kmToLat;
        const southLat = latCenter - (verticalKm / 2) * kmToLat;
        const eastLng = lngCenter + (horizontalKm / 2) * kmToLng;
        const westLng = lngCenter - (horizontalKm / 2) * kmToLng;
    
        // Define rectangle bounds
        const bounds = {
            north: northLat,
            south: southLat,
            east: eastLng,
            west: westLng
        };
    
        // Draw the rectangle on the map (non-editable and non-draggable)
        currentRectangle = new google.maps.Rectangle({
            bounds: bounds,
            editable: false,  // Prevent dragging/resizing
            draggable: false, // Prevent movement
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0,
            map: map
        });
    
        map.fitBounds(bounds);
        searchNearbyPlaces(bounds);

    }
    
    document.getElementById("toggleControls").addEventListener("click", function() {
        const controls = document.getElementById("controls");
        controls.classList.toggle("collapsed");
        
        // Toggle between '+' and '-' symbols
        this.textContent = controls.classList.contains("collapsed") ? '+' : '−';
    });
    
    function isControlsCollapsed() {
        const controls = document.getElementById("controls");
        return controls.classList.contains("collapsed");
    }

async function fetchSimulationData() {
    if (!isControlsCollapsed) {
        const controls = document.getElementById("controls");
        controls.classList.toggle("collapsed");
    }
    fetch('http://[::]:8000/tick', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.json())
    .then(data => {
        console.log('Simulation data:', data);
        updateSIRGraph(data);
    })
    .catch(error => console.error("Error running simulation:", error));
}

function initializeSIRGraph() {
    const ctx = document.getElementById('sirGraph').getContext('2d');
    window.sirChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Susceptible',
                    data: [],
                    borderColor: 'yellow',
                    fill: false
                },
                {
                    label: 'Infected',
                    data: [],
                    borderColor: 'red',
                    fill: false
                },
                {
                    label: 'Recovered',
                    data: [],
                    borderColor: 'blue',
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { title: { display: true, text: 'Time (hours)' } },
                y: { title: { display: true, text: 'People' } }
            }
        }
    });
}

function updateSIRGraph(data) {
    const time = data.time;
    let S = 0, I = 0, R = 0;

    data.building_counts.forEach(building => {
        S += building.S;
        I += building.I;
        R += building.R;
    });

    if (window.sirChart) {
        window.sirChart.data.labels.push(time);
        window.sirChart.data.datasets[0].data.push(S);
        window.sirChart.data.datasets[1].data.push(I);
        window.sirChart.data.datasets[2].data.push(R);
        window.sirChart.update();
    }
}

// Call fetchSimulationData every 5 seconds to update the graph
setInterval(fetchSimulationData, 5000);

// handler (user-input) functions (empty for now - to add backend updates)

function handleCityPopulation() {
    const cityPopulation = parseInt(document.getElementById("cityPopulation").value, 10);
    console.log("City Population:", cityPopulation);
}

function handleInfectionRate() {
    const infectionRate = parseFloat(document.getElementById("infectionRate").value);
    console.log("Infection Rate:", infectionRate);
}

function handleMaskMandate() {
    const maskMandate = document.getElementById("maskMandate").checked;
    console.log("Mask Mandate:", maskMandate);
}

function handleSchoolsClosed() {
    const schoolsClosed = document.getElementById("schoolsClosed").checked;
    console.log("Schools Closed:", schoolsClosed);
}

function handleWorkFromHome() {
    const workFromHome = document.getElementById("workFromHome").checked;
    console.log("Work From Home:", workFromHome);
}

function handleLockdown() {
    const lockdown = document.getElementById("lockdown").checked;
    console.log("Lockdown:", lockdown);
}

document.getElementById("cityPopulation").addEventListener("input", handleCityPopulation);
document.getElementById("infectionRate").addEventListener("input", handleInfectionRate);
document.getElementById("maskMandate").addEventListener("change", handleMaskMandate);
document.getElementById("schoolsClosed").addEventListener("change", handleSchoolsClosed);
document.getElementById("workFromHome").addEventListener("change", handleWorkFromHome);
document.getElementById("lockdown").addEventListener("change", handleLockdown);



// Load Google Maps API with Places and Geometry libraries
const script = document.createElement('script');
script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY }&libraries=places,geometry&loading=async&callback=initMap`;
script.async = true;
document.head.appendChild(script);