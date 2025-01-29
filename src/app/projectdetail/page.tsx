import { Suspense } from "react";
import Singleproject from "../components/singleproject";

export default function Project(){
    return(
        <div className="flex justify-center">
            <Suspense>
            <Singleproject />
            </Suspense>
        </div>
    )
}