(function($){
	var units = [{name:"vps",op:"divide",by:1},
			 {name:"bps",op:"divide",by:1},
			 {name:"vpm",op:"divide",by:60},
			 {name:"bpm",op:"divide",by:60},
			 {name:"vph",op:"divide",by:60*60},
			 {name:"bph",op:"divide",by:60*60},
			 {name:"hz",op:"multiply",by:2}];
	$.each(units, function(idx, unit) {
		if(unit.op === "divide") {
			unit.multiplyFactor = 1/unit.by;
		} else if(unit.op === "multiply") {
			unit.multiplyFactor = unit.by;
		}
	});
	function MechanicalClock(interval) {
		//default : second hand tick occurs 1 time per sec.
		//If 3Hz, or 3*2*3600=21600vPh(vibration per hour) is to be simulated,
		//tickInterval value should be calcuated to a value 1000/(3*2), which means
		//6 jumps per second.
		//for 4Hz, or 4*2*3600=28,800vPh, 1000/(4*2) = 125ms. 8 jumps per second.
		//for 2.5Hz, or 2.5*2*3600=18,800vPh, 1000/(2.5*2) = 200ms. 5 jumps per second.
		//480vpm or bpm -> 480/60=8 jumps per second
		this.jumpsPerSecond = 1;
		this.interval = "1vps";
		if(interval !== undefined && interval !== null) {
			this.setInterval(interval);
		}
		this.tickHandlers = $.Callbacks();
	}
	MechanicalClock.prototype.setInterval = function(interval) {
		var self = this;
		if(interval === undefined || interval === null) {
			interval = this.interval;
		}
		if(typeof interval === "number") {
			interval = (interval + "vps");
		}
		$.each(units, function(idx,unit) {
			if(interval.toLowerCase().indexOf(unit.name.toLowerCase())>=0) {
				var value = Number(interval.toLowerCase().split(unit.name.toLowerCase())[0])
					* unit.multiplyFactor;
				if(!isNaN(value)) {
					self.jumpsPerSecond = value|0;//integer only.
					self.interval = interval;
					return false;
				}
			}
		});
	};
	MechanicalClock.prototype.start = function() {

	};
	MechanicalClock.prototype.stop = function() {

	};
	MechanicalClock.prototype.addTickHandler = function(handler) {
		this.tickHandlers.add(handler);
	};
	MechanicalClock.prototype.removeTickHandler = function(handler) {
		this.tickHandlers.remove(handler);
	};
	MechanicalClock.prototype._tick = function() {
		//TODO Role of tick handlers?
		this.tickHandlers.fire();
	};
	window.MechanicalClock = MechanicalClock;
})(jQuery);