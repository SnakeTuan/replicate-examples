import { NextRequest, NextResponse } from "next/server"
import { imageToImage } from "@/lib/replicate"

export async function POST(request: NextRequest){
    try{
        const body = await request.json();
        const { prompt, style, inputImages, numOutputs } = body;
        console.log("Received request data:", { prompt, style, inputImages, numOutputs });

        const prediction = await imageToImage(prompt, inputImages, style, numOutputs);
        console.log("Generated Prediction:", prediction);

        return NextResponse.json(prediction);
    } catch (error) {
        console.error('Error in API route /api/image-to-image:', error);
        return NextResponse.json({ error: 'Error in API route /api/image-to-image:' }, { status: 500 });
    }
}
