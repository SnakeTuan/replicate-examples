import { NextRequest, NextResponse } from "next/server"
import { fetchPrediction } from "@/lib/replicate"

export async function GET(request: NextRequest, { params }: { params: { id: string } }){
    const { id } = params;

    try{
        const prediction = await fetchPrediction(id);
        console.log("Fetched Prediction:", prediction);
        return NextResponse.json(prediction);
    } catch (error) {
        console.error('Error in API route /image/[id]:', error);
        return NextResponse.json({ error: 'Error in API route /image/[id]:' }, { status: 500 });
    }
}