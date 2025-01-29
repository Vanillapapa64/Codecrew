import { NextRequest, NextResponse } from "next/server";
import { createproject, existingrepo, fetchaccesstoken, fetchprojects, updateProgress } from "../functions";

export async function GET(req:NextRequest){
    try {
        const id=req.headers.get("userid");
        if(!id){
            return NextResponse.json({message:"no headers",status:400})
        }
        const userid=parseInt(id)
        const response=await fetchprojects(userid)
        return NextResponse.json({projets:response})
    } catch (error) {
        return NextResponse.json({message:error,status:500})
    }
}
export async function POST(req:NextRequest){
    try {
        const body=await req.json()
        const id=req.headers.get("userId");
        const choice=req.headers.get("choice")
        
        if(!id){
            return NextResponse.json({message:"no headers",status:400})
        }
        const userid=parseInt(id)
        body.userid=userid
        const token= await fetchaccesstoken(userid)
        if(!token){
            return NextResponse.json({status:201})
        }
        if(choice=='1'){
            console.log("body is",body)
            const response= await createproject(body.formattedData,token.access_token)
            return NextResponse.json({projectid:response})
        }else{
            const progress= parseInt(req.headers.get('progress')||"")
            const response= await existingrepo(body.formattedData,progress)
            return NextResponse.json({projectid:response})
        }
    } catch (error) {
        console.log(error)
        return NextResponse.json({message:error,status:500})
    }
}
export async function PUT(req:NextRequest) {
    try {
        const progress=await req.json();
        const id=req.headers.get("projectId"); 
        if(!id){
            return NextResponse.json({message:"no headers",status:400})
        }
        const userid=parseInt(id)
        const response= await updateProgress(userid,progress.progress)
        return NextResponse.json({message:response})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message:error,status:500})
    }
}