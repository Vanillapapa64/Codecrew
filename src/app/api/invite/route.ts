import { NextRequest, NextResponse } from "next/server";
import { invited } from "../functions";

export async function POST(req:NextRequest) {
    try {
        const header= req.headers.get("projectId")
        const userid=req.headers.get("userId")
        if(!header||!userid){
            return NextResponse.json({message:"No projectid"})
        }
        const projectid=parseInt(header)
        const user=parseInt(userid)
        const response=await invited(user,projectid)
        console.log(response)
        return NextResponse.json({
            message:response
        })
    } catch (error) {
        return NextResponse.json({message:error,status:500})
    }
}