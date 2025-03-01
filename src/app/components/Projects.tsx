'use client'

import axios from "axios"
import { useSession } from "next-auth/react"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { string } from "zod"
import Projectcard, { card } from "./Projectcard"


export default function Projects() {
    const baseurl= process.env.NEXT_PUBLIC_BASE_URL
    console.log(baseurl)
    const { data: session, status } = useSession();
    console.log(session)
    const router=useRouter()
    const [projects,setprojects]=useState([])
    const [loading, setLoading] = useState(true);
    useEffect(()=>{
        if(status==="loading"){return }
        if(!session?.user.id||!baseurl){router.push('/signin')}
        const id=session?.user.id
        if(id==undefined){router.push('/signin'); return}
        const newid=parseInt(id)
        const fetchprojects=async()=>{
            try {
                const response= await axios.get(`${baseurl}/api/projects`,{
                    headers:{
                        userId:newid
                    }
                })
                console.log(response)
                if (Array.isArray(response.data.projets)) {
                    setprojects(response.data.projets); // Use 'projets'
                } else {
                    console.error(
                        "API did not return an array under 'projets'",
                        response.data
                    );
                    setprojects([]);
                }
            } catch (error) {
                console.error(error)
            }finally{
                setLoading(false);
            }
        }
        fetchprojects()
    },[session,status,router])
    return(
        <div>
            {loading?(
                <div className="flex  justify-center items-center ">
                <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500"></div>
                <div className="text-white pl-4">Wait while we fetch the latest data...</div>
            </div>
            ):(
                <div className="flex flex-col items-center">
                {Array.isArray(projects) && projects.length > 0 ? (
                    projects.map((project: card, index: number) => (
                        <Projectcard key={project.id} id={project.id} projectDesc={project.projectDesc} projectName={project.projectName} createdAt={project.createdAt} progess={project.progess} repoLink={project.repoLink} need={project.need}/>
                    ))
                ) : (
                    <p>No projects found.</p>
                )}
                </div>
            )}
        </div>
    )
}