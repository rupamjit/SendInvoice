
"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ErrorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: Record<string, { title: string; description: string }> = {
    Callback: {
      title: "Invalid Link",
      description: "The sign-in link has expired or is invalid.",
    },
    EmailSignInError: {
      title: "Email Error",
      description: "Failed to send verification email.",
    },
    SessionCallback: {
      title: "Session Error",
      description: "An error occurred with your session.",
    },
    Configuration: {
      title: "Configuration Error",
      description: "Server configuration issue. Try again later.",
    },
    Verification: {
      title: "Verification Failed",
      description: "The verification link is invalid or expired.",
    },
  };

  const errorInfo = errorMessages[error || ""] || {
    title: "Sign In Error",
    description: "An error occurred. Please try again.",
  };

  return (
    <>
      <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_50%_200px,#C9EBFF,transparent)]"></div>
      </div>

      <div className="h-screen flex items-center justify-center px-4">
        <Card className="md:w-[40%] lg:w-[25%] w-[80%]">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
            </div>
            <CardTitle className="text-2xl text-center">
              {errorInfo.title}
            </CardTitle>
            <CardDescription className="text-center pt-2">
              {errorInfo.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3">
            <Button
              onClick={() => router.push("/login")}
              className="w-full"
            >
              Back to Login
            </Button>

            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="w-full"
            >
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
