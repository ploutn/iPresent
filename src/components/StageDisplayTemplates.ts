import { StageDisplayTemplate } from "../types/stageDisplay";

export const defaultTemplates: StageDisplayTemplate[] = [
  {
    id: "default",
    name: "Default Template",
    description: "A basic template with current slide and clock",
    elements: [
      {
        id: "current-slide",
        type: "currentSlide",
        x: 0,
        y: 0,
        width: 1920,
        height: 1080,
        isVisible: true,
        style: {
          fontSize: "48px",
          textAlign: "center",
          color: "#ffffff",
        },
      },
      {
        id: "clock",
        type: "clock",
        x: 20,
        y: 20,
        width: 200,
        height: 50,
        isVisible: true,
        style: {
          fontSize: "24px",
          color: "#ffffff",
        },
      },
    ],
    backgroundColor: "#000000",
  },
  {
    id: "preview",
    name: "Preview Template",
    description: "Template with current slide, next slide, and timer",
    elements: [
      {
        id: "current-slide",
        type: "currentSlide",
        x: 0,
        y: 0,
        width: 1920,
        height: 800,
        isVisible: true,
        style: {
          fontSize: "48px",
          textAlign: "center",
          color: "#ffffff",
        },
      },
      {
        id: "next-slide",
        type: "nextSlide",
        x: 0,
        y: 800,
        width: 1920,
        height: 280,
        isVisible: true,
        style: {
          fontSize: "32px",
          textAlign: "center",
          color: "#ffffff",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        },
      },
      {
        id: "timer",
        type: "timer",
        x: 20,
        y: 20,
        width: 200,
        height: 50,
        isVisible: true,
        style: {
          fontSize: "24px",
          color: "#ffffff",
        },
      },
    ],
    backgroundColor: "#000000",
  },
];
