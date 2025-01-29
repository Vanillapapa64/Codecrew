import { updatetechstack, usercreate } from '@/types';
import { NextRequest, NextResponse } from 'next/server';
import { createuser, fetchuser, updateTechstack } from '../functions';
export async function POST(req: NextRequest) {
    try {
        const body:usercreate = await req.json();
        const code= req.headers.get("code")
        if ( !code) {
            throw new Error('JWT secret is not defined in the environment variables');
        }
        
        const response= await createuser(body,code)
        return NextResponse.json({token:response.id,status:200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message:error,status:500})
    }
}
export async function PUT(req:NextRequest) {
    try {
        const { techstack }: { techstack: string[] }=await req.json();
        const id=req.headers.get("userId")
        if(!id){
            return NextResponse.json({message:"No token/ wrong token",status:401})
            
        }
        const userId=parseInt(id)
        const response= await updateTechstack(userId,techstack)
        return NextResponse.json({message:response})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message:error,status:500})
    }
}
export async function GET(req:NextRequest) {
    try {
        
        const id=req.headers.get("userId")
        if(!id){
            return NextResponse.json({message:"No token/ wrong token",status:401})
            
        }
        const userId=parseInt(id)
        const response= await fetchuser(userId)
        return NextResponse.json({message:response})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message:error,status:500})
    }
}

