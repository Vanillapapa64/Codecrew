import { NextRequest, NextResponse } from "next/server";
import { accept, fetchinvited, fetchproject, fetchuser } from "../functions";
import { collab } from "../functions/github";

export  async function GET(req:NextRequest){
    try {
        const header=req.headers.get("projectId")
        if(!header){
            return NextResponse.json({message:"No projectid"})
        }
        const projectid=parseInt(header)
        const response=await fetchinvited(projectid)
        return NextResponse.json({invited:response})
    } catch (error) {
        return NextResponse.json({message:error,status:500})
    }
}
export  async function POST(req:NextRequest){
    try {
        const header1=req.headers.get("userId");
        const header2=req.headers.get("projectId")
        if(!header1 || !header2){
            return NextResponse.json({message:"No projectid or userid"})
        }
        const userid=parseInt(header1)
        const projectid=parseInt(header2)
        const person=await fetchuser(userid)
        const project=await fetchproject(projectid)
        if(!project||!person){
            return NextResponse.json({message:"couldn't find project",status:500})
        }
        const owner=await fetchuser(project?.userid)
        if(!owner){
            return NextResponse.json({message:"couldn't find project",status:500})
        }
        const body:collab={
            owner:owner?.githubusername,
            token:owner?.access_token,
            repo:project.projectName,
            username:person.githubusername
        }
        console.log(body)
        const response= await accept(userid,projectid,body)
        console.log(response)
        return NextResponse.json({accepted:response})
    } catch (error) {
        return NextResponse.json({message:error,status:500})
    }
}