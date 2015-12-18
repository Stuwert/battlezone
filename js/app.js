var state = "fresh";
var gameType;

$(document).ready(function(){
  gameTypeCheck();
  $('.player1').on('click', '[class^="attack"]', selectAttack);
  $('.player2').on('click', '[class^="attack"]', selectAttack);
  $('#real').on('click', 'button', addToParty);
  for (var i=0; i<10; i++){
    callVerb(i);
  }
})

function gameTypeCheck(){
  $('.gameStart').on("click", "button", function(){
    gameType = $(this).attr('id');
    $('.gameStart').addClass('hidden');
    if (gameType === "multi"){
      $(document).on("keydown", "input", addToParty);
    }else{
      gameObj["player2"] = {1: null, 2: null, 3: null}
      for (var i = 1; i<=3; i++){
        addToPartySingle(i);
      }
      $(document).on("keydown", "input", addToYourParty)
    }
  })
}

function addToYourParty(key){
  if(state === "fresh"){
    state = "stale";
    $('#player1').addClass("turn");
  }
  var input = $('input').val();
  if (key.keyCode === 13){
    var parameterz = {  query: input  }
    tmdb.call("/search/person", parameterz, responsesYours, failure);
    $('input').val("")
    console.log(nextAvailable(gameObj["player1"]))

  }

  function responsesYours(response){
    var actor = response["results"][0];
    var movie0 = actor["known_for"][0];
    var movie1 = actor["known_for"][1]
    var actorArmor = 0;
    actor["known_for"].forEach(function(item){
      actorArmor += item["vote_average"];
    })
    var inputz = nextAvailable(gameObj[turnstatus]);
    console.log(inputz);
    gameObj["player1"][inputz] = new newGameObj(actor.name, actorArmor, actor.popularity, actor["profile_path"], movie0["poster_path"], movie1["poster_path"], movie0["popularity"], movie1["popularity"]);
    renderer("player1", inputz);
    singleFullCheck();
  }
}

function addToPartySingle(num){
  if(state === "fresh"){
    state = "stale";
    $('#player1').addClass("turn");
  }
  var input = $('input').val();
  var parameterz = {  query: input  }
  tmdb.call("/person/popular", parameterz, responseSingle, failure);

  function responseSingle(response){
    var actor = response["results"][num];
    var movie0 = actor["known_for"][0];
    var movie1 = actor["known_for"][1]
    var actorArmor = 0;
    actor["known_for"].forEach(function(item){
      actorArmor += item["vote_average"];
    })
    var inputz = nextAvailable(gameObj[turnstatus]);
    gameObj["player2"][num] = new newGameObj(actor.name, actorArmor, actor.popularity, actor["profile_path"], movie0["poster_path"], movie1["poster_path"], movie0["popularity"], movie1["popularity"]);
    renderer("player2", num);
  }
}

function callFight(){
  var chars1 = returnActiveChar(gameObj["player1"]);
  var chars2 = returnActiveChar(gameObj["player2"]);
  player1attacktotal = 0;
  player2attacktotal = 0;
  turnNum = 0
  fightLoop(chars1, chars2);
}

function selectAttack(){
  $(this).css({"opacity" : "0.5"});
  $(this).siblings().css({"opacity" : 1});
  var attacknum = $(this).attr('class');
  var playerchar = $(this).parent().parent().attr('class');
  var playernum = $(this).parent().attr('class');
  attackstatus[playerchar] = gameObj[playerchar][playernum][attacknum];
  revealFightButton();
}

function revealFightButton(){
  for (attacks in attackstatus){
    if (attackstatus[attacks] === null){
      return;
    }
  }
  $('#real').removeClass("offButton");
  $('#real').click(callFight)
  // $('.input').animate({"height" : "50", "width" : "200"}, 500);
  // $('#printout').removeClass('hidden');
  // $('#fight').find('p').addClass('hidden');
  // $('#fight').find('button').removeClass('hidden');
}

function hideFightButton(){
  $('.input').animate({"height" : "150", "width" : "400"}, 500);
  $('#fight').find('p').removeClass('hidden');
  $('#fight').find('button').addClass('hidden');

}

function removePlayer(charname){
  var num = $("." + charname).children('div').attr('class');
  $("#" + charname).find('[class="'+ num+'"]').addClass('fainted');
  $('.' + charname).empty();
}

function addToParty(key){
  if(state === "fresh"){
    state = "stale";
    $('#player1').addClass("turn");
  }
  var input = $('input').val();
  if (key.keyCode === 13){
    var parameterz = {  query: input  }
    tmdb.call("/search/person", parameterz, response, failure);
  }

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

function singleFullCheck(){
  if(nextAvailable(gameObj["player1"]) === null){
    $('.fighters').css({"display" : "flex"});
    $('input').css({"display" : "none"});
    $('#real').html("Fight");
    $('.display').animate({"height" : "100px"});
    $('.display').empty();
    $('.display').append("<p>Select your Fighters and Attacks</p>")
    $('.display').find('p').css({"font-size" : "18px"})
    $('.bench').removeClass('turn');
    activate("player1");
    activate("player2");
    $('#real').addClass("offButton");
    $('#real').off('click');
  }
}

function fullCheck(){
  if(nextAvailable(gameObj[turnstatus]) === null){
    if(turnstatus === "player1"){
      switchTurn();
      $('.turnstatus').html(turnstatus.charAt(0).toUpperCase() + turnstatus.substr(1))
    }else{
      $('.fighters').css({"display" : "flex"});
      $('input').css({"display" : "none"});
      $('#real').html("Fight");
      $('.display').animate({"height" : "100px"});
      $('.display').empty();
      $('.display').append("<p>Select your Fighters and Attacks</p>")
      $('.display').find('p').css({"font-size" : "18px"})
      $('.bench').removeClass('turn');
      activate("player1");
      activate("player2");
      $('#real').addClass("offButton");
      $('#real').off('click');
    }
  }else{
    switchTurn();
    $('.turnstatus').html(turnstatus.charAt(0).toUpperCase() + turnstatus.substr(1))
  }
}

function switchTurn(){
  if(turnstatus === "player1"){
    turnstatus = "player2";
    $("#player1").removeClass('turn')
    $("#player2").addClass('turn')
    $('#populatebench').find('h4').html("Player 2, Select actor/actress number " + nextAvailable(gameObj[turnstatus]) + " for your team.");
  }else{
    turnstatus = "player1";
    $("#player2").removeClass('turn')
    $("#player1").addClass('turn')
      $('#populatebench').find('h4').html("Player 1, Select actor/actress number " + nextAvailable(gameObj[turnstatus]) + " for your team.");
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
  var findBench = $('#' + inputName).find('.characters');
  var printTo = $('<div class="'+ divClass + '"></div>').appendTo(findBench);
  $(printTo).append('<h5>' + obj.name + '</h5>');
  $(printTo).append('<img width="100" height="150" src="'+obj.img+'"/>');
  $(printTo).append('<button class="attack1"></button>')
  $(printTo).find('.attack1').append('<p>Attack 1</p>');
  $(printTo).find('.attack1').append('<img width="35" height="60" src="'+obj.attack1.img+'"/>')
  $(printTo).append('<button class="attack2"></button>')
  $(printTo).find('.attack2').append('<p>Attack 2</p>');
  $(printTo).find('.attack2').append('<img width="35" height="60" src="'+obj.attack2.img+'"/>')

}

function dragInto(player){
  return [document.getElementById(player).getElementsByClassName('characters')[0], document.querySelector("." + player)];
}

function dragOutOf(player){
  return [document.querySelector("." + player)];
}


function selectToFight(){
  if(isActive("player1") && isActive("player2")){
    $('#playerselect').addClass('hidden');
    $('#playerselect').children().addClass('hidden');
    $('#fight').removeClass('hidden');
    $('#fight').find('p').removeClass('hidden');
  }
}


function activate(player){
  console.log(player);
  dragula(dragInto(player),{
   copy: true,
   invalid: function(el){
     return el.className.includes("fainted");
   }}).on("drop", function(el){
    gameObj[player][+(el.className[0])].status = "active";
    selectToFight();
  });
 dragula(dragOutOf(player), {
   removeOnSpill: true
 }).on("remove", function(el){
    gameObj[player][+(el.className[0])].status = "bench";
    fightToSelect();
  })
}

function fightToSelect(){
  $('#playerselect').removeClass('hidden');
  $('#playerselect').children().removeClass('hidden');
  $('#fight').addClass('hidden');
  $('#fight').children().addClass('hidden');
}

function printScore(){
  $('.bench').find('h5').remove();
  $('#player1').find('p').after('<h5>' + player1score + '</h5>');
  $('#player2').find('p').after('<h5>' + player2score + '</h5>');
}

function printOutcome(outcome){
  $('.input').empty();
  $('.input').append('<p>'+ outcome +'</p>')
}

function callVerb (i){
  var callar = $.ajax({
    url: 'http://api.wordnik.com:80/v4/words.json/randomWord?hasDictionaryDef=false&includePartOfSpeech=verb&minCorpusCount=350&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1&limit=1&api_key=97d94b0b7779a50ac900e04879302f1c70b3d0fa7b6102f20',
    method: "GET",
    dataType: "json"
  })
  callar.done(function(response){
    wordArray[i] = response["word"]
  })
  callar.fail(function(response){
    console.log("Sad ");
    wordArray = shuffle(backupArray);
  })

}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function printWinningInfo(winningchar, losingchar){
  $('#player1').find('p').first().html("Score " + player1score)
  $('#player2').find('p').first().html("Score " + player2score)
  $('.display').empty();
  $('.display').animate({"height": "300px"}, 500);
  $('.display').append('<p>' + winningchar + ' wins.</p>');

  if (winningchar !== "No One"){
    $('.display').append('<p>' + winningchar + ' ' + wordArray[i] + ' ' + losingchar + ' ' + turnNum + ' times until ' + losingchar + ' fainted </p>');
    i++;
  }
}
