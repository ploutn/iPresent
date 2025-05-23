// src/hooks/useStageDisplay.ts
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  StageDisplayConfig,
  StageDisplayTemplate,
  StageDisplayElement,
} from "../types/stageDisplay";
import { defaultTemplates } from "../components/StageDisplayTemplates";
// Removed duplicate import: import { v4 as uuidv4 } from "uuid"; // Added import for uuid

export function useStageDisplay() {
  const [stageDisplayConfig, setStageDisplayConfig] =
    useState<StageDisplayConfig>(() => {
      // Initialize with default templates
      const defaultConfig: StageDisplayConfig = {
        activeTemplateId: defaultTemplates[0].id,
        templates: [...defaultTemplates],
        isActive: false,
      };

      // Try to load from localStorage if available
      try {
        const savedConfig = localStorage.getItem("stageDisplayConfig");
        if (savedConfig) {
          return JSON.parse(savedConfig);
        }
      } catch (error) {
        console.error("Error loading stage display config:", error);
      }

      return defaultConfig;
    });

  // Save config to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem(
        "stageDisplayConfig",
        JSON.stringify(stageDisplayConfig)
      );
    } catch (error) {
      console.error("Error saving stage display config:", error);
    }
  }, [stageDisplayConfig]);

  // Get the active template
  const activeTemplate =
    stageDisplayConfig.templates.find(
      (template) => template.id === stageDisplayConfig.activeTemplateId
    ) || stageDisplayConfig.templates[0];

  // Set the active template
  const setActiveTemplate = (templateId: string) => {
    setStageDisplayConfig({
      ...stageDisplayConfig,
      activeTemplateId: templateId,
    });
  };

  // Create a new template
  const createTemplate = (name: string) => {
    const newTemplate: StageDisplayTemplate = {
      id: uuidv4(),
      name,
      elements: [],
    };

    setStageDisplayConfig({
      ...stageDisplayConfig,
      templates: [...stageDisplayConfig.templates, newTemplate],
      activeTemplateId: newTemplate.id,
    });

    return newTemplate.id;
  };

  // Save changes to a template
  const saveTemplate = (updatedTemplate: StageDisplayTemplate) => {
    setStageDisplayConfig({
      ...stageDisplayConfig,
      templates: stageDisplayConfig.templates.map((template) =>
        template.id === updatedTemplate.id ? updatedTemplate : template
      ),
    });
  };

  // Delete a template
  const deleteTemplate = (templateId: string) => {
    // Don't allow deleting the last template
    if (stageDisplayConfig.templates.length <= 1) {
      return false;
    }

    // Don't allow deleting default templates
    const templateToDelete = stageDisplayConfig.templates.find(
      (t) => t.id === templateId
    );
    if (templateToDelete?.isDefault) {
      return false;
    }

    const newTemplates = stageDisplayConfig.templates.filter(
      (template) => template.id !== templateId
    );

    // If deleting the active template, switch to the first available template
    const newActiveId =
      templateId === stageDisplayConfig.activeTemplateId
        ? newTemplates[0].id
        : stageDisplayConfig.activeTemplateId;

    setStageDisplayConfig({
      ...stageDisplayConfig,
      templates: newTemplates,
      activeTemplateId: newActiveId,
    });

    return true;
  };

  // Rename a template
  const renameTemplate = (templateId: string, newName: string) => {
    setStageDisplayConfig((prevConfig) => ({
      ...prevConfig,
      templates: prevConfig.templates.map((template) =>
        template.id === templateId ? { ...template, name: newName } : template
      ),
    }));
  };

  // Duplicate a template
  const duplicateTemplate = (templateId: string): string | undefined => {
    const templateToDuplicate = stageDisplayConfig.templates.find(
      (template) => template.id === templateId
    );

    if (!templateToDuplicate) {
      console.warn(`Template with id ${templateId} not found for duplication.`);
      return undefined;
    }

    const newId = uuidv4(); // Ensure uuidv4 is imported
    const newTemplate: StageDisplayTemplate = {
      ...templateToDuplicate,
      id: newId,
      name: `${templateToDuplicate.name} (Copy)`,
      isDefault: false,
      elements: templateToDuplicate.elements.map((el) => ({
        ...JSON.parse(JSON.stringify(el)), // Deep copy individual element
        isVisible: el.isVisible !== false, // Set isVisible to true if undefined or true, false if false
      })),
    };

    setStageDisplayConfig((prevConfig) => ({
      ...prevConfig,
      templates: [...prevConfig.templates, newTemplate],
      activeTemplateId: newId,
    }));

    return newId;
  };

  // Toggle stage display active state
  const toggleStageDisplay = () => {
    setStageDisplayConfig({
      ...stageDisplayConfig,
      isActive: !stageDisplayConfig.isActive,
    });
  };

  // Set target display for stage display
  const setTargetDisplay = (displayId: string) => {
    setStageDisplayConfig({
      ...stageDisplayConfig,
      targetDisplayId: displayId,
    });
  };

  return {
    stageDisplayConfig,
    activeTemplate,
    setActiveTemplate,
    createTemplate,
    saveTemplate,
    deleteTemplate,
    renameTemplate, // Added
    duplicateTemplate, // Added
    toggleStageDisplay,
    setTargetDisplay,
  };
}
