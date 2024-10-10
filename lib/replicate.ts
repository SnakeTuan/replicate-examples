import Replicate from "replicate";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

// in this example im using black-forest-labs/flux-schnell model because it is the cheapest one, even though it is pretty good if you throw in good prompt
// you can see all the parameters for input and output here: https://replicate.com/black-forest-labs/flux-schnell/api/schema#output-schema
// here i am using the most default parameters, you can mess with them to get different results
// this function let you customize the input parameters, if you want it minimal, you can just pass in only the prompt and it will generate 1 image with default parameters
export async function generateImage(prompt_in: string, numOutputs_in: number, aspectRatio_in: string, outputFormat_in: string){
    try{
        const input = {
            prompt: prompt_in,
            go_fast: true,
            megapixels: "1",
            num_outputs: numOutputs_in, //default is 1
            aspect_ratio: aspectRatio_in, //default is 1:1
            output_format: outputFormat_in, //default is webp
            output_quality: 80, 
            num_inference_steps: 4 
        }
        const response = await replicate.run("black-forest-labs/flux-schnell:latest", {input});
        console.log("Replicate API Response:", response);
        return response;
    } catch (error) {
        console.error('Error in generateImage function:', error);
        throw new Error('Image generation failed');
    }
}