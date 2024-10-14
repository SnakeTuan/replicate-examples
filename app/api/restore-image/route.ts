import { NextRequest, NextResponse } from "next/server"
import { restoreImage } from "@/lib/replicate"

export async function POST(request: NextRequest){
    try{
        const body = await request.json();
        const {img} = body;
        console.log("Received request data:", { img })

        const prediction = await restoreImage(img)
        console.log("Generated Prediction:", prediction);

        return NextResponse.json(prediction);
    } catch (error) {
        console.error('Error in API route /api/restore-image:', error);
        return NextResponse.json({ error: 'Error in API route /api/restore-image:' }, { status: 500 });
    }
}
