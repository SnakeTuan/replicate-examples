import Replicate from 'replicate';

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
            version: "ddfc2b08d209f9fa8c1eca692712918bd449f695dabb4a958da31802a9570fe4",
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

export async function restoreImage(image_in: string){
    const model = "tencentarc/gfpgan"
    const version = "0fbacf7afc6c144e5be9767cff80f25aff23e52b0708f17e20f9879b2f21516c"
    const input = {
        img: image_in,
        scale: 2,
        version: "v1.4"
    }
    try{
        const prediction = await replicate.predictions.create({
            model: model,
            version: version,
            input: input
        });
        if(prediction.error){
            console.error('Error in Replicate API restoreImage:', prediction.error);
            return prediction.error;
        }
        return prediction;
    } catch (error) {
        console.error('Error in restoreImage function:', error);
        throw new Error('Error in restoreImage function');
    }
}