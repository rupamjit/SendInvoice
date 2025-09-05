"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  firstName: z.string().nonempty("FirstName is required"),
  lastName: z.string().nonempty("LastName is required"),
  address: z.string().nonempty("Address is required"),
});

type FormData = z.infer<typeof formSchema>;

const Page = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    const sendData = await axios.post("/api/onboarding", data);
    if (sendData.status == 200) {
      toast("Onbording Successful",{duration:5000});
      redirect("/dashboard");
    }
    toast("Something Wrong! Please Try Again");
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center">
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]"></div>
      </div>
      <Card className="max-w-sm mx-auto">
        <CardHeader>
          <CardTitle className="text-xl">You are almost finished!</CardTitle>
          <CardDescription>Enter your details to get started.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-4"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>First Name</Label>
                <Input
                  required
                  {...register("firstName", { required: true })}
                  type="text"
                  placeholder="John"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-sm">
                    {errors.firstName.message}
                  </p>
                )}
              </div>
              <div className="grid gap-2">
                <Label>Last Name</Label>
                <Input
                  type="text"
                  {...register("lastName", { required: true })}
                  placeholder="Doe"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-sm">
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Address</Label>
              <Input
                required
                type="text"
                {...register("address", { required: true })}
                placeholder="SanFransisco, USA"
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address.message}</p>
              )}
            </div>
            {isSubmitting ? (
              <Button>
                <Loader2 className="w-6 cursor-pointer animate-spin" />
                Please Wait
              </Button>
            ) : (
              <Button className="cursor-pointer">Finish Onboarding</Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
