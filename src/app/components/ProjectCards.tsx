"use client"

import { useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"

interface ProjectCardProps {
  projectId: number
  projectName: string
  invitedUsers: { id: number; name: string }[]
  baseUrl: string
}

export default function ProjectCard({ projectId, projectName, invitedUsers, baseUrl }: ProjectCardProps) {
  const [loading, setLoading] = useState<number | null>(null)
  const { toast } = useToast()

  const handleInvite = async (userId: number) => {
    setLoading(userId)
    console.log(`user ${userId}`)
    console.log(`project ${projectId}`)
    console.log(baseUrl)
    try {
      await axios.post(`${baseUrl}/api/invited`,{userId,projectId}, {
        headers: {
          userId: userId,
          projectId: projectId,
        },
      })
      toast({
        title: "Invitation sent",
        description: "The user has been invited to the project.",
      })
      
    } catch (error) {
      console.error("Error inviting user:", error)
      toast({
        title: "Error",
        description: "Failed to invite user. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(null)
      window.location.reload()
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{projectName}</CardTitle>
      </CardHeader>
      <CardContent>
        <h3 className="text-lg font-semibold mb-2">Invited Collaborators</h3>
        {invitedUsers.length > 0 ? (
          <ul className="space-y-2">
            {invitedUsers.map((user) => (
              <li key={user.id} className="flex items-center justify-between">
                <span>{user.name}</span>
                <Button onClick={() => handleInvite(user.id)} disabled={loading === user.id} size="sm">
                  {loading === user.id ? "Inviting..." : "Invite"}
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">No collaborators invited yet.</p>
        )}
      </CardContent>
    </Card>
  )
}

