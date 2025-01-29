import { NextURL } from "next/dist/server/web/next-url";
import Display from "../components/showquery";
import { useSearchParams } from "next/navigation";
import { ProfileForm } from "../components/signup";


export default function(){
    
    return(
        <div>
            you are authorized
            <ProfileForm />
        </div>
    )
}