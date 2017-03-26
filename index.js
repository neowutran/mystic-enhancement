var express = require('express');
var Camera = require('camera');
var app = express();
var fs = require("fs");
	
module.exports = function MysticEnhancement(dispatch){
	const camera = new Camera(false);
	let myLocation; 
	let lock = false;
	dispatch.hook('C_PLAYER_LOCATION', 1, (event) => {
		if(lock === false){
			myLocation = event;
			return true;
		}
		return false;
	});

    dispatch.hook('C_START_SKILL', 1, (event) => {
		if(event.skill == 67440264 ){ //get mystic vengeance thrall skill id
			lock = true;
			var newLocation = JSON.parse(JSON.stringify(myLocation));
			console.log(camera);
			myLocation.w = camera.angle();
			event.w = camera.angle();
			console.info("Modify thrall: "+event.w +" -> "+camera.angle());
			dispatch.toServer('C_PLAYER_LOCATION', 1, myLocation);
			dispatch.toServer('C_START_SKILL', 1, event);
			setTimeout(function(){
				lock = false;
			}, 800);
			return false;
		}
		
        return true;
    })
}
