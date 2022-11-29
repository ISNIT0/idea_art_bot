import { grpc } from "@improbable-eng/grpc-web";
import GenerationService from "./generation_pb_service";
import Generation from "./generation_pb";

const generationClient = new GenerationService.GenerationServiceClient(
  "https://grpc.stability.ai:443",
  {}
);

export function generateImage(prompt: string) {
  return new Promise<Uint8Array>((resolve, reject) => {
    const imageParams = new Generation.ImageParameters();
    imageParams.setWidth(640);
    imageParams.setHeight(512);
    imageParams.setSamples(1);
    imageParams.setSteps(50);

    const transformType = new Generation.TransformType();
    transformType.setDiffusion(Generation.DiffusionSampler.SAMPLER_K_DPMPP_2M);
    imageParams.setTransform(transformType);

    const request = new Generation.Request();
    request.setEngineId("stable-diffusion-512-v2-0");
    request.setRequestedType(Generation.ArtifactType.ARTIFACT_IMAGE);
    request.setClassifier(new Generation.ClassifierParameters());

    const samplerParams = new Generation.SamplerParameters();
    samplerParams.setCfgScale(13);

    const stepParams = new Generation.StepParameter();
    const scheduleParameters = new Generation.ScheduleParameters();

    stepParams.setScaledStep(0);
    stepParams.setSampler(samplerParams);
    stepParams.setSchedule(scheduleParameters);

    imageParams.addParameters(stepParams);
    request.setImage(imageParams);

    // Set our text prompt
    const promptText = new Generation.Prompt();
    promptText.setText(prompt);

    request.addPrompt(promptText);

    const metadata = new grpc.Metadata();
    metadata.set("Authorization", "Bearer " + process.env.DREAM_STUDIO_API_KEY);

    // Send the request using the `metadata` with our key from earlier
    const generation = generationClient.generate(request, metadata);

    // Set up a callback to handle data being returned
    generation.on("data", (data) => {
      console.log(data);
      data.getArtifactsList().forEach((artifact) => {
        // Oh no! We were filtered by the NSFW classifier!
        if (
          artifact.getType() === Generation.ArtifactType.ARTIFACT_TEXT &&
          artifact.getFinishReason() === Generation.FinishReason.FILTER
        ) {
          return console.error(
            "Your image was filtered by the NSFW classifier."
          );
        }

        // Make sure we have an image
        if (artifact.getType() !== Generation.ArtifactType.ARTIFACT_IMAGE)
          return;

        resolve(artifact.getBinary() as Uint8Array);
      });
    });

    // Anything other than `status.code === 0` is an error
    generation.on("status", (status) => {
      if (status.code === 0) return;
      reject(status);
    });
  });
}
