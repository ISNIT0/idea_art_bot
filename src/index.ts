import "dotenv/config";
import { generateImage } from "./dreamstudio/generate";
import { twitterHandlePromptGenerators } from "./handlePromptGenerators";
import { GenerationConfig, Tweet } from "./types";
import { twitterClient } from "./Twitter";

function areBasedOnSameTweet(lastTweetAt?: Tweet, lastTweetFrom?: Tweet) {
  const normalizedTweetFrom = lastTweetFrom?.text.slice(20, -10);
  return normalizedTweetFrom && lastTweetAt?.text.includes(normalizedTweetFrom);
}

async function getLatestUnhandledTweet(
  twitterHandle: string
): Promise<Tweet | null> {
  const { data: tweetAtHandleTimeline } =
    await twitterClient.readWrite.v2.search(`from:IdeaArtBot ${twitterHandle}`);
  const { data: handleTimeline } = await twitterClient.readWrite.v2.search(
    `from:${twitterHandle}`
  );

  const lastTweetAtHandle = tweetAtHandleTimeline.data?.[0];
  const lastTweetForHandle = handleTimeline.data?.[0];

  if (!areBasedOnSameTweet(lastTweetAtHandle, lastTweetForHandle)) {
    console.info(
      `Got Untweeted Tweet [${lastTweetForHandle.id}] for handle [${twitterHandle}]`
    );
    return lastTweetForHandle;
  }
  return null;
}

async function uploadImage(image: Uint8Array) {
  return twitterClient.v1.uploadMedia(Buffer.from(image), {
    mimeType: "image/png",
  });
}

async function doTweet({
  handle,
  tweet,
  generationConfig,
  imageId,
}: {
  handle: string;
  tweet: Tweet;
  generationConfig: GenerationConfig;
  imageId: string;
}) {
  await twitterClient.v2.tweet(generationConfig.tweetable + ` @${handle}`, {
    quote_tweet_id: tweet.id,
    media: { media_ids: [imageId] },
  });
}

async function run() {
  for (const handle of Object.keys(twitterHandlePromptGenerators)) {
    const tweet = await getLatestUnhandledTweet(handle);
    if (tweet) {
      const generationConfig = twitterHandlePromptGenerators[handle](tweet);
      const image = await generateImage(generationConfig.prompt);
      const uploadedImageId = await uploadImage(image);

      await doTweet({
        handle,
        tweet,
        generationConfig,
        imageId: uploadedImageId,
      });
    }
  }
}

run().then(
  () => console.info(`✅ Successfully Run`),
  (err) => console.error(`Failed to run`, err)
);
