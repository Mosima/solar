var router = require('express').Router();
var Temp = require('../models/temperature.model');


//~ const SerialPort = require('serialport');
//~ const Readline = require('@serialport/parser-readline');
//~ const port = new SerialPort('/dev/ttyACM0');

//~ const parser = port.pipe(new Readline({ delimiter: '\r\n' }));

//~ parser.on("data", function (data) {
	//~ convert(data);
//~ });

//~ const convert = (data)=>{
    //~ var str = JSON.parse(data);
    
    //~ let new_temperature = new WaterLevel({
        //~ temperature: parseInt(str.temp)
     //~ });
  
     //~ new_temperature.save(function(err){
       //~ if(err) { return next(err)}
       //~ console.log(new_temperature);
     //~ });
  
      //~ console.log(str.temp + " "+str.waterL);
  //~ } 
  
//~ // function intervalFunc() {

//~ //    let new_temperature = new Temp({
//~ //      temperature: 4023
//~ //    });

//~ //    new_temperature.save(function(err){
//~ //      if(err) { return next(err)}
//~ //      console.log(new_temperature);
//~ //    });
//~ //   }


// setInterval(intervalFunc, 3500);




router.get('/temp', function(req, res, next){
    Temp
    .find()
    .exec((err, temp)=>{
        if(err){ return next(err)}
        res.status(200).json(temp);
    })
});



module.exports = router;
