// src/components/stageDisplayElements/CountdownTimerDisplay.tsx
import React, { useState, useEffect } from "react";
import { StageDisplayElement } from "../../types/stageDisplay";

interface CountdownTimerDisplayProps {
  element: StageDisplayElement;
}

const CountdownTimerDisplay: React.FC<CountdownTimerDisplayProps> = ({
  element,
}) => {
  const {
    durationSeconds = 60,
    timerTitle = "Countdown",
    timerEndMessage = "Time's up!",
  } = element;
  const [remainingTime, setRemainingTime] = useState(durationSeconds);

  useEffect(() => {
    if (remainingTime <= 0) return;

    const intervalId = setInterval(() => {
      setRemainingTime((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [remainingTime]);

  useEffect(() => {
    // Reset timer if duration changes
    setRemainingTime(durationSeconds);
  }, [durationSeconds]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    if (durationSeconds >= 3600) {
      return `${h}:${m}:${s}`;
    }
    return `${m}:${s}`;
  };

  const styles: React.CSSProperties = {
    position: "absolute",
    left: `${element.x}%`,
    top: `${element.y}%`,
    width: `${element.width}%`,
    height: `${element.height}%`,
    backgroundColor: element.backgroundColor || "transparent",
    color: element.fontColor || "white",
    fontSize: element.fontSize ? `${element.fontSize}px` : "inherit",
    borderRadius: element.borderRadius ? `${element.borderRadius}px` : "0px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "10px",
    boxSizing: "border-box",
    textAlign: "center",
    overflow: "hidden",
    zIndex: element.zIndex,
    visibility: element.isVisible === false ? "hidden" : "visible",
  };

  return (
    <div style={styles} data-testid={`countdown-timer-${element.id}`}>
      {timerTitle && (
        <div style={{ fontSize: "0.8em", marginBottom: "5px" }}>
          {timerTitle}
        </div>
      )}
      {remainingTime > 0 ? (
        <div style={{ fontSize: "1.5em", fontWeight: "bold" }}>
          {formatTime(remainingTime)}
        </div>
      ) : (
        <div style={{ fontSize: "1.2em" }}>{timerEndMessage}</div>
      )}
    </div>
  );
};

export default CountdownTimerDisplay;
