const url = window.TS_WEB.socketUrl;
const im_token = window.TS_WEB.im_token;
const reg = /^\[\"(.*?);\",/;
function connect (url) {
	// let counter = 0;
	try {
		window.TS_WEB.webSocket = new window.WebSocket(url);
		// window.TS_WEB.webSocket.onopen = evt => {
		// 	onOpen(evt);
		// }
		// window.TS_WEB.webSocket.onmessage = evt => {
		// 	onMessage(evt);
		// }
		// window.TS_WEB.webSocket.onerror = evt => {
		// 	onError(evt);
		// }
	} catch (e) {
		window.console.log(e);
	}
};

function onMessage (message) {
	console.log(message);
	// let messageName = message.data.match(reg);
	let msg = message;
	let messagetype = msg.data.substr(0, 1); // 获取消息第一位判断消息类型
	// console.log(messagetype);
	let data = JSON.parse(msg.data.substr(1)); // 数据转换
	if(messagetype == 4) { // 出现错误

	}
	if(messagetype == 3) {
		// if(data[0] === 'convr.get') { // 获取对话列表

		// }
		if(data[0] === 'convr.msg' ) { // 收到消息

		}
		if(data[0] === '') {
			
		}
	}
};

function onError (error) {

};

function onOpen (evt) {
	window.TS_WEB.webSocket.send('2["convr.get"]');
};

function sendMessage (message) {
	if(window.TS_WEB.webSocket.readyState) {
		window.TS_WEB.socketUrl.send(message);
	} else {
		connect(`${url}?token=${im_token}`);
		sendMessage(message);
	}
}

export {
	connect,
	sendMessage
}