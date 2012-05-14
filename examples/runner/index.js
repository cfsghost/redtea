
RedTea.import();

RedTea.main(function() {
	var chat = new RedTea.API.Chat;

	chat.say('Fred', 'Hello World!');
	chat.say('Fred', 'Hello World!');
	chat.say('Fred', 'Hello World!');
	chat.say('Fred', 'Hello World!');
	chat.say('Fred', 'Hello World!');
	chat.getConversation(function(err, data) {
		for (var i in data) {
			var lineObj = data[0];
			document.getElementById('conversation').innerHTML += lineObj.name + ':' + lineObj.content + '<br>';
		}
	});

});
