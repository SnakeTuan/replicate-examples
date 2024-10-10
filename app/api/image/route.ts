import { NextRequest, NextResponse } from "next/server"
import { generateImage } from "@/lib/replicate"

export async function POST(request: NextRequest){
    try{
        // here we are getting the input from the user
        const { prompt, numOutputs, aspectRatio, outputFormat } = await request.json();
        console.log("Received request data:", { prompt, numOutputs, aspectRatio, outputFormat });

        // generating the image by passing the input to the replicate api
        const imageUrls:any = await generateImage(prompt, numOutputs, aspectRatio, outputFormat);
        console.log("Generated Image URLs:", imageUrls);

        // return the response
        return NextResponse.json({ imageUrls });
    } catch (error) {
        console.error('Error in API route:', error);
        return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
    }
}
