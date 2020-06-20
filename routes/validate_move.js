var express = require('express');
const app = require('../app');




var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {

  var move = req.query.move;
  var chess = req.app.locals.chess;
  var fen = req.app.locals.fen;




  var validate  = chess.move(move, { sloppy: true });
  
  if (validate == null)
    res.send("Illegal Move");
  else
  {
    fen = chess.fen(); //send the fen to main.js after valid move so it can update board
    var parameters = {'validity':'Valid Move','FEN':fen} //send 

    req.app.locals.fen = chess.fen(); //update global fen ; maybe redundent operation

    // res.send('Valid Move')
    res.send(parameters)
  }
    







});

module.exports = router;
