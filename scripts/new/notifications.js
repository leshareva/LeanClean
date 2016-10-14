'use strict';

define(['firebase', 'fsconfig'], function() {
	
	var database = firebase.database()
	var auth = firebase.auth()
	
	var notifications = {}
	
	notifications.getNotification = function(userId) {
		database.ref('notifications/' + userId).on('child_added', e => {
			var taskId = e.val().taskId
			var taskCont = document.getElementById(taskId)
			document.getElementById('bells').play();
			document.getElementById('bells').volume = 0.1;
//taskCont.querySelector('.bullet').style.display = "block"
		})
	}
	
	notifications.removeNotification = function(userId, taskId) {
		var ref = database.ref('notifications/' + userId).orderByChild("taskId").equalTo(taskId)
		ref.on('child_added', snap => {
			var delRef = database.ref('notifications/' + userId + '/' + snap.key)
// 			delRef.remove()	
			var taskCont = document.getElementById(taskId)
			//taskCont.querySelector('.bullet').style.display = "none"
		})
	}
	
	return notifications
})





/*



*/