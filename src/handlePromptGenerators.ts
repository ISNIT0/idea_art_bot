import { GenerationConfig, Tweet } from "./types";

const beginnings = [
  "Concept art for",
  "A photograph of",
  "Pixel art of",
  "A dream of",
  "A sketch of",
];

const endings = [
  ", tighly detailed",
  ", surrealism",
  ", trending on art station",
  ", triadic color scheme",
  ", smooth",
  ", sharp focus",
  ", matte",
  ", elegant",
  ", the most beautiful image ever seen",
  ", illustration",
  ", digital paint",
  ", dark",
  ", gloomy",
  ", octane render",
  ", 8k",
  ", 4k",
  ", washed colours",
  ", sharp",
  ", dramatic lighting",
  ", beautiful",
  ", post processing",
  ", picture of the day",
  ", ambient lighting",
  ", epic composition",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
];

function getRandomBeginning(beginningsToUse = beginnings) {
  return beginningsToUse[
    Math.round(Math.random() * beginningsToUse.length - 1)
  ];
}
function getRandomEnding(endingsToUse = endings) {
  return endingsToUse[Math.round(Math.random() * endingsToUse.length - 1)];
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
  visualizevalue: (tweet: Tweet) => {
    const normalizedBody = tweet.text.split("http")[0];
    const templated = `An abstract illustration depicting the concept: ${normalizedBody}${getRandomEnding(
      endings.filter(Boolean)
    )}`;
    return {
      prompt: templated,
      tweetable: templated,
    };
  },
  ShockedAtShit: (tweet: Tweet) => {
    const normalizedBody = tweet.text;
    const prefixes = [
      "A newspaper story about",
      "A photograph of",
      "Concept art for",
      "A sketch of",
      "Protestors upset that",
      "Fans celebrating that",
    ];
    const templated = `${getRandomBeginning(
      prefixes
    )} ${normalizedBody}${getRandomEnding()}`;
    return {
      prompt: templated,
      tweetable: templated,
    };
  },
};
