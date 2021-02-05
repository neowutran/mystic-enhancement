var net = require("net");
const Vec3 = require('tera-vec3');
const MULT_INT16_TO_RAD = 1 / 0x8000 * Math.PI,
      MULT_RAD_TO_INT16 = 1 / Math.PI * 0x8000
module.exports = function MysticEnhancement(dispatch){
   function getDist(x1, y1, x2, y2){
        return parseInt(Math.hypot(x2-x1, y2-y1));
   }
    dispatch.hook('C_START_SKILL', 7, (event) => {
        console.log(MULT_RAD_TO_INT16 * event.w);
        if(event.skill.id == 170100 || event.skill.id == 440100){
            var client = new net.Socket();
            client.connect(11000, '127.0.0.1', function(){});
            client.on('data', function(data) {
                var angle =  data.readInt16BE(0);
                event.moving = false;
                event.continue = false;
                event.w = angle * MULT_INT16_TO_RAD;
                var dist = getDist(event.loc.x, event.loc.y, event.dest.x, event.dest.y);
                event.dest = new Vec3( event.loc.x + dist * Math.cos(event.w)  ,  event.loc.y + dist * Math.sin(event.w), event.loc.z);
                dispatch.send('C_START_SKILL', 7, event);
                client.destroy();
            });
            return false;
        }
        dispatch.send('C_START_SKILL', 7, event);
        return false;
    });
}
