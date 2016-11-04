'use strict';

define([''], function() {
	
		var database = firebase.database()

	   var sendPush = function(values, key) { 
		   
		   if (!key) {
			var key = document.querySelector('.chatRoom').getAttribute("id");
			} 
		   
		   database.ref('tasks/' + key).once('value', function(e) {
			    let clientId = e.val().fromId;
			    database.ref('user-token/' + clientId).on('child_added', function(e) {
				   	var tokens = [e.key]
				   	 for (var i = 0, token; token = tokens[i]; i++) {
					  	values["token"] = token;
					 	values["clientId"] = clientId;
                         values["taskId"] = key;
    
					 	 database.ref('push').push(values)
					 }
				})
		 })
		}
		
		return sendPush;
	
})