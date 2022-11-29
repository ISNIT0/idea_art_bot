export interface Tweet {
  id: string;
  text: string;
}

export interface GenerationConfig {
  prompt: string;
  tweetable: string;
}
