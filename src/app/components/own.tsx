"use client"
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import OwnSingle from "./ownsingle";

interface Project {
  projectName: string;
  id: number;
  projectDesc: string;
  createdAt: Date;
  progess: number;
  repoLink: string;
  userid: number;
}

export default function Own() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const baseurl = process.env.NEXT_PUBLIC_BASE_URL;
  const [ownProjects, setOwnProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session?.user.id || !baseurl) {
      router.push('/signin');
      return;
    }

    const user = parseInt(session.user.id);

    const fetchown = async () => {
      try {
        const res = await axios.get<{ message: Project[] }>(`${baseurl}/api/fetchown`, {
          headers: {
            userId: user.toString()
          }
        });
        setOwnProjects(res.data.message);
      } catch (error) {
        console.error(error);
      }
    };

    fetchown();
  }, [session, router, status, baseurl]);

  return (
    <div className="w-2/3">
      {ownProjects.length > 0 ? (
        <ul>
          {ownProjects.map((project) => (
            <li key={project.id}>
              <OwnSingle projectId={project.id} projectName={project.projectName} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-white">No projects found.</p>
      )}
    </div>
  );
}