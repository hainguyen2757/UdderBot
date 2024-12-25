import { myVariables } from "./constants.js";
import { delay, getRandomDelay } from "./utils.js";

export async function boss(channel, client){
    await delay(getRandomDelay());
    client.say(channel, myVariables.bossing);
}