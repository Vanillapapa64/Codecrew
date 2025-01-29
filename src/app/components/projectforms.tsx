"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import ExistingProjectForm from "./existingprojectform"
import NewProjectForm from "./newproject"

export default function ProjectForms() {
  const [activeForm, setActiveForm] = useState<"new" | "existing" >("new")

  return (
    <div className="space-y-4">
      <div className="flex space-x-4 justify-center">
        <Button onClick={() => setActiveForm("new")} variant={activeForm === "new" ? "default" : "outline"}>
          Create New Project
        </Button>
        <Button onClick={() => setActiveForm("existing")} variant={activeForm === "existing" ? "default" : "outline"}>
          Add Existing Project
        </Button>
      </div>

      {activeForm === "new" && <NewProjectForm />}
      {activeForm === "existing" && <ExistingProjectForm />}
    </div>
  )
}

