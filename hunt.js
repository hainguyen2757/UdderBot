import { myVariables } from "./constants.js";
import { delay, getRandomDelay } from "./utils.js";

export async function hunt(channel,client) {
    
        await delay(getRandomDelay());
        client.say(channel, myVariables.hunting); //fathai hunt
    
}