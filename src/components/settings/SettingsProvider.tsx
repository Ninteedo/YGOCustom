import {createContext, ReactNode, useState} from "react";
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
