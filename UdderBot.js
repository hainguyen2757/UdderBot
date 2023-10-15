require("dotenv").config();
const { count } = require("console");
const { channel } = require("diagnostics_channel");
// const { count } = require("console");
const fs = require("fs");
//const { del } = require("request");
const fathai95OauthKey = process.env.FATHAI95_OAUTH_KEY;
const uddertasticOauthKey = process.env.UDDERTASTIC_OAUTH_KEY;

const tmi = require("tmi.js");
const channelName = "cowsep";
// Bot 1 configuration
const bot1Config = {
  identity: {
    username: "fathai95",
    password: fathai95OauthKey, // Generate this from https://twitchapps.com/tmi/
  },
  channels: [channelName], // Add the channel name for Bot 1
};

// Bot 2 configuration
const bot2Config = {
  identity: {
    username: "uddertastic",
    password: uddertasticOauthKey, // Generate this from https://twitchapps.com/tmi/
  },
  channels: [channelName], // Add the channel name for Bot 2
};

function logMessageToFile(message) {
  const timestamp = new Date().toISOString();
  const logEntry = `${timestamp}: ${message}\n`;

  fs.appendFile("message_log.txt", logEntry, (err) => {
    if (err) {
      console.error("Error writing to log file:", err);
    }
  });
}
// function logWinLoss(message) {
//   const timestamp = new Date().toISOString();
//   const logEntry = `${timestamp}: ${message}\n`;

//   fs.appendFile("WinLoss_log.txt", logEntry, (err) => {
//     if (err) {
//       console.error("Error writing to log file:", err);
//     }
//   });
// }

const client1 = new tmi.Client(bot1Config);
const client2 = new tmi.Client(bot2Config);
//values has to be outside to take effect inside the functions
var Bot1Hunt = 1;
var Bot1Fight = 0;
let udderBet = 0;
let targetUdder = "jacko_ws";
var TargetOn = 1;
var StealTimer = 55000;
var udderRps = 0;
var Bot1Steal = 1;
var udderEmote = 1;
const hunting = "!hunt 40%";
const bossing = "!boss 30%";
let isUddertastic=0;
let RemainingCooldown=0;
let isUddertasticOn=1;
let UddertasticSayRandomChatTime = 60000 + Math.random() * 120000; // Random interval between 1 and 2 minutes

function getRandomDelay() {
  //return Math.random() * 20000 + 500; // Generate random delay between 200ms and 1300ms
  return 1000; //1000ms = 1s

}
client1.connect();
console.log("Fathai95 connected to channel:", bot1Config.channels[0]);

client2.connect();
console.log("uddertastic connected to channel:", bot2Config.channels[0]);
console.log(
  `hunt: ${Bot1Hunt}| fight: ${Bot1Fight}|emote: ${udderEmote}|Steal: ${Bot1Steal}, target is ${targetUdder}`
);

client1.on("message", async (channel, userstate, message, self) => {
  //fathai95
  const username = userstate.username;
  const capturePattern = /(\S+) captured/i;
  const randomDelay = getRandomDelay();
  //const captureTextPattern = /captured (\S+) fathai95/i;
  //logMessageToFile(`[${channel}] ${username}: ${message}`); //this is to log every incoming messages
  if (username === "chatsrpg") {
    // logMessageToFile(channel, username, message);
    logMessageToFile(`[${channel}] ${username}: ${message}`);
  }
  if (username === "chatsrpg") {
    // logMessageToFile(channel, username, message);
    logMessageToFile(`[${channel}] ${username}: ${message}`);
  }

  if (self) return; // Ignore messages from the bot itself

  console.log(`${userstate.username}: ${message}`);
  //console.log(`Message includes "udder": ${message.toLowerCase().includes("udder")}`);
  //console.log(`Message includes "!give uddertastic": ${message.toLowerCase().includes("!give uddertastic")}`);
  //console.log(`Message includes "has defeated Fathai95": ${message.toLowerCase().includes("fathai95 has defeated")}`);
  if (message === "!hunting on" && username === "fathai95") {
    Bot1Hunt = 1;
    console.log("Bot1 hunt is on");
    return;
  } else if (message === "!hunting off" && username === "fathai95") {
    Bot1Hunt = 0;
    console.log("Bot1 hunt is off");
    return;
  }
  if (message === "!fighting on" && username === "fathai95") {
    Bot1Fight = 1;
    console.log("Bot1 fight is on");
    return;
  } else if (message === "!fighting off" && username === "fathai95") {
    Bot1Fight = 0;
    console.log("Bot1 fight is off");
    return;
  }
  if (message === "!steal on" && username === "fathai95") {
    Bot1Steal = 1;
    console.log("Bot1 steal is on");
    return;
  } else if (message === "!steal off" && username === "fathai95") {
    Bot1Steal = 0;
    console.log("Bot1 steal is off");
    return;
  }
  if (
    message.includes("!steal <username> <amount> to") &&
    Bot1Steal === 1 &&
    username === "chatsrpg"
  ) {
    await delay(StealTimer);
    client1.say(channel, `!steal ${targetUdder} all`);
    console.log("fathai is stealing from " + targetUdder);
    Bot1Steal = 0;
    await delay(120000);
    Bot1Steal = 1;
  }
  if (
    message.includes("Type !hunt <amount>") &&
    Bot1Hunt === 1 &&
    username === "chatsrpg"
  ) {
    console.log(`FatHai95: Responding to ${userstate.username} in ${channel}`);
    await delay(randomDelay);
    client1.say(channel, hunting); //fathai hunt
  }

  if (
    message.includes("!boss <amount> to") &&
    username === "chatsrpg" &&
    Bot1Hunt === 1
  ) {
    //var minionCount = 0;
    console.log(`FatHai95 hunting the boss BOSS`);
    await delay(1000);
    client1.say(channel, bossing);
  }
  const responsesWin = [
    "LETSGOOO Winions",
    "EZ Clap winions",
    "BERSERK GIMME MY MINIONS",
    "Pog winions",
    "gachiHYPER HYPERCLAP winions",
    "Ok minions",
    "pepePoint",
    "Igotmyeyesonyou",
  ];
  const responsesLoss = [
    "NOOO my minions",
    "NotLikeThis",
    "BERSERK GIMME BACK MY MINIONS",
    "NotCrying my minions",
    "BabyRage minions",
    "NOOO dont leave me",
    "Madge i'll get you for this",
  ];
  const randomResponseIndex = Math.floor(Math.random() * responsesWin.length);
  const randomLossResponseIndex = Math.floor(
    Math.random() * responsesLoss.length
  );
  const responseWin = responsesWin[randomResponseIndex];
  const responseLoss = responsesLoss[randomLossResponseIndex];

  if (message.includes("@fathai95 (+")) {
    console.log(`FatHai95 is celebrating the hunt`);
    await delay(200);
    client1.say(channel, responseWin);
  } else if (message.includes("@fathai95 (-")) {
    console.log(`FatHai95 is mourning the hunt`);
    await delay(200);
    client1.say(channel, responseLoss);
  }

  function sanitizeMessage(message) {
    // Remove symbols such as "@" and convert to lowercase
    return message.replace(/[@#!$%^&*(),.?":{}|<>]/g, "").toLowerCase();
  }
  const lowercaseMessage = sanitizeMessage(message);
  if (
    lowercaseMessage.includes("has challenged fathai95") &&
    Bot1Fight === 1
    // !lowercaseMessage.includes("runningitdownmidirl") &&
    // !lowercaseMessage.includes("dobardman")
  ) {
    console.log(`FatHai95: Responding to ${userstate.username} in ${channel}`);
    await delay(1000);
    client1.say(channel, `!fight`);
  }

  if (message.toLowerCase().includes("fathai95 captured")) {
    console.log(`FatHai95: Responding to ${userstate.username} in ${channel}`);
    await delay(200);
    client1.say(channel, responseWin);
  }
  if (capturePattern.test(message)) {
    const match = message.match(capturePattern);
    const capturedUser = match[1]; // Extract the captured minions number
    //console.log(`Bot 1: Captured ${capturedUser} minions by ${userstate.username} in ${channel}`);
    // Your response or action logic here
    //console.log('pattern '+capturePattern);
    // console.log(capturePattern.test(message));
    // console.log("user won is " + capturedUser);
    if (
      capturedUser !== "@fathai95" &&
      message.toLowerCase().includes("@fathai95")
    ) {
      await delay(200);
      console.log(`FatHai95: Responding ${responseLoss} to ${capturedUser}`);
      client1.say(channel, responseLoss);
    }
  }
  if (message.includes("!arena to")) {
    await delay(randomDelay);
    client1.say(channel, `!arena`);
  }
}); //end of client1
let lastResponse = ""; // Initialize with an empty string

const emoteResponses = [
  "gachiBASS Boner CUm",
  "boobahri boobaCheck boobaPls",
  "BOOBAL BERSERK BOOBAR",
  "BOOBAL CUm boobaPls",
  "hyperPOGGIES POGGIES hyperPOGGIES POGGIES",
  "FeelsCrazyMan Boner CUm lickR",
  "BOOBAL CUm",
];

const randomChats = [
  "POGGERS look at that",
  "Thats nice Ok",
  "LUL",
  "YEP",
  "KEKW",
  "Stare",
  "gachiBASS Boner here i come",
  "Concerned u sure?",
  "Concerned i mean...",
  "boobaPls",
  "CAUGHTIN4K",
  "hyperLick",
  "LOser another one",
  "NOPERS i dont think so",
  "NODDERS damn right",
  "Ok good enough",
  "Lmao look at this guy KEKW",
  "Pog",
  "Talking keep talking",
  "Wow",
  "classic",
  "NOTED uh huh",
  "Plotge",
  "Susge",
  "owojam dance with me owojam",
  "docmeat",
  "you're so right cowsep",
  "Damn bro Wow",
  "Imagine doing that, wouldnt be me Clueless",
  "Hmm interesting",
  "owo",
  "owoshy",
  "pepePoint look guys",
  "Chatting keep typing bud",
  "HUH uhhhh",
  "owoCheer lets go",
  "Shruge idk man",
  "COPIUM good stuff",
  "Aware oh...",
  "COPIUM if you say so...",
  "weSmart smart",
  "fricc you",
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

function getRandomChat() {
  const randomIndex = Math.floor(Math.random() * randomChats.length);
  return randomChats[randomIndex];
}
function sayRandomChat() {
  const randomSentence = getRandomChat();
  if(isUddertasticOn===1){
    client2.say("cowsep", randomSentence);
  isUddertastic++;
  console.log(`__________________isUddertastic: ${isUddertastic} | interval: ${UddertasticSayRandomChatTime}`);
  if(isUddertastic >=5){
    isUddertasticOn = 0;
    //client2.disconnect();
    client2.say(channelName,"Dead stream, im out!")
    console.log("_________________uddertastic is alone, shutting down");
    }
  }
  
}
const initialDelay = Math.random() * 120000; // Random delay between 0 and 5 minutes
setTimeout(() => {
  sayRandomChat(); // Send a random sentence immediately
  //const interval = 60000 + Math.random() * 60000; // Random interval between 1 and 2 minutes
  const interval = UddertasticSayRandomChatTime;
  setInterval(sayRandomChat, interval);
}, initialDelay);

let currentResponse = ""; // Initialize with an empty string

client2.on("message", async (channel, userstate, message, self) => {
  // udder
  const randomDelay = getRandomDelay();
  const username = userstate.username;
  const lowercaseMessage = message.toLowerCase();
  const givePattern = /uddertastic give me (\d+)/i;
  const rpsPattern = /!give uddertastic (\d+) (rock|paper|scissor)/i;
  const taggedUserPattern = /@?uddertastic\s+(rock|paper|scissor)/i;

  const udderTargetPattern = /uddertastic target (\S+)/i;
  let playerChoice = null;
  let gameOutcome = null;
  //const giveUserPattern = /uddertastic give (\S+)/i;
  if (self) return; // Ignore messages from the bot itself

  if (message.includes("Type !hunt <amount>") && username === "chatsrpg") {
    console.log(
      `uddertastic: Responding to ${userstate.username} in ${channel}`
    );
    console.log("randomdelay of !hunt on udder: " + randomDelay);
    setTimeout(() => {
      client2.say(channel, "!hunt half"); //udder hunt
    }, randomDelay);
  }

  if (message.includes("!boss <amount> to") && username === "chatsrpg") {
    //var minionCount = 0;
    console.log(`uddertastic hunting the boss BOSS`);
    await delay(randomDelay);
    client2.say(channel, "!boss 20%"); //udder boss
  }

  if (
    message.includes("udder") &&
    !message.includes("@uddertastic") &&
    !message.includes("uddertastic") &&
    udderEmote === 1
  ) {
    // || message === "udder 󠀀"  ) {
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

    await delay(700);
    client2.say(channel, `${currentResponse}`);
  }

  // if (message.includes("!give uddertastic")) {
  //   console.log(
  //     `uddertastic: Responding to ${userstate.username} in ${channel}`
  //   );
  //   await delay(randomDelay);
  //   client2.say(channel, `Thanks for the minions @${userstate.username}`);
  // }

  if (message.startsWith("uddertastic say") && username === "fathai95") {
    const response = message.replace("uddertastic say", "").trim();
    await delay(randomDelay);
    client2.say(channel, `${response}`);
  }

  if (givePattern.test(message)) {
    const match = message.match(givePattern);
    const giveMinion = match[1]; // Extract the captured minions number
    //console.log(`Bot 1: Captured ${capturedUser} minions by ${userstate.username} in ${channel}`);
    // Your response or action logic here
    //console.log('pattern '+capturePattern);
    //console.log(message);
    //console.log("minions " + capturedUser);
    if (username === "fathai95") {
      await delay(300);
      console.log(`uddertastic is giving Fathai95 ${giveMinion} minions`);
      client2.say(channel, "!give fathai95 " + giveMinion);
    }
  }
  if (message.includes("!rps help")) {
    client2.say(
      channelName,
      "Type '!rps rock', '!rps paper', or '!rps scissors' to play Rock-Paper-Scissors!"
    );
  }

  if (message === "!rps on" && username === "fathai95") {
    udderRps = 1;
    console.log("udderRPS is On");
    return;
  } else if (message === "!rps off" && username === "fathai95") {
    udderRps = 0;
    console.log("udderRPS is Off");
    return;
  }
  if (taggedUserPattern.test(message) && udderRps === 1) {
    console.log(`udderrps is ${udderRps}`);
    const match = message.match(taggedUserPattern);
    const taggedUser = userstate.username;
    const choice = match[1].toLowerCase();
    const udderChoice = ["rock", "paper", "scissor"];
    const randomResponseIndex = Math.floor(Math.random() * udderChoice.length);
    const udderRespond = udderChoice[randomResponseIndex];
    const rpsReward = 1000;
    console.log("choice is " + choice);

    if (choice === "rock" || choice === "paper" || choice === "scissor") {
      playerChoice = choice;
      // client2.say(channel, udderRespond);
      // await delay(500);
      if (udderRespond && playerChoice) {
        // Calculate the game outcome
        if (udderRespond === playerChoice) {
          gameOutcome = "It's a tie!";
          client2.say(channel, udderRespond + ", " + gameOutcome);
        } else if (
          (playerChoice === "rock" && udderRespond === "scissor") ||
          (playerChoice === "paper" && udderRespond === "rock") ||
          (playerChoice === "scissor" && udderRespond === "paper")
        ) {
          gameOutcome = `${taggedUser} wins!`;
          client2.say(
            channel,
            "!give " +
              taggedUser +
              " " +
              rpsReward +
              " || " +
              udderRespond +
              ", " +
              gameOutcome
          );
        } else {
          gameOutcome = "Uddertastic wins!";
          client2.say(channel, udderRespond + ", " + gameOutcome);
          return;
        }

        // Announce the game outcome
        //client2.say(channel, `${gameOutcome}`);
        // if (gameOutcome.includes(taggedUser)) {
        //   await delay(1200);
        //   client2.say(channel,;
        // } else if (gameOutcome.includes("Uddertastic")) {
        //   return;
        // }
        // Reset game state
        //udderChoice = null;
        playerChoice = null;
        gameOutcome = null;
      }
    }
  }

  if (message === "!bet on" && username === "fathai95") {
    udderBet = 1;
    client2.say(
      channel,
      "/me udder is betting! do !give uddertastic <amount> <rock|paper|scissor> you can win x3"
    );
    console.log("udderbet is " + udderBet);
    return;
  } else if (message === "!bet off" && username === "fathai95") {
    udderBet = 0;
    client2.say(channel, "/me udder is not betting anymore!");
    return;
  }
  if (rpsPattern.test(lowercaseMessage) && udderRps === 1) {
    const match = lowercaseMessage.match(rpsPattern);
    const betAmount = parseInt(match[1]);
    const maxBetAmount = 10000; // Set the maximum bet amount here
    const taggedUser = userstate.username;
    const choice = match[2].toLowerCase();
    const udderChoice = ["rock", "paper", "scissor"];
    const randomResponseIndex = Math.floor(Math.random() * udderChoice.length);
    const udderRespond = udderChoice[randomResponseIndex];
    console.log(
      taggedUser +
        " choice is " +
        choice +
        " || bet is " +
        betAmount +
        " || bet on? " +
        udderBet
    );
    if (udderBet === 0) {
      client2.say(channel, "Udder is not taking bets right now!");
      return;
    }

    if (betAmount > maxBetAmount && udderBet === 1) {
      client2.say(
        channel,
        `Sorry ${taggedUser}, the maximum bet amount is ${maxBetAmount}`
      );
      return; // Exit the function
    }
    await delay(1500);
    if (
      choice === "rock" ||
      choice === "paper" ||
      (choice === "scissor" && udderBet === 1)
    ) {
      playerChoice = choice;
      if (udderRespond && playerChoice) {
        // Calculate the game outcome
        if (udderRespond === playerChoice) {
          gameOutcome = "It's a tie!";
          client2.say(
            channel,
            `!give ${taggedUser} ` +
              betAmount +
              " " +
              udderRespond +
              ", " +
              gameOutcome
          );
        } else if (
          (playerChoice === "rock" && udderRespond === "scissor") ||
          (playerChoice === "paper" && udderRespond === "rock") ||
          (playerChoice === "scissor" && udderRespond === "paper")
        ) {
          gameOutcome = `${taggedUser} wins!`;
          client2.say(channel, udderRespond + ", " + gameOutcome);
        } else {
          gameOutcome = "Uddertastic wins!";
          client2.say(channel, udderRespond + ", " + gameOutcome);
        }

        // Announce the game outcome
        //client2.say(channel, `${gameOutcome}`);
        if (gameOutcome.includes(taggedUser)) {
          await delay(1200);
          client2.say(channel, `!give ${taggedUser} ` + betAmount * 3);
        } else if (gameOutcome.includes("Uddertastic")) {
          return;
        }
        // Reset game state
        //udderChoice = null;
        playerChoice = null;
        gameOutcome = null;
      }
    }
  }

  // if (TargetOn === 0 && udderTargetPattern.test(message) && message !== "uddertastic target 󠀀" && username === "fathai95") {
  //   const match = message.match(udderTargetPattern);
  //   targetUdder = match[1];
  //   client2.say(
  //     channel,
  //     `Roger that, targeting ${targetUdder} Igotmyeyesonyou`
  //   );
  // }

  
  let countdown = 600; // Initial countdown value in seconds (10 minutes)
  let countdownInterval;
  let timerRunning = false;
// Function to update the countdown and display it
function updateCountdown() {
  //const minutes = Math.floor(countdown / 60);
  //const seconds = countdown % 60;
  //console.log(`Time remaining: ${minutes} minutes ${seconds} seconds`); //counting down with consolelog
  
  
  if (countdown <= 0) {
    console.log("Countdown has reached zero.");
    clearInterval(countdownInterval); // Stop the countdown when it reaches zero
    timerRunning = false;
    
  } else {
    countdown--; // Decrement the countdown by 1 second
  RemainingCooldown=countdown;

  }
  return countdown;
}

// Function to start the countdown timer
function startTimer() {
  if (!timerRunning) {
    countdown = 600; // Reset the countdown to 10 minutes
    console.log(`Timer started.`);
    timerRunning = true;
    updateCountdown(); // Display the initial countdown value
    // Start the countdown timer
    countdownInterval = setInterval(updateCountdown, 1000);
  } else {
    console.log(`Timer is already running.`);
  }
}

  if (TargetOn === 1 && Bot1Steal === 1 && udderTargetPattern.test(message) && username !=="fathai95") {
    const match = message.match(udderTargetPattern);
    if (
      match.includes("fathai95") ||
      match.includes("Fathai95") ||
      match.includes("@Fathai95") ||
      match.includes("uddertastic") ||
      match.includes("@uddertastic")
    ) {
      //console.log(username + " trying to target " + targetUdder);
      targetUdder = username;
      client2.say(
        channel,
        `HUH what u tryin to do, im targeting you ${targetUdder} Igotmyeyesonyou`
      );
      startTimer();
      TargetOn = 0;
      await delay(1200001);
      TargetOn = 1;
      return;
    } else {
      if (match) {
        targetUdder = match[1];
        client2.say(
          channel,
          `Roger that, targeting ${targetUdder} Igotmyeyesonyou`
        );
        startTimer();
        TargetOn = 0;
        await delay(1200001);
        TargetOn = 1;
      }
    }

  }
  if (udderTargetPattern.test(message) && TargetOn === 0) {   
    //client2.say(channel,'Targeting on cooldown, try again!');
const minutes = Math.floor(RemainingCooldown / 60);
  const seconds = RemainingCooldown % 60;
  console.log(`Time remaining: ${minutes} minutes ${seconds} seconds`); //counting down with consolelog
    await delay(1000);
  }
  

  if (username==="fathai95" && udderTargetPattern.test(message)) {
    const match = message.match(udderTargetPattern);
    if (match) {
      targetUdder = match[1];
      client2.say(
        channel,
        `Roger that, targeting ${targetUdder} Igotmyeyesonyou`
      );
    }

  }



   

  if (
    message.includes("!steal <username> <amount> to") &&
    username === "chatsrpg" &&
    Bot1Steal === 1
  ) {
    await delay(StealTimer);
    client2.say(channel, `!steal ${targetUdder} all`);
    console.log("udder is stealing from " + targetUdder);
    Bot1Steal = 0;
    await delay(120000);
    Bot1Steal = 1;
  }

  //   const laughPattern = /@runningitdownmidirl \(([-\d,]+)\)/i;
  // const laughPattern2 = /@Dobardman \(([-\d,]+)\)/i;
  const laughPattern = /@RunningItDownMidIRL \(([-\d.]+M)\)/i;
  const laughPattern2 = /@Dobardman \(([-\d.]+M)\)/i;

  // if (laughPattern.test(lowercaseMessage)) {
  //   const match = lowercaseMessage.match(laughPattern);
  //   const lostAmount = match[1]; // Extract the captured number
  //   client2.say(channel, `pepePoint @runningitdownmidirl ${lostAmount}`);
  // }
  if (laughPattern.test(message)) {
    const match = message.match(laughPattern);
    //const lostAmount = match[1].replace(/,/g, ''); //replace the commas
    const lostAmount = match[1]; // Extract the captured number
    client2.say(channel, `pepePoint @runningitdownmidirl ${lostAmount}`);
  }

  if (laughPattern2.test(message)) {
    const match = message.match(laughPattern2);
    const lostAmount = match[1]; // Extract the captured number
    client2.say(channel, `pepePoint @dobardman ${lostAmount}`);
  }

  if (message === "uddertastic status" && username === "fathai95") {
    await delay(500);
    client2.say(
      channel,
      `hunt: ${Bot1Hunt}| fight: ${Bot1Fight}|emote: ${udderEmote}|Steal: ${Bot1Steal} |isUddertastic: ${isUddertastic}, target is ${targetUdder}`
    );
  }

  if (
    message === "meandyou uddertastic" ||
    message === "meandyou @uddertastic"
  ) {
    //username !=="helpstepbrolmstuck" &&
    await delay(200);
    client2.say(channel, `meandyou ${username}`);
  }
  if (message === "!emote on" && username === "fathai95") {
    udderEmote = 1;
    console.log("udderemote is on");
    return;
  } else if (message === "!emote off" && username === "fathai95") {
    udderEmote = 0;
    console.log("udderemote is off");
    return;
  }
  if (
    message.includes("uddertastic") &&
    username !== "fathai95" &&
    username !== "chatsrpg" &&
    message !== "meandyou uddertastic" &&
    !message.includes("!steal uddertastic") &&
    !message.includes("!steal @uddertastic")
  ) {
    const randomSentence = getRandomChat();
    client2.say(channel, randomSentence);
  console.log("_______________isUddertastic="+isUddertastic);

  }

  if (message.includes("!arena to")) {
    await delay(randomDelay);
    client2.say(channel, `!arena`);
  }
if (message && username !== "streamelements") {
  isUddertastic=0;
  //console.log("________someone is talking_______");
}else{
  return;
}
if(message==="uddertastic on"){
  isUddertasticOn =1;
  client2.say(channel,"Im always on baby!");}
});

client2.on('stream-offline', (channel) => {
  console.log(`Stream has ended in ${channel}. Stopping the bot.`);
  // You can take action here, such as stopping your bot or performing other tasks.
  client2.disconnect();
});