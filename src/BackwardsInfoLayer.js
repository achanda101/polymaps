po.backwardsInfo = function(fetch) {
  var backwardsInfo = po.layer(load, unload),
      container = backwardsInfo.container(),
      url;


	function toLoc(coord) {
		var z = 20,
			size = Math.pow(2, z),
			x = coord[0] + Math.floor(size/2); // column
			y = size - (Math.floor(size/2) + coord[1]); // row
		var loc = po.map.coordinateLocation({zoom:z, column:x, row:y});
		return [loc.lat, loc.lon];
	}

	function load(tile, proj) {
		if (tile.column < 0 || tile.column >= (1 << tile.zoom)) {
			tile.element = po.svg("g");
			return; // no wrap
		}
		var element = tile.element = po.svg("g"),
			size = backwardsInfo.map().tileSize();
		element.setAttribute("width", size.x);
		element.setAttribute("height", size.y);


function makePath(o, proj) {
	var x = po.svg("path"),
	d = [],
	ci = o.coordinates,
	cj, // ci[i]
	i = -1,
	j,
	n = ci.length,
	m;
	while (++i < n) {
	cj = ci[i];
	j = -1;
	m = cj.length - 1;
	d.push("M");
	while (++j < m) d.push((p = proj(toLoc(cj[j]))).x, ",", p.y, "L");
	d[d.length - 1] = "Z";
	}
	if (!d.length) return;
	x.setAttribute("d", d.join(""));
	return x;
}

		function update(data) {
		var updated = [];
		switch (data.type) {
        case "FeatureCollection": {
          for (var i = 0; i < data.features.length; i++) {
            var feature = data.features[i],
                element = makePath(feature.geometry, proj);
            if (element) updated.push({element: g.appendChild(element), data: feature});
          }
          break;
        }
        case "Feature": {
          var element = geometry(data.geometry, proj);
          if (element) updated.push({element: g.appendChild(element), data: data});
          break;
        }
        default: {
          var element = geometry(data, proj);
          if (element) updated.push({element: g.appendChild(element), data: {type: "Feature", geometry: data}});
          break;
        }
      }
		console.log(updated);
		}

		if (typeof url == "function") {
			var tileUrl = url(tile);
			console.log(tileUrl);
			if (tileUrl != null) {
				tile.request = po.queue.json(tileUrl.toString(), reqCallback);
				function reqCallback(err, data) {
					if (err) {
						if (tileUrl.version > 0) {
							tile.request = po.queue.json(url(tile, {}).toString(), reqCallback);
						}
						return;
					}
					update(data);
					delete tile.request;
					tile.ready = true;
					backwardsInfo.dispatch({type: "load", tile: tile});
				}
			} else {
				tile.ready = true;
				backwardsInfo.dispatch({type: "load", tile: tile});
			}
		} else {
			tile.ready = true;
			backwardsInfo.dispatch({type: "load", tile: tile});
		}
	}

	function unload(tile) {
		if (tile.request) tile.request.abort(true);
	}
	backwardsInfo.url = function(x) {
		if (!arguments.length) return url;
		url = typeof x == "string" && /{.}/.test(x) ? po.url(x) : x;
		return backwardsInfo.reload();
	};
	return backwardsInfo;
};
