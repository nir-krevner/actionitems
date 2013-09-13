$(document).ready(function(){
	$('.cls').click(function(){

		$.ajax({
			url: 'http://localhost:1337/get/1',
			dataType: "json",
			//jsonpCallback: "_testcb",
			cache: false,
			timeout: 5000,
			success: function(data) {
				console.log(data);
			},
			error: function(jqXHR, textStatus, errorThrown) {
				alert('error ' + textStatus + " " + errorThrown);
			}
		});
		
	});
});