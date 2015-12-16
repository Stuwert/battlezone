// dragula([document.querySelector(".player1"), document.querySelector(".player2")]);
var turnstatus = "player1";

var gameObj = {
  "player1" : {1:null , 2: null, 3: null, 4: null, 5: null},
  "player2" : {1:null , 2: null, 3: null, 4: null, 5: null}
}


$(document).ready(function(){
  $(document).on("keydown", "input", addToParty);
  $('.player1').on('click', '[class^="attack"]', selectAttack);
  $('.player2').on('click', '[class^="attack"]', selectAttack);
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


    // newGameObj(name, armor, actorpopularity, actorimage, image1, image2, attack1, attack2)
    // renderer(turnstatus, inputz);
    // fullCheck();
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
    console.log(gameObj);
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
  $(printTo).append('<img width="80" height="80" src="'+obj.img+'"/>');
  $(printTo).append('<div class="posters"></div>')
  $(printTo).find('.posters').append('<img class="attack1" width="30" height="30" src="'+obj.attack1+'"/>')
  $(printTo).find('.posters').append('<img class="attack2" width="30" height="30" src="'+obj.attack2+'"/>')

}

function activateDragging(){
  var player1draginto = dragula([document.querySelector("#player1"), document.querySelector(".player1")],{
    copy: true
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
    copy: true
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

function newGameObj(name, armor, actorpopularity, actorimage, image1, image2, attack1, attack2){
  this.name = name;
  this.armor = armor > 50 ? armor / 3 : armor * 1.5;;
  this.popularity = actorpopularity;
  this.status = "bench";
  this.img = "http://image.tmdb.org/t/p/w185" + actorimage;
  this.attack1 = {popularity: attack1 * 10, attack: attack1 * actorpopularity * 3, img: "http://image.tmdb.org/t/p/w185" + image1}
  this.attack2 = {popularity: attack2 * 10, attack: attack2 * actorpopularity * 3, img: "http://image.tmdb.org/t/p/w185" + image2};
}
