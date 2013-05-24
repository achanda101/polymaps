var po = org.polymaps;

var tileSize = 50;
var versions = null;
var tilePath = '';
var div = document.getElementById("map"),
	svg = div.appendChild(po.svg("svg")),
	g = svg.appendChild(po.svg("g"));
	
var map = po.map()
	.container(g)
	.tileSize({x: tileSize, y: tileSize})
	.add(po.interact());
var defaultParser = po.hash().parser();

// start at zoom 3
map.zoom(18)
	.center(map.coordinateLocation({row:Math.pow(2,18)/2-0.5,column:Math.pow(2,18)/2+0.5, zoom:18}))

// todo: figure out why we can't link to zoom:0
map.add(po.hash().parser(function(map, s) {
		var zxy = s.split('/');
		var z = 21 - parseFloat(zxy[0]),
			size = Math.pow(2, z),
			x = parseFloat(zxy[1]) + Math.floor(size/2) + 0.5; // column
			y = size - (Math.floor(size/2) + 0.5 + parseFloat(zxy[2])); // row
		l = map.coordinateLocation({row:y, column:x, zoom:z});
		return defaultParser(map, [z,l.lat,l.lon].join('/'));
	}).formatter(function(map) {
		var z = Math.round(map.zoom());
			coord = map.locationCoordinate(map.center()),
			size = Math.pow(2, z),
			x = coord.column - Math.floor(size/2) - 0.5,
			y = size - (coord.row + Math.floor(size/2) + 0.5);
		z = Math.round((21 - z)*1000)/1000;
		x = Math.round(x*1000)/1000;
		y = Math.round(y*1000)/1000;
		return '#'+z+'/'+x+'/'+y;
	}));
function clamp(c, a, b) {
	return (c < a ? a : c > b ? b : c);
};
versions = versions || {};
map.add(po.backwardsImage()
	.url(po.backwardsURL(tilePath+"{Z}.{X}.{Y}.{V}.png", versions))
	.zoom(function(z) { return clamp(z, 10, 20); }));
	
map.add(po.backwardsInfo()
	.url(po.backwardsURL("http://localhost:3000/json/drawings/{Z}/{X}/{Y}", versions))
	.zoom(function(z) { return clamp(z, 17, 20); })
	.on("load", load));


function load(e) {
	if (e.features.length > 0)console.log(e.features);
	for (var i = 0; i < e.features.length; i++) {
		var feature = e.features[i];
		console.log(feature.data.properties);
		feature.element.style.fill = 'hsl(0,100%,50%)';
		feature.element.onmouseover = function () {
			console.log(feature.data.id, feature.data.geometry.coordinates);
			this.style.fill = 'hsl(100,100%,50%)';
		};
		feature.element.onmouseout = function () {
			this.style.fill = 'hsl(0,100%,50%)';
		};
	}
}

map.zoomRange([9,21]);
