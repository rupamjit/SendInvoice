import FindUser from "@/hooks/FindUser";
import { db } from "@/utils/db";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const formSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  address: z.string(),
});

export const POST = async (req: NextRequest, res: NextResponse) => {
  const requestData = await req.json();
  const userData = await FindUser();

  if (!userData) {
    return NextResponse.json({ error: "User not Found" }, { status: 400 });
  }

  const parsedData = formSchema.parse(requestData);

  const user = await db.user.update({
    where: {
      id: userData.user?.id,
    },
    data: {
      firstName: parsedData.firstName,
      lastName: parsedData.lastName,
      address: parsedData.address,
    },
  });
  return NextResponse.json({ user }, { status: 200 });
};
