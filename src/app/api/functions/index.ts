import client from "../db"
import type {  createprojectinterface, usercreate } from "@/types";
import { collab, createRepo, createRepository, getCollaborators, getpersonalaccesstoken, inviteCollaborator, listCommits, viewcommit } from "./github";
import { NextResponse } from "next/server";
import axios from "axios";
export async function createuser(x:usercreate,code:string) {
    try{
        await client.$connect();
        const access_token= await getpersonalaccesstoken(code)
        const userResponse = await axios.get("https://api.github.com/user", {
            headers: {
                Authorization: `Bearer ${access_token}`,
            },
        });
        const username=userResponse.data.login
        const response=await client.user.create({
            data:{
                name:x.name,
                password:x.password,
                university:x.university,
                course:x.course,
                githubusername:username,
                access_token:access_token
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
        return {id:response.id,name:response.name}
    }catch(err){
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
    try {
        await client.$connect();
        const userExists = await client.user.findUnique({
            where: { id: x.userid },
        });

        if (!userExists) {
            throw new Error("User does not exist");
        }
        const y:createRepo={
            name:x.projectName,
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
        const collabs=await getCollaborators(token,username?.githubusername,project.projectName)
        const numberofcollaborators=collabs?.length
        const x:viewcommit={
            token:token,
            name:username.githubusername,
            repo:project.projectName
        }
        const commits= await listCommits(x)
        const techstack=await client.techstackproject.findFirst({
            where:{
                projectid:project.id
            }
        })
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
        return await client.user.findFirst({
                    where:{
                        id:userid
                    },
                    select:{
                        access_token:true
                    }
                });
    } catch (error) {
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