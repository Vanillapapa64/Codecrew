import client from "../db"
import type {  createprojectinterface, usercreate } from "@/types";
import { collab, createRepo, createRepository, getCollaborators, getpersonalaccesstoken, inviteCollaborator, listCommits, viewcommit } from "./github";
import { NextResponse } from "next/server";
import axios from "axios";
import bcrypt from "bcrypt"
import crypto from "crypto";
import { error } from "console";
import CryptoJS from 'crypto-js';
import dotenv from 'dotenv';

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY as string;
const IV_LENGTH = 16; 
function encrypt(text:string):string {
    const ciphertext = CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
    return ciphertext;
}
  
function decrypt(ciphertext:string):string {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
}
export async function createuser(x:usercreate,code:string) {
    try{const SECRET_KEY = process.env.SECRET_KEY;
        if (!SECRET_KEY) {
            throw new Error("SECRET_KEY is not defined in environment variables");
        }
        await client.$connect();
        const access_token= await getpersonalaccesstoken(code)
        const userResponse = await axios.get("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        const hashedPassword = await bcrypt.hash(x.password.trim(), 10)
        const encryptedToken= encrypt(access_token)
        const username=userResponse.data.login
        const response=await client.user.create({
            data:{
                name:x.name.trim(),
                password:hashedPassword,
                university:x.university,
                course:x.course,
                githubusername:username,
                access_token:encryptedToken
            }
        })
        if (x.techstack && x.techstack.length > 0) {
            const techStackPromises = x.techstack.map((tech) =>
                client.techstackuser.create({
                    data: {
                        userid: response.id,
                        tech: tech,
                    },
                })
            );
            await Promise.all(techStackPromises);
        }
        console.log(response)
        return {id:response.id,name:response.name}
    }catch(err){
        console.log(err)
        throw new Error("couldn't create user")
    }finally{
        await client.$disconnect()
    }
}
export async function updateTechstack(id:number,techstack: string[]) {
    if (!techstack || techstack.length === 0) {
        throw new Error("Techstack cannot be empty");
    }
    try {
        await client.$connect();
        await client.techstackuser.deleteMany({
            where: {
                userid: id,
            },
        });

        // Insert new techstack entries
        return await client.techstackuser.createMany({
                    data: techstack.map((tech) => ({
                        userid: id,
                        tech: tech,
                    })),
                });
    } catch (error) {
        console.log(error)
        throw new Error("Couldn't update techstack");
        
    }finally{
        await client.$disconnect()
    }
}
export async function existingrepo(x:createprojectinterface,pro:number) {
    try {
        await client.$connect()
        console.log(typeof(x));  // Add this log
        console.log("Progress value:", pro);
        const userExists = await client.user.findUnique({
            where: { id: x.userid },
        });

        if (!userExists) {
            throw new Error("User does not exist");
        }
        const response=await client.project.create({
            data:{
                userid:x.userid,
                projectName:x.projectName,
                projectDesc:x.projectDesc,
                repoLink:x.repoLink,
                techstack: {
                    create: x.techstack.map((tech:string) => ({
                      tech: tech, // Add each tech as a separate entry
                    }))},
                createdAt:new Date(),
                progess:pro
            }
        })
        console.log(response)
        return response.id
    } catch (error) {
        console.log(error)
        throw new Error("couldn't create project")
    }finally{
        await client.$disconnect()
    }
}
export async function createproject(x:createprojectinterface,token:string){
    console.log("x is ",x)
    try {
        await client.$connect();
        const userExists = await client.user.findUnique({
            where: { id: x.userid },
        });

        if (!userExists) {
            throw new Error("User does not exist");
        }
        const y:createRepo={
            name:x.repoLink,
            token:token
        }
        
        await createRepository(y)
        const response=await client.project.create({
            data:{
                userid:x.userid,
                projectName:x.projectName,
                projectDesc:x.projectDesc,
                repoLink:x.repoLink,
                techstack: {
                    create: x.techstack.map((tech:string) => ({
                      tech: tech, // Add each tech as a separate entry
                    }))},
                createdAt:new Date(),
                progess:0
            }
        })
        
        return response.id
    } catch (error) {
        console.log(error)
        throw new Error("couldn't create project")
    }finally{
        await client.$disconnect()
    }
}

export async function fetchprojects(userid:number) {
    try {
        await client.$connect();
        const id=await client.techstackuser.findMany({
            where:{
                userid:userid
            },
            select: {
                tech: true, // Only fetch the tech field
            },
        })
        const techList = id.map((entry) => entry.tech); // Extract the tech values

    // Fetch projects where the techstack contains any of the user's techs
            return await client.project.findMany({
            where: {
                techstack: {
                some: {
                    tech: {
                    in: techList, // Match tech values in the techstack
                    },
                },
                },
                userid:{
                    not:userid
                }
            },
            });
    } catch (error) {
        throw new Error("couldn't fetch projects")
    }finally{
        await client.$disconnect();
    }
}
export async function fetchprojectdetails(token:string,id:number) {
    try{
        await client.$connect()
        
        const project=await client.project.findFirst({
            where:{
                id:id
            }
        })
        if (!project) {
            throw new Error(`Project with id ${id} not found.`);
        }
        const username= await client.user.findFirst({
            where:{
                id:project.userid
            },
            select:{
                githubusername:true
            }
        })
        if (!username) {
            throw new Error(`username not found.`);
        }
        const collabs=await getCollaborators(token,username?.githubusername,project.repoLink)
        console.log(collabs)
        const numberofcollaborators=collabs?.length
        const x:viewcommit={
            token:token,
            name:username.githubusername,
            repo:project.repoLink
        }
        const commits= await listCommits(x)
        const techstack=await client.techstackproject.findFirst({
            where:{
                projectid:project.id
            }
        })
        console.log("commits",commits)
        return {
            nameofproject:project.projectName,
            description:project.projectDesc,
            progress:project.progess,
            created:project.createdAt,
            collaborators:collabs,
            number:numberofcollaborators,
            commits:commits,
            techstack:techstack?.tech
        }
    }catch(err){
        throw new Error("couldn't")
    }finally{
        await client.$disconnect();
    }
}
export async function updateProgress(id:number,progress:number) {
    try {
        await client.$connect();
        const response= await client.project.update({
            where:{
                id:id
            },
            data:{
                progess:progress
            }
        })

        return response
    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message); // Log the error message if it's an instance of Error
        } else {
            console.log("An unknown error occurred", error); // Handle any other cases
        }
        throw new Error("Couldn't update progress");
    }finally{
        await client.$disconnect();
    }
}
export async function invited(userid:number,projectid:number) {
    try {
        await client.$connect();
        return await client.invitedUser.create({
            data:{
                userId:userid,
                projectId:projectid
            }
        })

    } catch (error) {
        throw new Error("Couldn't update invited");
    }finally{await client.$disconnect();}
}
export async function fetchinvited(projectid:number) {
    try {
        await client.$connect();
        return await client.invitedUser.findMany({
            where:{
                projectId:projectid
            }
        })
    } catch (error) {
        throw new Error("Couldn't update invited");
    }finally{
        await client.$disconnect();
    }
}
export async function checkifalreadysent(userid:number,projectid:number) {
    try {
        await client.$connect();
        const check=await client.invitedUser.findFirst({
            where:{
                userId:userid,
                projectId:projectid
            }
        })
        if(!check){
            return false
        }
        return true
    } catch (error) {
        throw new Error("Couldn't update invited");
    }finally{
        await client.$disconnect();
    }
}
export async function accept(userid:number,projectid:number,inputs:collab) {
    try {
        await client.$connect();
        const name=await client.user.findFirst({
            where:{
                id:userid
            },
            select:{
                githubusername:true
            }
        })
        if(!name){
            throw new Error("no found")
        }
        inputs.username=name.githubusername
        const y=await inviteCollaborator(inputs)
        console.log(y)
        const project= await client.invitedUser.findFirst({
            where:{
                userId:userid,
                projectId:projectid
            }
        })
        const deletion = await client.invitedUser.delete({
            where:{
                id:project?.id
            }
        })
        return y
    } catch (error) {
        console.log(error)
        throw new Error("Couldn't update invited");
    }finally{
        await client.$disconnect();
    }
}
export async function fetchaccesstoken(userid:number){
    try {
        await client.$connect()
        const encrypted= await client.user.findFirst({
                    where:{
                        id:userid
                    },
                    select:{
                        access_token:true
                    }
                });
        if(!encrypted){
            return null
        }
        console.log(encrypted.access_token)
        const hii=decrypt(encrypted.access_token)
        console.log("it is",hii)
        return hii
    } catch (error) {
        console.log(error)
        throw new Error("Couldn't update invited");
    }finally{
        await client.$disconnect();
    }
}
export async function fetchuser(userid:number) {
    try {
        await client.$connect()
        return await client.user.findFirst({
                    where:{
                        id:userid
                    }
                });
    } catch (error) {
        throw new Error("Couldn't update invited");
    }finally{
        await client.$disconnect();
    }
}
export async function fetchproject(projectid:number) {
    try {
        await client.$connect()
        return await client.project.findFirst({
                    where:{
                        id:projectid
                    }
                });
    } catch (error) {
        throw new Error("Couldn't update invited");
    }finally{
        await client.$disconnect();
    }
}
export async function fetchown(userid:number) {
    try {
        await client.$connect()
        return await client.project.findMany({
                    where:{
                        userid:userid
                    }
                });
    } catch (error) {
        throw new Error("Couldn't get projects");
    }finally{
        await client.$disconnect();
    }
}