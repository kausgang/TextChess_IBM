var express = require('express');
const app = require('../app');
const { engine } = require('../app');
var router = express.Router();



/* GET home page. */
router.get('/', function(req, res, next) {
 
//  console.log(req.app.locals.chess.ascii()) //retrieve the global chess variable this way


  // // Reset game if page is reloaded
  req.app.locals.chess.reset();

  //render the page
  res.render('index', { title: 'Express' });
  
 
});

module.exports = router;
