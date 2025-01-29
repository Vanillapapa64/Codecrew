import { NextRequest, NextResponse } from "next/server";
import { fetchaccesstoken, fetchprojectdetails } from "../functions";
import { viewcommit } from "../functions/github";
import client from "../db"
export  async function GET(req:NextRequest){
    try {
        const header= req.headers.get("projectId")
        const userid=req.headers.get("userId")
        if(!header||!userid){
            return NextResponse.json({message:"No projectid"})
        }
        const projectid=parseInt(header)
        const projectowner=await client.project.findFirst({
            where:{
                id:projectid
            }
        })
        if(!projectowner){
            return NextResponse.json({message:"No projectid"})
        }
        console.log(projectowner)
        const token= await fetchaccesstoken(projectowner?.userid)
        if(!token){
            return NextResponse.json({message:"No token found"})
        }
        const response=await fetchprojectdetails(token.access_token,projectid)
        console.log(response)
        return NextResponse.json({details:response})
    } catch (error) {
        return NextResponse.json({message:error,status:500})
    }
}
