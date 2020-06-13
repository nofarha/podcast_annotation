var audio;
var stoppingTimes = [10, 15,20, 25];
var stoppedAt = [0];
var answeredQuestions = 0;
var buttonLocker = false;
//Hide Pause Initially
$('#pause').hide();

//Initializer - Play First Song
initAudio($('#playlist li:first-child'));
$("#wow").hide();

function initAudio(element){
	var song = element.attr('song');
    var title = element.text();
    var cover = element.attr('cover');
    var artist = element.attr('artist');

	//Create a New Audio Object
	audio = new Audio('media/' + song);

	if(!audio.currentTime){
		$('#duration').html('0.00');
	}

	$('#audio-player .title').text(title);
    $('#audio-player .artist').text(artist);

	//Insert Cover Image
	$('img.cover').attr('src','images/covers/' + cover);

	$('#playlist li').removeClass('active');
    element.addClass('active');
}


//Play Button
$('#play').click(function(){
	if (!buttonLocker){
		audio.play();
		$('#play').hide();
		$('#pause').show();
		$('#duration').fadeIn(400);
		showDuration();
	}
	//$("#wow").show(1000);
});

//Pause Button
$('#pause').click(function(){
	audio.pause();
	$('#pause').hide();
	$('#play').show();
});

$('#prev').click(function(){
		audio.pause();
		audio.currentTime = stoppedAt[stoppedAt.length - 1];
		audio.play();
	  // QUESTION: what is the expacted behavior for when the subject presses
		// this button while in question mode? Should we repeat the last section or
		// should we lock the button altogether?
		// currently, if you press on it while on question mode, it'll play

})

//Playlist Song Click
$('#playlist li').click(function () {
    audio.pause();
    initAudio($(this));
	$('#play').hide();
	$('#pause').show();
	$('#duration').fadeIn(400);
	audio.play();
	showDuration();
});

$("#1a").click(function(){
	$("#wow").hide();
	audio.play();
	$('#play').hide();
	$('#pause').show();
	var s = Math.floor(audio.currentTime);
	console.log(s+": Not at all");
	showDuration();
});

$("#1e").click(function(){
	$("#wow").hide();
	audio.play();
	$('#play').hide();
	$('#pause').show();
	var s = Math.floor(audio.currentTime);
	console.log(s+": very much");
	showDuration();
});


//Volume Control
$('#volume').change(function(){
	audio.volume = parseFloat(this.value / 10);
});

//Time Duration
function showDuration(){
	$(audio).bind('timeupdate', function(){
		//Get hours and minutes
		var s = parseInt(audio.currentTime % 60);
		var m = parseInt((audio.currentTime / 60) % 60);
		//Add 0 if seconds less than 10
		if (s < 10) {
			s = '0' + s;
		}
		$('#duration').html(m + '.' + s);
		var value = 0;
		if (audio.currentTime > 0) {
			value = Math.floor((100 / audio.duration) * audio.currentTime);
		}
		$('#progress').css('width',value+'%');

		// // QUESTION functionality
		if (stoppingTimes.includes(s) && !stoppedAt.includes(s)){
		//if ((s>0) && (s % 15 == 0)){
			stoppedAt.push(s);
			stop_audio();
		}
	});
}


function stop_audio(){
	$('#wow').show();
	$('.Question').show();
	buttonLocker = true;
	$('#play').show();
	$('#pause').hide();
	audio.pause();
}

function resume_audio(){
	$('#wow').hide();
	buttonLocker = false;
	$('#play').hide();
	$('#pause').show();
	audio.play();
	showDuration();
}

function get_resp(question, resp, question_number){

	// get the timestemp we are currently questioning on
	let s = Math.floor(audio.currentTime);

	// document subject's response at the console log
	console.log(s)
	console.log(question_number)
	console.log(resp);

	// increase the number of answered quetions for this timestemp
	++answeredQuestions;

  // when this var hits 5 we know all questons has been answered for this round)
	if (answeredQuestions==5){
		answeredQuestions = 0; // resret answered question count (for the next timetemp)
		resume_audio();
	}
	else {
		$(question).hide();
	}
}
