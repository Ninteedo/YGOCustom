import {ChangeEvent, useContext} from "react";
import {SettingsContext} from "./SettingsProvider.tsx";

export default function SettingsPanel() {
  const context = useContext(SettingsContext);

  if (!context) {
    throw new Error("SettingsContext not found");
  }

  const { settings, setSettings } = context;

  function setDisableCardFormatting(event: ChangeEvent<HTMLInputElement>) {
    const disableCardFormatting = event.target.checked;
    setSettings({...settings, disableCardFormatting});
  }

  return (
    <div className={"settings-panel"}>
      <label><input type={"checkbox"} onChange={(event) => setDisableCardFormatting(event)}/> Disable card text formatting</label>
    </div>
  )
}
