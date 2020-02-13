//
//Creating mapconsole var for div"map"
//
var map = L.map('map', {
	center: [58.7852,25.8288],
	zoom: 7
});
//
//adding WMS Layer
//
var geodata = L.tileLayer.wms('http://localhost:8080/geoserver/Eesti/wms', {
  layers: '	Eesti:EstPolygons',
  format: 'image/png',
  transparent: true
}).addTo(map);
//
//adding base maps 
//


var defmap= L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
        '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    id: 'mapbox/light-v9'
}).addTo(map);

var Stamen_Watercolor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
	attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	subdomains: 'abcd',
	minZoom: 1,
	maxZoom: 16,
	ext: 'jpg'
});

var toner = L.tileLayer('http://tile.stamen.com/toner/{z}/{x}/{y}.png', {attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>' });

var Esri_WorldImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    });


var OpenStreetMap_France = L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
        maxZoom: 20,
        attribution: '&copy; Openstreetmap France | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

// for using the base maps in the layer control, I defined a baseMaps variable
// the text on the left is the label shown in the layer control; the text right is the variable name
var baseMaps = {
    "Default WMS":geodata,
    "Default BaseMap":defmap,
	"Stamen": Stamen_Watercolor,
	"Toner": toner,
    "ESRI":Esri_WorldImagery,
    "OpenTopoMap": OpenStreetMap_France
	}
//
//---- Part 2: Adding a scale bar
//
var scale = L.control.scale({ maxWidth:100, imperial:false, position: 'bottomright' 

}).addTo(map);
//
//---- Part 3: Adding symbols ---- 
//

//Marker Version 1
var mark1 =L.marker([47, 14], {title:'marker1', clickable:true}).addTo(map).bindPopup("popup of marker 1");

	
//Marker Version 2
var mark = L.marker([47, 12], {title:'marker2', clickable:true}).addTo(map);
mark.bindPopup("this is my popup of marker 2");


//Marker Version 3	- using a specific symbol
var myIcon = L.icon({
iconUrl: 'css/images/house.png',
iconSize: [38, 38]
});

L.marker([48, 13], {icon: myIcon, title:'theHouse'}).addTo(map);

//
//---- Adding GeoJSON point features - to marker object
//



//adding a GeoJSON polygon feature set for tartu districts
var myStyle = {
    "color": "#ff7800",
    "weight": 2,
    "opacity": 0.80
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

var dist = L.geoJson(districts, {
    style: myStyle,
    onEachFeature: function (feature, layer) {
       layer.on({click: zoomToFeature}); }
});

//
//adding a GeoJSON polygon feature set for tartu counties and styling based on attributes
//
// function to get color based on attributes
	function getColor(p) {
		return p > 150000 ? '#800026' :
				p > 100000  ? '#BD0026' :
				p > 80000  ? '#E31A1C' :
				p > 50000  ? '#FC4E2A' :
				p > 35000   ? '#FD8D3C' :
				p > 30000   ? '#FEB24C' :
				p > 10000   ? '#FED976' :
							'#FFEDA0';
	}
//style function as copied from leaflet tutorial
	function style(feature) {
		return {
			weight: 2,
			opacity: 1,
			color: 'white',
			dashArray: '3',
			fillOpacity: 0.7,
			fillColor: getColor(feature.properties.pop)
		};
	}
//calling the json file
    var county = L.geoJson(counties, {
        style: style,
        }).addTo(map);

//adding the legend

        var legend = L.control({position: 'bottomright'});
        legend.onAdd = function (map) {
    
            var div = L.DomUtil.create('div', 'info legend'),
                grades = [0, 10000, 30000, 35000, 50000, 80000, 100000, 150000],
                labels = [],
                from, to;
    
            for (var i = 0; i < grades.length; i++) {
                from = grades[i];
                to = grades[i + 1];
    
                labels.push(
                    '<i style="background:' + getColor(from + 1) + '"></i> ' +
                    from + (to ? '&ndash;' + to : '+'));
            }
    
            div.innerHTML = labels.join('<br>');
            return div;
        };
        legend.addTo(map);

    // function highlightFeature(e) {
	// 	var layer = e.target;

	// 	layer.setStyle({
	// 		weight: 5,
	// 		color: '#666',
	// 		dashArray: '',
	// 		fillOpacity: 0.7
	// 	});

	// 	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
	// 		layer.bringToFront();
	// 	}

	// 	info.update(layer.feature.properties);
    // }
    
	// var county;
	// function resetHighlight(e) {
	// 	county.resetStyle(e.target);
	// 	info.update();
	// }
	// function zoomToFeature(e) {
	// 	map.fitBounds(e.target.getBounds());
	// }

	// function onEachFeature(feature, layer) {
	// 	layer.on({
	// 		mouseover: highlightFeature,
	// 		mouseout: resetHighlight,
	// 		click: zoomToFeature
	// 	});
	// }
 
    // county = L.geoJson(counties, {
    // style: style,
	// onEachFeature: onEachFeature
	// }).addTo(map);



//the variable features lists layers that I want to control with the layer control
var features = {
    "Estonia Districts": dist,
    "Estonia Counties": county
}

//the legend uses the layer control with entries for the base maps and two of the layers we added
//in case either base maps or features are not used in the layer control, the respective element in the properties is null

var legend2 = L.control.layers(baseMaps,features, {position:'bottomleft', collapsed:true}).addTo(map);