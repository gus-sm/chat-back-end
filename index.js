const http = require('http');
const {Server} =require('socket.io'); 

const createRoom = require("logic_module/room");
const createChat = require("logic_module/chat");

//const app = express(),
webserver = http.createServer(),
sockets = new Server(webserver, {
  cors:{
    origin: "*"
  }
})


const room = createRoom();
const chat = createChat();


room.subscribe((command) => {
  console.log("[ROOM] - emitindo para todos os sockets ativos");
  sockets.emit(command.eType, command) //notifica TODOS os sockets abertos
});

chat.subscribe((command) => {
  console.log("[CHAT] - emitindo para todos os sockets ativos");
  sockets.emit(command.eType, command) //notifica TODOS os sockets abertos
});

sockets.on("connection", (socket) => {
  room.addUser(socket.id);
  socket.emit("setup", {room_state: room.state, chat_state: chat.state});

  socket.on("disconnect",()=>{
    console.log("disconnect")
    room.removeUser(socket.id);
    //socket.emit("remove_user",socket.id);

  });

  socket.on("add-message", (obj)=>{
    console.log("recebido mensagem "+obj.message +" de "+obj.userId);
    chat.addMessage(obj.userId, obj.message);
  })

});


webserver.listen(3001, ()=>{
  console.log("running");
});