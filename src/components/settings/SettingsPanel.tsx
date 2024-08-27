import {ChangeEvent} from "react";
import {useGetSettingsContext} from "./SettingsProvider.tsx";

export default function SettingsPanel() {
  const { settings, setSettings } = useGetSettingsContext();

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
