$(function() {
	//Sample
	var ticker = new TickGenerator();
	ticker.addTickHandler(function() {
		var args = $.makeArray(arguments).slice(0,TickGenerator.I_MILLI+1);
		$('#time').text(args.join(' , '));
	});
	ticker.start();
	$('#active').prop('checked',true).change(function() {
		if(this.checked) {
			ticker.start();
		} else {
			ticker.stop();
		}
	});
	$('#rate').change(function() {
		ticker.setInterval($(this).find('option:selected').val());
	});
});