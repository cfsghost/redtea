
RedTea.import();

RedTea.main(function() {
	var chat = new RedTea.API.Chat;

	chat.say('Fred', 'Hello World!');
	chat.say('Fred', 'Hello World!');
	chat.say('Fred', 'Hello World!');
	chat.say('Fred', 'Hello World!');
	chat.say('Fred', 'Hello World!');
	chat.getConversation(function(err, data) {
		console.log(data);
	});

});
