var count1 = 0;

function counter1() {
  count1++;
  console.log(count1);
}

var count2 = 0;

function counter2() {
  count2++;
  console.log(count2);
}

counter1();
counter1();
counter2();
counter1();
count2 = 100;
counter2();
