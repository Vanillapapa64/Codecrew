"use client"
import { useRouter } from "next/navigation"

export default function signupbutton(){
    const router= useRouter()
    return(
        <div>
        <button onClick={()=>{router.push('/dashboard')}} className="rounded-full bg-green-700 w-28 h-10 font-bold text-white lg:w-40 lg:h-14">Get Started</button>
        </div>
    )
}