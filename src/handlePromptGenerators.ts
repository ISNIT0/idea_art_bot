import { GenerationConfig, Tweet } from "./types";

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
};
