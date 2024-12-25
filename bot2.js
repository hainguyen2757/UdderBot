let client2;
const uddertasticOauthKey = process.env.UDDERTASTIC_OAUTH_KEY;

import {
  getRandomDelay,
  getRandomResponseDelayTime,
  delay,
  logMessageToFile,
  UddertasticSayRandomChatTime,
} from "./utils.js";
import { channelName } from "./UdderBot.js";
import { myVariables } from "./constants.js"; // Import myVariables
import { emoteResponses } from "./emoteResponses.js";
import { client } from "tmi.js";
import { randomChats } from "./randomChats.js";
import { hunt } from "./hunt.js";
import { arena } from "./arena.js";
import { boss } from "./boss.js";
import { rickRollLinks } from "./rickRoll.js";
import { randomResponses } from "./randomResponses.js";

const huntInfo = `initial delay: ${myVariables.initialDelay}| hunt: ${myVariables.Bot1Hunt} | fight: ${myVariables.Bot1Fight} | emote: ${myVariables.udderEmote} | RPS: ${myVariables.udderRps} |Steal: ${myVariables.Bot1Steal}, target is ${myVariables.targetUdder}, LogMinionRPG is ${myVariables.logMinionrpg}`;
console.log(huntInfo);

export function clientUdder(newClientUdder) {
  client2 = newClientUdder;
  client2.on("message", async (channel, userstate, message, self) => {
    // udder
    const randomDelay = getRandomDelay();
    const randomResponseDelayTime = getRandomResponseDelayTime();
    const username = userstate.username;
    const lowercaseMessage = message.toLowerCase();
    const getchannelName = channelName;
    let getLogMinionrpg = myVariables.logMinionrpg;
    //rps
    const rpsPattern = /!give uddertastic (\d+) (rock|paper|scissor)/i;
    const taggedUserPattern = /@?uddertastic\s+(rock|paper|scissor)/i;
    let playerChoice = null; //rps choice
    let gameOutcome = null; //rps outcome

    let lastResponse = ""; // Initialize with an empty string,
    let currentResponse = "";
    const udderTargetPattern = /uddertastic target (\S+)/i;
    const udderKissPattern = /uddertastic kiss (\S+)/i;
    const minionAmount = "5%"; //amount hunting arena

    //const giveUserPattern = /uddertastic give (\S+)/i;
    if (self) return; // Ignore messages from the bot itself

    // if (username === "minionrpg") {
    //   // logMessageToFile(channel, username, message);
    //   logMessageToFile(`[${channel}] ${username}: ${message}`);
    // }

    if (message.includes("Type !hunt") && username === "minionrpg") {
      client2.say(channel, "!hunt " + minionAmount);
      //hunt(channel,client2);
    }

    if (message.includes("Type !treasure") && username === "minionrpg") {
      await delay(getRandomResponseDelayTime);
      client2.say(channel, "!treasure");
    }

    if (message.includes("Type !catch") && username === "minionrpg") {
      await delay(getRandomResponseDelayTime);
      client2.say(channel, "!catch");
    }

    if (message.includes("!boss to") && username === "minionrpg") {
      boss(channel, client2);
    }

    if (
      message.includes("udder") &&
      !message.includes("@uddertastic") &&
      !message.includes("uddertastic") &&
      myVariables.udderEmote === 1 &&
      !message.includes("uddertastic say")
    ) {
      console.log("___________________Udder is called");
      let responseIndex;
      let randomResponseIndex = getRandomResponseEmoteIndex();
      while (emoteResponses[responseIndex] === lastResponse) {
        responseIndex = getRandomResponseEmoteIndex();
      }
      lastResponse = emoteResponses[responseIndex];
      currentResponse = emoteResponses[randomResponseIndex];
      // console.log(
      //   `=============================uddertastic: Responding to ${userstate.username} in ${channel} with ${currentResponse} after ${randomDelay}`
      // );

      await delay(getRandomResponseDelayTime);
      client2.say(channel, `${currentResponse}`);
    }

    if (message.startsWith("uddertastic say") && username === "fathai95") {
      const response = message.replace("uddertastic say", "").trim();
      await delay(randomResponseDelayTime);
      if ((getLogMinionrpg = 0)) {
        client2.say(channel, `${response}`);
      } else if ((getLogMinionrpg = 1)) {
        client2.say("minionrpg", `${response}`);
      }
    }

    //uddertastic gives minions
    const givePattern = /uddertastic give me (\d+(\.\d+)?m?)/i;
    if (givePattern.test(message)) {
      const match = message.match(givePattern);
      const giveMinion = match[1]; // Extract the captured minions number
      if (username === "fathai95") {
        await delay(300);
        console.log(`uddertastic is giving Fathai95 ${giveMinion} minions`);
        client2.say(channel, "!give fathai95 " + giveMinion);
      }
    }

    // if (message === "uddertastic give me" && username === "fathai95") {
    //   await delay(300);
    //   console.log(`uddertastic is giving Fathai95 5m minions`);
    //   if ((getLogMinionrpg = 0)) {
    //     client2.say(channel, "!give fathai95 5m");
    //   } else if ((getLogMinionrpg = 1)) {
    //     client2.say("minionrpg", "!give fathai95 5m");
    //   }
    // }

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
      if (countdown <= 0) {
        console.log("Countdown has reached zero.");
        clearInterval(countdownInterval); // Stop the countdown when it reaches zero
        timerRunning = false;
      } else {
        countdown--; // Decrement the countdown by 1 second
        myVariables.RemainingCooldown = countdown;
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

    if (
      myVariables.TargetOn === 1 &&
      myVariables.Bot1Steal === 1 &&
      udderTargetPattern.test(message) &&
      username !== "fathai95"
    ) {
      const match = message.match(udderTargetPattern);
      if (
        match.includes("fathai95") ||
        match.includes("Fathai95") ||
        match.includes("@Fathai95") ||
        match.includes("uddertastic") ||
        match.includes("@uddertastic")
      ) {
        //console.log(username + " trying to target " + targetUdder);
        myVariables.targetUdder = username;
        client2.say(
          channel,
          `HUH what u tryin to do, im targeting you ${myVariables.targetUdder} Igotmyeyesonyou`
        );
        startTimer();
        myVariables.TargetOn = 0;
        await delay(1200001);
        myVariables.TargetOn = 1;
        return;
      } else {
        if (match) {
          myVariables.targetUdder = match[1];
          client2.say(
            channel,
            `Roger that, targeting ${myVariables.targetUdder} Igotmyeyesonyou`
          );
          startTimer();
          myVariables.TargetOn = 0;
          await delay(1200001);
          myVariables.TargetOn = 1;
        }
      }
    }
    if (udderTargetPattern.test(message) && myVariables.TargetOn === 0) {
      //client2.say(channel,'Targeting on cooldown, try again!');
      const minutes = Math.floor(myVariables.RemainingCooldown / 60);
      const seconds = myVariables.RemainingCooldown % 60;
      console.log(`Time remaining: ${minutes} minutes ${seconds} seconds`); //counting down with consolelog
      await delay(1000);
    }

    if (username === "fathai95" && udderTargetPattern.test(message)) {
      const match = message.match(udderTargetPattern);
      if (match) {
        myVariables.targetUdder = match[1];
        client2.say(
          channel,
          `Roger that, targeting ${myVariables.targetUdder} Igotmyeyesonyou`
        );
      }
    }

    if (
      message.includes("!steal <username> <amount> to") &&
      username === "minionrpg" &&
      myVariables.Bot1Steal === 1
    ) {
      await delay(myVariables.StealTimer);
      client2.say(channel, `!steal ${myVariables.targetUdder} all`);
      console.log("udder is stealing from " + myVariables.targetUdder);
      myVariables.Bot1Steal = 0;
      await delay(120000);
      myVariables.Bot1Steal = 1;
    }

    const laughPattern = /@RunningItDownMidIRL \(([-\d.]+M)\)/i;
    const laughPattern2 = /@Dobardman \(([-\d.]+M)\)/i;

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
        `hunt: ${myVariables.Bot1Hunt}| fight: ${myVariables.Bot1Fight}|emote: ${myVariables.udderEmote}|Steal: ${myVariables.Bot1Steal} |RPS: ${myVariables.udderRps}, target is ${myVariables.targetUdder}`
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
      myVariables.udderEmote = 1;
      console.log("udderemote is on");
      return;
    } else if (message === "!emote off" && username === "fathai95") {
      myVariables.udderEmote = 0;
      console.log("udderemote is off");
      return;
    }

    //fight fighting !fight !accept
    if (message === "uddertastic fight on" && username === "fathai95") {
      myVariables.Bot1Fight = 1;
      console.log("udder is fighting");
    } else if (message === "uddertastic fight off" && username === "fathai95") {
      myVariables.Bot1Fight = 0;
      console.log("udder is not fighting");
    }

    // Check if the message is from "minionrpg" and matches the required pattern
    if (
      message.includes("uddertastic, you have been") &&
      myVariables.Bot1Fight === 1
    ) {
      console.log("==========================================================");

      // Define the regex pattern to match messages with the required format
      const match = message.match(
        /\s*(\d+(?:\.\d{1,3})?)([KM]?)\s*minions! Type !accept to/
      );

      if (match) {
        // Debugging to check the match result
        //console.log("Match found:", match);

        // Parse the number and unit from the match
        let number = parseFloat(match[1]);
        const unit = match[2] || ""; // Default to empty string if no unit is provided

        // Convert to a standard numeric value if "K" or "M" is present
        if (unit === "K") {
          number *= 1000;
        } else if (unit === "M") {
          number *= 1000000;
        }

        // Debugging to check the parsed number
        //console.log("Parsed number:", number);

        // Check if the number exceeds 10 million
        if (number > 10000000) {
          client2.say(channel, "!cancel [max fighting is 10m] Stare");
        } else {
          await delay(getRandomResponseDelayTime + 1000);
          console.log("udder is fighting " + username);
          client2.say(channel, "!accept");
        }
      } else {
        console.log("Pattern did not match the message:", message);
      }
    }

    //end of !fight

    if (
      message.includes("uddertastic") &&
      !message.includes("uddertastic say") &&
      !message.includes("!give uddertastic") &&
      !message.includes("!fight uddertastic") &&
      !message.includes("!minions uddertastic") &&
      !message.includes("!stats uddertastic") &&
      !message.includes("uddertastic target") &&
      username !== "minionrpg" &&
      message !== "meandyou uddertastic" &&
      !message.includes("!steal uddertastic") &&
      !message.includes("!steal @uddertastic") &&
      !message.includes("uddertastic kiss") &&
      !message.includes("uddertastic give me") &&
      !message.includes("@uddertastic kiss") &&
      username !== "streamelements" &&
      username !== "nightbot"
    ) {
      const randomSentence = getRandomResponses();
      delay(700);
      client2.say(channel, randomSentence);
      console.log(
        "=======================isUddertasticAlone(max 5)=" +
          myVariables.isUddertasticAlone
      );
    }

    // if (message.includes("Type !arena") && username === "minionrpg") {
    //   //arena(channel,client2);
    //   client2.say(channel, "!arena " + minionAmount);
    // }
    if (
      message &&
      username !== "streamelements" &&
      username !== "uddertastic" &&
      channel === "#cowsep"
    ) {
      myVariables.isUddertasticAlone = 0;
      //console.log("________someone is talking_______");
    } else {
      return;
    }
    if (message === "uddertastic on") {
      myVariables.isUddertasticOn = 1;
      client2.say(channel, "Im always on baby!");
    }

    if (udderKissPattern.test(message)) {
      const match = message.match(udderKissPattern);
      const udderKiss = match[1]; // Extract the captured minions number

      await delay(350);
      console.log(`uddertastic is kissing ${udderKiss}`);
      client2.say(channel, "meandyou " + udderKiss);
    }
    const containsRickRollLink = rickRollLinks.some((link) =>
      message.includes(link)
    );

    if (containsRickRollLink) {
      // Send a "don't click" message in the channel
      await delay(300);
      client2.say(channel, "Don't click that link! It's a Rick Roll!");
    }

    if (message.includes("!rps help")) {
      client2.say(
        getchannelName,
        "Type '!give uddertastic <amount> rock/paper/scissors', !give uddertastic 1000 rock (max is 10000)  Rock-Paper-Scissors!"
      );
    }

    if (message === "!rps on" && username === "fathai95") {
      myVariables.udderRps = 1;
      console.log("udderRPS is On");
      return;
    } else if (message === "!rps off" && username === "fathai95") {
      myVariables.udderRps = 0;
      console.log("udderRPS is Off");
      return;
    }

    // song request
    // const isSubscriber = userstate.subscriber === true;
    // const isVip = userstate.vip === true;
    // const songRequestPattern = /^!fsr (.+)/i;
    //   if (username ==="fathai95") {
    //     if (songRequestPattern.test(message)) {
    //       const match = message.match(songRequestPattern);
    //       const songRequest = match[1]; // Extract the captured minions number

    //       await delay (500);
    //       console.log("saying "+songRequest);
    //       client2.say(channel,`!sr ${songRequest}`);

    //     }
    //   } else {
    //     if (!isSubscriber && !isVip) {
    //       if (songRequestPattern.test(message)) {
    //         const match = message.match(songRequestPattern);
    //         const songRequest = match[1]; // Extract the captured minions number

    //         await delay (5000);
    //         console.log("saying "+songRequest);
    //         client2.say(channel,`!sr ${songRequest}`);

    //       }
    //     }
    //   }
  }); //end of client2.on (end of checking every message in chat)
} //end of clientUdder
function getRandomResponseIndex(responsesArray) {
  return Math.floor(Math.random() * responsesArray.length);
}
function getRandomResponseEmoteIndex() {
  return getRandomResponseIndex(emoteResponses);
}

function getRandomChat() {
  const randomIndex = Math.floor(Math.random() * randomChats.length);
  return randomChats[randomIndex];
}

function getRandomResponses() {
  const randomIndex = Math.floor(Math.random() * randomResponses.length);
  return randomResponses[randomIndex];
}

function sayRandomChat() {
  const randomSentence = getRandomChat();
  if (myVariables.isUddertasticOn === 1) {
    client2.say("cowsep", randomSentence);
    myVariables.isUddertasticAlone++;
    console.log(
      `__________________isUddertasticAlone: ${myVariables.isUddertasticAlone}`
    );
    if (myVariables.isUddertasticAlone >= 5) {
      myVariables.isUddertasticOn = 0;
      client2.say("cowsep", "Dead stream, im out!");
      console.log("_________________uddertastic is alone, shutting down");
    }
  }
  UddertasticSayRandomChatTime();
}

//start of minionrpgfarm in chat
// async function minionrpgFarm() {
//   const getchannelName = channelName;

//   if (getchannelName === "minionrpg") {
//     console.log("________________________________________Udder is farming");
//     await delay(1000);
//     console.log("________________________________________Udder is playing slot");
//     client2.say("minionrpg", `!spin`);
//     await delay(2000);
//     client2.say("minionrpg", `!risk 20%`);
//   }
// }
// setTimeout(() => {
//   minionrpgFarm();
//   setInterval(() => {
//     minionrpgFarm();
//   }, 61000);
// }, 2000);

//end of minionrpgfarm

setTimeout(() => {
  sayRandomChat(); // Send a random sentence immediately
  var interval = UddertasticSayRandomChatTime();
  //   setInterval(sayRandomChat, interval);
  setInterval(() => {
    sayRandomChat();
    var newInterval = UddertasticSayRandomChatTime(); // Get a new random interval for the next iteration
    interval = newInterval; // Update the interval for the next iteration
    //console.log(`________________interval from last chat time: ${interval}`);
  }, interval);
}, myVariables.initialDelay);
