'use strict';

define(['jquery', 'templates'], function($, templates) {
	
	var chat = {};
	
    var messageForm = document.getElementById('message-form');
	var messageInput = document.getElementById('message');
	var submitButton = document.getElementById('submit');
	var stockButton = document.getElementById('openStock');
	var messageList = document.getElementById('messages');
	var submitImageButton = document.getElementById('submitImage');
    var imageForm = document.getElementById('image-form');
	var mediaCapture = document.getElementById('mediaCapture');
	 var chatRoom = document.querySelector('.chatRoom');
	
	var auth = firebase.auth();
	var database = firebase.database();
	var storage = firebase.storage();

	var buttonTogglingHandler = toggleButton.bind(this);
	messageInput.addEventListener('keyup', buttonTogglingHandler);
	messageInput.addEventListener('change', buttonTogglingHandler);
	messageForm.addEventListener('submit', saveMessage.bind(this));
	mediaCapture.addEventListener('change', saveImageMessage.bind(this));
	
	
	
	

	function toggleButton() {
		
	  if (messageInput.value) {
	      submitButton.removeAttribute('disabled');
	      document.querySelector('.mdl-textfield__label').style.dislplay = "none";
	  } else {
	     submitButton.setAttribute('disabled', 'true');
	  }
	};


	function saveMessage(e) {
	  e.preventDefault();
		  // Check that the user entered a message and is signed in.
		  if (messageInput.value) {
			   
			   var text = messageInput.value
			  require(['push'], function(sendPush){
			      sendPush({ message: text });
			       
		      })
		      
			  sendValuesToMessages({ text: text })
		       resetMaterialTextfield(messageInput);
		      toggleButton();

		  }
	}
	
	function resetMaterialTextfield(element) {
	  element.value = '';
	  element.parentNode.MaterialTextfield.boundUpdateClassesHandler();
	};
	
	
	// Events for image upload.
	submitImageButton.addEventListener('click', function() {
	 mediaCapture.click();
	}.bind(this));
	
	
	
	function saveImageMessage() {
			 var file = event.target.files[0];
	  		var width, height;
	        var img = new Image();
	        img.src = window.URL.createObjectURL( file );
	        img.onload = function() {
	           		width = img.naturalWidth;
	                height = img.naturalHeight;
	        };
		  
		  // Clear the selection in the file picker input.
		  imageForm.reset();
	
		 	 var messKey = "";
		 	 let messVal = {}
		    // We add a message with a loading icon that will get updated with the shared image.
		    var taskId = chatRoom.getAttribute("id");
		    var currentUser = auth.currentUser;
		    let messData = database.ref('messages').push({
		      name: currentUser.displayName,
		      photoUrl: currentUser.photoURL || '/img/profile_placeholder.png',
		      taskId: taskId,
		      fromId: auth.currentUser.uid
		    })
			messKey = messData.key;
			
			
		      // Upload the image to Firebase Storage.
		      var uploadTask = storage.ref(currentUser.uid + '/' + Date.now() + '/' + file.name)
		          .put(file, {'contentType': file.type});
		      // Listen for upload completion.
		      uploadTask.on('state_changed', null, function(error) {
		        console.error('There was an error uploading a file to Firebase Storage:', error);
		      }, function() {
		
		        // Get the file's Storage URI and update the chat message placeholder.
		        var filePath = uploadTask.snapshot.downloadURL;
		        database.ref('messages/' + messKey).update({imageUrl: filePath.toString(), imageWidth: width, imageHeight: height });
		        messVal[messKey] = 1;
		        database.ref('task-messages/' + taskId).update(messVal)
		
				      }.bind(this));
	
	}
	
	chat.openChatRoom = function(taskId) {	 
		 chatRoom.setAttribute("id", taskId);
		
		//очищаем содержимое чата от предыдущей задачи		
		 messageList.innerHTML = '';
		 
		 loadMessages(taskId);
		 updateMessageStatus(taskId);
	} 
	
	function loadMessages(taskId) {
	database.ref('task-messages').child(taskId).on('child_added', e => {
		let messageKeys = [e.key]
		
		for (var i = 0, key; key = messageKeys[i]; i++) {
				let messagesTaksRef =  database.ref('messages').child(key);
				messagesTaksRef.on('value', data => {
			  	var val = data.val();
			  	displayMessage(data.key, val.fromId, val.photoUrl, val.status, val.taskId, val.text, val.toId, val.name, val.imageUrl, val.timestamp);
		  		});  			
		}
	})	  
	}
	
	
	function displayMessage(key, fromId, photoUrl, status, taskId, text, toId, name, imageUri, timeStamp) {
		
		var div = document.getElementById(key);
		  // If an element for that message does not exists yet we create it.
		  if (!div) {
			    var container = document.createElement('div');
			    container.innerHTML = templates.MESSAGE_TEMPLATE;
			    div = container.firstChild;
			    div.setAttribute('id', key);
			    var roomId = chatRoom.getAttribute("id");
				if (taskId === roomId) {
					messageList.appendChild(div); 
		    	}

				
		  } if (photoUrl) {
			div.querySelector('.pic').style.backgroundImage = 'url(' + photoUrl + ')';
		  }
		  
		  div.querySelector('.name').textContent = name + ' (' + timeConverter(timeStamp) + ')';
		  
		  var messageElement = div.querySelector('.message');
		  if (text) { // If the message is text.
            messageElement.innerHTML = replaceURLWithHTMLLinks(text);
		    // Replace all line breaks by <br>.
		    messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>');
              
		  } else if (imageUri) { // If the message is an image.
		    var image = document.createElement('img');
			
				image.setAttribute("class", "myPic");
				image.addEventListener('click', function(){
					
					  var modal = document.getElementById('myModal');
					  var modalImg = document.getElementById("img01");
					  var captionText = document.getElementById("caption");
					  var span = document.getElementsByClassName("close")[0];
					
				     modal.style.display = "block";
				     modalImg.src = this.src;
				     modalImg.alt = this.alt;
				     captionText.innerHTML = this.alt;
				});
		
				image.addEventListener('load', function() {
				 messageList.scrollTop =  messageList.scrollHeight;
		    }.bind(this));
		     setImageUrl(imageUri, image);
		    messageElement.innerHTML = '';
		    messageElement.appendChild(image);
		  } 
		  setTimeout(function() {div.classList.add('visible')}, 1);
		   messageList.scrollTop =  messageList.scrollHeight;
		   messageInput.focus();
		   
		  require(['notifications'], function(notifications) {
			var userId = auth.currentUser.uid
			var taskId = chatRoom.getAttribute('id')
			notifications.removeNotification(userId, taskId)
		})
	}
	
	function setImageUrl(imageUri, imgElement) {
	  // If the image is a Firebase Storage URI we fetch the URL.
	  if (imageUri.startsWith('gs://')) {
	    imgElement.src = FriendlyChat.LOADING_IMAGE_URL; // Display a loading image first.
		storage.refFromURL(imageUri).getMetadata().then(function(metadata) {
	      imgElement.src = metadata.downloadURLs[0];
	    });
	  } else {
	    imgElement.src = imageUri;
	  }
	};


	function updateMessageStatus(taskId) {
		var messageRef = database.ref('messages')
		let userId = auth.currentUser.uid
		let updates = {};
		database.ref('tasks/' + taskId).once('value', e => {
			let toId = e.val().fromId
			
			messageRef.orderByChild("status").equalTo(userId).on('child_added', snap => {
				updates[snap.key + "/status"] = toId;
			})
		
			messageRef.update(updates);
		})
		
	};
	
    
    //find urls in text
    function replaceURLWithHTMLLinks(text)
    {
      /*var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
      return text.replace(exp,"<a href='$1'>$1</a>"); */
        var exp = /(\b(((https?|ftp|file|):\/\/)|www[.])[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        var temp = text.replace(exp,"<a href=\"$1\" target=\"_blank\">$1</a>");
        var result = "";

        while (temp.length > 0) {
            var pos = temp.indexOf("href=\"");
            if (pos == -1) {
                result += temp;
                break;
            }
            result += temp.substring(0, pos + 6);

            temp = temp.substring(pos + 6, temp.length);
            if ((temp.indexOf("://") > 8) || (temp.indexOf("://") == -1)) {
                result += "http://";
            }
        }

        return result;
    }
    
    
  //  timestamp converter

function timeConverter(UNIX_timestamp){
  var a = new Date(UNIX_timestamp * 1000);
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var hour = a.getHours();
  var min = a.getMinutes();
  var sec = a.getSeconds();
  var time = date + ' ' + month + ' ' + year ;
  return time;
}
    
	
	function sendValuesToMessages(values, taskId) {
		if (taskId == undefined) {
			taskId = document.querySelector('.chatRoom').getAttribute("id");
		} 
		var currentUser = auth.currentUser;
		var clientId = "";
		database.ref('tasks/' + taskId).once('value', e => {
			    clientId = e.val().fromId
		 })
		values ["photoUrl"] = currentUser.photoURL || '/img/profile_placeholder.png';
		values["status"] = clientId;
		values["name"] = currentUser.displayName;
		values["fromId"] = currentUser.uid;
		values["taskId"] = taskId;
		values["toId"] = clientId;
		values["timestamp"] = Math.round(new Date().getTime()/1000)
		
		  
		let messKey = database.ref('messages').push(values).key
		let messVal = {}
		messVal[messKey] = 1;
		database.ref('task-messages/' + taskId).update(messVal)
	} 
	
	
	

	
	
	return chat
})