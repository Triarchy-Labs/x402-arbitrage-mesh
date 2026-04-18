const fs = require('fs');
function checkAnimations(filename) {
    const data = fs.readFileSync(filename);
    const jsonStr = data.slice(20, 20 + data.readUInt32LE(12)).toString();
    try {
        const json = JSON.parse(jsonStr);
        console.log(filename, 'Animations:', json.animations ? json.animations.length : 0);
    } catch(e) {
        console.log(filename, 'error parsing json chunk');
    }
}
checkAnimations('public/models/tech-ring-a-optimize.glb');
checkAnimations('public/models/tech-ring-b-optimize.glb');
checkAnimations('public/models/tech-rings-v2-optimize.glb');
