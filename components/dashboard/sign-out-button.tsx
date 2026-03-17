import { logoutAction } from "@/lib/actions/auth";

import { Button } from "@/components/ui/button";

export function SignOutButton() {
  return (
    <form action={logoutAction}>
      <Button className="w-full justify-center" variant="outline">
        Sign Out
      </Button>
    </form>
  );
}
