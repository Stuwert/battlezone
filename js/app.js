// dragula([document.querySelector(".player1"), document.querySelector(".player2")]);
var array = [{name: "Bing Bong"}, {name: "Bing Bong"}, {name: "Bing Bong"}];
var turnstatus = "player1";

var gameObj = {
  "player1" : {1:null , 2: null, 3: null, 4: null},
  "player2" : {1:null , 2: null, 3: null, 4: null}
}

dragula([document.querySelector(".bench"), document.querySelector(".active")]);

$(document).ready(function(){


  $(document).on("keydown", "#" + turnstatus, addToParty);


})

function addToParty(key){
  console.log(turnstatus)
  var classist = $(this).attr('id');
  var input = $('input').val();
  if (key.keyCode === 13){
    var inputz = nextAvailable(gameObj[classist])
    console.log(inputz);
    if(turnstatus === "player1"){
      turnstatus = "player2";
      $("#player1").parent().removeClass('turn')
      $("#player2").parent().addClass('turn')
      $(document).off("keydown", "#player1");
      $(document).on("keydown", "#player2", addToParty);
    }else{
      turnstatus = "player1";
      $("#player2").parent().removeClass('turn')
      $("#player1").parent().addClass('turn')
      $(document).off("keydown", "#player2");
      $(document).on("keydown", "#player1", addToParty);
    }
    if (inputz !== null){
      gameObj[classist][inputz] = array[input];
    }else{
      // alert("BingBong")
    }
    if (nextAvailable(gameObj[classist]) === null){
      $('.'+classist+'bench').find('input').after('<p>Party Complete</p>');
    }
  }
}

function nextAvailable(playerobj){
  console.log(playerobj)
  for (pieces in playerobj){
    if (playerobj[pieces] === null){
      return pieces;
    }
  }
  return null;
}

function renderer(){
  for (players in gameObj){
    for(pieces in gameObj[players]){
      if (gameObj[players][pieces] !== null){
        $
      }
    }
  }
}
