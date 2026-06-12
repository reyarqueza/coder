"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type WelcomeCardProps = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
};

export function WelcomeCard({ name, email, image }: WelcomeCardProps) {
  const initials = (name ?? email ?? "?")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
        <CardDescription>You are signed in to coder.</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center gap-4">
        <Avatar className="size-12">
          <AvatarImage src={image ?? undefined} alt={name ?? "User"} />
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{name ?? "Signed-in user"}</p>
          {email ? (
            <p className="text-sm text-muted-foreground">{email}</p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
