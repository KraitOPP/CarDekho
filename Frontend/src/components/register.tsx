import React from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRegisterMutation } from "@/slices/authApiSlice";
import { toast } from "sonner";
import { useNavigate, Link } from "react-router-dom";

const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required."),
    email: z.string().email("Invalid Email Address."),
    phone: z.string().min(10, "Invalid mobile number."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string().min(8, "Confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data) {
    try {
      const res = await registerUser({
        name: data.name,
        email: data.email,
        mobileNumber: data.phone, 
        password: data.password,
      }).unwrap();
      console.log(res);
      toast.success("Registration Successful", {
        description: "Your account has been created.",
      });
      navigate("/accounts/sign-in");
    } catch (error) {
      toast.error("Registration Failed", {
        description: error?.data?.error || "An unexpected error occurred.",
      });
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Create an Account</h1>
                <p className="text-muted-foreground text-balance">
                  Sign up for your CarDekho account
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" type="text" placeholder="John Doe" {...register("name")} />
                {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" {...register("email")} />
                {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="phone">Mobile Number</Label>
                <Input id="phone" type="text" placeholder="Enter mobile number" {...register("phone")} />
                {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" {...register("password")} />
                {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input id="confirm-password" type="password" {...register("confirmPassword")} />
                {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>}
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Registering..." : "Register"}
              </Button>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link to="/accounts/sign-in" className="underline underline-offset-4">
                  Sign in
                </Link>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/signup.png"
              alt="Registration Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground text-center text-xs">
        By clicking continue, you agree to our{" "}
        <Link to="#" className="underline underline-offset-4 hover:text-primary">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link to="#" className="underline underline-offset-4 hover:text-primary">
          Privacy Policy
        </Link>.
      </div>
    </div>
  );
}
