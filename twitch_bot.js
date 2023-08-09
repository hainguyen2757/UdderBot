const tmi = require("tmi.js");
const channelName = "cowsep";
// Bot 1 configuration
const bot1Config = {
  identity: {
    username: "fathai95",
    password: "oauth:jvc7yhp8utiizgtki9vwda6wj0fcha", // Generate this from https://twitchapps.com/tmi/
  },
  channels: [channelName], // Add the channel name for Bot 1
};

// Bot 2 configuration
const bot2Config = {
  identity: {
    username: "uddertastic",
    password: "oauth:ivc8i2koggk0dm2zdx4sx34qw072dv", // Generate this from https://twitchapps.com/tmi/
  },
  channels: [channelName], // Add the channel name for Bot 2
};

const client1 = new tmi.Client(bot1Config);
const client2 = new tmi.Client(bot2Config);
const randomDelay = Math.random() * 1100 + 200; //delay between 200ms and 1300ms seconds
var Bot1Hunt=1;
var Bot1Fight=1;

function getRandomDelay() {
  return Math.random() * 1100 + 200; // Generate random delay between 200ms and 1300ms
}
client1.connect();
console.log("Fathai95 connected to channel:", bot1Config.channels[0]);

client2.connect();
console.log("uddertastic connected to channel:", bot2Config.channels[0]);

client1.on("message", async (channel, userstate, message, self) => {
  //fathai95
  const username = userstate.username;
  if (self) return; // Ignore messages from the bot itself
  console.log(`Incoming message- ${userstate.username}: ${message}`);
  //console.log(`Message includes "udder": ${message.toLowerCase().includes("udder")}`);
  //console.log(`Message includes "!give uddertastic": ${message.toLowerCase().includes("!give uddertastic")}`);
  //console.log(`Message starts with "!take uddertastic": ${message.toLowerCase().startsWith("!take uddertastic")}`);
  //console.log(`Message includes "has defeated Fathai95": ${message.toLowerCase().includes("fathai95 has defeated")}`);
  //console.log(`Message includes "has defeated Fathai95": ${message.toLowerCase().includes("has defeated fathai95")}`);
  if (message==='!hunting on' && username === "fathai95") {
    Bot1Hunt = 1;
    console.log('Bot1 hunt is on');
    return;
  }  else if (message==='!hunting off' && username === "fathai95") {
    Bot1Hunt = 0;
    console.log('Bot1 hunt is off');
    return;
  }
  if (message==='!fighting on' && username === "fathai95") {
    Bot1Fight = 1;
    console.log('Bot1 fight is on');
    return;
  }  else if (message==='!fighting off' && username === "fathai95") {
    Bot1Fight = 0;
    console.log('Bot1 fight is off');
    return;
  }

  if (message.includes("The minions are out!")&& Bot1Hunt===1) {
    console.log(`FatHai95: Responding to ${userstate.username} in ${channel}`);
    client1.say(channel, `!hunt all`);
  }
  if (message.includes('@Fathai95 (+')) {

    console.log(`FatHai95 is celebrating the hunt`);
    await delay(200);
    client1.say(channel, `gachiHYPER HYPERCLAP`);
  }else if (message.includes("@Fathai95 (-")) {
    console.log(`FatHai95 is mourning the hunt`);
    await delay(200);
    client1.say(channel, `NOOO my minions`);
  }


  
  if (message.includes("!fight fathai95")&& Bot1Fight===1) {
    console.log(`FatHai95: Responding to ${userstate.username} in ${channel}`);
    await delay(1000);
    client1.say(channel, `!fight`);
  }
  if (message.toLowerCase().includes("fathai95 has defeated")) {

    console.log(`FatHai95: Responding to ${userstate.username} in ${channel}`);
    const randomChoice = Math.random();
    let response;
    if (randomChoice <0.3) {
      response = 'EZ Clap';
    }else if(0.3< randomChoice <0.6){
      response = 'LOser';
    }
    else{
      response = 'BERSERK GIMME YOUR MINIONS';
    }
    await delay(200);
    client1.say(channel, response);
  }
  if (message.toLowerCase().includes("has defeated fathai95")) {
    console.log(`FatHai95: Responding to ${userstate.username} in ${channel}`);
  const randomChoice = Math.random();
    let response;
    if (randomChoice <0.3) {
      response = 'RAGEY';
    }else if(0.3< randomChoice <0.6){
      response = 'NOOO my minions';
    }
    else{
      response = 'NotCrying';
    }
    await delay(200);
    client1.say(channel, response);
  }
});

let lastResponseIndex = -1; // Initialize with an invalid index
let currentResponseIndex = -1; // Initialize with an invalid index
let lastResponse = ''; // Initialize with an empty string
// function getRandomResponseIndex() {
//   let randomIndex = Math.floor(Math.random() * responses.length);

//   // Ensure the new response is different from the previous one
//   while (
//     randomIndex === lastResponseIndex ||
//     randomIndex === currentResponseIndex
//   ) {
//     randomIndex = Math.floor(Math.random() * responses.length);
//   }

//   return randomIndex;
// }

const emoteResponses = [
  "gachiBASS Boner CUm",
  "boobahri boobaCheck boobaPls",
  "BOOBAL BERSERK BOOBAR",
  "BOOBAL CUm boobaPls",
  "hyperPOGGIES POGGIES hyperPOGGIES POGGIES",
  "FeelsCrazyMan Boner CUm lickR",
];
function getRandomResponseIndex(responsesArray) {
  return Math.floor(Math.random() * responsesArray.length);
}
function getRandomResponseEmoteIndex() {
  return getRandomResponseIndex(emoteResponses);
}


function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let currentResponse = ""; // Initialize with an empty string

client2.on("message", async (channel, userstate, message, self) => {
  // udder
  const username = userstate.username;

  if (self) return; // Ignore messages from the bot itself

  if (message.includes("The minions are out!")) {
    console.log(
      `uddertastic: Responding to ${userstate.username} in ${channel}`
    );
    setTimeout(() => {
      client2.say(channel, `!hunt half`);
    }, randomDelay);
  }

  if (message === "udder") {
    const randomDelay = getRandomDelay();
    let responseIndex;
    let randomResponseIndex = getRandomResponseEmoteIndex();
    while (emoteResponses[responseIndex] === lastResponse) {
      responseIndex = getRandomResponseEmoteIndex();
    }
    lastResponse = emoteResponses[responseIndex];
    currentResponse = emoteResponses[randomResponseIndex];
    console.log(
      `uddertastic: Responding to ${userstate.username} in ${channel} with ${currentResponse} after ${randomDelay}`
    );

    await delay(randomDelay);
    client2.say(channel, `${currentResponse} 2`);
  }

  if (message.includes("!give uddertastic")) {
    console.log(
      `uddertastic: Responding to ${userstate.username} in ${channel}`
    );
    await delay(randomDelay);
    client2.say(channel, `Thanks for the minions @${userstate.username}`);
  }

  if (message.startsWith("!take uddertastic") && username === "fathai95") {
    const match = message.match(/\d+/);
    const number = match ? parseInt(match[0]) : 0;
    console.log(`udder: giving ${userstate.username} ${number} points`);
    await delay(randomDelay);
    client2.say(channel, `!give ${userstate.username} ${number}`);
  }
  if (message.startsWith("uddertastic say") && username === "fathai95") {
    const response = message.replace("uddertastic say", "").trim();
    console.log(`udder: responding - ${response}`);
    await delay(randomDelay);
    client2.say(channel, `${response}`);
  }
});

client1.on("stream-down", (channel) => {
  client1.disconnect();
  console.log(`Stream has ended in ${channel}. Stopping the bot.`);
});
client2.on("stream-down", (channel) => {
  client2.disconnect();
  console.log(`Stream has ended in ${channel}. Stopping the bot.`);
});
