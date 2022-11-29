import { GenerationConfig, Tweet } from "./types";

const beginnings = [
  "Concept art for",
  "A photograph of",
  "Pixel art of",
  "A dream of",
  "A sketch of",
];

const endings = [", trending on artstation", ", in space", "", "", ""];

function getRandomBeginning() {
  return beginnings[Math.round(Math.random() * beginnings.length - 1)];
}
function getRandomEnding() {
  return endings[Math.round(Math.random() * endings.length - 1)];
}

export const twitterHandlePromptGenerators: Record<
  string,
  (tweet: Tweet) => GenerationConfig
> = {
  gameideabot(tweet: Tweet) {
    const normalizedBody = tweet.text
      .replace("In this", "A")
      .replace("A", "a")
      .replace(/#.*/g, "");

    const templated = `Concept art for ${normalizedBody}`;

    return {
      prompt: templated,
      tweetable: templated,
    };
  },
  gameidea_bot: (tweet: Tweet) =>
    twitterHandlePromptGenerators.gameideabot(tweet),
  magicrealismbot(tweet: Tweet) {
    const normalizedBody = "when " + tweet.text.replace("A", "a");

    const randomBeginning = getRandomBeginning();
    const randomEnding = getRandomEnding();
    const templated = `${randomBeginning} ${normalizedBody}${randomEnding}`;

    return {
      prompt: templated,
      tweetable: templated,
    };
  },
  bot_teleport: (tweet: Tweet) => {
    const normalizedBody = tweet.text;

    const randomEnding = getRandomEnding();
    const templated = `${normalizedBody}${randomEnding}`;

    return {
      prompt: templated,
      tweetable: templated,
    };
  },
  neighbour_civs: (tweet: Tweet) => {
    const normalizedBody = tweet.text;
    const randomEnding = getRandomEnding();
    const templated = `${normalizedBody}${randomEnding}`;

    return {
      prompt: templated,
      tweetable: templated,
    };
  },
  brandnewplanet: (tweet: Tweet) => {
    const normalizedBody = tweet.text.split(" ").slice(2).join(" ");

    const randomBeginning = getRandomBeginning();
    const randomEnding = getRandomEnding();
    const templated = `${randomBeginning} ${normalizedBody}${randomEnding}`;

    return {
      prompt: templated,
      tweetable: templated,
    };
  },
};
