var os = require('os');
var nodestatic = require('node-static');
var http = require('http');
var socketIO = require('socket.io');

var fileServer = new(nodestatic.Server)();
var app = http.createServer(function(req,res){
	fileServer.serve(req,res);
}).listen(8085);

var io = socketIO.listen(app);
io.sockets.on('connection',function(socket){
	function log(){
		var array = ['message from server'];
		array.push.apply(array,arguments);
		socket.emit('log',array);
		}
		socket.on('message',function(message){
			log('client said:',message);
			socket.broadcast.emit('message',message);
		});
		socket.on('create or join',function(room){
			log('Received req to create or join room'+ room);
		
		var numClients = io.sockets.sockets.length;
		log('Room' + room + 'now has' + numClients + 'clients');
		if(numClients === 1){
			socket.join(room);
			log('Client ID'+ socket.id+'created room'+ room);
			socket.emit('created',room,socket.id);
			}
			else if(numClients === 2) {
				log('Client ID'+ socket.id+'joined room'+ room);
				io.sockets.in(room).emit('join',room);
				socket.join(room);
				socket.emit('joined',room,socket.id);
				io.sockets.in(room).emit('ready');
				//socket.broadcast.emit('ready',room);
				}
				else{
				socket.emit('full',room);
				}
	});
socket.on('ipaddr',function(){
	var ifaces = os.networkInterfaces();
	for(var dev in ifaces){
		ifaces[dev].forEach(function(details){
		if(details.family === 'IPv4' && details.address !== 'localhost'){
			socket.emit('ipaddr',details.address);
			}
		});
	}
});
socket.on('bye',function(){
		console.log('received bye');
	});
});
	
		
		
		
		
		
		