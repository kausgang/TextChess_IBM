var express = require('express');
const app = require('../app');

const { exec } = require('child_process');



var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {

  
  var chess = req.app.locals.chess;
  var engine = req.app.locals.engine;
  var fen = req.query.fen;

  // console.log(fen);



  
  // engine.postMessage("setoption name skill level value 19")
  engine.postMessage("position fen "+ fen);
  engine.postMessage("go depth 15");

  engine.onmessage = function(line){

    // console.log(line)


    if (line.indexOf("bestmove") > -1) {
      match = line.match(/bestmove\s+(\S+)/);
      if (match) {
          // console.log("Best move: " + match[1]);
          

          // find the engine move in UCI
          var engine_response_UCI = match[1];

          // move the piece
          var engine_move = chess.move(engine_response_UCI, { sloppy: true });

          // find the SAN move
          var SAN_move = engine_move.san;

          // find FEN
          var FEN = chess.fen();

          // Create response JSON
          var parameter = {'engine_move':SAN_move,'FEN':FEN}

          // send response 
          res.send(parameter);
      }


  }}
  
    







});

module.exports = router;
