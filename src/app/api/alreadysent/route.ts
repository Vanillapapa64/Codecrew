import { NextRequest, NextResponse } from "next/server";
import { checkifalreadysent } from "../functions";

export async function GET(req:NextRequest){
    try {
        const header1=req.headers.get("userId");
        const header2=req.headers.get("projectId")
        if(!header1 || !header2){
            return NextResponse.json({message:"No projectid or userid"})
        }
        const userid=parseInt(header1)
        const projectid=parseInt(header2)
        const response= await checkifalreadysent(userid,projectid)
        return NextResponse.json({res:response})
    } catch (error) {
        return NextResponse.json({message:error,status:500})
    }
}