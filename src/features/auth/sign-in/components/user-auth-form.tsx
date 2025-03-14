import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/password-input"
import { useNavigate } from '@tanstack/react-router'
import { useToast } from "@/hooks/use-toast"
import { Auth } from "@/services/api"
import { useAuthStore } from "@/stores/authStore"

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Please enter your email" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(1, { message: "Please enter your password" })
    .min(7, { message: "Password must be at least 7 characters long" }),
})

type FormData = z.infer<typeof formSchema>

export function UserAuthForm() {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const navigate = useNavigate()
  const { auth } = useAuthStore()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(data: FormData) {
    setIsLoading(true)
    
    try {
      const response = await Auth.staffLogin({
        email: data.email,
        password: data.password
      })

      // Create a complete user data object
      const userData = {
        id: response.user.id,
        name: response.user.name,
        email: response.user.email,
        roles: response.user.roles || [],
        status: response.user.status,
        created_at: response.user.created_at,
        updated_at: response.user.updated_at,
        deleted_at: response.user.deleted_at,
        // Include additional user data with fallbacks
        image: response.user.image || '',
        phone_number: response.user.phone_number || '',
        address: response.user.address || '',
        gender: response.user.gender || ''
      }

      // Manually update the auth store to ensure all fields are set
      auth.staff.setUser(userData)

      // Log the stored data for verification
      console.log("Login successful - User data stored:", userData)
      
      // Navigate to home page
      navigate({ to: '/' })
      
      toast({
        title: "Success",
        description: "Successfully logged in",
      })
    } catch (error: any) {
      console.error("Login error:", error)
      
      const errorMessage = error.response?.data?.message || error.message || "Failed to login"
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="name@example.com"
                  type="email"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
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
                <PasswordInput
                  placeholder="********"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "Login"}
        </Button>
      </form>
    </Form>
  )
}