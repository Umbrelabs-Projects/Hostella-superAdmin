"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { InputField } from "./InputField";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import { images } from "@/lib/images";
import { useAuthStore } from "@/stores/useAuthStore";
import { signInSchema, type SignInFormData } from "../validations/signInSchema";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { signIn } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit: SubmitHandler<SignInFormData> = async (data) => {
    setIsLoading(true);
    toast.info("Logging in...");

    try {
      await signIn(data);
      toast.success("Login successful!");
      // Small delay to ensure cookie is set, then navigate
      setTimeout(() => {
        router.push(ROUTES.dashboard);
      }, 100);
    } catch (error) {
      // Show specific error message if available, otherwise generic message
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Login failed. Please check your credentials.";
      
      // Check if it's a role-based access denial
      if (errorMessage.includes("Access denied") || errorMessage.includes("SUPER_ADMIN")) {
        toast.error("Access denied. Only SUPER_ADMIN users can access this application.");
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
      
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full md:w-1/2 p-8 lg:p-16 mb-14 flex flex-col justify-center items-center">
      <div className="max-w-sm w-full space-y-8">
        <div className="flex flex-col items-center space-y-3">
          <div className="bg-black px-3 pb-2">
            <Image src={images.logo} alt="logo" />
          </div>
          <div className="text-center">
            {" "}
            <h1 className="text-2xl font-bold">Welcome Hostella</h1>
            <h1 className="text-2xl font-bold"> Super-Admin</h1>
          </div>
          <p className="text-sm">Manage Hostella from here</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <InputField
            label="Email"
            name="email"
            type="email"
            placeholder="superAdmin@hostella.com"
            icon={Mail}
            register={register}
            errors={errors}
          />

          <InputField
            label="Password"
            name="password"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            register={register}
            errors={errors}
            isPassword
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full py-5 rounded-lg font-semibold cursor-pointer bg-yellow-400 hover:bg-yellow-500 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Logging in...
              </>
            ) : (
              "Log in"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
