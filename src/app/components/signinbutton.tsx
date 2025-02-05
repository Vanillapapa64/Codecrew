"use client"
import { useRouter } from "next/navigation"

export default function signinbutton(){
    const router= useRouter()
    return(
        <div>
        <button onClick={()=>{router.push('/signin')}} className="rounded-full bg-pink-600 w-28 h-10 font-bold text-white lg:w-32 lg:h-12">Sign in</button>
        </div>
    )
}