import { NextRequest, NextResponse } from "next/server";
import { fetchown } from "../functions";

export async function GET(req:NextRequest) {
    try {
        const header=req.headers.get("userId")
        if(!header){
                    return NextResponse.json({message:"no headers",status:400})
        }
        const userid=parseInt(header)
        const response=await fetchown(userid)
        return NextResponse.json({message:response,status:200})
    } catch (error) {
        return NextResponse.json({message:error,status:500})
    }
}