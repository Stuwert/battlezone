// dragula([document.querySelector(".player1"), document.querySelector(".player2")]);
var array = [{name: "Bing Bong", img:"img/bb.jpg", status:"bench"}, {name: "Bing Bong"}, {name: "Bing Bong"}];
var turnstatus = "player1";

var gameObj = {
  "player1" : {1:null , 2: null, 3: null, 4: null},
  "player2" : {1:null , 2: null, 3: null, 4: null}
}


$(document).ready(function(){



  $(document).on("keydown", "input", addToParty);


})

function addToParty(key){
  var input = $('input').val();
  if (key.keyCode === 13){
    var inputz = nextAvailable(gameObj[turnstatus])
    if (inputz !== null){
      gameObj[turnstatus][inputz] = new newGameObj(array[input].name, array[input].img, array[input].status);
      renderer(turnstatus, inputz);
    }
    if (nextAvailable(gameObj[turnstatus]) === null){
      $('#'+turnstatus).prepend('<p>Party Complete</p>');
      if (turnstatus === "player2"){
        $('p').removeClass('hidden');
        $('input').addClass('hidden');
        activateDragging();
      }
    }
    if(turnstatus === "player1"){
      turnstatus = "player2";
      $("#player1").removeClass('turn')
      $("#player2").addClass('turn')
    }else{
      turnstatus = "player1";
      $("#player2").removeClass('turn')
      $("#player1").addClass('turn')
    }
  }
}

function nextAvailable(playerobj){
  for (pieces in playerobj){
    if (playerobj[pieces] === null){
      return pieces;
    }
  }
  return null;
}

function renderer(inputName, divClass){
  var obj = gameObj[inputName][divClass]
  var printTo = $('<div class="'+ divClass + '"></div>').appendTo("#" + inputName);
  $(printTo).append('<h4>' + obj.name + '</h4>');
  $(printTo).append('<img width="80" height="80" src="'+obj.img+'"/>');

}

function activateDragging(){
  var player1draginto = dragula([document.querySelector(".player1bench"), document.querySelector(".act1")],{
    copy: true
  });
  var player1dragoutof = dragula([document.querySelector(".act1")], {
    removeOnSpill: true
  });

  player1draginto.on("drop", function(el){
    gameObj["player1"][+(el.className[0])].status = "active";
  })

  player1dragoutof.on("remove", function(el){
    gameObj["player1"][+(el.className[0])].status = "bench";
    console.log(gameObj["player1"])
  })

  var player2draginto = dragula([document.querySelector(".player2bench"), document.querySelector(".act2")],{
    copy: true
  });
  var player2dragoutof = dragula([document.querySelector(".act2")], {
    removeOnSpill: true
  });

  player2draginto.on("drop", function(el){
    gameObj["player2"][+(el.className[0])].status = "active";
  })

  player2dragoutof.on("remove", function(el){
    gameObj["player2"][+(el.className[0])].status = "bench";
    console.log(gameObj["player1"])
  })

}

function newGameObj(name, image, status){
  this.name = name;
  this.status = status;
  this.img = image;
}
