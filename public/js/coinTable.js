
getRow1();
getRow2();
getRow3();
getRow4();
getRow5();
getRow6();
getRow7();
getRow8();


let number1 = getRandomNumber();
let number2 = getRandomNumber();
let number3 = getRandomNumber();
let number4 = getRandomNumber();
let number5 = getRandomNumber();
let number6 = getRandomNumber();
let number7 = getRandomNumber();
let number8 = getRandomNumber();

// let binanceArray=[11,12,98,141,190,900,195,201,236,281,298,308,469,482,501,505,508,535,553,564,924,963,999,1003,1041,1780,1791];
function getRandomNumber(){
  let binanceArray=[11,12,98,141,190,900,195,201,236,281,298,308,469,482,501,505,508,535,553,562,924,963,999,1003,1041,1780,1791, 5, 6, 33, 125,333, 501, 505, 202, 338];
  return binanceArray[Math.floor(Math.random()*binanceArray.length)];
}

async function fetchData(url){
   let response = await fetch(url);
   let data = await response.json();
   //console.log(data);
   return data;
}

async function getRow1(){
 
  let url="https://api2.binance.com/api/v3/ticker/24hr";
  let data = await fetchData(url);
 
  $("#coin1").html(data[number1].symbol);
  $("#coin1Price").html(data[number1].askPrice);
  $("#coin1High").html(data[number1].highPrice);
  $("#coin1Last").html(data[number1].lastPrice);
  $("#coin1Vol").html(data[number1].volume);
}

async function getRow2(){
 
  let url="https://api2.binance.com/api/v3/ticker/24hr";
  let data = await fetchData(url);
 
  $("#coin2").html(data[number2].symbol);
  $("#coin2Price").html(data[number2].askPrice);
  $("#coin2High").html(data[number2].highPrice);
  $("#coin2Last").html(data[number2].lastPrice);
  $("#coin2Vol").html(data[number2].volume);
}

async function getRow3(){
 
  let url="https://api2.binance.com/api/v3/ticker/24hr";
  let data = await fetchData(url);
 
  $("#coin3").html(data[number3].symbol);
  $("#coin3Price").html(data[number3].askPrice);
  $("#coin3High").html(data[number3].highPrice);
  $("#coin3Last").html(data[number3].lastPrice);
  $("#coin3Vol").html(data[number3].volume);
}
async function getRow4(){
 
  let url="https://api2.binance.com/api/v3/ticker/24hr";
  let data = await fetchData(url);
 
  $("#coin4").html(data[number4].symbol);
  $("#coin4Price").html(data[number4].askPrice);
  $("#coin4High").html(data[number4].highPrice);
  $("#coin4Last").html(data[number4].lastPrice);
  $("#coin4Vol").html(data[number4].volume);
}
async function getRow5(){
 
  let url="https://api2.binance.com/api/v3/ticker/24hr";
  let data = await fetchData(url);
 
  $("#coin5").html(data[number5].symbol);
  $("#coin5Price").html(data[number5].askPrice);
  $("#coin5High").html(data[number5].highPrice);
  $("#coin5Last").html(data[number5].lastPrice);
  $("#coin5Vol").html(data[number5].volume);
}
async function getRow6(){
 
  let url="https://api2.binance.com/api/v3/ticker/24hr";
  let data = await fetchData(url);
 
  $("#coin6").html(data[number6].symbol);
  $("#coin6Price").html(data[number6].askPrice);
  $("#coin6High").html(data[number6].highPrice);
  $("#coin6Last").html(data[number6].lastPrice);
  $("#coin6Vol").html(data[number6].volume);
}
async function getRow7(){
 
  let url="https://api2.binance.com/api/v3/ticker/24hr";
  let data = await fetchData(url);
 
  $("#coin7").html(data[number7].symbol);
  $("#coin7Price").html(data[number7].askPrice);
  $("#coin7High").html(data[number7].highPrice);
  $("#coin7Last").html(data[number7].lastPrice);
  $("#coin7Vol").html(data[number7].volume);
}
async function getRow8(){
 
  let url="https://api2.binance.com/api/v3/ticker/24hr";
  let data = await fetchData(url);
 
  $("#coin8").html(data[number8].symbol);
  $("#coin8Price").html(data[number8].askPrice);
  $("#coin8High").html(data[number8].highPrice);
  $("#coin8Last").html(data[number8].lastPrice);
  $("#coin8Vol").html(data[number8].volume);
}
