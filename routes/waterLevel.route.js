var router = require('express').Router();
var WaterLevel = require('../models/waterLevel.model');
//var _ = require('lodash');


 const SerialPort = require('serialport');
 const Readline = require('@serialport/parser-readline');
 const port = new SerialPort('/dev/ttyACM0');
const Ready = require('@serialport/parser-ready')
 //const parser = port.pipe(new Readline({ delimiter: '\r\n' }));
 
 //~ port.on("data", (data)=>{
    //~ console.log(data);
 //~ })
const parser = port.pipe(new Ready({ delimiter: 'READY' }))
parser.on('ready', () => console.log('the ready byte sequence has been received'))
parser.on('data', console.log) // all data after READY is received

 parser.on("data", function (data) {
 	convert(data);
 });

 const convert = (data)=>{
   var str = JSON.parse(data);
  
   let new_Level = new WaterLevel({
      waterLevel: parseInt(str.waterL) 
    });

    new_Level.save(function(err){
      if(err) { return next(err)}
      console.log(new_Level);
    });

 	console.log(str.temp + " "+str.waterL);
 }


//function intervalFunc() {

   //let new_Level = new WaterLevel({
     //waterLevel: 4023
   //});

   //new_Level.save(function(err){
     //if(err) { return next(err)}
     //console.log(new_Level);
   //});
  //}


//setInterval(intervalFunc, 3500);


 
//route
router.get('/water-level', function(req, res, next){
  WaterLevel
  .find()
  .exec((err, level)=>{
      if(err){ return next(err)}
      res.status(200).json(level);
  })
});

  
module.exports = router;
