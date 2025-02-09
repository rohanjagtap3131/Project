mapboxgl.accessToken =mapToken;

const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v9',
        projection: 'globe', // Display the map as a globe, since satellite-v9 defaults to Mercator
        center: coordinates,
        zoom: 10,
    });

// console.log(coordinates)

const marker =new mapboxgl.Marker({color:"red"})
.setLngLat(coordinates)
.setPopup( 
    new mapboxgl.Popup({offset:25})
.setHTML("<p>Exact Location wil be provided after booking</p>")
.setMaxWidth("300px")
)
.addTo(map)

