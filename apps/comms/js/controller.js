if(
	localStorage.comm_user == undefined ||
	localStorage.comm_session == undefined ||
	localStorage.comm_id == undefined
){
	location.href = "error.html?t=You're%20not%20logged%20in,%20try%20going%20back%20to%20the%20app%20list%20and%20logging%20in%20from%20there";
}
var lastMessageAuthor = "yourmomlolololool";
function encode(str, secret){
  var encoded = "";
  for (i=0; i<str.length;i++) {
    var a = str.charCodeAt(i);
    var b = a ^ secret;
    encoded = encoded+String.fromCharCode(b);
  }
  return encoded;
}
var typers = [];
function scrollToBottom(e){
	e.scrollTop = e.scrollHeight;
}
/*
stringToColor taken from jsfiddle posted by https://stackoverflow.com/users/108907/joe-freeman
*/
var stringToColor = function(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = '#';
    for (var i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 0xFF;
        colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
}
function updateTypers(){
	if(typers.length == 1){
		elem("typers_txt").textContent = typers[0]+" is typing...";
	} else if(typers.length == 0){
		elem("typers_txt").innerHTML ="&nbsp;";
	} else if(typers.length == 2){
		elem("typers_txt").textContent = `${typers[0]} and ${typers[1]} are typing...`;
	} else if (typers.length > 2){
		var str = "";
		for(var i = 0; i+2<typers.length;i++){
			str=str+typers[i]+", ";
		}
		str=str+typers[typers.length-2]+" and "+typers[typers.length-1]+" are typing...";
		elem("typers_txt").textContent =str;
	}
}
function decode(m,s){
	var decoded = "";
	for(var i = 0; i<m.length; i++){
		var b = m[i].charCodeAt(0);
		var a = b ^ s;
		decoded = decoded+""+String.fromCharCode(a);
	}
	return decoded;
}
function verified(msg){
	if(msg.verified == "owner"){
		return `${msg.name}&nbsp;<span class="verf" title="Owner/Creator"><img src="../css/owner.svg"><span class="verf" title="Administrator"><img src="../css/admin.svg"></span><span class="verf" title="Known User"><img src="../css/user.svg"></span>&nbsp;`
	} else if(msg.verified == "admin"){
		return `${msg.name}&nbsp;<span class="verf" title="Administrator"><img src="../css/admin.svg"></span><span class="verf" title="Known User"><img src="../css/user.svg"></span>&nbsp;`
	} else if(msg.verified == "user"){
		return `${msg.name}&nbsp;<span class="verf" title="Known User"><img src="../css/user.svg"></span>&nbsp;`
	} else {
		return msg.name;
	}
}
var socket = io("https://secure.4sure.ml");
socket.emit("login", {
	user: localStorage.comm_user,
	id: localStorage.comm_id,
	session: localStorage.comm_session
});
var typingState = false;
socket.on("message", (msg)=>{
	msg.msg = decode(msg.msg,msg.time);
	var div = document.createElement("div");
	div.setAttribute("class", "msg");
	msg.msg=msg.msg.replaceAll("<","&lt;",).replaceAll(">", "&gt;");
	if(lastMessageAuthor!=msg.name){
		div.innerHTML = `<div class="msg_bar"><p style="color:${stringToColor(msg.name)};">${verified(msg)} <span class="msg_time">at ${new Date(msg.time).toLocaleString()}</span></p></div><div class="msg_text"><p>${msg.msg}</p></div>`;
		lastMessageAuthor=msg.name;
	} else {
		div.setAttribute("class", "msg reduced_margin");
		div.innerHTML = `<div class="msg_text"><p>${msg.msg}</p></div>`;
	}
	elem("msg_wrapper").appendChild(div);
	scrollToBottom(elem("msg_wrapper"));
});
socket.on("type", (data) => {
	if(data.name != localStorage.comm_user){
		if(data.state == true && typers.indexOf(data.name)==-1){
			typers.push(data.name);
		} else if (!data.state && typers.indexOf(data.name)!=-1){
			typers.splice(typers.indexOf(data.name), 1);
		}
		updateTypers();
	}
});
socket.on("ban", (data) => {
	if(data.user == localStorage.comm_user){
		delete localStorage.comm_user;
		delete localStorage.comm_session;
		delete localStorage.comm_id;
		location.href="../../index.html";
	}
});
socket.on("aping", () => {
	setTimeout(function(){
		socket.emit("apong", {
			name: localStorage.comm_user,
			session: localStorage.comm_session
		});
	}, (Math.floor(Math.random() * (500 - 0 + 1)) + 500));
});
socket.on("active", (a) => {
	document.getElementById("online_txt").textContent = "Online: "+a.join(", ");
});
function elem(id){
	return document.getElementById(id);
}
elem("msg_input").addEventListener("keyup", function(e){
	if(e.key=="Enter"){
		sendMessage();
	}
	if(!typingState){
		if(elem("msg_input").value!=""){
			typingState=true;
			socket.emit("type", {
				state: typingState,
				name: localStorage.comm_user,
				session: localStorage.comm_session
			});
		}
	}
	if(typingState){
		if(elem("msg_input").value==""){
			typingState=false;
			socket.emit("type", {
				state: typingState,
				name: localStorage.comm_user,
				session: localStorage.comm_session
			});
		}
	}
});
function sendMessage(){
	var m = elem("msg_input").value;
	if(m!=""&&m.length<256){
		var d = new Date();
		socket.emit("message", {
			time : d.getTime(),
			msg: encode(m,d.getTime()),
			session: localStorage.comm_session,
			name: localStorage.comm_user
		});
		elem("msg_input").value = "";
	}
}