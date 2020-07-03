const socket = io();

//elementos del DOM
let message = document.getElementById('message');
let username = document.getElementById('username');
let btn = document.getElementById('send');
let output = document.getElementById('output');
let actions = document.getElementById('actions');

btn.addEventListener('click', function (){
    socket.emit('chatMensajeNavegador', {
        message: message.value,
        username: username.value
    });
});

message.addEventListener('keypress', function (){
    console.log(username.value);
    socket.emit('chatEscribiendoNavegador', username.value);
});

socket.on('chatMensajeRetorno', function (data){
    actions.innerHTML = '';
    output.innerHTML += `<p><strong>${data.username}</strong>: ${data.message}</p>`;
});

socket.on('chatEscribiendoRetorno', function (data){
    actions.innerHTML = `<p><em>${data} esta escribiendo</em></p>`;
});