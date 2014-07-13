/**
 * Gloabal things :)
 */
var graphite = {};
var notifications = [];
var buttonCallbacks = [];
/**
 * Storage namespace
 */
var storage = {};
storage.get = function() {
	graphite = localStorage['ngStorage-graphite'];
	notifications = localStorage['ngStorage-notifications'];
	graphite = (graphite) ? JSON.parse(graphite) : {};
	notifications = (notifications) ? JSON.parse(notifications) : [];
};

/**
 * Message namespace
 */
var message = {};
message.guid = function() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	}

	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
};
message.change = function(notification, id, values) {
	try {
		var uid = message.guid();
		var opt = {
			type : (notification.chart === 'true') ? 'image' : 'basic',
			title : notification.title,
			message : 'Current count: ' + values.current,
			contextMessage : 'Last count: ' + values.last,
			priority : notification.priority,
			iconUrl : 'icons/' + notification.color + '_exclamation_circle.png',
		};
		if (notification.chart === 'true') {
			opt.imageUrl = graphiteTools.chart(graphite.url, notification.metric, notification.chartInterval);
		}
		if (notification.button === 'true') {
			opt.buttons = [{
				title : notification.buttonName
			}];
			buttonCallbacks[uid] = notification.buttonUrl;
		}
		chrome.notifications.create(uid, opt, function() {

		});
	} catch(e) {
		console.error(e);
		message.error(notification, e);
		throw e;
	}
};
message.check = function(notification, id) {
	try {
		var uid = message.guid();

		var opt = {
			type : 'image',
			title : notification.title,
			message : notification.metric,
			priority : notification.priority,
			contextMessage : '',
			iconUrl : 'icons/' + notification.color + '_exclamation_circle.png',
		};
		if (notification.chart === 'true') {
			opt.imageUrl = graphiteTools.chart(graphite.url, notification.metric, notification.chartInterval);
		}
		if (notification.button === 'true') {
			opt.buttons = [{
				title : notification.buttonName
			}];
			buttonCallbacks[uid] = notification.buttonUrl;

		}
		chrome.notifications.create(uid, opt, function() {
		});

	} catch(e) {
		console.error(e);
		message.error(notification, e);
		throw e;
	}
};
message.error = function(notification, error) {
	try {
		chrome.notifications.create('notification_error', {
			type : "basic",
			title : 'ERROR: ' + notification.title,
			message : '' + (error) ? error : '',
			contextMessage : 'Check Graphite Notifications options',
			iconUrl : "icons/red_exclamation_circle.png",
		}, function() {
		});
	} catch(e) {
		console.error(e);
		chrome.notifications.create('fatal_error', {
			type : "basic",
			title : "Notification error...",
			message : "Check Graphite Notifications options",
			contextMessage : "" + e,
			iconUrl : "icons/red_exclamation_circle.png",
		}, function() {
		});
	}
};

/**
 * Init
 */
if (window) {
	window.addEventListener('load', function() {
		storage.get();
		//TODO: stupid but should work... why the f@#*k will somene do this thing with listeners...
		chrome.notifications.onButtonClicked.addListener(function(id, index) {
			if (id && buttonCallbacks[id]) {
				window.open(buttonCallbacks[id], '_blank');
			}
		});

		//TODO: cleanup callback hell :(
		var processNotifications = function() {
			var findIncrease = function(last, current) {
				var increase = ((current - last) / last * 100);
				return (isNaN(increase)) ? 0 : increase;
			};
			buttonCallbacks = [];
			for (var i = 0, l = notifications.length; i < l; i++) {
				var notification = notifications[i];
				//console.log(notification, graphite, graphite.enabled);
				//console.log(new Date().getTime(), notification.nextRun, notification.interval);

				if (graphite && graphite.enabled && notification && notification.enabled && (!notification.nextRun || notification.nextRun <= (new Date).getTime())) {
					notification.nextRun = timer.addMinutes(notification.interval);
					//change notification
					if (notification.type === "change") {
						var id = i;
						var url = graphiteTools.json(graphite.url, notification.metric, notification.aggregation, notification.interval);

						graphiteTools.getValues(url, i, notification, function(err, values, id, notification) {
							try {
								if (err) {
									throw 'Error getting json from graphite...';
								}
								var increase = findIncrease(values.last, values.current);
								//console.log(increase, notification.treshold, notification.change);
								if (Math.abs(increase) > notification.treshold) {
									if (notification.chnage == 'increase' && increase > 0) {
										message.change(notification, i, values);
									} else if (notification.chnage == 'decrease' && increase < 0) {
										message.change(notification, i, values);
									} else {
										message.change(notification, i, values);
									}
								}
							} catch(e) {
								console.error(e);
							}
						});
						notification.nextRun = timer.addMinutes(notification.interval);
					}
					//check notification
					if (notification.type === "check") {
						try {
							message.check(notification, i);
						} catch(e) {
							console.error(e);
						}
						if (notification.periodicInterval > 0) {
							notification.nextRun = timer.addMinutes(notification.periodicInterval);
						} else if (notification.periodicInterval == -15) {
							notification.nextRun = timer.nearest15m();
						} else if (notification.periodicInterval == -30) {
							notification.nextRun = timer.nearest30m();
						} else if (notification.periodicInterval == -60) {
							notification.nextRun = timer.nearestHour();
						}
					}
				}
			}

		};

		timer.tick(function() {
			processNotifications();
		});
		processNotifications();
		//message.init();
		//message.error();
	});
}

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	storage.get();
});
