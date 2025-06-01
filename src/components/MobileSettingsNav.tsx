import React from "react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Menu } from "lucide-react";
import { ResponsiveButton } from "./ResponsiveCard";

interface SettingsOption {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface MobileSettingsNavProps {
  settingsOptions: SettingsOption[];
  activeSetting: string;
  onSettingChange: (settingId: string) => void;
}

export function MobileSettingsNav({
  settingsOptions,
  activeSetting,
  onSettingChange,
}: MobileSettingsNavProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSettingSelect = (settingId: string) => {
    onSettingChange(settingId);
    setIsOpen(false);
  };

  const activeOption = settingsOptions.find(
    (option) => option.id === activeSetting
  );

  return (
    <div className="mobile-only bg-[#1E293B] border-b border-[#2D2D2D] p-4">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <ResponsiveButton
            variant="outline"
            className="w-full justify-between touch-target bg-[#2D3748] border-[#4A5568] text-white hover:bg-[#4A5568]"
          >
            <div className="flex items-center gap-2">
              {activeOption?.icon}
              <span>{activeOption?.label || "Settings"}</span>
            </div>
            <Menu className="h-4 w-4" />
          </ResponsiveButton>
        </SheetTrigger>
        <SheetContent
          side="bottom"
          className="bg-[#1E293B] border-[#2D2D2D] text-white max-h-[70vh]"
        >
          <div className="space-y-2 mt-4">
            <h3 className="text-lg font-semibold mb-4">Settings</h3>
            <div className="grid grid-cols-2 gap-2">
              {settingsOptions.map((option) => (
                <ResponsiveButton
                  key={option.id}
                  variant="ghost"
                  className={`touch-target-lg justify-start rounded-lg text-sm font-medium flex flex-col items-center gap-2 p-4 ${
                    activeSetting === option.id
                      ? "bg-[#3182CE] text-white"
                      : "text-gray-300 hover:bg-[#2D3748] hover:text-white"
                  }`}
                  onClick={() => handleSettingSelect(option.id)}
                >
                  <div className="text-lg">{option.icon}</div>
                  <span className="text-xs text-center">{option.label}</span>
                </ResponsiveButton>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
