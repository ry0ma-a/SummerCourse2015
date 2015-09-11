Number.prototype.plus = function ( num ) {
  return this + num;
};

Number.prototype.minus = function ( num ) {
  return this - num;
};

Number.prototype.multiple = function ( num ) {
  return this * num;
};

Number.prototype.divide = function ( num ) {
  return this / num;
};

Number.prototype.mod = function ( num ) {
  return this % num;
};

var number = 100;

var result1 = number.plus(1000);
var result2 = number.minus(10);
var result3 = number.multiple(3);
var result4 = number.divide(4);
var result5 = number.mod(2);
console.log(result1);
console.log(result2);
console.log(result3);
console.log(result4);
console.log(result5);
