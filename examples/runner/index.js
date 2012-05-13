
RedTea.import();

RedTea.main(function() {
	var chat = new RedTea.API.Chat;

	//console.log(chat.conversation[0]);
	console.log(RedTea.API);
	console.log(chat);
	console.log(chat.conversation);

	chat.say();
});
