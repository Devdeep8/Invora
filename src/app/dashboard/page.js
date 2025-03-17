import { Button } from "@/components/ui/button";
import { requireUser } from "../utils/requireUser";
import { signOut } from "../utils/auth";


export default async function Dashboard() {

    const session = await requireUser()
    console.log(session)

  return (
    <div>
        {session?.user?.email}
            Dashboard Page
      <form action={ async () => {
         "use server"
         await signOut()
      }}>

      <Button >signOut</Button>
      </form>
    </div>
  );
}