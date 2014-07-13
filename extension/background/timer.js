/**
 * Timer & interval helpers
 */
var timer = (function() {
	var timeouts = {};
	var intervals = {};
	var tickId = false;

	/**
	 * setInterval wrapper
	 * @param {Object} cb
	 * @param {Object} time
	 */
	var interval = function(cb, time) {
		var t = setInterval(cb, time);
		intervals[t] = t;
		return t;
	};
	/**
	 * setTimeout wrapper
	 * @param {Object} cb
	 * @param {Object} time
	 */
	var timeout = function(cb, time) {
		var t = setTimeout(cb, time);
		timeouts[t] = t;
		return t;
	};
	/**
	 * Minute "tick"
	 * Callback is called every minute
	 * @param {Object} cb
	 * @param {Object} time
	 */
	var tick = function(cb) {
		var tickId = setInterval(cb, 20 * 1000);
		//var tickId = setInterval(cb, 60 * 1000);
		return tickId;
	};

	/**
	 * Reset timeout/interval/tick
	 * @param {Object} id
	 */
	var reset = function(id) {
		if (id) {
			if (tickId === id) {
				clearInterval(id);
				tickId = false;
			}
			if (intervals[id]) {
				clearInterval(id);
				delete intervals[id];
			}
			if (timeouts[id]) {
				clearTimeout(id);
				delete timeouts[id];
			}
		} else {
			clearInterval(tickId);
			for (var i = 0, l = timeouts.length; i < l; i++) {
				clearTimeout(timeouts[i]);
			}
			for (var i = 0, l = intervals.length; i < l; i++) {
				clearInterval(intervals[i]);
			}
			tickId = false;
			timeouts = intervals = {};

		}
	};

	var addMinutes = function(minutes) {
		minutes = (minutes) ? minutes : 0;
		return (new Date()).getTime() + (minutes * 60 * 1000);
	};

	/**
	 * Get nearest hour timestamp
	 */
	var nearestHour = function() {
		var actualHour = new Date();
		var nextHour = (new Date()).setHours(actualHour.getHours() + 1, 0, 0, 0);
		return nextHour;
	};
	/**
	 * Get nearest 30m timestamp
	 */
	var nearest30m = function() {
		var actualHour = new Date();
		var minutes = Math.ceil(((new Date()).getMinutes() / 30)) * 30;
		var next30m = (actualHour).setHours(actualHour.getHours(), minutes, 0, 0);
		return next30m;

	};
	/**
	 * Get nearest 15m timestamp
	 */
	var nearest15m = function() {
		var actualHour = new Date();
		var minutes = Math.ceil(((new Date()).getMinutes() / 15)) * 15;
		var next15m = (actualHour).setHours(actualHour.getHours(), minutes, 0, 0);
		return next15m;
	};

	/**
	 * Public methods
	 */
	return {
		tick : tick,
		timeout : timeout,
		interval : interval,
		addMinutes : addMinutes,
		nearestHour : nearestHour,
		nearest30m : nearest30m,
		nearest15m : nearest15m
	};
})();

