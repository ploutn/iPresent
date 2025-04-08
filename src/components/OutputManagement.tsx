// src/components/OutputManagement.tsx
import React from "react";
import { useOutputManagement } from "../hooks/useOutputManagement";

interface OutputManagementProps {
  className?: string;
}

export function OutputManagement({ className = "" }: OutputManagementProps) {
  const { displayDevices, activeDevice, setActiveDevice } =
    useOutputManagement();

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="p-6 border-b border-[#2D2D2D]">
        <h2 className="text-lg font-semibold">SCREEN CONTROL</h2>
      </div>
      <div className="flex-1 p-6">
        <div className="space-y-4">
          <h3 className="text-md font-medium">Available Displays</h3>
          {displayDevices.length === 0 ? (
            <p className="text-slate-400">No external displays detected</p>
          ) : (
            <div className="space-y-2">
              {displayDevices.map((device) => (
                <button
                  key={device.id}
                  onClick={() => setActiveDevice(device.id)}
                  className={`w-full p-3 rounded-md text-left ${
                    activeDevice === device.id ? "bg-blue-600" : "bg-[#2D2D2D]"
                  }`}
                >
                  {device.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
