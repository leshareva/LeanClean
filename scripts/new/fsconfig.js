define(['firebase'], function() {
	var config = {
		    apiKey: "AIzaSyCxwXDT6cB7W0Ci-P-OVJxahHvZ4Me__Wk",
		    authDomain: "leandesign-4e7ec.firebaseapp.com",
		    databaseURL: "https://leandesign-4e7ec.firebaseio.com",
		    storageBucket: "leandesign-4e7ec.appspot.com",
		  };
	var initialFB = firebase.initializeApp(config);
	
	return initialFB
})