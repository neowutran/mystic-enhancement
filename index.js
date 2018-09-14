var express = require('express');
var Camera = require('camera');
var app = express();
var fs = require("fs");
const Vec3 = require('tera-vec3');
const MULT_INT16_TO_RAD = 1 / 0x8000 * Math.PI,
	  MULT_RAD_TO_INT16 = 1 / Math.PI * 0x8000
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
   
    dispatch.hook('C_START_SKILL', 7, (event) => {
		if(event.skill.id == 170100 || event.skill.id == 440100){
			event.moving = false;
			event.continue = false;
			event.w = camera.angle() * MULT_INT16_TO_RAD;
			var dist = getDist(event.loc.x, event.loc.y, event.dest.x, event.dest.y);
			event.dest = new Vec3( event.loc.x + dist * Math.cos(getRadian(event.w))  ,  event.loc.y + dist * Math.sin(getRadian(event.w)), event.loc.z);
		}	
		dispatch.send('C_START_SKILL', 7, event);
        return false;
    });
}
