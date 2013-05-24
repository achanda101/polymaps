po.backwardsURL = function(template, versions) {
	var hosts = [],
		repeat = true;

	function _url(str, version){
		this.str = str;
		this.version = version;
	}
	_url.prototype.toString = function () {
		return this.str;
	};

	function format(c, ver) {
		var max = c.zoom < 0 ? 1 : 1 << c.zoom,
				column = c.column;
		if (repeat) {
			column = c.column % max;
			if (column < 0) column += max;
		} else if ((column < 0) || (column >= max)) {
			return null;
		}
		var version = 0;
		var str = template.replace(/\{(.)\}/g, function(s, v) {
			var size = Math.pow(2, c.zoom);
			var z = 20 - c.zoom,
				x = column - Math.floor(size/2),
				y = size - (c.row + Math.floor(size/2) + 1);
			version = ver !== undefined ? ver : versions[z+'.'+x+'.'+y] || 0;
			switch (v) {
				case "S": return hosts[(Math.abs(c.zoom) + c.row + column) % hosts.length];
				case "Z": return z;
				case "X": return x;
				case "Y": return y;
				case "V": return version;
				case "B": {
					var nw = po.map.coordinateLocation({row: c.row, column: column, zoom: c.zoom}),
							se = po.map.coordinateLocation({row: c.row + 1, column: column + 1, zoom: c.zoom}),
							pn = Math.ceil(Math.log(c.zoom) / Math.LN2);
					return se.lat.toFixed(pn)
							+ "," + nw.lon.toFixed(pn)
							+ "," + nw.lat.toFixed(pn)
							+ "," + se.lon.toFixed(pn);
				}
			}
			return v;
		});

		return new _url(str, version);
	}

	format.template = function(x) {
		if (!arguments.length) return template;
		template = x;
		return format;
	};

	format.hosts = function(x) {
		if (!arguments.length) return hosts;
		hosts = x;
		return format;
	};

	format.repeat = function(x) {
		if (!arguments.length) return repeat;
		repeat = x;
		return format;
	};

	return format;
};
