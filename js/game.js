var attackstatus = {
  player1: null,
  player2: null
}
var player1attacktotal = 0;
var player2attacktotal = 0;
var turnNum = 0;
var player1score = 0;
var player2score = 0;
var turnstatus = "player1";
var gameObj = {
  "player1" : {1:null, 2: null  },
  "player2" : {1:null, 2: null }
}
var i = 0;
var wordArray = [];



function fightLoop(character1, character2){
  player1attacktotal++;
  player2attacktotal++;
  turnNum++;
  var char1pop = attackstatus["player1"].popularity/attackstatus["player2"].popularity;
  var char2pop = 1/char1pop;
  calculateHealth(character1, damageDealt(damageMultiplier(attackstatus["player2"].attack, char2pop), character1.armor));
  calculateHealth(character2, damageDealt(damageMultiplier(attackstatus["player1"].attack, char1pop), character1.armor));
  // printScreen(character1, character2Damage, character2, character1Damage);
  var winner = fightWinner(character1, character2);
  if (!winner){
    fightLoop(character1, character2);
  }
}

function returnActiveChar(player){
  for(var chars in player){
    if (player[chars].status === "active"){
      return player[chars];
    }
  }
}



function fightWinner(character1, character2){
  var winningchar;
  var losingchar;
  if (character1.status === "fainted" && character2.status === "fainted"){
    removePlayer("player1")
    removePlayer("player2")
    winningchar =  "No One";
  }else if (character1.status === "fainted"){
    removePlayer("player1")
    player2score++;
    winningchar = character2.name;
    losingchar = character1.name;
  }else if (character2.status === "fainted"){
    removePlayer("player2");
    player1score++;
    winningchar = character1.name;
    losingchar = character2.name;
  }else{
    winningchar = false;
  }
  if(winningchar !== false){
    printWinningInfo(winningchar, losingchar);
    resetCheck();
  }
  hideFightButton();
  checkForWinner();
  fightToSelect();
  return winningchar;
}



function damageDealt(attack, armor){
  if (armor > attack){
    return 1
  }else{
    return +((attack - armor).toFixed(0));
  }
};

function getRandom(avg){
  var min = avg - 1;
  var max = avg + 1;
  return Math.random() * (max - min) + min;
}

function damageMultiplier(attack, multiplier){
  multiplier = multiplier > 1 ? multiplier/2 : multiplier * 2;
 var randomizer = getRandom(multiplier);
 return attack * randomizer;
};

function calculateHealth(char, attackDamage){
  char.health = char.health - attackDamage
  if (char.health <= 0 ){
    char.status = "fainted"
  }
};

function newGameObj(name, armor, actorpopularity, actorimage, image1, image2, attack1, attack2){
  this.name = name;
  this.armor = armor > 50 ? armor / 3 : armor * 1.5;
  console.log(this.armor);
  this.popularity = actorpopularity;
  this.status = "bench";
  this.health = 500;
  this.img = "http://image.tmdb.org/t/p/w185" + actorimage;
  this.attack1 = {popularity: attack1 * 10, attack: attack1 * actorpopularity * 3, img: "http://image.tmdb.org/t/p/w185" + image1}
  this.attack2 = {popularity: attack2 * 10, attack: attack2 * actorpopularity * 3, img: "http://image.tmdb.org/t/p/w185" + image2};
}

function characterReady(player){
  for (characters in player){
    if (player[characters].status !== "fainted"){
      return true;
    }
  }
  return false;
}

function checkForWinner(){
  var player1stats = characterReady(gameObj["player1"]);
  var player2stats = characterReady(gameObj["player2"]);
  if (player1stats && !player2stats){
    printOutcome("Player 1 Wins");
  }else if(player2stats && !player1stats){
      printOutcome("Player 2 Wins");
  }else if (!player1stats && !player2stats){
    printOutcome("No One Wins");
  }
}

function isActive(player){
  for (var fighters in player){
    if(player[fighters].status === "active"){
      return true;
    }
  }
  return false;
}

function isAlive(player){
  for (var fighters in player){
    console.log(player[fighters].status);
    if(player[fighters].status === "active" || player[fighters].status === "bench"){
      return true;
    }
  }
  return false;
}

function resetCheck(){
  if (isAlive(gameObj["player1"]) && isAlive(gameObj["player2"])){
    $('#real').off("click");
    $('#real').addClass('offButton');
    $('.display').append('<p>-------</p>');
    $('.display').append("<p>Select your next Fighters and Attacks</p>")
    $('.display').find('p').css({"font-size" : "18px"})
    attackstatus = { "player1" : null, "player2" : null}
    $('[class^="attack"]').css({"opacity" : "1.0"});
  }else{
    if(isAlive(gameObj["player1"])){
      console.log("Player1")
      $('.gameOver').find('h4').after('<h5>Player 1 Wins</h5>')
    }else if(isAlive(gameObj["player2"])){
      console.log("Player1")
      $('.gameOver').find('h4').after('<h5>Player 2 Wins</h5>')
    }else{
      $('.gameOver').find('h4').after('<h5>No One Wins</h5>')
    }
    $("#real").addClass('hidden');
    $('.gameOver').removeClass('hidden');
    $('#close').click(function(){
      $('.gameOver').find('h4').html("Thanks for Playing!");
      $('.restartChoice').empty();
    });
  }
}
