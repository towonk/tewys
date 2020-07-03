const express = require( 'express' );
const morgan = require( 'morgan' );
const exphbs = require( 'express-handlebars' );
const path = require('path');//ruta
const flash = require('connect-flash');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const passport = require('passport');
const SocketIO = require('socket.io');
const { database } = require('./keys');


//inicializamos
const app =  express();
require('./lib/passport');

//configurando ... https://www.youtube.com/watch?v=0wqteZNqruc ...   https://www.youtube.com/watch?v=qJ5R9WTW0_E
//https://www.youtube.com/watch?v=ik-6BA8D2RA
app.set('port', process.env.PORT || 4000 );
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
  }));
app.set('view engine', '.hbs');


//middlewares
app.use(session({
    secret: 'tewysmysqlnodemysql',
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(database)
  }));
app.use(flash());
app.use( morgan('dev') );
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());


//variables globales
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
        
    next();
});


//rutas
app.use( require('./routes') );
app.use( require('./routes/authentication') );
app.use( '/links', require('./routes/links') );
app.use( require('./routes/chat') );

//Public
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