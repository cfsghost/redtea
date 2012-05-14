
module.exports = {
	Chat: Chat
};

function Chat(externalData) {
	this.externalData = externalData;
	this.publicData = externalData.userdata;
}

Chat.prototype.getUserList = function(callback) {

	callback(null, this.publicData.users);
};

Chat.prototype.getConversation = function(callback) {

	callback(null, this.publicData.conversation);
};

Chat.prototype.say = function(name, content) {
	var line = {};
	line[name] = content;

	this.publicData.conversation.push(line);
};

