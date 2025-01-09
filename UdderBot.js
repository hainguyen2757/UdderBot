/* eslint-disable node/no-unsupported-features/es-syntax */
import dotenv from "dotenv";
import tmi, { client } from "tmi.js";
import { clientUdder } from "./bot2.js";
import { clientFathai } from "./bot1.js"; // Ensure clientFathai is defined in bot1.js
import { logMessageToFile, delay, logWinrateToFile } from "./utils.js";
import { myVariables } from "./constants.js"; // Import myVariables

// Call the `config` method to load environment variables from a .env file
// This allows you to use environment variables defined in a .env file
dotenv.config();
//change channel name here cowsep or minionrpg
export const channelName = ["cowsep", "minionrpg"];
// export const channelName = "minionrpg";

const uddertasticOauthKey = process.env.UDDERTASTIC_OAUTH_KEY;

const bot2Config = {
  identity: {
    username: "uddertastic",
    password: uddertasticOauthKey, // Generate this from https://twitchapps.com/tmi/
  },
  channels: channelName, // Add the channel name for Bot 2
};

const client2 = new tmi.Client(bot2Config);

clientUdder(client2);
client2.connect();
// Add error event listener for client2
client2.on("error", (error) => {
  if (error.message.includes("Could not connect to server")) {
    console.log("Uddertastic connection error");
  }
});
console.log("uddertastic connected to channel:", channelName);

const fathai95OauthKey = process.env.FATHAI95_OAUTH_KEY;
const bot1Config = {
  identity: {
    username: "fathai95",
    password: fathai95OauthKey, // Generate this from https://twitchapps.com/tmi/
  },
  channels: channelName, // Add the channel name for Bot 1
};

const client1 = new tmi.Client(bot1Config);
client1.connect();
clientFathai(client1);
client1.on("error", (error) => {
  if (error.message.includes("Could not connect to server")) {
    console.log("Fathai95 connection error");
  }
});
console.log("FatHai95 connected to channel:", channelName);

logWinrateToFile("restarted");//log retart event if the bot is restarted

let getLogMinionrpg = myVariables.logMinionrpg;
let intervalBet;
let intervalBillionairBet;
let intervalCountdown;
const startTime = new Date();
let getisGambaRunning = myVariables.isGambaRunning;
let logTest = 0;
let currentBetAmount;
let logTotalMinions;
let wins = 0;
let losses = 0;
let streaks = {
  win: {
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
    11: 0,
    12: 0,
    13: 0,
    14: 0,
    15: 0,
  },
  loss: {
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
    10: 0,
    11: 0,
    12: 0,
    13: 0,
    14: 0,
    15: 0,
  },
};

//------------------ CONTROLLERS ------------------
let isBillionare = false;
let isWaiting = false;
let isBettingOff = false;
let isAutoGambaOn = false;
let isAutoGamba2On = false;
let isBroke = false;
let isWinstreak = false;
let rebirthed = true;
let riskUnder50 = 5; //if has less than 50m, risk 5m
let riskUnder100 = 10; //if has less than 100m, risk 10m
let riskUnder200 = 20; //if has less than 200m, risk 20m
let riskOver200 = 30; //if has more than 200m, risk 30m
let setAutoGamba2Risk=2; //set it to "2k" or "200k" or "2"
let isAutoSpinOn = true;

//------------------ CONTROLLERS ------------------

client1.on("message", async (channel, userstate, message, self) => {
  const username = userstate.username;

  if (channel === "#cowsep" && getLogMinionrpg === 0) {
    //logging cowsep
    console.log(
      `[${getVietnamTime("timeOnly")}] [COWSEP] ${
        userstate.username
      }: ${message}`
    );
  }
  if (channel === "#cowsep" && username === "minionrpg") {
    logMessageToFile(`[${channel}] ${username}: ${message}`);
  }

  if (channel === "#minionrpg") {
    // logging minionrpg
    if (message.includes("fathai95") || username === "fathai95") {
      console.log(
        `[${getVietnamTime("timeOnly")}] [MINIONRPG] ${
          userstate.username
        }: ${message}`
      );
    }
  }

  if (message === "!check" && username === "fathai95") {
    (async () => {
      await delay(1000);
      client1.say(
        `minionrpg`,
        `isBillionare:${isBillionare} | isWaiting:${isWaiting} | currentBetAmount: ${currentBetAmount} | logTotalMinions: ${logTotalMinions} | autogamba: ${isAutoGambaOn} | isBettingOff: ${isBettingOff} | SpinOn: ${isAutoSpinOn}`
      );
    })();
  }

  // if (
  //   logTotalMinions !== "undefined" &&
  //   logTotalMinions <= 50e6 &&
  //   rebirthed === false
  // ) {
  //   (async () => {
  //     await delay(10000);
  //     sendMessage("minionrpg", `uddertastic give me 12.5m`);
  //     await delay(61000);
  //     sendMessage("minionrpg", `uddertastic give me 12m`);
  //   })();
  // }

  if (
    (message === "!spin" || message.includes("!risk")) &&
    username === "fathai95" &&
    channel === "#minionrpg" &&
    isAutoGambaOn === false
  ) {
    console.log("----------Manually gambling--------");
    clearAllBetIntervals();
    clearInterval(intervalCountdown);
    countdown(60);
  }

  if (message === "!autogambaoff" && username === "fathai95") {
    console.log("----------------------ALL BETTINGS ARE OFF----------------");
    isBettingOff = true;
    isAutoGambaOn = false;
    isAutoGamba2On = false;
    clearAllBetIntervals();
    clearInterval(intervalCountdown);
  }

  // if (message === "test" && username === "fathai95") {

  // }

  if (message === "!autogamba2" && username === "fathai95") {
    console.log("--------------Starting autogamba2--------------");
    isAutoGambaOn = true;
    isAutoGamba2On = true;
    myVariables.isUddertasticOn = 0; //turn off uddertastic chatting
    riskAmount(setAutoGamba2Risk);
  }

  //start gambling risk and spin every 60s
  if (
    (message === "!autogamba" && username === "fathai95") ||
    (message === "!autogamba" && username === "uddertastic")
  ) {
    isBettingOff = false;
    isAutoGambaOn = true;
    getLogMinionrpg = 1;
    myVariables.isUddertasticOn = 0;
    console.log(
      `------------------Start gambling automatically, isAutoGambaOn: ${isAutoGambaOn} | isBettingOff: ${isBettingOff} | isBillionare:${isBillionare} | isWaiting: ${isWaiting} --------------`
    );
    clearInterval(intervalCountdown);
    (async () => {
      await delay(2000);
      sendMessage("minionrpg", `!minions`);
    })();
  }
  //reading result of minionrpg returning total minion
  //if not a billionare then execute this
  //!minions
  if (
    message.includes("fathai95") &&
    message.includes("has") &&
    username === "minionrpg" &&
    channel === "#minionrpg" &&
    isBettingOff === false &&
    isAutoGambaOn === true
  ) {
    clearInterval(intervalCountdown);
    clearAllBetIntervals();
    const totalMinionsMatch = message.match(/(\d+(\.\d+)?[MB])/i);
    if (isAutoGamba2On === true) {
      riskAmount(setAutoGamba2Risk);
    }

    if (totalMinionsMatch && isAutoGamba2On === false) {
      const totalMinions = totalMinionsMatch[0];
      const totalMinionsValue =
        parseFloat(totalMinions) * (totalMinions.includes("B") ? 1e9 : 1e6); // full numbers 100.000.000 minions
      console.log(
        `--------------CHECKING MINIONS: ${totalMinions} || isBillionare: ${isBillionare} | isAutoGambaOn: ${isAutoGambaOn}`
      ); /// xxx.xM minions
      logTotalMinions = totalMinions; //total minions for logging command

      if (isBillionare === false && isWinstreak === false) {
        if (totalMinionsValue < 50e6) {
          isBillionare = false;
          //total minions less than 50m
          console.log(
            "-------------------------Have less than 50m, reducing risk to 5m---------------"
          );
          riskAmount(riskUnder50);
        } else if (totalMinionsValue > 50e6 && totalMinionsValue < 100e6) {
          //total minions more than 50m
          isBillionare = false;
          riskAmount(riskUnder100);
        } else if (totalMinionsValue > 100e6 && totalMinionsValue < 200e6) {
          //total minions more than 100m
          isBillionare = false;
          riskAmount(riskUnder200);
        } else if (totalMinionsValue > 200e6 && totalMinionsValue < 1e9) {
          //total minions more than 200m
          isBillionare = false;
          riskAmount(riskOver200);
        } else if (totalMinionsValue >= 1e9) {
          //total minions more than 1 billion
          console.log(
            "-------------------------Declaring billionare status---------------"
          );
          isBillionare = true;
          riskAmount("20%");
        } else {
          console.log(
            `---------------ERROR RETRIVING MINIONS AMOUNT--------------`
          );
        }
      }

      if (totalMinionsValue >= 1e9 && isBillionare === false) {
        console.log(
          `---------i have more than 1b(${totalMinions}), but i have not declare billionare status-----------`
        );
        isBillionare = true;
        riskAmount("20%");
      } else if (
        totalMinionsValue < 1e9 &&
        isBillionare === true &&
        isWinstreak === false
      ) {
        console.log(
          `----------NO LONGER A BILLIONARE (${totalMinions}), REVOKING billionare status----------`
        );
        isBillionare = false;
        riskAmount(30);
      }
    }
  }
  if (
    message.includes("your wager is too low") &&
    username === "minionrpg" &&
    message.includes("fathai95") &&
    isAutoGambaOn === true &&
    isBillionare === false
  ) {
    console.log(message);
    console.log(
      "--------------Total is over 1b, delcaring billionair status, changing to risk 20%------------------"
    );
    isBillionare = true;
    riskAmount("20%");
  }

  if (
    message.includes("fathai95, you must wait") &&
    username === "minionrpg" &&
    isWaiting === false &&
    isAutoGambaOn === true &&
    channel === "#minionrpg"
  ) {
    console.log(
      "--------------minionrpg told me to wait, so i wait 60s---------------"
    );
    isWaiting = true;
    clearAllBetIntervals();
    clearInterval(intervalCountdown);

    (async () => {
      try {
        countdown(60);
        await delay(60000);
        console.log(`-------------I waited 60s, resetting--------------`);
        sendMessage("minionrpg", `!reset`);
      } catch (error) {
        console.error("Error during !reset operation:", error);
      }
      isWaiting = false;
    })();
  } else if (
    message.includes("fathai95, you must wait") &&
    username === "minionrpg" &&
    isWaiting === true &&
    isAutoGambaOn === true
  ) {
    //clearAllBetIntervals();
    console.log("------------already waiting-----------");
  }
  // Reset command to clear the interval

  if (
    message.includes("fathai95") &&
    message.includes("lost their wager of") &&
    username === "minionrpg" &&
    channel === "#minionrpg" &&
    isAutoGambaOn === true &&
    rebirthed === false
  ) {
    const minionsSpinLostMatch = message.match(/(\d+(\.\d+)?[MB])/i);
    if (minionsSpinLostMatch) {
      const minionsLost = minionsSpinLostMatch[0];
      const minionsLostValue =
        parseFloat(minionsLost) * (minionsLost.includes("B") ? 1e9 : 1e6);
      if (minionsLostValue < 10e6 && rebirthed === false) {
        console.log(`-----------IM BROKE----------`);
        isBroke = true;
        //clearAllBetIntervals();
        clearInterval(intervalCountdown);
        (async () => {
          await delay(6000);
          sendMessage("minionrpg", `uddertastic give me 12.5m`);
          await delay(61000);
          sendMessage("minionrpg", `uddertastic give me 12m`);
          await delay(61000);
          sendMessage("minionrpg", `uddertastic give me 12.5m`);
          await delay(61000);
          countdown(60);
          sendMessage("minionrpg", `!reset`);
        })();
      }
    }
  }

  if (
    message.includes("fathai95") &&
    message.includes("and won") &&
    username === "minionrpg" &&
    channel === "#minionrpg" &&
    isAutoGambaOn === true &&
    rebirthed === false
  ) {
    const minionsSpinLostMatch = message.match(/(\d+(\.\d+)?[MB])/i);
    if (minionsSpinLostMatch) {
      const minionsLost = minionsSpinLostMatch[0];
      const minionsLostValue =
        parseFloat(minionsLost) * (minionsLost.includes("B") ? 1e9 : 1e6);
      if (minionsLostValue < 10e6 && rebirthed === false) {
        console.log(`-----------IM BROKE----------`);
        isBroke = true;
        //clearAllBetIntervals();
        clearInterval(intervalCountdown);
        (async () => {
          await delay(6000);
          sendMessage("minionrpg", `uddertastic give me 12.5m`);
          await delay(61000);
          sendMessage("minionrpg", `uddertastic give me 12m`);
          await delay(61000);
          sendMessage("minionrpg", `uddertastic give me 12.5m`);
          await delay(61000);
          countdown(60);
          sendMessage("minionrpg", `!reset`);
        })();
      }
    }
  }

  if (
    message.includes("fathai95") &&
    message.includes("You lost") &&
    username === "minionrpg" &&
    channel === "#minionrpg" &&
    isWinstreak === true &&
    isAutoGambaOn === true
  ) {
    console.log(`--------lost my winstreak >4-------`);
    (async () => {
      await delay(3000);
      isWinstreak = false;
      console.log(`calling !minions in lost my winstreak >4`);
      sendMessage("minionrpg", "!minions");
    })();
  }

  if (
    message.includes("fathai95") &&
    message.includes("You lost") &&
    username === "minionrpg" &&
    channel === "#minionrpg" &&
    currentBetAmount === "20%" &&
    isAutoGambaOn === true
  ) {
    const minionsLostMatch = message.match(/(\d+(\.\d+)?[MB])/i);
    if (minionsLostMatch) {
      const minionsLost = minionsLostMatch[0];
      const minionsLostValue =
        parseFloat(minionsLost) * (minionsLost.includes("B") ? 1e9 : 1e6);
      //console.log(`You lost ${minionsLost} minions`);

      if (
        minionsLostValue < 200e6 &&
        isBillionare === true &&
        isWinstreak === false
      ) {
        clearAllBetIntervals();
        clearInterval(intervalCountdown);
        isBillionare = false;
        console.log(
          "------------------------Losing less than 200m, not a billionare anymore (<200e6)----------------"
        );
        isBillionare = false;
        (async () => {
          await delay(1000);
          console.log(`calling !minions in <200e6`);

          sendMessage("minionrpg", `!minions`);
        })();
      } else if (minionsLostValue < 200e6 && isBillionare === false) {
        console.log(`----------Did i winstreak--------`);
      }
    }
  } //end of if

  if (
    (message.includes(`!hunt`) || message.includes(`!arena`)) &&
    username === "fathai95" &&
    channel === "#minionrpg" &&
    isAutoGambaOn === true
  ) {
    console.log(
      "\n ---------------------There was a hunt/arena, reseting cooldown--------------- \n"
    );
    clearAllBetIntervals();
    clearInterval(intervalCountdown);
    (async () => {
      await delay(1000);
      sendMessage("minionrpg", `!reset`);
    })();
  }

  if (
    message === "!reset" &&
    username === "fathai95" &&
    channel === "#minionrpg"
  ) {
    clearAllBetIntervals();
    clearInterval(intervalCountdown);
    (async () => {
      console.log(
        "-------RESETTING and waiting 60s till using !autogamba---------"
      );
      countdown(58);
      await delay(60000); // Wait for 60 seconds
      console.log(`---------finished waiting---------`);
      await delay(1000);
      sendMessage("minionrpg", `!autogamba`); //!autogamba already has calling a minions
      //sendMessage("minionrpg", `!autogamba2`); //!autogamba already has calling a minions

    })(); // Call the async function immediately
  }

  const streakTypes = ["win", "loss"];
  const streakLengths = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

  streakLengths.forEach((length) => {
    streakTypes.forEach((type) => {
      if (
        message.includes(
          `${length} ${type === "win" ? "win streak!" : "losses"}`
        ) &&
        message.includes("fathai95")
      ) {
        streaks[type][length]++;

        // Decrement the previous streak length if the current streak length is greater than 2
        if (length > 2 && streaks[type][length - 1] > 0) {
          streaks[type][length - 1]--;
        } else if (length > 15) {
          console.log(`streak ${streaks[type][length]} > 15`);
          logWinrateToFile(`[${channel}] streak over 15: ${message}`);
        }

        // Log if the win streak is greater than 4
        if (type === "win" && length > 4 && isAutoGambaOn === true) {
          console.log(
            `-----------Im having a winstreak of ${[length]}-------------`
          );
          isWinstreak = true;
          //clearAllBetIntervals();
          clearInterval(intervalCountdown);
          riskAmount("20%");
        }

        logWinrateToFile(
          `[${channel}] ${
            type.charAt(0).toUpperCase() + type.slice(1)
          } streaks: ${JSON.stringify(streaks[type])}`
        );
      }
    });
  });

  if (
    message.includes(`You lost`) &&
    message.includes("fathai95") &&
    username === "minionrpg"
  ) {
    losses++;
  } else if (
    message.includes(`You gained`) &&
    message.includes("fathai95") &&
    username === "minionrpg"
  ) {
    wins++;
  }

  if (message === "!streak" && username === "fathai95") {
    console.log(`Bot has been running for: ${getElapsedTime()}`);
    // console.log(
    //   `[${getVietnamTime("timeOnly")}] : Win streaks: ${JSON.stringify(
    //     streaks.win
    //   )} || Loss streaks: ${JSON.stringify(
    //     streaks.loss
    //   )} || W: ${wins} L:${losses}`
    // );
    logWinrateToFile(
      `[${channel}] Manual Log: Win streaks: ${JSON.stringify(
        streaks.win
      )} || Loss streaks: ${JSON.stringify(
        streaks.loss
      )} || Bot has been running for: ${getElapsedTime()}`
    );
    (async () => {
      await delay(1000);
      sendMessage(
        "minionrpg",
        `Win streaks: ${formatStreaks(
          streaks.win
        )} || Loss streaks: ${formatStreaks(
          streaks.loss
        )} ||W: ${wins} L:${losses}`
      );
    })();
  }

  // Helper function to format streaks
  function formatStreaks(streaks) {
    return Object.entries(streaks)
      .map(([length, count]) => `${length}:${count}`)
      .join(", ");
  }

  // Countdown function
  function countdown(seconds) {
    let counter = seconds;
    clearInterval(intervalCountdown);
    intervalCountdown = setInterval(() => {
      process.stdout.write(`\r${counter} seconds remaining`);
      counter--;
      if (counter < 0) {
        clearInterval(intervalCountdown);
        console.log("\n");
      }
    }, 1000);
  }
  function getVietnamTime(format = "full") {
    const options = {
      timeZone: "Asia/Ho_Chi_Minh",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };
    if (format === "timeOnly") {
      delete options.day;
      delete options.month;
      delete options.year;
    }
    return new Date().toLocaleString("en-GB", options).replace(",", "");
  }

  function clearAllBetIntervals() {
    console.log("--------------clearing all bets-------------");
    clearInterval(intervalBet);
    clearInterval(intervalBillionairBet);
  }

if (message==="!spinon" && username==="fathai95"){
  isAutoSpinOn = true;
  console.log("Auto spin is on");
} else if (message==="!spinoff" && username==="fathai95"){
  isAutoSpinOn=false;
  console.log("Auto spin is off");
}

  function riskAmount(amount) {
    clearAllBetIntervals();
    clearInterval(intervalCountdown);
    (async () => {
      currentBetAmount = amount;
      console.log(`--------------Starting bets-------------------`);

      countdown(63);
      // Function to execute the betting logic
      const executeBet = async () => {
        await delay(1000);
        if (isAutoSpinOn === true) {
          sendMessage("minionrpg", `!spin`);
          await delay(2000);
        }
        // Check if the amount is a percentage
        if (typeof amount === "string" && amount.includes("%")) {
          sendMessage("minionrpg", `!risk ${amount}`);
        } else if (typeof amount === "string" && amount.includes("k")) {
          sendMessage("minionrpg", `!risk ${amount}`);
        } else {
          sendMessage("minionrpg", `!risk ${amount}m`);
        }
        //take 3 seconds to do spin and risk
        currentBetAmount = amount;
        countdown(60);
      };
      // Run the function immediately
      //await executeBet();
      // Set the interval to run the function every 64 seconds
      intervalBet = setInterval(executeBet, 64000);
    })();
  }

  let messageTimestamps = [];
  const MESSAGE_LIMIT = 10;
  const TIME_WINDOW = 10000;
  // 20 seconds
  function canSendMessage() {
    const now = Date.now();
    // Remove timestamps older than 20 seconds
    messageTimestamps = messageTimestamps.filter(
      (timestamp) => now - timestamp < TIME_WINDOW
    );
    return messageTimestamps.length < MESSAGE_LIMIT;
  }
  function sendMessage(channel, message) {
    if (canSendMessage()) {
      client1.say(channel, message);
      messageTimestamps.push(Date.now());
    } else {
      console.log("Message limit exceeded. Stopping bot.");
      isBettingOff = true;
      isAutoGambaOn = false;
      clearAllBetIntervals();
      clearInterval(intervalCountdown);
      // Implement logic to stop the bot or handle the rate limit
    }
  }

  // Record the start time when the bot starts
  // Function to get the elapsed time
  function getElapsedTime() {
    const currentTime = new Date();
    const elapsedTime = currentTime - startTime; // Elapsed time in milliseconds
    // Convert elapsed time to hours, minutes, and seconds
    const hours = Math.floor(elapsedTime / (1000 * 60 * 60));
    const minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  //example
  //console.log(`Bot has been running for: ${getElapsedTime()}`);
}); //end of client1.on
