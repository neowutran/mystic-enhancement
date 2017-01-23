var express = require('express');
var app = express();
var fs = require("fs");
var cameraAngle = 0;

app.get('/camera', function (req, res) {
   console.log( req.query.angle );
   cameraAngle = req.query.angle;
   res.end( "" );
})

var server = app.listen(9999, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Listening camera modification at http://%s:%s", host, port)
});

module.exports = function MysticEnhancement(dispatch){
    dispatch.hook('cStartSkill', (event) => {
        if(false){ //get mystic vengeance thrall skill id
			event.w = cameraAngle;
		}
        return true;
    })
}
