'use strict';

define(['templates', 'firebase', 'fsconfig'], function(templates) {
	
		var headerMeth = {};
		var auth = firebase.auth()
		var database = firebase.database()
		
		var btnLogout = document.getElementById('sign-out')
		var btnStock = document.getElementById('openStock')
		
		btnLogout.addEventListener('click', e => {
			 auth.signOut();
			 location.reload();
			 document.querySelector('.page').style.display = 'none';
		 })
		
		
		var stockContainer = document.getElementById('all-tasks')
		
				btnStock.addEventListener('click', e => {
						require(['stock'])
						btnStock.style.display = "none"
						document.getElementById('chat-container').style.display = "none"
						document.getElementById('stock-container').style.display = "block"
				})
			
		
		
		headerMeth.setupUserCard = function(name, rate, sum, pic) {
			document.querySelector('.user_user-info').innerHTML = '<span id="user-name" ></span><br><span id="user-rate" class="user__rate"></span><span id="user-earn" class="user__earn"></span>'
  			var earnLabel = document.getElementById('user-earn');
  			var picView = document.getElementById('user-pic');
  			var nameLabel = document.getElementById('user-name');
  			var rateLabel = document.getElementById('user-rate')
  			
		    // Set the user's profile pic and name.
		    picView.style.backgroundImage = 'url(' + pic + ')';
		    nameLabel.textContent = name;
			earnLabel.textContent = sum + " ₽";
		    rateLabel.textContent = rate;	
		}
		
		return headerMeth
	
})