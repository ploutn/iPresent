import React, { useState, useEffect, useRef } from "react";
import { Timer, Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";
import { cn } from "../../lib/utils";

interface CountdownTimerProps {
  initialMinutes?: number;
  initialSeconds?: number;
  onComplete?: () => void;
  className?: string;
  size?: "sm" | "md" | "lg";
  showControls?: boolean;
  autoStart?: boolean;
}

export function CountdownTimer({
  initialMinutes = 5,
  initialSeconds = 0,
  onComplete,
  className,
  size = "md",
  showControls = true,
  autoStart = false,
}: CountdownTimerProps) {
  const [totalSeconds, setTotalSeconds] = useState(
    initialMinutes * 60 + initialSeconds
  );
  const [isRunning, setIsRunning] = useState(autoStart);
  const [isEditing, setIsEditing] = useState(false);
  const [editMinutes, setEditMinutes] = useState(initialMinutes);
  const [editSeconds, setEditSeconds] = useState(initialSeconds);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isRunning && totalSeconds > 0) {
      intervalRef.current = setInterval(() => {
        setTotalSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current as NodeJS.Timeout);
            setIsRunning(false);
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (!isRunning && intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, totalSeconds, onComplete]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTotalSeconds(initialMinutes * 60 + initialSeconds);
  };

  const startEditing = () => {
    setIsRunning(false);
    setIsEditing(true);
    setEditMinutes(Math.floor(totalSeconds / 60));
    setEditSeconds(totalSeconds % 60);
  };

  const saveEditing = () => {
    setIsEditing(false);
    setTotalSeconds(editMinutes * 60 + editSeconds);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const sizeClasses = {
    sm: "text-xl",
    md: "text-3xl",
    lg: "text-5xl",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center p-4 rounded-lg bg-slate-800/50",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <Timer className="h-5 w-5 text-blue-400" />
        <h3 className="font-medium text-white">Countdown Timer</h3>
      </div>

      {isEditing ? (
        <div className="flex items-center gap-2 my-4">
          <input
            type="number"
            min="0"
            max="59"
            value={editMinutes}
            onChange={(e) => setEditMinutes(parseInt(e.target.value) || 0)}
            className="w-16 bg-slate-700 border border-slate-600 rounded p-2 text-center text-white"
          />
          <span className="text-white text-xl">:</span>
          <input
            type="number"
            min="0"
            max="59"
            value={editSeconds}
            onChange={(e) => setEditSeconds(parseInt(e.target.value) || 0)}
            className="w-16 bg-slate-700 border border-slate-600 rounded p-2 text-center text-white"
          />
          <Button onClick={saveEditing} size="sm" className="ml-2">
            Set
          </Button>
        </div>
      ) : (
        <div
          className={cn(
            "font-mono font-bold my-4 cursor-pointer",
            sizeClasses[size]
          )}
          onClick={startEditing}
        >
          {formatTime(totalSeconds)}
        </div>
      )}

      {showControls && (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTimer}
            className="h-9 w-9 rounded-full bg-slate-700 border-slate-600 hover:bg-slate-600"
          >
            {isRunning ? (
              <Pause className="h-4 w-4 text-white" />
            ) : (
              <Play className="h-4 w-4 text-white" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={resetTimer}
            className="h-9 w-9 rounded-full bg-slate-700 border-slate-600 hover:bg-slate-600"
          >
            <RotateCcw className="h-4 w-4 text-white" />
          </Button>
        </div>
      )}

      {showControls && (
        <div className="w-full mt-4">
          <Slider
            value={[totalSeconds]}
            min={0}
            max={initialMinutes * 60 + initialSeconds}
            step={1}
            onValueChange={(value) => {
              if (!isRunning) {
                setTotalSeconds(value[0]);
              }
            }}
            className="cursor-pointer"
          />
        </div>
      )}
    </div>
  );
}
