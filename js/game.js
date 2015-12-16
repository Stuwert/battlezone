var i = 0;
var h = 0;
var gameObj = {};
var attackstatus = {
  player1: null,
  player2: null
}


function fightLoop(character1, character2){
  var char1pop = attackstatus["player1"].popularity/attackstatus["player2"].popularity;
  var char2pop = 1/char1pop;
  var character1Damage = damageDealt(damageMultiplier(attackstatus["player2"].attack, char2pop), character1.armor);
  var character2Damage = damageDealt(damageMultiplier(attackstatus["player1"].attack, char1pop), character1.armor);
  calculateHealth(character1, character1Damage);
  calculateHealth(character2, character2Damage);
  printScreen(character1, character2Damage, character2, character1Damage);
  if (!detectWinner(character1, character2)){
    fightLoop(character1, character2);
  }else{
    console.log(detectWinner(character1, character2))
  }
}

function returnActiveChar(player){
  for(var chars in player){
    if (player[chars].status === "active"){
      return player[chars];
    }
  }
}

function printScreen(character1, characater1dam, character2, character2dam){
  $('#printout').append('<p>' + character1.name + ' dealt ' + characater1dam + " to " + character2.name + ", + " + character2.name + " is at " + character2.health + " life.")
  $('#printout').append('<p>' + character2.name + ' dealt ' + character2dam + " to " + character1.name + ", + " + character1.name + " is at " + character1.health + " life.")
}

// function printScreen(dam1, dam2){
//   var character1 = gameObj.char1;
//   var character2 = gameObj.char2;
//   var damage1 = game.add.text(20, 20 * h, character2.name + " dealt " + dam1 + " damage to " + character1.name, {font: "14px Arial", fill: "white"});
//   h++;
//   var charhealth1 = game.add.text(20, 20 * h, character1.name + " is at " + character1.health.toFixed(0) + " health.", {font: "14px Arial", fill: "white"})
//   h++;
//   var damage2 = game.add.text(20, 20 * h, character1.name + "dealt " + dam2 + " damage to " + character2.name, {font: "14px Arial", fill: "white" })
//   h++;
//   var charhealth2 = game.add.text(20, 20 * h, character2.name + " is at " + character2.health.toFixed(0) + " health.", {font: "14px Arial", fill: "white"})
//   h++;
// }

function detectWinner(character1, character2){
  if (character1.status === "fainted" && character2.status === "fainted"){
    removePlayer("player1")
    removePlayer("player2")
    return "No One";
  }else if (character1.status === "fainted"){
    removePlayer("player1")
    return character2.name;
  }else if (character2.status === "fainted"){
    removePlayer("player2")
    return character1.name;
  }else{
    return false;
  }
}

function removePlayer(charname){
  $("." + charname).empty();
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
