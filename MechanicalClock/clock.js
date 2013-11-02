(function($){
	var I_YEAR = 0, I_MONTH = 1, I_DATE = 2, I_DAY = 3, 
	    I_HOUR = 4, I_MINUTE = 5, I_SECOND = 6, I_MILLI = 7;
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
	function TickGenerator(interval) {
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
	TickGenerator.prototype.setInterval = function(interval) {
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
	TickGenerator.prototype.start = function() {

	};
	TickGenerator.prototype.stop = function() {

	};
	TickGenerator.prototype.addTickHandler = function(handler) {
		this.tickHandlers.add(handler);
	};
	TickGenerator.prototype.removeTickHandler = function(handler) {
		this.tickHandlers.remove(handler);
	};
	TickGenerator.prototype.getCurrentTickTime = function(phase) {
		var date = new Date();
		date.setMilliseconds(date.getMilliseconds() +
			(typeof phase === "number" ? (1000*(phase/this.jumpsPerSecond)) : 0));
		//TODO round milliseconds according to jumpsPerSecond
		for(var i=0; i<(this.jumpsPerSecond); i++) {
			var a = 1000*(i/this.jumpsPerSecond);
			var b = 1000*((i+1)/this.jumpsPerSecond);
			var m = date.getMilliseconds();//t[I_MILLI]
			if(a <= m && m <= b) {
				date.setMilliseconds(Math.abs(a-m) > Math.abs(b-m) ? b : a);
				//t[I_MILLI] = Math.abs(a-m) > Math.abs(b-m) ? b : a;
				//t[I_SECOND] += (i===this.jumpsPerSecond-1) && Math.abs(a-m) > Math.abs(b-m) ? 1 : 0;
			}
		}
		var t = [];
		t[ I_YEAR  ] = date.getFullYear();
		t[ I_MONTH ] = date.getMonth() + 1;
		t[ I_DATE  ] = date.getDate();
		t[ I_DAY   ] = date.getDay();//0 sunday
		t[ I_HOUR  ] = date.getHours();
		t[ I_MINUTE] = date.getMinutes();
		t[ I_SECOND] = date.getSeconds();
		t[ I_MILLI ] = date.getMilliseconds();
		return t;
	};
	TickGenerator.prototype._tick = function() {
		//TODO Role of tick handlers?
		this.tickHandlers.fire.apply(this.tickHandlers, this.getCurrentTickTime());
	};
	window.TickGenerator = TickGenerator;
})(jQuery);