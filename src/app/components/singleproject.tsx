"use client"

import axios from "axios"
import { useSession } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { convertToIST } from "./Projectcard"

type Commit = {
    sha: string;
    commit: {
        message: string;
        committer: {
            name: string;
        };
    };
    html_url: string;
};
type ProjectDetails = {
    nameofproject: string;
    description: string;
    progress: number;
    created: string;
    collaborators: string[];
    number: number;
    commits: Commit[];
    techstack:string
};
type Project = {
    details: ProjectDetails;
};
export default function Singleproject(){
    const param=useSearchParams()
    const projectid=param.get('id')
    const baseurl= process.env.NEXT_PUBLIC_BASE_URL
    const { data: session, status } = useSession();
    const router=useRouter()
    const [already,setalready]=useState(false)
    const [loading, setLoading] = useState(true);
    const [project, setProject] = useState<Project>({
        details: {
          nameofproject: '',
          description: '',
          progress: 0,
          created: '',
          collaborators: [],
          number: 0,
          commits: [],
          techstack:""
        },
      });
    useEffect(()=>{
        if(status==="loading"){return }
        if(!session?.user.id||!baseurl){router.push('/signin')}
        const id=session?.user.id
        if(id==undefined||projectid===null){router.push('/signin'); return}
        const newprojectid=parseInt(projectid)
        const newid=parseInt(id)
        const fetchdetails=async()=>{
            try {
                const response=await axios.get(`${baseurl}/api/projectdetails`,{
                    headers:{
                        userId:newid,
                        projectId:newprojectid
                    }
                })
                setProject(response.data)
                console.log(response.data)
            } catch (error) {
                console.log("erro",error)
                console.error(error)
            }finally {
                setLoading(false);
            }
        }
        const fetchsent=async()=>{
            try {
                const response=await axios.get(`${baseurl}/api/alreadysent`,{
                    headers:{
                        userId:newid,
                        projectId:newprojectid
                    }
                })
                setalready(response.data.res)
            } catch (error) {
                console.error(error)
            }
        }
        fetchsent()
        fetchdetails()
    },[session,status,router])
    const clickhandle = async() => {
        const newProjectId = parseInt(projectid||'');
        const id = parseInt(session?.user.id || '');
        const res= await axios.post(`${baseurl}/api/invite`,{}, {
            headers: {
                userId: id,
                projectId: newProjectId,
            },
        });
        window.location.reload()
    };
    const newdate= convertToIST(project.details.created)
    console.log(project)
    return(
        <div className="w-screen flex justify-center h-screen">
            {loading?(
                <div className="flex  justify-center items-center -translate-y-12">
                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
                <div className="text-white pl-4">Wait while we fetch the latest data...</div>
            </div>
            ):(
                <div className="text-white w-4/5 pt-10 grid grid-cols-2 flex gap-6">
            <div className="grid gap-6 col-span-2 lg:col-span-1">
                <div className="text-7xl font-black">{project.details.nameofproject}</div>
                <div className="text-xl flex"><div className="font-semibold">Created At:</div>{newdate}</div>
                <div className="text-xl"><div className="font-semibold">Description:</div>{project.details.description}</div>
                <div className="text-xl font-bold">Progress: {project.details.progress}%</div>
                <div className="text-lg"><div className="text-xl font-bold">Techstack:</div>{project.details.techstack}</div>
            </div>
            <div className="text-start grid col-span-2 lg:col-span-1 content-between">
                <div>
                <div className="text-4xl font-extrabold">Collaborators</div>
                <ul>{project.details.collaborators.map((name,index)=>(
                    <li className="p-2 text-lg" key={index}><div>{name}</div></li>
                ))}</ul>
                </div>
                <div >
                {already ? (
                    <button
                    disabled
                    className="bg-gray-600 h-16 w-72 no-underline group cursor-not-allowed relative shadow-2xl shadow-zinc-900 rounded-full p-px text-lg font-semibold leading-6 text-white inline-block text-center"
                    >
                    <div className="h-16 w-72 relative flex space-x-2  items-center z-10 rounded-full bg-gray-700 py-0.5 px-6 ring-1 ring-white/10 ">
                        <span>Request Already Sent</span>
                    </div>
                    </button>
                ) : (
                    <button onClick={clickhandle} className="bg-slate-800 h-16 w-72 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-lg font-semibold leading-6  text-white inline-block">
                    <span className="absolute h-16 w-72 inset-0 overflow-hidden rounded-full">
                        <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    </span>
                    <div className="h-16 w-72 relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-0.5 px-6 ring-1 ring-white/10 ">
                        <span>
                        Request to collaborate!
                        </span>
                        <svg
                        fill="none"
                        height="28"
                        viewBox="0 0 24 24"
                        width="28"
                        xmlns="http://www.w3.org/2000/svg"
                        >
                        <path
                            d="M10.75 8.75L14.25 12L10.75 15.25"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                        />
                        </svg>
                    </div>
                    <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
                    </button>)}
                </div>
            </div>
            <div className="col-span-2 w-full h-1 bg-white"></div>
            <div className="col-span-2 text-center text-lg">
                <div className="text-4xl font-extrabold">Commits:</div>
                <ul >{project.details.commits.map((commit, index) => (
                        <li className="p-4" key={index}>
                            <div><strong>Committer:</strong> {commit.commit?.committer.name}</div>
                            <div><strong>Message:</strong> {commit.commit?.message}</div>
                        </li>
                    ))}</ul>
            </div>
        </div>
            )}
            
        </div>
    )
}