const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const port = new SerialPort('/dev/ttyACM0');

const WaterLevel = require('../../models/waterLevel.model');

const parser = port.pipe(new Readline({ delimiter: '\r\n' }));


parser.on("data", function (data) {
	convert(data);
});

const convert = (data)=>{
    var str = JSON.parse(data);
    var Level = new WaterLevel({
        waterLevel: parseInt(data.waterL)
    })
    
    console.log(str.temp + " "+str.waterL);
    
    Level.save(function(error) {
        console.log("Your bee has been saved!");
        if (error) {
            console.error(error);
        }
    });
}