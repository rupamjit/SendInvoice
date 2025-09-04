"use client";
import React from "react";
import { useFormStatus } from "react-dom";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

interface ButtonTypes {
  text: string;
  variant?:
    | "secondary"
    | "outline"
    | "ghost"
    | "link"
    | "default"
    | "destructive"
    | null
    | undefined;
}

const SubmitButton = ({ text, variant }: ButtonTypes) => {
  const { pending } = useFormStatus();

  return (
    <>
      {pending ? (
        <Button
          disabled={pending}
          className="w-full cursor-pointer"
          variant={variant}
        >
          <Loader2 className="size-4 mr-2 animate-spin " />
          Please Wait
        </Button>
      ) : (
        <Button
          type="submit"
          className="w-full cursor-pointer"
          variant={variant}
        >
          {text}
        </Button>
      )}
    </>
  );
};

export default SubmitButton;
