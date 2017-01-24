var express = require('express');
var app = express();
var fs = require("fs");
var cameraAngle = 0;

app.get('/camera', function (req, res) {
   cameraAngle = req.query.angle;
   res.end( "" );
})

var server = app.listen(9999, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Listening camera modification at http://%s:%s", host, port)
});

	
module.exports = function MysticEnhancement(dispatch){
	
	let myLocation; 
	let lock = false;
	dispatch.hook('cPlayerLocation', (event) => {
		if(lock === false){
			myLocation = event;
			return true;
		}
		return false;
	});

    dispatch.hook('cStartSkill', (event) => {
		console.info(event);
		if(event.skill == 67440264 ){ //get mystic vengeance thrall skill id
			lock = true;
			var newLocation = JSON.parse(JSON.stringify(myLocation))
			myLocation.w = cameraAngle;
			event.w = cameraAngle;
			dispatch.toServer('cPlayerLocation', myLocation);
			dispatch.toServer('cStartSkill', event);
			console.info("Modify thrall: "+event.w +" -> "+cameraAngle);
			setTimeout(function(){
				lock = false;
			}, 800);
			return false;
		}
		
        return true;
    })
}
