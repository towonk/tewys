const express = require( 'express' );
const router = express.Router();

router.get('/', async (req, res) => {
    //res.send('Hola desde las rutas');
    res.render('index');
});

module.exports = router;