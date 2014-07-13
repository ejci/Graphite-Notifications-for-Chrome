/**
 * Helper to create URL for graphite requests...
 */
var graphiteTools = (function() {
	var path = false;
	var target = '';
	//TODO: I should change it to configurable object...
	var options = [];
	options.push('bgcolor=ffffff');
	options.push('fgcolor=333333');
	options.push('width=720');
	options.push('height=480');
	options.push('margin=20');
	options.push('margin=20');
	options.push('lineWidth=4');
	options.push('hideLegend=true');
	options.push('hideGrid=true');
	options.push('fontSize=16');
	options.push('hideLegend=true');
	options.push('colorList=003580,155EA8,CF812D,3E4853,2C5520,9D2124,A44C20,003580,0896FF,FEBA02,7C90A6,55AF32,E52923,EF6C0A');
	options.push('minorY=1');
	options.push('lineMode=connected');
	/**
	 * Change interval minutes to Xm or Xh string
	 * @param {Object} interval
	 */
	var intervalString = function(interval) {
		interval = (parseInt(interval, 10) > 0) ? interval : 1;
		return (interval < 60) ? interval + 'min' : Math.floor(interval / 60) + 'h';
	};

	/**
	 * Get graphite url for chart
	 * @param {Object} path
	 * @param {Object} metric
	 * @param {Object} func
	 * @param {Object} from
	 */
	var chart = function(path, metric, from) {
		//copy original options
		var opt = options.slice(0);
		opt.push('target=' + metric + '');
		opt.push('from=-' + intervalString(from));
		var url = path + 'render?';
		return url + (opt.join('&'));
	};
	/**
	 * Get graphite chart for JSON
	 * @param {Object} path
	 * @param {Object} target
	 * @param {Object} func
	 * @param {Object} interval
	 */
	var json = function(path, metric, func, interval) {
		var opt = [];
		interval = (parseInt(interval, 10) > 0) ? interval : 10;
		opt.push('target=transformNull(summarize(' + metric + ',"' + intervalString(interval) + '","' + func + '",true))');
		opt.push('format=json');
		opt.push('from=-' + intervalString(2 * interval));
		var url = path + 'render?';
		return url + (opt.join('&'));
	};
	/**
	 * Get values from graphite (json)
	 * @param {Object} notification
	 * @param {Object} id
	 * @param {Object} cb
	 */
	var getValues = function(url, id, notification, cb) {
		//console.log(url);
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function(response) {
			//console.log(response);
			if (xhr.readyState === 4) {
				var data = {
					current : -1,
					last : -1
				};
				try {
					var json = JSON.parse(response.target.responseText);
					data.last = json[0].datapoints[0][0];
					data.current = json[0].datapoints[1][0];
					cb(false, data, id, notification);
				} catch(e) {
					cb(true, null, id, notification);
				}
			}
		};
		// Implemented elsewhere.
		xhr.open("GET", url, true);
		xhr.send();
	};
	return {
		chart : chart,
		json : json,
		getValues : getValues
	};
})();
