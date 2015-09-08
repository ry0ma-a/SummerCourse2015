function Human(name) {
  this.name = name;
}

function greet(arg1 , arg2) {
  console.log(arg1 + "My name is " + this.name + arg2);
}

var ryoma = new Human("Aoyama Ryoma");
var greetHello = greet.bind(ryoma);
greetHello("Hello!" + "!!!!!!");
