define([''], function() {
	
	var templates = {}
	
	templates.SIGN_IN_FORM = '<div class="page_sigUp"><div class="signInForm"><button id="btnSignIn" class="btn btn_sky signUpForm_btn" >Войти</button><a id="logout" class="link link_sky" hidden>Выйти</a> </div><div class="signUpForm" hidden></div></div>'	
	
	templates.MESSAGE_TEMPLATE = '<div class="message-container">' +
      '<div class="spacing"><div class="pic"></div></div>' +
      '<div class="message"></div>' +
      '<div class="name"></div>' +
    '</div>';
	
	templates.TASK_TEMPLATE = '<li class="taskContainer taskContainer__myTasks">' +
				      '<div style="width: 80%; pointer-events:none;">' +
				      '<span class="taskContainer__taskText"></span>' +
				      '<span class="taskContainer__taskStatus"></span>' +
				      '</div>' +
				      '<div class="bullet"></div>' +
				    '</li>';
	
	
	templates.BLANK_TEMPLATE = '<div class="page_sigUp">' +
					'<div class="signInForm">' +
						'<p class="p_sky"></p>' +
						'<div class="form">' +
						'<input id="txtName" type="text" placeholder="Имя" class="input input_sky signUpForm_input">' +
						'<input id="txtSecondName" type="text" placeholder="Фамилия" class="input input_sky signUpForm_input">' +
						'<input id="txtPhone" type="number" class="input input_sky signUpForm_input" placeholder="Телефон">' +
						'<input id="txtPortfolio" type="text" class="input input_sky signUpForm_input" placeholder="Ссылка на портфолио">' +
						'<button id="btnSignUp" class="btn btn_sky signUpForm_btn">Отправить</button><br /><br />' +
						'<a id="logoff" class="link link_sky">В другой раз</a>' +
						'</div>'+
					'</div>'+
				'</div>';
	
				
	templates.HEADER_TEMPLATE =	'<div class="logo"><a href="index.html">LEAN</a></div>'+
	  '<div id="openStock" class="btn btn_sky">Сток задач</div>'+
      '<div id="user-container" class="user user_header"><div id="user-pic"></div><div class="user_user-info"></div></div>' +
	  '<a id="sign-out" class="link link_sky"> Выйти </a>';
 	
 	
 	templates.CLIENT_VIEW = '<div class="сlientInfo aboutTask_clientInfo">' +
			 '<div class="userPic"></div>' +
			 '<ul class="сlientInfo_info">' +
			 	 '<li class="сlientInfo__userName"></li>' +
				 '<li class="сlientInfo__companyName"></li>' +
				 '<li class="сlientInfo__phoneNumber"></li>' +
				 '<li class="сlientInfo__folder"></li>' +
			 '</ul>' +
		 '</div>';
				
	templates.AWARENESS_VIEW = '<h4 class="aboutTask__Title awarenessForm__Title">Заполните понимание задачи</h4>' +
			'<p>Свяжитесь с&nbsp;клиентом, заполните понимание задачи и&nbsp;укажите сколько у&nbsp;вас уйдет времени на&nbsp;задачу.</p>' +
			'<textarea id="awarenessField" rows="5" cols="40" class="aboutTask__input aboutTask__input_awareness" placeholder="Опишите то, как вы поняли задачу "></textarea>' +
			'<label for="timeField" class="label">Сколько часов займет работа</label><input id="timeField" type="text" class="aboutTask__input aboutTask__input_price">' +
			'<button id="btnSendAwareness" class="btn btn_paper btn_l">Отправить</button> ' +
			'<a class="link aboutTask__link aboutTask__link_cancel" hidden>Отмена</a>' +
			'<div class="aboutTask__error"></div>';	
			
	templates.WAITING_APPROVE = '<h4 class="aboutTask__Title awarenessForm__Title">Ждем подтверждения от клиента</h4>' +
			'<div class="awarenessForm__awarenessText"></div>' +
			'<p>Если в течение нескольких часов клиент не выходит на связь, позвоните ему.</p>' +
			'<a id="editCurrentStep" class="link aboutTask__link">Редактировать</a>';			
					
	
	templates.CONCEPT_VIEW = '<div class="alert_paper aboutTask__alert_paper" hidden></div>' +
		'<h4 class="aboutTask__Title awarenessForm__Title"></h4>' +
		'<p class="awarenessForm__p"></p>' +
		'<input id="imgConcept" type="file" accept="image/jpeg,image/png" multiple>' +
		'<input id="textField" type="text" style="display: none" class="aboutTask__input">' +
		'<button id="btnSendAwareness" class="btn btn_paper btn_l">Отправить</button>' +
		'<div class="aboutTask__error"></div>';	
			
	templates.MY_TASKS_VIEW = '<div id="tasking" class="tasks-grid"><h4 class="tasks-grid__title">Мои задачи</h4><ul id="tasks" class="myTasks"></ul></div>';
	 	
 	
/*var editCurrentStep = document.getElementById('editCurrentStep');
                editCurrentStep.addEventListener('click', e => {
                    awarenessForm.innerHTML = templates.CONCEPT_VIEW;
                });*/
    
    
    
	
				
	return templates
})