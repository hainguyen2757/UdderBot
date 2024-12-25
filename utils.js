import fs from "fs";
export function getRandomDelay() {
    return Math.random() * 20000 + 500; // Generate random delay between 500ms and 20500ms
    //return 1000; //1000ms = 1s
  }
  export function getRandomResponseDelayTime() {
    return Math.random() * 1000 + 500; // Generate random delay between 500ms and 1500ms
    //return 1000; //1000ms = 1s
  }
  
  export function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  export function sanitizeMessage(message) {
    // Remove symbols such as "@" and convert to lowercase
    return message.replace(/[@#!$%^&*(),.?":{}|<>]/g, "").toLowerCase();
  }

  export function logMessageToFile(message) {
    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp}: ${message}\n`;
  
    fs.appendFile("message_log.txt", logEntry, (err) => {
      if (err) {
        console.error("Error writing to log file:", err);
      }
    });
  }

  export function logWinrateToFile(message) {
    const timestamp = new Date().toISOString();
    const logEntry = `${timestamp}: ${message}\n`;
  
    fs.appendFile("winrate_log.txt", logEntry, (err) => {
      if (err) {
        console.error("Error writing to log file:", err);
      }
    });
  }

  export function UddertasticSayRandomChatTime() {
   
    return 90000 + Math.random() * 150000;
  }