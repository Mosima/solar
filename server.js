var express = require ('express');
var morgan = require('morgan'); //logger
var bodyParser = require('body-parser'); //passing body from client // form data
var http = require('http').Server(express);
var mongoose = require('mongoose');
var cors = require ('cors');
var secret = require('./configs/dev');
var Temp = require('./models/temperature.model');
var WaterLevel = require('./models/waterLevel.model');
var Geyser = require('./models/geyser.model');


//connect db
mongoose.connect(secret.database, { useNewUrlParser: true }, function(err){
  if(err){
    console.log('failed connceting to db');
  }
  else{
    console.log('connected to db');
  }
})

var app = express();
var io = require('socket.io')(http);

//middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors(
  {origin: ['http://localhost:3000','http://localhost:3001'],
  credentials: true
}
));


const SerialPort = require('serialport');
const Readline = require('@serialport/parser-readline');
const Regex = require('@serialport/parser-regex');
const Delimiter = require('@serialport/parser-delimiter')
const port = new SerialPort('/dev/ttyACM0');

const parser = port.pipe(new Readline({ delimiter: '\r\n' }));

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('empty-can', (id)=>{
    console.log(id.id)
    port.write(id.id)
  })
});

parser.on("data", function (data) {
	
	console.log(data)
	if(data){
		try{
			convert(data);
			var str = JSON.parse(data);
			io.sockets.emit('solar',{waterL:str.waterL,temp:str.temp});
			//io.on('connection', (client) => {
			  //client.on('subscribeToTimer', (interval) => {
			    //console.log('client is subscribing to timer with interval ', interval);
			    //setInterval(() => {
			      //client.emit('solar',{waterL:str.waterL,temp:str.temp});
			    //}, interval);
			  //});
			//});
		}
		catch{
			console.log("Not Converted"); 
		}
	}
}); 

const convert = (data)=>{
	var str = JSON.parse(data);
	  
  Geyser.findById({_id: "5bffc5d0629fb70d2c1bec61"}, ()=>{
      
  });
	let new_temperature = new Temp({
        temperature: parseInt(str.temp)
     });
  
  
     new_temperature.save(function(err){
       //~ if(err) { return next(err)}
      
     });
  
     let new_water = new WaterLevel({
        waterLevel: parseInt(str.waterL)
     });
  
     new_water.save(function(err){
       //~ if(err) { return next(err)}
      
     });
	
}

//routes


//require('http').get('http://192.168.8.102:3002/api/empty-can/:id', function(req, res, next){
	//res.json(req.params.id)
//});

http.listen(secret.port, function(){
  console.log("App running on port 88");
})
