import { NextRequest, NextResponse } from "next/server";
import { fetchaccesstoken, fetchprojectdetails } from "../functions";
import { viewcommit } from "../functions/github";

export  async function GET(req:NextRequest){
    try {
        const header= req.headers.get("projectId")
        const userid=req.headers.get("userId")
        if(!header||!userid){
            return NextResponse.json({message:"No projectid"})
        }
        const projectid=parseInt(header)
        const user=parseInt(userid)
        const token= await fetchaccesstoken(user)
        if(!token){
            return NextResponse.json({message:"No token found"})
        }
        const response=await fetchprojectdetails(token.access_token,projectid)
        return NextResponse.json({details:response})
    } catch (error) {
        return NextResponse.json({message:error,status:500})
    }
}
