const path = require('path');//ruta
const express = require('express');
const app =  express();
const SocketIO = require('socket.io');

//configurando ... https://www.youtube.com/watch?v=0wqteZNqruc
app.set('port', process.env.PORT || 3000 );

//ruta a los archivos estaticos, osea, los que estan en public (html, css, js)
app.use( express.static( path.join( __dirname, 'public' ) ) );

//iniciando el servidor
const server = app.listen(app.get('port'), () =>{
    console.log( 'Servidor en el puerto:', app.get('port') );
});

//websocket
const io = SocketIO(server);
io.on( 'connection', (socket) => {
    console.log("nueva coneccion", socket.id);

    socket.on('chatMensajeNavegador', (data) => {
        io.sockets.emit('chatMensajeRetorno', data);
    });

    socket.on('chatEscribiendoNavegador', (data) =>{
        socket.broadcast.emit('chatEscribiendoRetorno', data);
    });
});