import React from "react";
import { BibleSearch } from "../BibleSearch";
import { ScrollArea } from "../ui/scroll-area";

export function BiblePage() {
  return (
    <ScrollArea className="flex-1 min-h-0">
      <BibleSearch />
    </ScrollArea>
  );
}
