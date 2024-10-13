import Replicate, { type Prediction } from 'replicate';
import { readFile } from "node:fs/promises";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

export async function textToImage(prompt_in: string, numOutputs_in: number, aspectRatio_in: string, outputFormat_in: string){
    const input = {
        prompt: prompt_in,
        num_outputs: numOutputs_in, //default is 1
        aspect_ratio: aspectRatio_in, //default is 1:1
        output_format: outputFormat_in, //default is webp
    }   
    try{     
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

export async function imageToImage(prompt_in: string, image_in: string, style_in: string, numOutputs_in: number){
    const input = {
        prompt: prompt_in,
        input_image: image_in,
        style_name: style_in,
        num_outputs: numOutputs_in,
    }
    try{
        const prediction = await replicate.predictions.create({
            model: "tencentarc/photomaker",
            input: input
        });
        if(prediction.error){
            console.error('Error in Replicate API imageToImage:', prediction.error);
            return prediction.error;
        }
        return prediction;
    } catch (error) {
        console.error('Error in imageToImage function:', error);
        throw new Error('Error in imageToImage function');
    }
}