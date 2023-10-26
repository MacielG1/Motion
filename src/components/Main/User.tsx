"use client";

import { SignOutButton, useUser } from "@clerk/clerk-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Avatar, AvatarImage } from "../ui/avatar";
import { ChevronsUpDown } from "lucide-react";

export default function UserItem() {
  const { user } = useUser();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div role="button" className="flex w-full items-center p-3 text-sm hover:bg-primary/5">
          <div className="flex max-w-[10rem] items-center gap-x-2">
            <Avatar className="h-5 w-5">
              <AvatarImage src={user?.imageUrl} />
            </Avatar>
            <span className="line-clamp-1 text-start font-medium">{user?.fullName}&apos;s Motion</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 text-muted-foreground" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="start" alignOffset={10} forceMount>
        <div className="flex flex-col space-y-4 p-2">
          <p className="text-xs font-medium text-muted-foreground">{user?.emailAddresses?.[0]?.emailAddress}</p>
          <div className="flex items-center gap-2">
            <span className="rounded-md p-1">
              <Avatar className="h-7 w-7">
                <AvatarImage src={user?.imageUrl} />
              </Avatar>
            </span>
            <div className="space-y-1">
              <p className="line-clamp-1 text-sm">{user?.fullName}&apos;s Motion</p>
            </div>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild className="ml-auto cursor-pointer text-muted-foreground">
          <SignOutButton>Logout</SignOutButton>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
