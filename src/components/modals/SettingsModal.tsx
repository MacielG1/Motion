"use client";

import { useSettings } from "@/hooks/useSettings";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";
import { Label } from "../ui/label";
import { ThemeToggler } from "../ThemeToggler";

export default function SettingsModal() {
  const settings = useSettings();
  return (
    <Dialog open={settings.isOpen} onOpenChange={settings.onClose}>
      <DialogContent>
        <DialogHeader className="border-b pb-3">
          <h2 className="text-lg font-medium">Settings</h2>
        </DialogHeader>
        <div className="flex items-center justify-between">
          <span className="flex flex-col gap-y-1">
            <Label>Appearance</Label>
            <span className="text-[0.8rem] text-muted-foreground">Customize the appearance of your workspace.</span>
          </span>
          <ThemeToggler />
        </div>
      </DialogContent>
    </Dialog>
  );
}
