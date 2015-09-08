function Animal(height , weight) {
  this.height = height;
  this.weight = weight;
}

function Human(name) { //1
  this.name = name;
}

Animal.prototype.move = function() {
  console.log("Moving!!");
};

Human.prototype.greet = function() { //2
  console.log("Hello! My name is " + this.name);
};

var inherits = function(childObj , parentObj) {
  Object.setPrototypeOf(childObj.prototype , parentObj.prototype);
};
inherits(Human , Animal);


var ryoma = new Human("Aoyama Ryoma"); //3
ryoma.move();
ryoma.greet(); //4
