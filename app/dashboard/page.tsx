import FindUser from "@/hooks/FindUser";
import { signOut } from "@/utils/auth";
import React from "react";

const page = async () => {
  await FindUser();

  return (
    <div>
      Hello From Dashboard
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button type="submit">Sign Out</button>
      </form>
    </div>
  );
};

export default page;
