// dragula([document.querySelector(".player1"), document.querySelector(".player2")]);
var array = [{name: "Bing Bong", img:"img/bb.jpg", status:"bench"}, {name: "Bing Bong"}, {name: "Bing Bong"}];
var turnstatus = "player1";

var gameObj = {
  "player1" : {1:null , 2: null, 3: null, 4: null},
  "player2" : {1:null , 2: null, 3: null, 4: null}
}


$(document).ready(function(){

  var player1draginto = dragula([document.querySelector(".player1bench"), document.querySelector(".act1")],{
    copy: true
  });
  var player1dragoutof = dragula([document.querySelector(".act1")], {
    removeOnSpill: true
  });
  player1draginto.on("drop", function(el, target, source){
    console.log(target);
    if(source.className.includes("bench")){
      if(target.className.includes("act1")){
        gameObj["player1"][+(el.className[0])].status = "active";
        // alert("Bing");
      }
    }
  })

  player1dragoutof.on("remove", function(el){
    gameObj["player1"][+(el.className[0])].status = "benched";
    console.log(gameObj["player1"]);
  })

  dragula([document.querySelector(".player2bench"), document.querySelector(".act2")],{
    copy: true
  });
  dragula([document.querySelector(".act2")], {
    removeOnSpill: true
  });

  $(document).on("keydown", "#" + turnstatus, addToParty);


})

function addToParty(key){
  var classist = $(this).attr('id');
  var input = $('input').val();
  if (key.keyCode === 13){
    var inputz = nextAvailable(gameObj[classist])
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
      renderer(classist, inputz);
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

function renderer(inputName, divClass){
  var obj = gameObj[inputName][divClass]
  var printTo = $("#" + inputName).siblings('.' + divClass);
  // console.log(printTo);
  $(printTo).append('<h4>' + obj.name + '</h4>');
  $(printTo).append('<img class ="'+ divClass + '"width="80" height="80" src="'+obj.img+'"/>');

}
