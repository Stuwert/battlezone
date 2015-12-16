var i = 0;
var h = 0;
var gameObj = {};
var char1 = {
  armor: 20,
  attack1: 80,
  health: 300,
  status: "active"
}

var char2 = {
  armor: 30,
  attack1: 60,
  health: 300,
  status: "active"
}

var attackstatus = {
  player1: null,
  player2: null
}


function fightLoop(character1, character2){
  var char1pop = attackstatus["char1"].popularity/attackstatus["char2"].popularity;
  var char2pop = 1/char1pop
  var character1Damage = damageDealt(damageMultiplier(attackstatus["char2"].attack, char2pop), character1.armor);
  var character2Damage = damageDealt(damageMultiplier(attackstatus["char1"].attack, char1pop), character2.armor);
  character1.health = calculateHealth(character1.health, character1Damage);
  character2.health = calculateHealth(character2.health, character2Damage);
  character1.status = returnStatus(character1);
  character2.status = returnStatus(character2);
  printScreen(character1Damage, character2Damage)
  var winner = detectWinner(character1, character2);
  if (winner){
    var winner = game.add.text(20, 20 * h, winner + " wins", {font: "14px Arial", fill: "white" })
    h++
  }
}

function printScreen(dam1, dam2){
  var character1 = gameObj.char1;
  var character2 = gameObj.char2;
  var damage1 = game.add.text(20, 20 * h, character2.name + " dealt " + dam1 + " damage to " + character1.name, {font: "14px Arial", fill: "white"});
  h++;
  var charhealth1 = game.add.text(20, 20 * h, character1.name + " is at " + character1.health.toFixed(0) + " health.", {font: "14px Arial", fill: "white"})
  h++;
  var damage2 = game.add.text(20, 20 * h, character1.name + "dealt " + dam2 + " damage to " + character2.name, {font: "14px Arial", fill: "white" })
  h++;
  var charhealth2 = game.add.text(20, 20 * h, character2.name + " is at " + character2.health.toFixed(0) + " health.", {font: "14px Arial", fill: "white"})
  h++;
}

function detectWinner(character1, character2){
  if (character1.status === "fainted" && character2.status === "fainted"){
    return "No One";
  }else if (character1.status === "fainted"){
    return character2.name;
  }else if (character2.status === "fainted"){
    return character1.name;
  }else{
    return false;
  }
}

function damageDealt(attack, armor){
  if (armor > attack){
    return 1
  }else{
    return +(attack - armor).toFixed(0);
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

function calculateHealth(health, attackDamage){
 return health - attackDamage;
};

function returnStatus(character){
 return character.health <= 0 ? "fainted" : "alive";
};


function characterz(armor, movie0, movie1, actorpopularity, name){
  console.log(armor);
  this.armor = armor > 50 ? armor / 3 : armor * 1.5;
  this.movie1 = {popularity: movie0 * 10, attack: movie0 * actorpopularity * 3};
  this.movie2 = {popularity: movie1 * 10, attack: movie1 * actorpopularity * 3};
  this.popularity = actorpopularity;
  this.health = 500;
  this.status = "active";
  this.name = name;
}
