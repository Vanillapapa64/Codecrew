"use client"
import { useEffect, useState } from "react"
import axios from "axios"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import ProjectCard from "./ProjectCards"

interface InvitedResponse {
  invited: Array<{
    id: number;
    userId: number;
    projectId: number;
  }>;
}

interface User {
  id: number;
  name: string;
  access_token: string;
  password: string;
  university: string;
  course: string;
  githubusername: string;
}

export default function OwnSingle({ projectId, projectName }: { projectId: number; projectName: string }) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
  const [invitedUsers, setInvitedUsers] = useState<User[]>([])
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return
    if (!session?.user.id || !baseUrl) {
      router.push("/signin")
      return
    }

    const fetchCollabIds = async () => {
      try {
        const response = await axios.get<InvitedResponse>(`${baseUrl}/api/invited`, {
          headers: {
            projectId: projectId.toString(),
          },
        })
        const userPromises = response.data.invited.map((invite) =>
          axios.get(`${baseUrl}/api/user`, {
            headers: {
              userId: invite.userId.toString()
            }
          }).then(response =>response.data.message)
        )

        const users = await Promise.all(userPromises)
        

        setInvitedUsers(users)

      } catch (error) {
        console.error("Error fetching collaborators:", error)
      }
    }

    fetchCollabIds()
  }, [baseUrl, projectId, router, session?.user.id, status])

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (!session?.user.id || !baseUrl) {
    return null
  }
  return (
    <div className="container w-full flex justify-center mx-auto p-4">
      <ProjectCard
        projectId={projectId}
        projectName={projectName}
        invitedUsers={invitedUsers.map((user) => ({ id: user.id, name: user.githubusername }))}
        baseUrl={baseUrl}
      />
    </div>
  )
}