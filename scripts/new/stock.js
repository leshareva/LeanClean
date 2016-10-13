'use strict';

define(['templates', 'firebase', 'fsconfig'], function(templates) {
    var database = firebase.database()	
	var tasksRef = database.ref('tasks')
	var auth = firebase.auth();
    var storage = firebase.storage();
	document.getElementById('stock-container').innerHTML = '<center><h3 id="taskListTitle" class="taskStock__title">Задачек нету :(</h3></center><div id="all-tasks"></div>';
    
   
	var taskListTitle = document.getElementById('taskListTitle');
	var allTasks = document.getElementById('all-tasks');
	allTasks.innerHTML = "";
	
	var STOCK_TASK_TEMPLATE =
   '<div class="taskContainer taskContainer_stock mdl-shadow--2dp">' +
      '<div class="taskText" style="font-size: 14px; line-height: 22px; margin-bottom: 14px;"></div>' +
      '<button class="get-task btn btn_paper btn_active">Взять задачу</buttom>' +
    '</div>';

	/*var setTask = function(data) {
	var val = data.val();
		displayAllTasks(data.key, val.taskId, val.text, val.status, val.imageUrl, val.toId);
  	}.bind(this);*/
  	
	tasksRef.orderByChild("toId").equalTo('designStudio').on('child_added', data => {
        var val = data.val();
		displayAllTasks(data.key, val.taskId, val.text, val.status, val.imageUrl, val.toId);
        taskListTitle.innerText = 'Доступные задачи';
        console.log('Задачи грузятся');
    });
    
    
	
	function displayAllTasks(key, toId, text, status, imageUrl)  {
		let taskCard = document.getElementById(key)
		if (!taskCard)	 {
            console.log('bla');
			var container = document.createElement("div");
			container.innerHTML = STOCK_TASK_TEMPLATE;
			var div = container.firstChild;
			div.querySelector('.get-task').setAttribute("id", key);
				
				allTasks.appendChild(div);	 
			  	div.querySelector('.taskText').textContent = text;
			  	
			  	div.querySelector('.get-task').addEventListener('click', a => {
			  	
					var id = auth.currentUser.uid
				
					var postData = {
					    status: "awareness",
					    toId: id,
					    imageUrl: auth.currentUser.photoURL
					  };
					  
					  require(['push'], function(sendPush){
					      sendPush({ message: "На вашу задачу назначен дизайнер"}, key)
				      })
					
					database.ref('tasks').child(key).update(postData); 
					let taskVal = {}
					taskVal[key] = 1;
					database.ref('active-tasks/' + id).update(taskVal)
					div.style.display = 'none';
					window.location.href = "/index.html";
	
				});
		}
	
	 };	

});
	