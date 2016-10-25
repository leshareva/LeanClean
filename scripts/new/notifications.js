'use strict';

define([], function() {
	
	var database = firebase.database()
	var auth = firebase.auth()
	
	var notifications = {}
	
	notifications.getNotification = function(userId) {
		database.ref('notifications/' + userId).on('child_added', e => {
			var taskId = e.val().taskId
			var taskCont = document.getElementById(taskId)
			document.getElementById('bells').play();
			document.getElementById('bells').volume = 0.1;
            var currentTask = document.getElementById(taskId);
           
            
            // *** Get the last message for that task *** //
            var newMessage = database.ref('messages');
            var lastMessages = database.ref('task-messages/' + taskId);
            lastMessages.limitToLast(1).on('child_added', function(snapshot) {
                newMessage.child(snapshot.key).once('value', e => {
                    var statusTask = currentTask.querySelector('.taskContainer__taskStatus');
                    if ( (e.val().text != undefined) && (e.val().text != null) ) {
                         statusTask.innerHTML = e.val().text;
                    } else {
                         statusTask.innerHTML = 'Вам отправили изображение';
                    }
                   
                    currentTask.classList.add( "newMessage");
                    //last message from db
                });
            });
            
            //document.querySelector('.bullet').style.display = "block"

           // taskCont.querySelector('.bullet').style.display = "block"

		})
	}  
	
	notifications.removeNotification = function(userId, taskId) {
        var currentTask = document.getElementById(taskId);
		var ref = database.ref('notifications/' + userId).orderByChild("taskId").equalTo(taskId)
		ref.on('child_added', snap => {
			var delRef = database.ref('notifications/' + userId + '/' + snap.key)
			delRef.remove();	
			var taskCont = document.getElementById(taskId);
            
			//taskCont.querySelector('.bullet').style.display = "none"
		})
	}
	
	return notifications
})





/*



*/