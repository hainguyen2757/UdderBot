
if (message.includes("!rps help")) {
    client2.say(
      channelName,
      "Type '!rps rock', '!rps paper', or '!rps scissors' to play Rock-Paper-Scissors!"
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
  if (taggedUserPattern.test(message) && myVariables.udderRps === 1) {
    console.log(`udderrps is ${myVariables.udderRps}`);
    const match = message.match(taggedUserPattern);
    const taggedUser = userstate.username;
    const choice = match[1].toLowerCase();
    const udderChoice = ["rock", "paper", "scissor"];
    const randomResponseIndex = Math.floor(
      Math.random() * udderChoice.length
    );
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
        playerChoice = null;
        gameOutcome = null;
      }
    }
  }

  if (message === "!bet on" && username === "fathai95") {
    myVariables.udderBet = 1;
    client2.say(
      channel,
      "/me udder is betting! do !give uddertastic <amount> <rock|paper|scissor> you can win x3"
    );
    console.log("udderbet is " + myVariables.udderBet);
    return;
  } else if (message === "!bet off" && username === "fathai95") {
    myVariables.udderBet = 0;
    client2.say(channel, "/me udder is not betting anymore!");
    return;
  }
  if (rpsPattern.test(lowercaseMessage) && myVariables.udderRps === 1) {
    const match = lowercaseMessage.match(rpsPattern);
    const betAmount = parseInt(match[1]);
    const maxBetAmount = 10000; // Set the maximum bet amount here
    const taggedUser = userstate.username;
    const choice = match[2].toLowerCase();
    const udderChoice = ["rock", "paper", "scissor"];
    const randomResponseIndex = Math.floor(
      Math.random() * udderChoice.length
    );
    const udderRespond = udderChoice[randomResponseIndex];
    console.log(
      taggedUser +
        " choice is " +
        choice +
        " || bet is " +
        betAmount +
        " || bet on? " +
        myVariables.udderBet
    );
    if (myVariables.udderBet === 0) {
      client2.say(channel, "Udder is not taking bets right now!");
      return;
    }

    if (betAmount > maxBetAmount && myVariables.udderBet === 1) {
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
      (choice === "scissor" && myVariables.udderBet === 1)
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