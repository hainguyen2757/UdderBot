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
const randomDelay = Math.random() * 200 + 1000; //delay between 1 and 2.5 seconds

client1.connect();
console.log("Fathai95 connected to channel:", bot1Config.channels[0]);

client2.connect();
console.log("uddertastic connected to channel:", bot2Config.channels[0]);

client1.on("message", async (channel, userstate, message, self) => {
  //fathai95
  if (self) return; // Ignore messages from the bot itself
  //console.log(`Incoming message- ${userstate.username}: ${message}`);
  //console.log(`Message includes "udder": ${message.toLowerCase().includes("udder")}`);
  //console.log(`Message includes "!give uddertastic": ${message.toLowerCase().includes("!give uddertastic")}`);
  //console.log(`Message starts with "!take uddertastic": ${message.toLowerCase().startsWith("!take uddertastic")}`);
  //console.log(`Message includes "has defeated Fathai95": ${message.toLowerCase().includes("fathai95 has defeated")}`);
  //console.log(`Message includes "has defeated Fathai95": ${message.toLowerCase().includes("has defeated fathai95")}`);
  if (message.includes("The minions are out!")) {
    console.log(`FatHai95: Responding to ${userstate.username} in ${channel}`);
    client1.say(channel, `!hunt all`);
  }
  if (message.includes("!fight Fathai95")) {
    await delay(1000);
    if (message.includes("There is already a fight going on")) {
      return;
    } else {
      console.log(`FatHai95: Responding to ${userstate.username} in ${channel}`);
      await delay(1000);
      client1.say(channel, `!fight`);
    }
  }
  if (message.toLowerCase().includes("Fathai95 has defeated")) {
    console.log(`FatHai95: Responding to ${userstate.username} in ${channel}`);
    await delay(200);
    client1.say(channel, `EZ Clap`);
  }
  if (message.toLowerCase().includes("has defeated Fathai95")) {
    console.log(`FatHai95: Responding to ${userstate.username} in ${channel}`);
    client1.say(channel, `NOOO`);
  }
});

let lastResponseIndex = -1; // Initialize with an invalid index
let currentResponseIndex = -1; // Initialize with an invalid index

const responses = [
  "gachiBASS Boner CUm",
  "boobahri boobaCheck boobaPls",
  "BOOBAL BERSERK BOOBAR",
  "BOOBAL CUm boobaPls",
  "hyperPOGGIES POGGIES hyperPOGGIES POGGIES",
  "FeelsCrazyMan Boner CUm lickR",
];

function getRandomResponseIndex() {
  let randomIndex = Math.floor(Math.random() * responses.length);

  // Ensure the new response is different from the previous one
  while (
    randomIndex === lastResponseIndex ||
    randomIndex === currentResponseIndex
  ) {
    randomIndex = Math.floor(Math.random() * responses.length);
  }

  return randomIndex;
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
    console.log(`uddertastic: Responding to ${userstate.username} in ${channel}`);
    setTimeout(() => {
      client2.say(channel, `!hunt half`);
    }, randomDelay);
  }

  if (message === "udder") {
    let randomResponseIndex = getRandomResponseIndex();
    while (responses[randomResponseIndex] === currentResponse) {
      randomResponseIndex = getRandomResponseIndex(); // Choose a new response if it's the same as the current one
    }
    currentResponse = responses[randomResponseIndex];
    console.log(
      `uddertastic: Responding to ${userstate.username} in ${channel} with ${currentResponse} after ${randomDelay}`
    );

    await delay(randomDelay);
    client2.say(channel, `${currentResponse}`);
  }

  if (message.includes("!give uddertastic")) {
    console.log(`uddertastic: Responding to ${userstate.username} in ${channel}`);
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
});

client1.on("stream-down", (channel) => {
  console.log(`Stream has ended in ${channel}. Stopping the bot.`);
  client.disconnect();
});
client2.on("stream-down", (channel) => {
  console.log(`Stream has ended in ${channel}. Stopping the bot.`);
  client.disconnect();
});
