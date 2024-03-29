import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { currentProfile } from "@/lib/current-profile";
import { ServerSidebar } from "@/components/server/server-sidebar";
import AIConversation from "@/components/ai/AIconversation";


const ServerIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) => {
  const profile = await currentProfile();

  if (!profile) {
    return redirectToSignIn();
  }

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id
        }
      }
    }
  });

  if (!server) {
    return redirect("/");
  }

  return ( 
    <div className="h-full flex flex-col ">
      <header className="items-center flex flex-row w-fit md:h-[150px]">
      <img src="/download.jpg" className=" " alt="Header"/>
      <img src="/download.jpg" className=" " alt="Header"/>
      <img src="/download.jpg" className=" " alt="Header"/>
      </header>
<div className="flex flex-row">


      <div 
      className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0">
       
        <ServerSidebar serverId={params.serverId} />
        
      </div>
      <main className="h-full w-screen md:pl-60 border-r-2 border-black/10">
     
        {children}
        <div className="">

<AIConversation />
</div>
      </main>
</div>
    
    
     
    
    </div>
   );
}
 
export default ServerIdLayout;