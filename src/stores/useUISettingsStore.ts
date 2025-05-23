import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// Define the shape of settings for section visibility
interface SectionVisibilitySettings {
  isScheduleManagementVisible: boolean;
  isLivePresentationControlVisible: boolean;
  isOutputMappingContentVisible: boolean;
  isTemplatesContentVisible: boolean;
  // Add other section visibility toggles here as needed
}

// Define the overall state and actions for UI settings
interface UISettingsState {
  sections: SectionVisibilitySettings;
  toggleSectionVisibility: (
    sectionKey: keyof SectionVisibilitySettings
  ) => void;
  resetToDefaults: () => void; // Action to reset all settings to default
}

// Create the Zustand store with persistence
export const useUISettingsStore = create<UISettingsState>()(
  persist(
    (set) => ({
      // Initial state for UI settings
      sections: {
        isScheduleManagementVisible: true, // Default to visible
        isLivePresentationControlVisible: true, // Default to visible
        isOutputMappingContentVisible: true, // Default to visible
        isTemplatesContentVisible: true, // Default to visible
      },

      // Action to toggle the visibility of a specific section
      toggleSectionVisibility: (sectionKey) =>
        set((state) => ({
          sections: {
            ...state.sections,
            [sectionKey]: !state.sections[sectionKey],
          },
        })),

      // Action to reset all section visibility settings to their default values
      resetToDefaults: () =>
        set(() => ({
          sections: {
            isScheduleManagementVisible: true,
            isLivePresentationControlVisible: true,
            isOutputMappingContentVisible: true,
            isTemplatesContentVisible: true,
          },
        })),
    }),
    {
      name: "ipresent-ui-settings-storage", // Unique name for localStorage item
      storage: createJSONStorage(() => localStorage), // Use localStorage for persistence
      // partialize: (state) => ({ displayTab: state.displayTab }), // Example: only persist displayTab
    }
  )
);

/*
Example Usage:

import { useUISettingsStore } from './useUISettingsStore';

function MyComponent() {
  const { sections, toggleSectionVisibility } = useUISettingsStore();

  return (
    <div>
      <button onClick={() => toggleSectionVisibility('isScheduleManagementVisible')}>
        Toggle Schedule Management Visibility
      </button>
      {sections.isScheduleManagementVisible && <div>Schedule Management Section</div>}

      <button onClick={() => toggleSectionVisibility('isLivePresentationControlVisible')}>
        Toggle Live Presentation Control Visibility
      </button>
      {sections.isLivePresentationControlVisible && <div>Live Presentation Control Section</div>}

      <button onClick={() => toggleSectionVisibility('isOutputMappingContentVisible')}>
        Toggle Output Mapping Content Visibility
      </button>
      {sections.isOutputMappingContentVisible && <div>Output Mapping Content Section</div>}

      <button onClick={() => toggleSectionVisibility('isTemplatesContentVisible')}>
        Toggle Templates Content Visibility
      </button>
      {sections.isTemplatesContentVisible && <div>Templates Content Section</div>}
    </div>
  );
}
*/
