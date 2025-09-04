import { auth } from "@/utils/auth";
import { redirect } from "next/navigation";

const FindUser = async () => {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (!session.user?.email) {
    console.log("Session exists but no user data, redirecting to login");
    redirect("/login");
  }

  return session;
};

export default FindUser;
