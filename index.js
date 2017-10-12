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
		
	function getRadian(angle){
		return angle*(2*Math.PI/0x10000);
	}
   function getDist(x1, y1, x2, y2){
        return parseInt(Math.hypot(x2-x1, y2-y1));
   }
   
    dispatch.hook('C_START_SKILL', 2, (event) => {
		if(event.skill == 67278964){
			event.movementkey = 0;
			event.w = camera.angle();
			var dist = getDist(event.x1, event.y1, event.x2, event.y2);
			event.x2 = event.x1 + dist * Math.cos(getRadian(event.w));
			event.y2 = event.y1 + dist * Math.sin(getRadian(event.w));
			event.z2 = event.z1 + 4;
			dispatch.toServer('C_START_SKILL', 2, event);
			return false;
		}
		if(event.skill == 67440064){ //get mystic vengeance thrall skill id
			lock = true;
			var newLocation = JSON.parse(JSON.stringify(myLocation));
			myLocation.w = camera.angle();
			event.w = camera.angle();
			dispatch.toServer('C_PLAYER_LOCATION', 1, myLocation);
			dispatch.toServer('C_START_SKILL', 2, event);
			setTimeout(function(){
				lock = false;
			}, 800);
			return false;
		}
		
        return true;
    })
}
