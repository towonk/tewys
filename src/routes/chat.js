const express = require('express');
const router = express.Router();


const pool = require('../database');//es la conecion a base de datos, pero de momento le llamamos pool
const { isLoggedIn } = require('../lib/auth');




//isLoggedIn
router.get('/chat', (req, res) => {
    //res.send("estoy en el chat");
    res.render('chat/chatgeneral');
});



module.exports = router;