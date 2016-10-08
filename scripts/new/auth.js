'use strict';

define(['firebase', 'fsconfig', 'templates'], function(initialFB, fsconfig, templates) {
	
	var authMethods = {};
	var auth = firebase.auth();
	var database = firebase.database();
		 
		auth.onAuthStateChanged(function(user) {
		  if (user) {
			  console.log( "User logged in.")
			  checkUserInDB(user)
		  } else {
			  console.log( "User not loggin.")	
			  document.querySelector('.blank_page').innerHTML = templates.SIGN_IN_FORM;			  
			  var btnSignUp = document.getElementById('btnSignIn')
			   btnSignUp.addEventListener('click', function(e) {
			   		 var provider = new firebase.auth.GoogleAuthProvider();
			   		 auth.signInWithPopup(provider);
				})
		  }
		});	 
		  
		function checkUserInDB(user) {
			var uid = user.uid;
			
			database.ref('designers').on('value', snap => {
				
				if (snap.child(uid).exists()) {
					console.log('User in database')
					document.querySelector('.blank_page').innerHTML = '';
					document.querySelector('.header').innerHTML = templates.HEADER_TEMPLATE;
					
                        
              
					require(['main'], function(mainMethods) {
							mainMethods.loadUserInfo(user);
                        	var btnStock = document.getElementById('openStock');
                            console.log(btnStock); 
					}) ;	
					
				} else {
					console.log('User not in database ' + uid)
					displaySignUpBlank(user)
				}
			})
		}
		
		function displaySignUpBlank(user) {
			var uid = user.uid;
			var userName = user.displayName;
			var userEmail = user.email;
			
			database.ref('requests/designers').on('value', snap => {
				var page = document.querySelector('.blank_page')
				
				if (snap.child(uid).exists()) {
					console.log('User in requests')
					
					page.innerHTML = templates.BLANK_TEMPLATE
					page.querySelector('.p_sky').innerHTML = 'Привет, ' + userName + '! Мы рассматриваем вашу заявку<br><br><a id="logoff" class="link link_sky">Выйти</a>';
					page.querySelector('.form').style.display = "none";
					document.getElementById('logoff').addEventListener('click', e => {
						auth.signOut();
						location.reload();
					})
					
					
				} else {
					console.log('No user in requests')
					let container = document.createElement("div");
					container.innerHTML = templates.BLANK_TEMPLATE
					
					page.appendChild(container);
					
					let txtAbout = document.querySelector('.p_sky');
					txtAbout.innerHTML = "Привет! Мы не&nbsp;нашли вас в&nbsp;базе, заполните анкету и&nbsp;мы свяжемся с&nbsp;вами."
					
					let name = document.getElementById('txtName')
					let secondName = document.getElementById('txtSecondName')	
					let phone = document.getElementById('txtPhone')
					let portfolio = document.getElementById('txtPortfolio')
					let btnSignUp = document.getElementById('btnSignUp')
					let signUpForm = document.querySelector('.form');
					
					document.getElementById('logoff').addEventListener('click', e => {
						auth.signOut();
						location.reload();
					})
					
					btnSignUp.addEventListener('click', e => {
						var values = {
										name: name.value,
										id: uid,
										secondName: secondName.value,
										phone: phone.value,
										portfolio: portfolio.value,
										photoUrl: user.photoURL,
										state: "none",
										email: user.email
									}
						database.ref('requests/designers/' + user.uid).update(values)
						txtAbout.innerHTML = "Спасибо! Мы рассмотрим вашу заявку и ответим в течении недели."
						signUpForm.setAttribute('hidden', 'true')
					})
				}
			})
			
			
		}

	return authMethods
	
});