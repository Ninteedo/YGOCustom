import {createContext, ReactNode, useContext, useState} from "react";
import {Settings} from "./Settings.ts";

interface SettingsContextType {
  settings: Settings;
  setSettings: (settings: Settings) => void;
}

export const SettingsContext = createContext<SettingsContextType | null>(null);

export default function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>({disableCardFormatting: false});

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useGetSettingsContext(): SettingsContextType {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error("SettingsContext not found");
  }

  return context;
}
