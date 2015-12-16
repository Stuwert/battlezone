// dragula([document.querySelector(".player1"), document.querySelector(".player2")]);
var turnstatus = "player1";

var gameObj = {
  "player1" : {1:null },
  "player2" : {1:null }
}


$(document).ready(function(){
  $(document).on("keydown", "input", addToParty);
  $('.player1').on('click', '[class^="attack"]', selectAttack);
  $('.player2').on('click', '[class^="attack"]', selectAttack);
  $('.input').on('click', 'button', function(){
    var chars1 = returnActiveChar(gameObj["player1"]);
    var chars2 = returnActiveChar(gameObj["player2"]);
    fightLoop(chars1, chars2);
  })
})

function selectAttack(){
  $(this).css({"opacity" : "0.5"});
  $(this).siblings().css({"opacity" : 1});
  var attacknum = $(this).attr('class');
  var playerchar = $(this).parent().parent().attr('class');
  var playernum = $(this).parent().parent().parent().attr('class');
  attackstatus[playernum] = gameObj[playernum][playerchar][attacknum];
  revealFightButton();
}

function revealFightButton(){
  for (attacks in attackstatus){
    if (attackstatus[attacks] === null){
      return;
    }
  }
  $('.input').animate({"height" : "50", "width" : "200"}, 500);
  $('#printout').removeClass('hidden');
  $('#fight').find('p').addClass('hidden');
  $('#fight').find('button').removeClass('hidden');
}

function addToParty(key){
  var input = $('input').val();
  if (key.keyCode === 13){
    var parameterz = {
      query: input
    }
    tmdb.call("/search/person", parameterz, response, failure);
  }

  function response(response){
    var actor = response["results"][0];
    var movie0 = actor["known_for"][0];
    var movie1 = actor["known_for"][1]
    var actorArmor = 0;
    actor["known_for"].forEach(function(item){
      actorArmor += item["vote_average"];
    })
    var inputz = nextAvailable(gameObj[turnstatus]);
    gameObj[turnstatus][inputz] = new newGameObj(actor.name, actorArmor, actor.popularity, actor["profile_path"], movie0["poster_path"], movie1["poster_path"], movie0["popularity"], movie1["popularity"]);
    renderer(turnstatus, inputz);
    $('input').val("")
    fullCheck();
  }

  function failure(){
    console.log("Stuart is Sad.")
  }

}

function fullCheck(){
  if(nextAvailable(gameObj[turnstatus]) === null){
    if(turnstatus === "player1"){
      switchTurn();
    }else{
      $('#playerselect').removeClass('hidden');
      $('#playerselect').children().removeClass('hidden');
      $('#populatebench').children().addClass('hidden');
      $('#populatebench').addClass('hidden');
      $('.bench').removeClass('turn');
      activateDragging();
    }
  }else{
    switchTurn();
  }
}

function switchTurn(){
  if(turnstatus === "player1"){
    turnstatus = "player2";
    $("#player1").removeClass('turn')
    $("#player2").addClass('turn')
    $('#populatebench').find('h4').html("Player 2, Choose Character " + nextAvailable(gameObj[turnstatus]));
  }else{
    turnstatus = "player1";
    $("#player2").removeClass('turn')
    $("#player1").addClass('turn')
      $('#populatebench').find('h4').html("Player 1, Choose Character " + nextAvailable(gameObj[turnstatus]));
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
  $(printTo).append('<img width="60" height="80" src="'+obj.img+'"/>');
  $(printTo).append('<div class="posters"></div>')
  $(printTo).find('.posters').append('<img class="attack1" width="40" height="60" src="'+obj.attack1.img+'"/>')
  $(printTo).find('.posters').append('<img class="attack2" width="40" height="60" src="'+obj.attack2.img+'"/>')

}

function activateDragging(){
  var player1draginto = dragula([document.querySelector("#player1"), document.querySelector(".player1")],{
    copy: true,
    invalid: function (el){
      return el.className.includes("fainted");
    }
  });
  var player1dragoutof = dragula([document.querySelector(".player1")], {
    removeOnSpill: true
  });

  player1draginto.on("drop", function(el){
    gameObj["player1"][+(el.className[0])].status = "active";
    if(activeCheck()){
      $('#playerselect').addClass('hidden');
      $('#playerselect').children().addClass('hidden');
      $('#fight').removeClass('hidden');
      $('#fight').find('p').removeClass('hidden');
    }
  })

  player1dragoutof.on("remove", function(el){
    gameObj["player1"][+(el.className[0])].status = "bench";
    $('#playerselect').removeClass('hidden');
    $('#playerselect').children().removeClass('hidden');
    $('#fight').addClass('hidden');
    $('#fight').children().addClass('hidden');
  })

  var player2draginto = dragula([document.querySelector("#player2"), document.querySelector(".player2")],{
    copy: true,
    invalid: function (el){
      return el.className.includes("fainted");
    }

  });

  var player2dragoutof = dragula([document.querySelector(".player2")], {
    removeOnSpill: true
  });

  player2draginto.on("drop", function(el){
    gameObj["player2"][+(el.className[0])].status = "active";
    if(activeCheck()){
      $('#playerselect').addClass('hidden');
      $('#playerselect').children().addClass('hidden');
      $('#fight').removeClass('hidden');
      $('#fight').find('p').removeClass('hidden');
    }
  })

  player2dragoutof.on("remove", function(el){
    gameObj["player2"][+(el.className[0])].status = "bench";
    $('#playerselect').removeClass('hidden');
    $('#playerselect').children().removeClass('hidden');
    $('#fight').addClass('hidden');
    $('#fight').children().addClass('hidden');
  })

}

function activeCheck(){
  var activeOne = isActive(gameObj["player1"]);
  var activeTwo = isActive(gameObj["player2"]);
  return activeOne && activeTwo ? true : false;

}

function isActive(player){
  for (var fighters in player){
    if(player[fighters].status === "active"){
      return true;
    }
  }
  return false;
}
