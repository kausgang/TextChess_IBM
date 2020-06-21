


$(document).ready(function(){

    //start board fen
    var FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

    var board1 = Chessboard('board1', 'start')
    var board2 = Chessboard('board2', 'clear')

    var move_counter = 0;
    var play_as_black = false;
    var engine_evaluation = 0



    $("#board1").hide();
    $("#board2").hide();


    // load the board position if move is clicked
    $("#PGNTable").on("click", "td", function() { 
        
            
    var move_fen = $(this).data().fen
    board1.position(move_fen)


    });




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
                
                if(res == 'Illegal Move')
                    alert('Illegal Move, Chess moves are case sensetive')
                // if(res == 'Valid Move')
                if(res.validity == 'Valid Move')
                {

                    FEN = res.FEN;

                    // 3. enter move into table
                    //  document.getElementById("PGNTable").insertRow(-1).innerHTML = '<td>'+ (++move_counter)+'</td>'+'<td>'+move+'</td>';
                    // $("#PGNTable").append('<tr><td> '+ (++move_counter)+' </td>'+'<td> '+move+' </td></tr>');
                    if(play_as_black == true)
                        // $("#PGNTable").append('<td></td><td></td><td>'+move+'</td>');
                        $("#PGNTable").append('<td></td><td></td>'
                        +' .</td>'+'<td id="Move" data-FEN="'+ FEN +'" >'
                        +'<a href="#">'
                        +move+'</td>');                    
                    else
                    {
                        // $("#PGNTable").append('<tr><td> '+ (++move_counter)+' .</td>'+'<td id="Move"> <a href=# data-FEN="'+ FEN +'" >'+move+' </td></tr>');
                        $("#PGNTable").append('<tr><td> '+ (++move_counter)
                            +' .</td>'+'<td id="Move" data-FEN="'+ FEN +'" >'
                            +'<a href="#">'
                            +move+' </td></tr>');
                        
                    }
                        // $("#PGNTable").append('<tr><td> '+ (++move_counter)+' .</td>'+'<td>'+move+' </td></tr>');

                    //  4. update board fen
                    board1.position(FEN)
                    // board1.position(res.FEN) 

                    // Scroll the PGN table to the end move
                    var scrollBottom = 0;
                    scrollBottom = Math.max($('#PGNTable').height() - $('#pgn').height() + 20, 0);
            
                    if(scrollBottom > 0)
                    {
            
                        var height = $('#PGNTable').height();
                        // $('#PGNTable').scrollTop(scrollBottom);
                        $('#pgn').scrollTop(height);
                        
                    }
                    
                


                    //  5. find engine response to the move
                    // $.get('/engine_move',{'fen':res.FEN},function(engine_response,eng_err) {
                    $.get('/engine_move',{'fen':res.FEN},function(engine_response,eng_err) {

                        
                        // console.log(engine_response)

                        // receive the engine move
                        var engine_move = engine_response.engine_move;

                        // capture FEN
                        FEN = engine_response.FEN

                        //update the taable with the engine move
                        // $("#PGNTable").find("tr").last().append('<td>'+engine_move+'</td>');
                        // $("#PGNTable").append('<td></td><td></td><td>'+engine_move+'</td>');
                        if(play_as_black == true)
                            // $("#PGNTable").append('<tr><td> '+ (++move_counter)+' .</td>'+'<td>'+engine_move+' </td></tr>');
                            $("#PGNTable").append('<tr><td> '+ (++move_counter)
                            +' .</td>'+'<td id="Move" data-FEN="'+ FEN +'" >'
                            +'<a href="#">'
                            +engine_move+' </td></tr>');
                        else
                            // $("#PGNTable").append('<td></td><td></td><td>'+engine_move+'</td>');
                            $("#PGNTable").append('<td></td><td></td>'
                            +' .</td>'+'<td id="Move" data-FEN="'+ FEN +'" >'
                            +'<a href="#">'
                            +engine_move+'</td>'); 

                        //  4. update board fen
                        // FEN = engine_response.FEN;
                        board1.position(FEN)
                        

                        // Scroll the PGN table to the end move
                        var scrollBottom = 0;
                        scrollBottom = Math.max($('#PGNTable').height() - $('#pgn').height() + 20, 0);
                
                        if(scrollBottom > 0)
                        {
                
                            var height = $('#PGNTable').height();
                            // $('#PGNTable').scrollTop(scrollBottom);
                            $('#pgn').scrollTop(height);
                            
                        }

                        

                    
                    })


                    

                }
                
                                                    
            })

        
        }
    });








    //if played as black
    $("#play_as").click(function(){

        //hide the play as button
        $(this).hide();

        // set play as black flag = true
        play_as_black = true;

        

        //set the board orientation as black
        board1.orientation('black')
        
        // start with engine move
        $.get('/engine_move',{'fen':FEN},function(engine_response,eng_err) {

                        
            // console.log(engine_response)

            // receive the engine move
            var engine_move = engine_response.engine_move;

            // capture FEN
            FEN = engine_response.FEN

            //update the taable with the engine move
            // $("#PGNTable").find("tr").last().append('<td>'+engine_move+'</td>');
            // $("#PGNTable").append('<tr><td> '+ (++move_counter)+' </td>'+'<td>'+engine_move+' </td></tr>');
            $("#PGNTable").append('<tr><td> '+ (++move_counter)
                            +' .</td>'+'<td id="Move" data-FEN="'+ FEN +'" >'
                            +'<a href="#">'
                            +engine_move+' </td></tr>');

            //  4. update board fen
            // FEN = engine_response.FEN;
            board1.position(FEN)
            
            
        
            
        })
    })
















});