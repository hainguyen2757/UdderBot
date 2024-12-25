import { delay, getRandomDelay } from "./utils.js";

export async function arena(channel,client) {
    await delay(getRandomDelay());
    client.say(channel,"!arena");
    
}