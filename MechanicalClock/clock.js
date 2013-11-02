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
		this.tickTimer = null;
	}
	TickGenerator.I_YEAR = 0;
	TickGenerator.I_MONTH = 1; 
	TickGenerator.I_DATE = 2; 
	TickGenerator.I_DAY = 3; 
	TickGenerator.I_HOUR = 4;
	TickGenerator.I_MINUTE = 5;
	TickGenerator.I_SECOND = 6;
	TickGenerator.I_MILLI = 7;
	TickGenerator.I_INST = 8;
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
		if(this.tickTimer) {
			return;
		}
		var self = this;
		self.tickTimer = {timer:null};
		function tick(date) {
			date = date || new Date();
			self.tick(date);
			self.setNextTickTimeout(date, tick);
		}
		tick(new Date());
	};
	TickGenerator.prototype.stop = function() {
		if(this.tickTimer) {
			clearTimeout(this.tickTimer.timer);
			this.tickTimer = null;
		}
	};
	TickGenerator.prototype.setNextTickTimeout = function(date, handler) {
		if(!date || !this.tickTimer) {
			return;
		}
		var current = new Date(date);
		var next = this.getCurrentTickTime(date,1);
		var diff = next[TickGenerator.I_INST].getTime() - current.getTime(); //difference in milliseconds.
		this.tickTimer.timer = setTimeout(handler, diff);
	};
	TickGenerator.prototype.addTickHandler = function(handler) {
		this.tickHandlers.add(handler);
	};
	TickGenerator.prototype.removeTickHandler = function(handler) {
		this.tickHandlers.remove(handler);
	};
	TickGenerator.prototype.getCurrentTickTime = function(date, phase) {
		date = date ? new Date(date) : new Date();
		date.setMilliseconds(date.getMilliseconds() +
			(typeof phase === "number" ? (1000*(phase/this.jumpsPerSecond)) : 0));
		//TODO round milliseconds according to jumpsPerSecond
		for(var i=0; i<(this.jumpsPerSecond); i++) {
			var a = 1000*(i/this.jumpsPerSecond);
			var b = 1000*((i+1)/this.jumpsPerSecond);
			var m = date.getMilliseconds();
			if(a <= m && m <= b) {
				date.setMilliseconds(Math.abs(a-m) < Math.abs(b-m) ? a : b);
			}
		}
		var t = [];
		t[ TickGenerator.I_YEAR  ] = date.getFullYear();
		t[ TickGenerator.I_MONTH ] = date.getMonth() + 1;
		t[ TickGenerator.I_DATE  ] = date.getDate();
		t[ TickGenerator.I_DAY   ] = date.getDay();//0 sunday
		t[ TickGenerator.I_HOUR  ] = date.getHours();
		t[ TickGenerator.I_MINUTE] = date.getMinutes();
		t[ TickGenerator.I_SECOND] = date.getSeconds();
		t[ TickGenerator.I_MILLI ] = date.getMilliseconds();
		t[ TickGenerator.I_INST  ] = date;
		return t;
	};
	TickGenerator.prototype.tick = function(date) {
		//TODO Role of tick handlers?
		this.tickHandlers.fire.apply(this.tickHandlers, this.getCurrentTickTime(date));
	};
	window.TickGenerator = TickGenerator;
})(jQuery);