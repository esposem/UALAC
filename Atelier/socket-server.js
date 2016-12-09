var socketIo = require('socket.io')

var eventBus = require('./pubsub')

module.exports = function(httpServer) {
	var io = socketIo(httpServer)

	// Socket.io server
	io.on('connect', function(socket){
		// console.log('Connected')
		// socket.emit('onopen');

		socket.on('disconnect', function(){
			// console.log('Disconnected')
		})

		socket.on('mess', function(){
			console.log("GOT A MESS");
		})

		socket.on('error', function(err){
			console.log("Error: " + err)
		})
	})


	eventBus.on('article.updated', function(event){
		io.emit('change-article', event)
	})

	eventBus.on('article.deleted', function(event){
		io.emit('delete-article', event)
	})
}
