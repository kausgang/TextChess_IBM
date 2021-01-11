


$(document).ready(function(){

    //set starting position if page is loaded
    // document.cookie='fen=rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    document.cookie='fen=rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
    document.cookie='new_game=True'
    document.cookie='validate_move='


    //start board fen
    var FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';


    

    var board1 = Chessboard('board1', 'start')
    // var board2 = Chessboard('board2', 'clear')

    var move_counter = 0;
    var play_as_black = false;
    var movelist = [];


    var engine_level = $("#engine_level").val()
    // console.log(engine_level)

    $("#engine_level").on('change', function() {
        // alert( this.value );
        engine_level = this.value;
        // console.log(engine_level)
      });


    $("#board1").hide();
    $("#board2").hide();
    $("#play_as_white").hide();


    // load the board position if move is clicked
    $("#PGNTable").on("click", "td", function() { 
        var move_fen = $(this).data().fen
        board1.position(move_fen)

        // also load the copy FEN button with the move FEN
        $("#copy_fen").attr("data-clipboard-text",move_fen)
    });


      // copy fen 
      $("#copy_fen").click(function(){
        
        if($(this).attr("data-clipboard-text") == undefined){
            $(this).attr("data-clipboard-text",FEN)
        }
        new ClipboardJS('#copy_fen');
        alert("FEN copied to clipboard")
    })

    // Export PGN
    $("#export_pgn").click(function(){

        new ClipboardJS('#export_pgn');
        alert("PGN copied to clipboard")
        // console.log(movelist)
    })

        // SHOW/HIDE board
    $("#show-hide_button").click(function(){
        
        if($(this).text() == "Show Board")
        {
            $("#board2").hide();
            $("#board1").show();
            $(this).text("Hide Board");
            $("#empty_board").hide();
        }
        else
        {
            $("#board2").hide();
            $("#board1").hide();
            $(this).text("Show Board");
            $("#empty_board").show();
        
        }
                    
    });

    // show Empty board
    $("#empty_board").click(function(){
        
        if($(this).text() == "Show Empty Board")
        {
            
            $("#board1").hide();
            $("#board2").show();
            $(this).text("Hide Empty Board");
            $("#show-hide_button").hide()
        }
        else
        {
            $("#board2").hide();
            $(this).text("Show Empty Board");
            $("#show-hide_button").show()

        }
                    
    });


    









    function engine_move(){

        $.get('/engine_move',{'engine_level': engine_level},function(engine_response,eng_err) {

                                
            // console.log(engine_response)

            // receive the engine move
            var engine_move = engine_response.engine_move;

            // capture FEN
            FEN = engine_response.FEN
            // FEN = decodeURIComponent(engine_response.FEN)
            // console.log(FEN)
            

            //update the taable with the engine move
            // $("#PGNTable").find("tr").last().append('<td>'+engine_move+'</td>');
            // $("#PGNTable").append('<td></td><td></td><td>'+engine_move+'</td>');
            if(play_as_black == true){

                // $("#PGNTable").append('<tr><td> '+ (++move_counter)+' .</td>'+'<td>'+engine_move+' </td></tr>');
                $("#PGNTable").append('<tr><td> '+ (++move_counter)
                +' .</td>'+'<td id="Move" data-FEN="'+ FEN +'" >'
                +'<a href="#">'
                +engine_move+' </td></tr>');


                // push move in movelist
                movelist.push(move_counter+". "+engine_move)

            }
            else{

                // $("#PGNTable").append('<td></td><td></td><td>'+engine_move+'</td>');
                $("#PGNTable").append('<td></td><td></td>'
                +' .</td>'+'<td id="Move" data-FEN="'+ FEN +'" >'
                +'<a href="#">'
                +engine_move+'</td>'); 

                // push move in movelist
                movelist.push(" "+engine_move)
            }
                

            //  4. update board fen
            // FEN = engine_response.FEN;
            board1.position(FEN)

            
            // save move in copy fen button
            $("#copy_fen").attr("data-clipboard-text",FEN)

            // save the PGN into export pgn button
            $("#export_pgn").attr("data-clipboard-text",movelist)
            

            // Scroll the PGN table to the end move
            var scrollBottom = 0;
            scrollBottom = Math.max($('#PGNTable').height() - $('#pgn').height() + 20, 0);
    
            if(scrollBottom > 0)
            {
    
                var height = $('#PGNTable').height();
                // $('#PGNTable').scrollTop(scrollBottom);
                $('#pgn').scrollTop(height);
                
            }


            // check for checkmate
            var checkmate = engine_response.checkmate;
            // console.log(checkmate)
            if(checkmate){
                alert("Checkmate")
                document.getElementById("input").disabled = true;
            }
            

        
        })

    }
    
  


    // Input move 
    $("#input").keypress(function(event) {

        if (event.keyCode == 13) {
            // alert('Entered');

            // 1. get the move from input field and empty the input field
            move = $('#input').val();
            $('#input').val('');

            // 2. prevent blank value from entering
            if(move == ''){
                alert ("enter valid move");
                return
            }
            
            
        
            
        
            // // scroll the pgn table to the end
            // var scrollBottom = 0;
            // scrollBottom = Math.max($('#PGNTable').height() - $('#pgn').height() + 20, 0);

            // if(scrollBottom > 0)
            // {

            //     var height = $('#PGNTable').height();
            //     // $('#PGNTable').scrollTop(scrollBottom);
            //     $('#pgn').scrollTop(height);
                
            // }
                



            // 2. Check if this is a leagal move
            $.get('/validate_move',{move:move},function(res,err) {

                document.cookie='new_game=False'
                
                if(res == 'Illegal Move')
                    alert('Illegal Move, Chess moves are case sensetive')
                // if(res == 'Valid Move')
                if(res.validity == 'Valid Move')
                {

                    FEN = res.FEN;
                    // FEN = decodeURIComponent(res.FEN)
                    // console.log(FEN)

                    // 3. enter move into table
                    //  document.getElementById("PGNTable").insertRow(-1).innerHTML = '<td>'+ (++move_counter)+'</td>'+'<td>'+move+'</td>';
                    // $("#PGNTable").append('<tr><td> '+ (++move_counter)+' </td>'+'<td> '+move+' </td></tr>');
                    if(play_as_black == true){

                        // $("#PGNTable").append('<td></td><td></td><td>'+move+'</td>');
                        $("#PGNTable").append('<td></td><td></td>'
                        +' .</td>'+'<td id="Move" data-FEN="'+ FEN +'" >'
                        +'<a href="#">'
                        +move+'</td>');
                        
                        // push move in movelist
                        movelist.push(" "+move)
                    }
                    else
                    {
                        // $("#PGNTable").append('<tr><td> '+ (++move_counter)+' .</td>'+'<td id="Move"> <a href=# data-FEN="'+ FEN +'" >'+move+' </td></tr>');
                        $("#PGNTable").append('<tr><td> '+ (++move_counter)
                            +' .</td>'+'<td id="Move" data-FEN="'+ FEN +'" >'
                            +'<a href="#">'
                            +move+' </td></tr>');
                        
                        // push move in movelist
                        movelist.push(move_counter+". "+move)
                    }
                        // $("#PGNTable").append('<tr><td> '+ (++move_counter)+' .</td>'+'<td>'+move+' </td></tr>');

                    //  4. update board fen
                    board1.position(FEN)
                    // board1.position(res.FEN) 

                    // save move in copy fen button
                    $("#copy_fen").attr("data-clipboard-text",FEN)


                    // save the PGN into export pgn button
                    $("#export_pgn").attr("data-clipboard-text",movelist)

                    // Scroll the PGN table to the end move
                    var scrollBottom = 0;
                    scrollBottom = Math.max($('#PGNTable').height() - $('#pgn').height() + 20, 0);
            
                    if(scrollBottom > 0)
                    {
            
                        var height = $('#PGNTable').height();
                        // $('#PGNTable').scrollTop(scrollBottom);
                        $('#pgn').scrollTop(height);
                        
                    }
                    
                
                    // check for checkmate
                    var checkmate = res.checkmate;
                    if(checkmate){
                        alert("Checkmate")
                        document.getElementById("input").disabled = true;
                        // break;
                    }
                        





                    // check if validate cookie is set
                    // check if validateMove has run by checking cookie
                    // var user_move_done = true

                 

                    // while(user_move_done){
                    //     validate_move = getCookie('validate_move')
                    //     console.log('validate_move_done status - ',validate_move)
                    //     if(validate_move == 'valid_move'){
                            
                    //         user_move_done=false



                    

                    //                             //  5. find engine response to the move

                    engine_move()


           
                    

                }
                
                                                    
            })

        
        }
    });








    //if played as black
    $("#play_as_black").click(function(){

        //hide the play as button
        $(this).hide();
        $("#play_as_white").show();
        

        // set play as black flag = true
        play_as_black = true;

        
        // console.log(FEN)

        //set the board orientation as black
        board1.orientation('black')
        
        // start with engine move
        $.get('/engine_move',{'engine_level': engine_level},function(engine_response,eng_err) {

                        
            // console.log(engine_response)

            // receive the engine move
            var engine_move = engine_response.engine_move;

            // capture FEN
            FEN = engine_response.FEN
            // FEN = decodeURIComponent(engine_response.FEN)
            console.log(FEN)

            //update the taable with the engine move
            // $("#PGNTable").find("tr").last().append('<td>'+engine_move+'</td>');
            // $("#PGNTable").append('<tr><td> '+ (++move_counter)+' </td>'+'<td>'+engine_move+' </td></tr>');
            $("#PGNTable").append('<tr><td> '+ (++move_counter)
                            +' .</td>'+'<td id="Move" data-FEN="'+ FEN +'" >'
                            +'<a href="#">'
                            +engine_move+' </td></tr>');

            // push move in movelist
            movelist.push(move_counter+". "+engine_move)

            //  4. update board fen
            // FEN = engine_response.FEN;
            board1.position(FEN)

            
            // save move in copy fen button
            $("#copy_fen").attr("data-clipboard-text",FEN)
            
            // save the PGN into export pgn button
            $("#export_pgn").attr("data-clipboard-text",movelist)
            
             // // scroll the pgn table to the end
            var scrollBottom = 0;
            scrollBottom = Math.max($('#PGNTable').height() - $('#pgn').height() + 20, 0);

            if(scrollBottom > 0)
            {

                var height = $('#PGNTable').height();
                // $('#PGNTable').scrollTop(scrollBottom);
                $('#pgn').scrollTop(height);
                
            }


               // check for checkmate
               var checkmate = engine_response.checkmate;
               if(checkmate){
                   alert("Checkmate")
                   document.getElementById("input").disabled = true;
               }
            
        })
    })






    $("#play_as_white").click(function(){

        play_as_black=false;
        $(this).hide();
        $("#play_as_black").show();
        board1.orientation('white');

        // start with engine move
        $.get('/engine_move',{'engine_level': engine_level},function(engine_response,eng_err) {


                        
            // console.log(engine_response)

            // receive the engine move
            var engine_move = engine_response.engine_move;

            // capture FEN
            FEN = engine_response.FEN
            // FEN = decodeURIComponent(engine_response.FEN)
            console.log(FEN)

            //update the taable with the engine move
            // $("#PGNTable").find("tr").last().append('<td>'+engine_move+'</td>');
            // $("#PGNTable").append('<tr><td> '+ (++move_counter)+' </td>'+'<td>'+engine_move+' </td></tr>');
            $("#PGNTable").append('<td></td><td></td>'
                            +' .</td>'+'<td id="Move" data-FEN="'+ FEN +'" >'
                            +'<a href="#">'
                            +engine_move+'</td>'); 

            // push move in movelist
            movelist.push(" "+engine_move)

            //  4. update board fen
            // FEN = engine_response.FEN;
            board1.position(FEN)
            
            // save move in copy fen button
            $("#copy_fen").attr("data-clipboard-text",FEN)

            // save the PGN into export pgn button
            $("#export_pgn").attr("data-clipboard-text",movelist)
            
             // // scroll the pgn table to the end
            var scrollBottom = 0;
            scrollBottom = Math.max($('#PGNTable').height() - $('#pgn').height() + 20, 0);

            if(scrollBottom > 0)
            {

                var height = $('#PGNTable').height();
                // $('#PGNTable').scrollTop(scrollBottom);
                $('#pgn').scrollTop(height);
                
            }

               // check for checkmate
               var checkmate = engine_response.checkmate;
            //    console.log(checkmate)
               if(checkmate){
                   alert("Checkmate")
                   document.getElementById("input").disabled = true;
               }

         })


    })







});




function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }


  function checkCookie(cname) {
    var iscset = getCookie(cname);
    if (iscset != "") 
     return true
    else {
        // consele.log('checking again')
        return false
    }
      
      
}
  
