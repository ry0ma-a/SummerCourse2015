function createCounter() {
  var count = 0;
  return function counte() {
    count++;
    console.log(count);
  };
}

var counter1 = createCounter();
var counter2 = createCounter();

counter1();
counter1();
counter2();
counter1();
count = 100;
counter2();

console.log(count);
