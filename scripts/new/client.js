'use strict';

define(['templates', 'firebase', 'fsconfig'], function(templates) {
	
	var userMethods = {}
	var database = firebase.database()
	
	userMethods.loadUserInfo = function(clientId) {
		var setClient = function(data) {
		var a = data.val();
		displayClientCard(a.name, a.phone, a.email, a.company, a.photoUrl, a.conceptUrl)
		}.bind(this);
		database.ref("clients/" + clientId).on('value', setClient);
	}
	
	
	function displayClientCard(name, phone, email, company, photoUrl, conceptUrl) {
		var clientContainer = document.querySelector(".aboutTask__ClientCard");
		clientContainer.innerHTML = templates.CLIENT_VIEW;
		var div = clientContainer.firstChild;
		div.querySelector(".сlientInfo__userName").textContent = name;
		div.querySelector(".сlientInfo__companyName").textContent = company;
		div.querySelector(".сlientInfo__phoneNumber").textContent = phone;	
        console.log('Работает');
			div.querySelector(".сlientInfo__folder").innerHTML = '<a href="' + conceptUrl + '">Дизайн-концепция</a>';
		let photo = photoUrl || '/img/profile_placeholder.png';		
		div.querySelector(".userPic").style.backgroundImage = 'url(' + photo + ')';
	}

	return userMethods
	
})