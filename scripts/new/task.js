'use strict';

define(['templates', 'firebase', 'fsconfig'], function(templates) {
	
	var taskMethods = {}
	
	var auth = firebase.auth();
	var database = firebase.database();
	var storage = firebase.storage();
	var taskId = document.querySelector('.chatRoom').getAttribute('id')
	
	
	var awarenessForm = document.querySelector(".aboutTask__awarenessForm")
	
	taskMethods.loadTaskInfo = function(taskId) {
		var taskRef = database.ref("tasks/" + taskId);
		console.log('try to load tasks info')
		taskRef.on('value', snap => {
			let val = snap.val()
			require(['client'], function(userMethods){
				userMethods.loadUserInfo(val.fromId)
			})
			
			
			let stepOne = document.querySelector(".aboutTask__step_one");
			let stepTwo = document.querySelector(".aboutTask__step_two");
			let stepThree = document.querySelector(".aboutTask__step_three");
			let stepFour = document.querySelector(".aboutTask__step_four");
			let designPrice = snap.val().price - (snap.val().price * 0.3)
			let mathDesignPrice = Math.round(designPrice * 10) / 10;
			let dateString = moment.unix(snap.val().end).format("MM/DD/YYYY");
			let taskInfoView = document.querySelector(".aboutTask__info")
			taskInfoView.innerHTML = '<div class="aboutTask__info__layout">Стоимость:<div class="aboutTask__label">' + mathDesignPrice + ' руб</div></div><div class="aboutTask__info__layout">Срок сдачи:<div class="aboutTask__label">' + dateString + '</div></div>'
			
			if (val.status == "awareness") {
				//показываем форму для заполнения понимания задачи
				document.querySelector(".aboutTask__step_one").className += " aboutTask__step_active"
				taskInfoView.setAttribute("hidden", "true")
			 	awarenessForm.innerHTML = templates.AWARENESS_VIEW;
			 	document.getElementById('btnSendAwareness').addEventListener('click', sendAwareness.bind(this))	
			} else if (val.status == "awarenessApprove") {
				taskInfoView.setAttribute("hidden", "true")
				//показываем форму «ждем подтверждения»
				awarenessForm.innerHTML = templates.WAITING_APPROVE;
				stepOne.className += " aboutTask__step_active"
				awarenessForm.style.display = 'block';
				 
				taskRef.child("awareness").once('child_added', snap => {
				 	awarenessForm.querySelector(".awarenessForm__awarenessText").textContent = snap.val().text 
				 })
				awarenessForm.querySelector('.aboutTask__link').addEventListener('click', editAwareness.bind(this))
			} else if (val.status == "concept") {
				taskInfoView.removeAttribute("hidden")
				awarenessForm.innerHTML = templates.CONCEPT_VIEW;
				var alert = awarenessForm.querySelector('.alert_paper')
				
				alert.innerHTML = "Клиент утвердил понимание задачи"
				alert.removeAttribute("hidden")
				stepOne.className += " aboutTask__step_active"
				stepTwo.className += " aboutTask__step_active"
				
				awarenessForm.querySelector(".aboutTask__Title").textContent = "Работаем над черновиком"
				awarenessForm.querySelector(".awarenessForm__p").textContent = "Помним, что черновик это очень быстро и главное свериться с клиентом - туда ли мы движемся."
				var inputConcept = document.getElementById("imgConcept");
				inputConcept.addEventListener('change', saveImages.bind(this));
					
			} else if (val.status == "conceptApprove") {
				awarenessForm.innerHTML = templates.WAITING_APPROVE;
				stepOne.className += " aboutTask__step_active"
				stepTwo.className += " aboutTask__step_active"
				awarenessForm.style.display = 'block';
				awarenessForm.querySelector('.aboutTask__link').addEventListener('click', editConcept.bind(this));
				
			} else if (val.status == "design") {
				awarenessForm.innerHTML = templates.CONCEPT_VIEW;
				var alert = awarenessForm.querySelector('.alert_paper')
				alert.innerHTML = "Клиент утвердил черновик"
				alert.removeAttribute("hidden")
				stepOne.className += " aboutTask__step_active"
				stepTwo.className += " aboutTask__step_active"
				stepThree.className += " aboutTask__step_active"
				awarenessForm.querySelector(".aboutTask__Title").textContent = "Выгрузите чистовики на согласование"
				awarenessForm.querySelector(".awarenessForm__p").textContent = "Сначала обсудите с клиентом черновки в чате и по телефону, когда он одобрит их, отправьте их на согласование, чтобы закрыть этап."
				let inputConcept = document.getElementById("imgConcept");
				inputConcept.addEventListener('change', saveImages.bind(this));
				
		
			} else if (val.status == "designApprove") {
				awarenessForm.innerHTML = templates.WAITING_APPROVE;
				stepOne.className += " aboutTask__step_active"
				stepTwo.className += " aboutTask__step_active"
				awarenessForm.style.display = 'block';
				awarenessForm.querySelector('.aboutTask__link').addEventListener('click', editDesign.bind(this));
				
			} else if (val.status == "sources") {
				awarenessForm.innerHTML = templates.CONCEPT_VIEW;
				var alert = awarenessForm.querySelector('.alert_paper')
				alert.innerHTML = "Клиент утвердил чистовик"
				alert.removeAttribute("hidden")
				stepOne.className += " aboutTask__step_active"
				stepTwo.className += " aboutTask__step_active"
				stepThree.className += " aboutTask__step_active"
				stepFour.className += " aboutTask__step_active"
				awarenessForm.querySelector(".aboutTask__Title").textContent = "Выгрузите исходники"
				awarenessForm.querySelector(".awarenessForm__p").textContent = "Загрузите их на гугл-драйв и сюда прикрепите ссылку"
				var textField = document.getElementById("textField");
				textField.style.display = "block";
				document.getElementById("imgConcept").style.display = "none";
				let btnSend = document.getElementById('btnSendAwareness');
			 	btnSend.addEventListener('click', e => {
			 		sendValuesToMessages({text: textField.value})
					database.ref('bills').push({ taskId: taskId })
					let values = {}
					values[taskId] = 1;
					database.ref('user-tasks/' + auth.currentUser.uid).update(values)
					database.ref('active-tasks/' + auth.currentUser.uid).child(taskId).remove()	
					
			 	})
				
			} else if (val.status == "done") {
				awarenessForm.innerHTML = templates.CONCEPT_VIEW;
				stepOne.className += " aboutTask__step_active"
				stepTwo.className += " aboutTask__step_active"
				stepThree.className += " aboutTask__step_active"
				stepFour.className += " aboutTask__step_active"
				awarenessForm.style.display = 'block';			
				location.reload()

				
			}
	
		})
	}
	


    
    
    
    function sendAwareness() {
        var taskId = document.querySelector('.chatRoom').getAttribute("id");

	
	function sendAwareness() {
		var taskId = document.querySelector('.chatRoom').getAttribute("id")

		let awarenessField = document.getElementById('awarenessField');
		let timeField = document.getElementById('timeField');
		let userId = auth.currentUser.uid;
		let text = awarenessField.value
		let time = timeField.value 
		
		let values = {
			text: text,
			designerId: userId,
			taskId: taskId,
			time: Number(time)
		}
		
        if (isNumeric(timeField.value)) {
            if (awarenessField.value != "") {
                database.ref("PriceCount").push(values);       
            } else {
                alert('Нехорошо не заполнять понимание задачи');
            }
           
        } else {
            alert('Эм... '+timeField.value+'? Сёрьёзно? Это на какой планете так часы считают? Поменяйте значение в поле "Сколько часов займёт работа"');
        }
        
		
	}
    
	//Является ли введённое значение числом
	function isNumeric(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    } 
	
    
	
	
	function editAwareness() {
		var taskId = document.querySelector('.chatRoom').getAttribute("id")
		var taskRef = database.ref("tasks/" + taskId);
		taskRef.update({status: "awareness"})
		taskRef.child("awareness").once('child_added', snap => {
			 let text = snap.val().key
			 awarenessForm.innerHTML = templates.AWARENESS_VIEW;
			 document.getElementById('awarenessField').value = snap.val().text;
			 document.querySelector('.aboutTask__link_cancel').removeAttribute('hidden')
			 document.querySelector('.aboutTask__link_cancel').addEventListener('click', e => {
				 awarenessForm.innerHTML = templates.WAITING_APPROVE;
			 })
			let btnSend = document.getElementById('btnSendAwareness');
			btnSend.addEventListener('click', sendAwareness.bind(this))
		})
	};
    
    
    
    
    
    function editConcept() {
		var taskId = document.querySelector('.chatRoom').getAttribute("id")
		var taskRef = database.ref("tasks/" + taskId);
		taskRef.update({status: "concept"})
		taskRef.child("concept").once('child_added', snap => {
			 let text = snap.val().key
             taskInfoView.removeAttribute("hidden")
			 awarenessForm.innerHTML = templates.CONCEPT_VIEW;
			 document.getElementById('awarenessField').value = snap.val().text;
			 document.querySelector('.aboutTask__link_cancel').removeAttribute('hidden')
			 document.querySelector('.aboutTask__link_cancel').addEventListener('click', e => {
				 awarenessForm.innerHTML = templates.WAITING_APPROVE;
			 })
             
             awarenessForm.querySelector(".aboutTask__Title").textContent = "Работаем над черновиком"
             awarenessForm.querySelector(".awarenessForm__p").textContent = "Помним, что черновик это очень быстро и главное свериться с клиентом - туда ли мы движемся."
             var inputConcept = document.getElementById("imgConcept");
             inputConcept.addEventListener('change', saveImages.bind(this));
		})
	};
    
    
    
    function editDesign() {
		var taskId = document.querySelector('.chatRoom').getAttribute("id")
		var taskRef = database.ref("tasks/" + taskId);
		taskRef.update({status: "design"})
		taskRef.child("design").once('child_added', snap => {
			 let text = snap.val().key
             taskInfoView.removeAttribute("hidden")
			 awarenessForm.innerHTML = templates.CONCEPT_VIEW;
			 document.getElementById('awarenessField').value = snap.val().text;
			 document.querySelector('.aboutTask__link_cancel').removeAttribute('hidden')
			 document.querySelector('.aboutTask__link_cancel').addEventListener('click', e => {
				 awarenessForm.innerHTML = templates.WAITING_APPROVE;
			 })
             
             awarenessForm.querySelector(".aboutTask__Title").textContent = "Работаем над черновиком"
             awarenessForm.querySelector(".awarenessForm__p").textContent = "Помним, что черновик это очень быстро и главное свериться с клиентом - туда ли мы движемся."
             var inputConcept = document.getElementById("imgConcept");
             inputConcept.addEventListener('change', saveImages.bind(this));
		})
	};
    

	
	function saveImages(event) {
	  var files = event.target.files;
	  var status = "";
	  var clientId = "";
	  var userId = auth.currentUser.uid;
	  var userName = auth.currentUser.displayName;
	  
	  database.ref("designers/" + userId).once('value', e => {
			userName = e.val().name
		})
	  
		database.ref("tasks/" + taskId).once('value', e => {
			status = e.val().status
			clientId = e.val().fromId
		});
	  
	  //загружем каждое изображение в сторадж
	  let btnSend = document.getElementById('btnSendAwareness');
	  btnSend.addEventListener('click', e => {
		  for (var i = 0, file; file = files[i]; i++) {
			  console.log(taskId, file, status)
		  	sendImgToDb(taskId, file, status) 
		 } 
		 //изменяем статус задачи
		updateTaskStatus(taskId, status)
		 require(['push'], function(sendPush){
			      sendPush({ message: "Согласуйте результаты этапа" })
		 })
	  })
	};
	
	
	function sendImgToDb(taskId, file, status) { 
		// Upload the image to Firebase Storage.
			var width, height;
	        var img = new Image();
	        img.src = window.URL.createObjectURL( file );
	        img.onload = function() {
	           		width = img.naturalWidth;
	                height = img.naturalHeight;
	        };
	        
	      var uploadTask = storage.ref(taskId + '/' + file.name)
	      	.put(file);
	      // Listen for upload completion.
	      uploadTask.on('state_changed', function (snapshot) {	     
		     
	      }, function(error) {
	        console.error('There was an error uploading a file to Firebase Storage:', error);
		 }, function() {
			 var filePath = uploadTask.snapshot.downloadURL;
			database.ref("tasks" + "/" + taskId + "/" + status).push({imgUrl: filePath.toString(), imageWidth: width, imageHeight: height });	 
	      }.bind(this));	
	}
	
	function updateTaskStatus(taskId, status) {
		database.ref("tasks/" + taskId).update({status: status + "Approve"})
		database.ref("tasks/" + taskId + "/" + status).update({status: "none"}) 
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
		values["status"] = "toClient";
		values["name"] = currentUser.displayName;
		values["fromId"] = currentUser.uid;
		values["taskId"] = taskId;
		values["toId"] = clientId;
		  
		let messKey = database.ref('messages').push(values).key
		let messVal = {}
		messVal[messKey] = 1;
		database.ref('task-messages/' + taskId).update(messVal)
	} 	
	
	return taskMethods
})