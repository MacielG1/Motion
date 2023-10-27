"use client";

import EmojiPicker, { Theme } from "emoji-picker-react";
import { useTheme } from "next-themes";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

type Props = {
  onChange: (emoji: string) => void;
  children: React.ReactNode;
  asChild?: boolean;
};
export default function IconPicker({ onChange, children, asChild = false }: Props) {
  const { resolvedTheme } = useTheme();
  const currentTheme = (resolvedTheme || "light") as "light" | "dark";

  const themeMap = {
    light: Theme.LIGHT,
    dark: Theme.DARK,
  };

  const theme = themeMap[currentTheme];

  return (
    <Popover>
      <PopoverTrigger asChild={asChild}>{children}</PopoverTrigger>
      <PopoverContent className="w-full border-none p-0 shadow-none">
        <EmojiPicker height={325} theme={theme} onEmojiClick={(data) => onChange(data.emoji)} />
      </PopoverContent>
    </Popover>
  );
}
