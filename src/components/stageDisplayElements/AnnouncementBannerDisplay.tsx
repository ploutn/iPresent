// src/components/stageDisplayElements/AnnouncementBannerDisplay.tsx
import React from "react";
import { StageDisplayElement } from "../../types/stageDisplay";
import "./AnnouncementBannerDisplay.css"; // We'll create this for animations

interface AnnouncementBannerDisplayProps {
  element: StageDisplayElement;
}

const AnnouncementBannerDisplay: React.FC<AnnouncementBannerDisplayProps> = ({
  element,
}) => {
  const {
    bannerText = "Announcement",
    scrollSpeed = "medium",
    bannerDirection = "left-to-right",
  } = element;

  const styles: React.CSSProperties = {
    position: "absolute",
    left: `${element.x}%`,
    top: `${element.y}%`,
    width: `${element.width}%`,
    height: `${element.height}%`,
    backgroundColor: element.backgroundColor || "rgba(0,0,0,0.7)",
    color: element.fontColor || "white",
    fontSize: element.fontSize ? `${element.fontSize}px` : "24px",
    borderRadius: element.borderRadius ? `${element.borderRadius}px` : "0px",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start", // For left-to-right, adjust if right-to-left
    padding: "0 10px",
    boxSizing: "border-box",
    overflow: "hidden",
    zIndex: element.zIndex,
    visibility: element.isVisible === false ? "hidden" : "visible",
  };

  let animationDuration = "15s"; // Default for medium
  if (scrollSpeed === "slow") animationDuration = "25s";
  if (scrollSpeed === "fast") animationDuration = "8s";

  const animationName =
    bannerDirection === "left-to-right"
      ? "scrollLeftToRight"
      : "scrollRightToLeft";

  // Inline style for animation to use dynamic duration
  const textStyles: React.CSSProperties = {
    whiteSpace: "nowrap",
    animation: `${animationName} ${animationDuration} linear infinite`,
  };

  return (
    <div style={styles} data-testid={`announcement-banner-${element.id}`}>
      <div style={textStyles}>{bannerText}</div>
    </div>
  );
};

export default AnnouncementBannerDisplay;
