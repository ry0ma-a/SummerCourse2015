Number.prototype.plus = function ( num ) {
  return this + num;
};

Number.prototype.multiple = function ( num ) {
  return this * num;
};

Number.prototype.divide = function ( num ) {
  return this / num;
};

var number = 100;
var result = number.plus(1000);
var result2 = number.multiple(3);
var result3 = number.divide(4);
console.log(result);
console.log(result2);
console.log(result3);
