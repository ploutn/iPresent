import React from "react";
import { Button } from "../ui/button";
import { ExternalLink } from "lucide-react";
import { ButtonAction } from "../../types/interactive";

interface InteractiveButtonProps {
  id: string;
  label: string;
  action: ButtonAction;
  variant?: "default" | "outline" | "ghost";
  isVisible: boolean;
}

export function InteractiveButton({
  id,
  label,
  action,
  variant = "default",
  isVisible,
}: InteractiveButtonProps) {
  if (!isVisible) return null;

  const handleClick = () => {
    switch (action.type) {
      case "link":
        window.open(action.url, "_blank");
        break;
      case "next":
        // Handle next slide navigation
        console.log("Navigate to next slide");
        break;
      case "previous":
        // Handle previous slide navigation
        console.log("Navigate to previous slide");
        break;
    }
  };

  return (
    <Button
      variant={variant}
      onClick={handleClick}
      className="flex items-center gap-2"
      data-interactive-id={id}
    >
      {label}
      {action.type === "link" && <ExternalLink className="h-4 w-4" />}
    </Button>
  );
}

export type { ButtonAction };
