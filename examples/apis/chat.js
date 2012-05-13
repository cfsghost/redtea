
module.exports = {
	Chat: Chat
};

function Chat() {
	this.conversation = [
		'First',
		'Second'
	];
}

Chat.prototype.getUserList = function() {
};

Chat.prototype.say = function() {
	console.log('SAY()');
};

