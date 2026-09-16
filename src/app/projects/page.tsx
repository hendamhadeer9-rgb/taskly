import { Button } from "@/components/ui/Button";
import Link from "next/link";
import React from "react";

export default function page() {
  return (
    <div>
      <Button>
        <Link href="/projects/add">new</Link>
      </Button>
    </div>
  );
}
