/* eslint-disable node/no-unsupported-features/es-syntax */
import tmi from "tmi.js";
import {
  getRandomDelay,
  getRandomResponseDelayTime,
  delay,
  sanitizeMessage,
} from "./utils.js";
const channelName = "cowsep";
import { myVariables } from "./constants.js"; // Import myVariables
import { hunt } from "./hunt.js";
import { responsesLoss, responsesWin } from "./myResponses.js";
import { boss } from "./boss.js";
import { arena } from "./arena.js";

let client1;
export function clientFathai(newClientFathai) {
  client1 = newClientFathai;
  client1.on("message", async (channel, userstate, message, self) => {
    //fathai95
    const username = userstate.username;
    const capturePattern = /(\S+) captured/i;
    const randomResponseDelay = getRandomResponseDelayTime();
    const randomDelay = getRandomDelay();
    let getisGambaRunning = myVariables.isGambaRunning;

    //const captureTextPattern = /captured (\S+) fathai95/i;
    //logMessageToFile(`[${channel}] ${username}: ${message}`); //this is to log every incoming messages

    if (self) return; // Ignore messages from the bot itself

    //log every message to console
    //console.log(`${userstate.username}: ${message}`);

    if (message.includes("!gamba") && username === "fathai95") {
      getisGambaRunning = false;
      await delay(1000);
      client1.say(channel, `!spin`);
      await delay(1000);
      client1.say(channel, `!risk 20%`);
      countdown(60);
    }

    if (message === "!hunting on" && username === "fathai95") {
      myVariables.Bot1Hunt = 1;
      console.log("Bot1 hunt is on");
      return;
    } else if (message === "!hunting off" && username === "fathai95") {
      myVariables.Bot1Hunt = 0;
      console.log("Bot1 hunt is off");
      return;
    }
    if (message === "!fighting on" && username === "fathai95") {
      myVariables.Bot1Fight = 1;
      console.log("Bot1 fight is on");
      return;
    } else if (message === "!fighting off" && username === "fathai95") {
      myVariables.Bot1Fight = 0;
      console.log("Bot1 fight is off");
      return;
    }
    if (message === "!steal on" && username === "fathai95") {
      myVariables.Bot1Steal = 1;
      console.log("Bot1 steal is on");
      return;
    } else if (message === "!steal off" && username === "fathai95") {
      myVariables.Bot1Steal = 0;
      console.log("Bot1 steal is off");
      return;
    }
    if (
      message.includes("!steal <username> <amount> to") &&
      myVariables.Bot1Steal === 1 &&
      username === "minionrpg"
    ) {
      await delay(myVariables.StealTimer);
      client1.say(channel, `!steal ${myVariables.targetUdder} all`);
      console.log("fathai is stealing from " + myVariables.targetUdder);
      myVariables.Bot1Steal = 0;
      await delay(120000);
      myVariables.Bot1Steal = 1;
    }

    if (
      message.includes("Type !hunt") &&
      myVariables.Bot1Hunt === 1 &&
      username === "minionrpg"
    ) {
      hunt(channel, client1);
    }

    if (message.includes("Type !catch") && username === "minionrpg") {
      await delay(getRandomResponseDelayTime);
      client1.say(channel, "!catch");
    }

    if (message.includes("Type !treasure") && username === "minionrpg") {
      await delay(getRandomResponseDelayTime);
      client1.say(channel, "!treasure");
    }

    if (
      message.includes("!boss to") &&
      username === "minionrpg" &&
      myVariables.Bot1Hunt === 1
    ) {
      //var minionCount = 0;
      boss(channel, client1);
    }

    // if (message.includes("Type !arena") && username === "minionrpg") {
    //   arena(channel, client1);
    // }

    const randomResponseIndex = Math.floor(Math.random() * responsesWin.length);
    const randomLossResponseIndex = Math.floor(
      Math.random() * responsesLoss.length
    );
    const responseWin = responsesWin[randomResponseIndex];
    const responseLoss = responsesLoss[randomLossResponseIndex];

    if (message.includes("@fathai95 (+") || message.includes("@fathai95 (-")) {
      const chance = Math.random(); // Generate a random number between 0 and 1

      if (chance < 0.7) {
        // 70% chance of responding
        if (message.includes("fathai95 (+")) {
          console.log(`FatHai95 is celebrating the hunt`);
          await delay(400);
          client1.say(channel, responseWin);
        } else if (message.includes("fathai95 (-")) {
          console.log(`FatHai95 is mourning the hunt`);
          await delay(400);
          client1.say(channel, responseLoss);
        }
      }
    }

    const lowercaseMessage = sanitizeMessage(message);
    if (
      lowercaseMessage.includes("has challenged fathai95") &&
      myVariables.Bot1Fight === 1
      // !lowercaseMessage.includes("runningitdownmidirl") &&
      // !lowercaseMessage.includes("dobardman")
    ) {
      await delay(1000);
      client1.say(channel, `!fight`);
    }

    if (message.toLowerCase().includes("fathai95 (+")) {
      
      await delay(randomResponseDelay);
      client1.say(channel, responseWin);
    }
    if (capturePattern.test(message)) {
      const match = message.match(capturePattern);
      const capturedUser = match[1]; // Extract the captured minions number

      if (
        capturedUser !== "@fathai95" &&
        lowercaseMessage.includes("@fathai95")
      ) {
        await delay(randomResponseDelay);
        console.log(`FatHai95: Responding ${responseLoss} to ${capturedUser}`);
        client1.say(channel, responseLoss);
      }
    }

    const isSubscriber = userstate.subscriber === true;
    const isVip = userstate.vip === true;
    const songRequestPattern = /^!sr (.+)/i;
    if (username !== "fathai95" && !isSubscriber && !isVip) {
      if (songRequestPattern.test(message)) {
        const match = message.match(songRequestPattern);
        const songRequest = match[1]; // Extract the captured minions number

        await delay(5000);
        console.log("saying " + songRequest);
        client1.say(channel, `!sr ${songRequest}`);
      }
    }
    // if (isSubscriber) {
    //   console.log(`User ${userstate.username} is a subscriber.`);
    //   Handle subscriber-specific actions
    // } else {
    //   console.log(`User ${userstate.username} is not a subscriber.`);
    //   Handle actions for non-subscribers
    // }
  }); //end of client1
  function countdown(seconds) {
    let counter = seconds;
    const intervalId = setInterval(() => {
      process.stdout.write(`\r${counter} seconds remaining`);
      counter--;
      if (counter < 0) {
        clearInterval(intervalId);
        console.log("\n");
      }
    }, 1000);
  }
}
