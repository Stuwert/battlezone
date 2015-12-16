// dragula([document.querySelector(".player1"), document.querySelector(".player2")]);
var array = [{name: "Bing Bong"}, {name: "Bing Bong"}, {name: "Bing Bong"}];
var turnstatus = "player1";

var gameObj = {
  "player1" : {1:null , 2: null, 3: null, 4: null},
  "player2" : {1:null , 2: null, 3: null, 4: null}
}

dragula([document.querySelector(".bench"), document.querySelector(".active")]);

$(document).ready(function(){

  $('input').keydown(function(key){
    var input = $('input').val();
    if (key.keyCode === 13){
      var inputz = nextAvailable(gameObj.player1)
      console.log(inputz);
      if (inputz !== null){
        gameObj.player1[inputz] = array[input]
      }else{
        alert("BingBong")
      }
      console.log(gameObj.player1);
    }
  })


})

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
