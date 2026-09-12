import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="p-8">
      <h1 className="text-neutral-muted font-bold">
        Taskly Project Initialization
      </h1>
      <Button>
        <Link href="/logIn">نمتن</Link>
      </Button>
    </main>
  );
}
