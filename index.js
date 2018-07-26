var express = require('express');
var Camera = require('camera');
var app = express();
var fs = require("fs");
const Vec3 = require('vec3');	

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
   
    dispatch.hook('C_START_SKILL', 5, (event) => {
		console.log(event.w, event.loc.y);
		if(event.skill == 67278964 || event.skill == 67548964){
			event.moving = false;
			event.continue = false;
			event.w = camera.angle();
			var dist = getDist(event.loc.x, event.loc.y, event.dest.x, event.dest.y);
			event.dest = new Vec3( event.loc.x + dist * Math.cos(getRadian(event.w))  ,  event.loc.y + dist * Math.sin(getRadian(event.w)), event.loc.z);
			dispatch.toServer('C_START_SKILL', 5, event);
			return false;
		}
		if(event.skill == 67440064){ // || event.skill == 67440094 || event.skill == 67380194 || event.skill == 67449594){ //get mystic vengeance thrall skill id
			lock = true;
			var newLocation = JSON.parse(JSON.stringify(myLocation));
			myLocation.w = camera.angle();
			event.w = camera.angle();
			dispatch.toServer('C_PLAYER_LOCATION', 1, myLocation);
			dispatch.toServer('C_START_SKILL', 5, event);
			setTimeout(function(){
				lock = false;
			}, 800);
			return false;
		}
		
        return true;
    })
}
