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
	dispatch.hook('cPlayerLocation', (event) => {
			myLocation = event;
			return true;
	});

    dispatch.hook('cStartSkill', (event) => {
		console.info(event);
		myLocation.w = cameraAngle;
        dispatch.toServer('cPlayerLocation', myLocation);
		if(event.skill == 67440264 ){ //get mystic vengeance thrall skill id
			console.info("Modify thrall: "+event.w +" -> "+cameraAngle);
			event.w = cameraAngle;
		}
		
        return true;
    })
}
