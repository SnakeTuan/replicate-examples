import { NextRequest, NextResponse } from "next/server"
import { generatePrediction } from "@/lib/replicate"

export async function POST(request: NextRequest){
    try{
        const body = await request.json();
        const { prompt, numOutputs, aspectRatio, outputFormat } = body;
        console.log("Received request data:", { prompt, numOutputs, aspectRatio, outputFormat });

        const prediction = await generatePrediction(prompt, numOutputs, aspectRatio, outputFormat);
        console.log("Generated Prediction:", prediction);

        return NextResponse.json(prediction);
    } catch (error) {
        console.error('Error in API route /api/image:', error);
        return NextResponse.json({ error: 'Error in API route /api/image:' }, { status: 500 });
    }
}
