// Define the URL for the earthquake data
var queryURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Create a map instance
var myMap = L.map("map", {
  center: [0, 0],
  zoom: 3,
});

// Add a tile layer to the map
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
}).addTo(myMap);

// Fetch earthquake data from the USGS GeoJSON API using D3
d3.json(queryURL).then(function (data) {
  // Access the features array within the fetched data
  var features = data.features;

  // Define a function to map depth to color
  function getColor(depth) {
    return depth > 70
      ? "#d73027"
      : depth > 50
      ? "#fc8d59"
      : depth > 30
      ? "#fee08b"
      : depth > 10
      ? "#d9ef8b"
      : "#1a9850";
  }

  // Iterate over each earthquake feature and create a marker
  features.forEach(function (feature) {
    var coordinates = feature.geometry.coordinates;
    var magnitude = feature.properties.mag;
    var depth = coordinates[2];

    // Create a circle marker for each earthquake
    var marker = L.circleMarker([coordinates[1], coordinates[0]], {
      radius: magnitude * 3, // Adjust the scaling factor as needed
      fillColor: getColor(depth),
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8,
    })
      .bindPopup(
        `<b>Earthquake Information:</b><br>
        <b>Magnitude:</b> ${magnitude}<br>
        <b>Location:</b> ${feature.properties.place}<br>
        <b>Depth:</b> ${depth}`
      )
      .addTo(myMap);
  });

  // Create a legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function () {
    var div = L.DomUtil.create("div", "legend");
    var depths = [0, 10, 30, 50, 70];
    var labels = [];

    // Add legend labels
    for (var i = 0; i < depths.length; i++) {
      div.innerHTML +=
        '<i style="background:' +
        getColor(depths[i] + 1) +
        '"></i> ' +
        depths[i] +
        (depths[i + 1] ? "&ndash;" + depths[i + 1] + "<br>" : "+");
    }
    return div;
  };
  legend.addTo(myMap);
});
