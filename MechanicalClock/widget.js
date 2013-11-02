$(function() {
	var interval = null;
	if(window.widget) {
		interval = widget.preferenceForKey('interval');
	}
	var ticker = new TickGenerator(interval);
	window.ticker = ticker;
	var hourhand = $('#hourhand');
	var minhand = $('#minutehand');
	var sechand = $('#secondhand');
	ticker.addTickHandler(function() {
		var args = $.makeArray(arguments).slice(0,TickGenerator.I_MILLI+1);
        var s = args[TickGenerator.I_SECOND] * 1000 + args[TickGenerator.I_MILLI];
		var m = args[TickGenerator.I_MINUTE] * 60 * 1000 + s;
        var h = (args[TickGenerator.I_HOUR]%12) * 3600 * 1000 + m
        hourhand.attr('transform', 'rotate('+(h*30/(3600*1000))+',50,50)');
        minhand.attr('transform',  'rotate('+(m*6/(60*1000))   +',50,50)');
        sechand.attr('transform',  'rotate('+(s*6/(1000))      +',50,50)');
	});
	$('#rate').change(function() {
		var value = $(this).find('option:selected').val();
		if(window.widget) {
			widget.setPreferenceForKey('interval', value);
		}
		ticker.setInterval(value);
	});
	function changeInterval(value) {
		if(!value) return;
		$('#rate').find('[value="'+interval+'"]').prop('selected',true);
		ticker.setInterval(value);
	}
	ticker.start();
	function showPrefs() {
		if(window.widget) {
			widget.prepareForTransition('ToBack');
			var intv = widget.preferenceForKey('interval');
			changeInterval(intv);
		}
		$('.widget.front').removeClass('active');
		$('.widget.back').addClass('active');
		if (window.widget) {
	        setTimeout ('widget.performTransition();', 0);
	    }
	}
	function hidePrefs() {
		if(window.widget) {
			widget.prepareForTransition('ToFront');
		}
		$('.widget.front').addClass('active');
		$('.widget.back').removeClass('active');
		if (window.widget) {
	        setTimeout ('widget.performTransition();', 0);
	    }
	}
	$('#infobutton').hover(function(){$(this).animate({'opacity':1});}, 
						   function(){$(this).animate({'opacity':0});} )
		.css('opacity',0)
		.click(function() {
			if(!$(this).is(':visible')) {
				return;
			}
			showPrefs();
		});
	$('#backbutton').click(hidePrefs);
	if(window.widget) {
		window.widget.onshow = function() {
			ticker.tick();
			ticker.start();
		};
		window.widget.onhide = function() {
			ticker.stop();
		};
	}
});