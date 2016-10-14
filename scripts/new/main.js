'use strict';

define(['jquery', 'templates'], function($, templates) {

		var mainMethods = {}

		var auth = firebase.auth();
		var database = firebase.database();
		var storage = firebase.storage();
		
			var blah = document.querySelector('.page__layout_left');

	if ( blah != null){	document.querySelector('.page__layout_left').innerHTML = templates.MY_TASKS_VIEW;}
		
		mainMethods.loadUserInfo = function(user) {
				var userName = user.displayName;
				var profilePicUrl = user.photoURL;
				var uid = user.uid;	
				database.ref('designers').on('value', snap => {
						database.ref('designers/' + uid).once('value', e => {
							var val = e.val()
							require(['header'], function(headerMeth) {
								headerMeth.setupUserCard(val.name, val.rate, val.sum, val.photoUrl)
							})
						})
						
						document.querySelector('.blank_page').innerHTML = ''
					    loadTasks();   
				})
		};	 


		function loadTasks() {
			  // Reference to the /messages/ database path.
			  var tasksRef = database.ref('active-tasks')
			  // Make sure we remove all previous listeners.
			  tasksRef.off();
			  var designerId = auth.currentUser.uid;
			  tasksRef.on('value', function(e){
				  if (e.child(designerId).exists()) {
				  		 tasksRef.child(designerId).on('child_added', function(snap){ 
							let tasksKeys = [snap.key] 
							var setTask = function(data) { 
							   			var val = data.val();
							   			displayTasks(data.key, val.text, val.status, val.imageUrl);  
									  }.bind(this);		  
							database.ref('tasks/' + tasksKeys).once('value', setTask); 
					  });
				   } else {
					    console.log('No active tasks')
					    document.querySelector('.blank_page').innerHTML = '<div style="margin: auto; text-align: center;">У вас пока нет задач. Зайдите в сток, может там есть что-нибудь.</div>' 
						document.querySelector('.page__layout_left').style.display = "none"
						document.querySelector('.page__layout_center').style.display = "none"
					}
			  })
			   
				
			   
		};
		
		
		function displayTasks(key, text, status, imageUrl, company, phonem)  {
			var container = document.createElement("li");
			var li;
			var keyli = document.getElementById(key)
			if (!keyli) {
				var taskCont = document.querySelector('#tasks');
				container.innerHTML = templates.TASK_TEMPLATE;
				li = container.firstChild;
				li.setAttribute("id", key);
				
					taskCont.appendChild(li);
					
					li.querySelector('.taskContainer__taskText').textContent = text;
					li.querySelector('.taskContainer__taskText').setAttribute("id", key);
					li.querySelector('.taskContainer__taskStatus').setAttribute("id", key);
				  	
				  	if (status == "awareness" || status == "awarenessApprove") {
					  li.querySelector('.taskContainer__taskStatus').textContent = "Понимание задачи";		
				  	} else if (status == "concept" || status == "conceptApprove") {
					  li.querySelector('.taskContainer__taskStatus').textContent = "Черновик";			
				  	} else if (status == "design" || status == "designApprove") {
					  li.querySelector('.taskContainer__taskStatus').textContent = "Чистовик";			
				  	} else if (status == "sources") {
					  li.querySelector('.taskContainer__taskStatus').textContent = "Исходники";			
				  	}
		
				  	var uid = auth.currentUser.uid
				  	
				  	require(['notifications'], function(notifications) {
						     notifications.getNotification(uid)
					    })
		
					 var chatDoorText = li.querySelector('.taskContainer__taskText');
					 var chatDoorStatus = li.querySelector('.taskContainer__taskStatus');
					 
					 
							
					
						require(['chat'], function(chat) {				
							
							$("document").ready(function() {
							    setTimeout(function() {
							    $("ul.myTasks li:nth-child(1)").trigger('click');
							    },10);
							});
							
							taskCont.addEventListener("click", function(event) {
								var taskId = event.target.id;	
								var stockContainer = document.getElementById('all-tasks')
								var btnStock = document.getElementById('openStock')
								btnStock.style.display = "block"
								document.getElementById('chat-container').style.display = "flex" 
								document.getElementById('stock-container').style.display = "none"
								
								chat.openChatRoom(taskId)
								
								require(['task'], function(taskMethods){
									taskMethods.loadTaskInfo(taskId)
								})
								var uid = auth.currentUser.uid;
								
								require(['notifications'], function(notifications) {
										notifications.removeNotification(uid, key)
								})
								
							});
	
						})
						
				}
					 
			
			  	
					
				$('.myTasks').on('click','li', function(){
					$(this).addClass('taskContainer__taskText_active').siblings().removeClass('taskContainer__taskText_active');
				});
				
					
				
				
		}
		
		
		
				
		return mainMethods
});