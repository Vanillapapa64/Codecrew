"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { MultiSelect, type Option } from "@/components/ui/multiselect"
import axios from "axios"

const formSchema = z.object({
  name: z.string().min(5, {
    message: "Username must be at least 5 characters.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
  university: z.string().min(1, { message: "Please select a university." }),
  course: z.string().min(1, { message: "Please select a course." }),
  techstack: z.array(z.string()).min(1, { message: "Please select at least one tech stack." }),
})

const universities = [
  { label: "Guru Nanak Dev University", value: "GNDU" },
  { label: "Khalsa college", value: "Khalsa" },
  { label: "IIT", value: "iit" },
  { label: "NIT", value: "nit" },
  { label: "Other University/Colleges", value: "other" },
]

const courses = [
  { label: "Computer Science", value: "cse" },
  { label: "Electrical Communication Engineering", value: "ece" },
  { label: "Electrical Computer Engineering", value: "ecm" },
  {label:"Computer Applications",value:"mca"}
]

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
  { label: "DBMS", value: "dbms" }
]

export function ProfileForm() {
  const searchParams = useSearchParams()
  const code = searchParams?.get("code") || ""
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      password: "",
      university: "",
      course: "",
      techstack: [],
    },
  })
  const baseurl=process.env.NEXT_PUBLIC_BASE_URL
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('hi')
    if(baseurl===undefined){
      return
    }
    try {
      const response = await axios.post(
        `${baseurl}/api/user`,
        values, // Axios automatically sets Content-Type to application/json for objects
        {
          headers: {
            "Content-Type": "application/json",
            code: code,
          },
        }
      );
      if (!response) {
        const errorData = await response
        console.error("Signup failed:", errorData)
        alert("Signup failed: " + errorData)
        return
      }

      const data = await response.data
      console.log("Signup successful:", data)
      router.push("/api/auth/signin")
    } catch (error) {
      console.error("Error during signup:", error)
      alert("An error occurred. Please try again.")
    }
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 bg-transparent">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Eg: Navkirat Singh" {...field} />
              </FormControl>
              <FormDescription>This is your public display name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter your password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="university"
          render={({ field }) => (
            <FormItem>
              <FormLabel>University</FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="block bg-transparent  w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                >
                  <option className="text-black" value="">Select a university</option>
                  {universities.map((uni) => (
                    <option className="text-black" key={uni.value} value={uni.value}>
                      {uni.label}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="course"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Course</FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="block bg-transparent  dark:text-white w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
                >
                  <option className="text-black" value="">Select a course</option>
                  {courses.map((course) => (
                    <option className="text-black" key={course.value} value={course.value}>
                      {course.label}
                    </option>
                  ))}
                </select>
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
                selected={techstack.filter((option) => field.value.includes(option.value))}
                onChange={(selectedValues) =>
                  field.onChange(selectedValues.map((option) => option.value))
                }
                placeholder="Select your tech stack..."
              />
            </FormControl>
            <FormDescription>Select the technologies you're familiar with.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}

