"use client";
import { headers } from "next/headers";
import { useSearchParams } from "next/navigation";
export default function Display(){
    const searchParams = useSearchParams();
    const queryParam = searchParams?.get("code");
    
    return(
        <div className="flex justify-center items-center">
            <div className="text-center">
                <p className="text-lg font-bold">Query Parameter Value:</p>
                <p className="text-gray-600">{queryParam ? queryParam : "No query parameter found"}</p>
            </div>
        </div>
    )
}