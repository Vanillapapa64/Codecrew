"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { MultiSelect, type Option } from "@/components/ui/multiselect"
import axios from "axios"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

const techstack: Option[] = [
    { label: "React", value: "react" },
    { label: "Node.js", value: "Nodejs" },
    { label: "Flask", value: "flask" },
    { label: "Java", value: "java" },
    { label: "Django", value: "django" },
    { label: "JavaScript", value: "javascript" },
    { label: "TypeScript", value: "typescript" },
    { label: "Nextjs", value: "Nextjs" },
    { label: "Dev Ops", value: "Devops" },
    { label: "DBMS", value: "dbms" },
]

const existingProjectSchema = z.object({
    projectName: z.string().min(1, "Project name is required"),
    projectDesc: z.string().min(1, "Project description is required"),
    repoName: z.string().min(1, "Repository name is required"),
    techstack: z.array(z.string()).min(1, "Select at least one technology"),
    progress: z.number().min(0).max(100, "Progress must be between 0 and 100"),
    need:z.string().min(1,"required")
})

type FormData = z.infer<typeof existingProjectSchema>;

export default function ExistingProjectForm() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL
    const { data: session, status } = useSession()
    const router = useRouter()

    const form = useForm<FormData>({
        resolver: zodResolver(existingProjectSchema),
        defaultValues: {
            projectName: "",
            projectDesc: "",
            repoName: "",
            techstack: [],
            progress: 0,
            need:""
        },
    })

    // Debug: Watch form values
    // const formValues = form.watch();
    // console.log("Current form values:", formValues);

    async function onSubmit(data: FormData) {
        try {
            console.log("Submitting data:", data);
            if(session?.user.id==undefined){
                return
            }
            const formattedData = {
                userid: parseInt(session?.user.id),
                projectName: data.projectName,
                projectDesc: data.projectDesc,
                repoLink: data.repoName,
                techstack: data.techstack,
                need:data.need
            };

            console.log("Formatted data:", formattedData);

            const res=await axios.post(
                `${baseUrl}/api/projects`,
                
                    {formattedData}
                ,
                {
                    headers: {
                        userId:session?.user.id,
                        choice: "2",
                        progress:data.progress 
                    },
                }
            );
            console.log(res)
            toast({
                title: "Success",
                description: "Project added successfully",
            });
            
            form.reset()
        } catch (error) {
            console.error("Submission error:", error);
            toast({
                title: "Error",
                description: "Failed to add project",
                variant: "destructive",
            });
        }
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Add Existing Project</CardTitle>
                <CardDescription>Enter the details of your existing project</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="projectName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Project Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter project name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="projectDesc"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Project Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Describe your project" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="repoName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Repository Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter repository name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="need"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>What Role do you require?</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter role" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="techstack"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Tech Stack</FormLabel>
                                    <FormControl>
                                        <MultiSelect
                                            options={techstack}
                                            selected={techstack.filter(option => 
                                                field.value.includes(option.value)
                                            )}
                                            onChange={(selectedOptions) => {
                                                const values = selectedOptions.map(option => option.value);
                                                console.log("Selected tech stack values:", values);
                                                field.onChange(values);
                                            }}
                                            placeholder="Select your tech stack..."
                                        />
                                    </FormControl>
                                    <FormDescription>Select the technologies used in this project</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="progress"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Project Progress (%)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min={0}
                                            max={100}
                                            placeholder="Enter progress percentage"
                                            {...field}
                                            onChange={(e) => field.onChange(Number(e.target.value))}
                                            value={field.value}
                                        />
                                    </FormControl>
                                    <FormDescription>Enter a number between 0 and 100</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit">Add Project</Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}