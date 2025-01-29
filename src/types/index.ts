import {z} from 'zod'
export interface usercreate{
    id: number;
    name: string;
    password: string;
    university: string;
    course: string;
    techstack:string[]
}
export interface createprojectinterface{
    userid: number;
    projectName: string;
    projectDesc: string;
    repoLink: string;
    techstack:string[]
}
export interface updatetechstack{
    userid:number,
    techstack:string[]
}
export interface addusertoproject{
    userid:number,
    projectid:number
}