
import { date } from "zod";
import PercentageGauge from "./Gauge";
import { useRouter } from "next/navigation";

export interface card{
    id:number
    projectName: string;
    projectDesc: string;
    repoLink: string;
    createdAt: string;
    progess: number;
}
export default function Projectcard(inputs:card){
    const router= useRouter()
    const newdate=convertToIST(inputs.createdAt)
    return(<div onClick={()=>{
        router.push(`/projectdetail?id=${inputs.id}`)
    }} className="w-10/12 m-8 bg-amber-500 flex flex-col md:flex-row md:justify-between p-6 cursor-pointer rounded-xl ">
        <div>
            <div className="font-extrabold text-2xl lg:text-5xl py-2">{inputs.projectName}</div>
            <div className="font-semibold lg:text-xl pb-2">Description: {inputs.projectDesc.slice(0, 80) + "..."}</div>
            <div>{newdate}</div>
        </div>
        <div className="grid md:justify-items-end">
            <div className="font-semibold text-lg md:text-xl pb-4">Repository: {inputs.repoLink}</div>
            {/* <div className="flex"><div>Progress:</div><div>{inputs.progess}</div></div> */}
            <PercentageGauge
          percentage={inputs.progess}
          label="Progress"
          size={100}
          strokeWidth={10}
          backgroundColor="#f3f4f6"
          foregroundColor="#10b981"
        />
        </div>
    </div>)
}
export function convertToIST(utcDateString: string): string {
    const utcDate = new Date(utcDateString);

    // IST is UTC + 5:30
    const istOffset = 5.5 * 60 * 60 * 1000; // Offset in milliseconds
    const istDate = new Date(utcDate.getTime() + istOffset);

    // Format IST date as a readable string
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: "Asia/Kolkata",
        timeZoneName: "short",
    };

    return istDate.toLocaleString("en-IN", options);
}

