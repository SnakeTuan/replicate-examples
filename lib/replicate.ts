import Replicate, { type Prediction } from 'replicate';

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

export async function generatePrediction(prompt_in: string, numOutputs_in: number, aspectRatio_in: string, outputFormat_in: string){
    try{
        const input = {
            prompt: prompt_in,
            num_outputs: numOutputs_in, //default is 1
            aspect_ratio: aspectRatio_in, //default is 1:1
            output_format: outputFormat_in, //default is webp
        }        
        const prediction = await replicate.predictions.create({
            model: "black-forest-labs/flux-schnell",
            input: input
        });
        
        if(prediction.error){
            console.error('Error in Replicate API generatePrediction:', prediction.error);
            return prediction.error;
        }
        return prediction;
    } catch (error) {
        console.error('Error in generatePrediction function:', error);
        throw new Error('Error in generatePrediction function');
    }
}

export async function fetchPrediction(predictionId: string){
    try{
        const prediction = await replicate.predictions.get(predictionId);

        if(prediction.error){
            console.error('Error in Replicate API fetchPrediction:', prediction.error);
            return prediction.error;
        }

        return prediction;
    } catch (error) {
        console.error('Error in fetchPrediction function:', error);
        throw new Error('Error in fetchPrediction function');
    }
}
