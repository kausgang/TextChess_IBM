var express = require('express');
const { engine } = require('../app');
const app = require('../app');





var router = express.Router();


router.get('/', function(req, res, next) {

  var move = req.query.move;
  
  var chess = req.app.locals.chess;
  

  //read the cookie set by index.js
  var fen = req.cookies['fen']
  var engine_level = req.cookies['engine_level']

  // make sure that fen is read from cookie before maaking move
  var read_cookie = Promise.resolve([fen,engine_level]);

  // if the cookie was successfully read then - 
  read_cookie.then(function(arr) {

      chess.load(arr[0]) //fen was sent at 0th position of array using resolve

     
      
      var validate  = chess.move(move, { sloppy: true });
      
      if (validate == null)
        res.send("Illegal Move");
      else
      {
        fen = chess.fen(); //send the fen to main.js after valid move so it can update board
        // var parameters = {'validity':'Valid Move','FEN':fen} //send 

   
         // check for checkmate
        checkmate = chess.in_checkmate()
        if(checkmate)
          var parameters = {'validity':'Valid Move','FEN':fen,'checkmate':true} //send
        else
          var parameters = {'validity':'Valid Move','FEN':fen,'checkmate':false} //send  
        
        // update cookie
        res.cookie('fen',fen,{overwrite: true})
        res.cookie('engine_level',engine_level,{overwrite: true})

        // res.send('Valid Move')
        res.send(parameters)

      }
        

  });



  






});

module.exports = router;
