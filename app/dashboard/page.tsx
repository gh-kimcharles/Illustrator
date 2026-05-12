import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db/prisma";
import { DashboardClient } from "@/components/ui/DashboardClient";

const DashboardPage = async () => {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login"); // check session (middleware handle this, but be defensive)

  // fetch user's project (no pixel data)
  const projects = await prisma.project.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      thumbnail: true,
      isShared: true,
      shareToken: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return (
    // update: DashboardClient to handle dashboard navigation and body
    <DashboardClient
      projects={projects}
      userEmail={session.user.email ?? ""}
      userName={session.user.name ?? ""}
    />
  );
};

export default DashboardPage;
