import {ReactNode} from "react";
import {Link} from "react-router-dom";
import YugipediaLogo from "../assets/images/logos/Yugipedia.png";

export function YugipediaLink({page, text}: { page: string, text?: string | null }): ReactNode {
  return <Link to={`https://yugipedia.com/wiki/${page}`}>{text}{text == null ? "" : " "}{YugipediaLogoComponent()}</Link>;
}

function YugipediaLogoComponent() {
  return <img className={"inline-logo"} src={YugipediaLogo} alt="Yugipedia logo" />;
}
