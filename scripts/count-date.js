'use strict';
		

// Initializes FriendlyChat.
function LeanChat() {

this.testBtn = document.getElementById('testBtn');
this.doneBtn = document.getElementById('doneBtn');
this.testField = document.getElementById('testField');




this.ref = firebase.database().ref('test');


this.testBtn.addEventListener('click', event => {
var start = moment();
var end = moment().add(this.testField.value, 'days');
var point1 = (+end - +start) * 0.2;
var point2 = (+end - +start) * 0.4;
var point3 = (+end - +start) * 0.9;

var data = {
	start: +start,
	point1: +start + +point1,
	point2: +start + +point2,
	point3: +start + +point3,
	end: +end
}



this.ref.set(data)

	
});


this.doneBtn.addEventListener('click', event => {

this.ref.on('value', e => {

	var s = e.val().start;
	var f = e.val().point1;
	var c = e.val().end;
	
	
	var start = e.val().start.toString().substr(3, 5)
	var end = e.val().end.toString().substr(3, 5)
	var now =  +moment()
	var taptime = +now.toString().substr(3, 5);
// 	var taptime = 32084;

	console.log(start, +taptime, end)
	
	
	var t = moment( s ).format('MMMM Do YYYY, h:mm:ss a');
	var b = moment( f ).format('MMMM Do YYYY, h:mm:ss a');
	var z = moment( c ).format('MMMM Do YYYY, h:mm:ss a');
// 	var formatted = t.format("dd.mm.yyyy hh:MM:ss");
	console.log(t, b, z)
	
	var cof = ( (+end - +start) / (+end - +taptime) )
	var caf = +cof.toString().substr(0, 4)
	console.log(caf)
// 	console.log(+now)
	
	
	if (cof < 1) {
		console.log('В пизду такого дизайнера')
	} else if (cof > 2 && cof < 3) {
		console.log('Супербыстрый дизайнер ' + ( ( caf / 10 )))
	} else if (cof > 3 && cof < 4) {
		console.log('Красава сделал ' + ( ( caf / 10 ) ) )
	} else if (cof > 5) {
		console.log('Нормально, все в срок ' + ( ( caf / 10 ) ))
	}
	
	
	
	
		/*
if(+now > +end) {
		console.log('Дедлайн пройобан')	
		} else {
		console.log('Все заебок')	
		}
*/
	
})





	
})


}; 



 
window.onload = function() {
  window.leanchat = new LeanChat();
};
 	