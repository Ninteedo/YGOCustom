import {MonsterAttribute, MonsterAttributeImage} from "../MonsterAttribute.ts";
import {ReactNode} from "react";

export default function MonsterInfo({level, attribute}: { level: number, attribute: MonsterAttribute }): ReactNode {
  const attributeIcon = MonsterAttributeImage(attribute);
  const attributeIconElement = <img className={"attribute-icon"} src={attributeIcon} alt={attribute + " icon"}/>;
  return <h4 className={"monster-info"}>Level {level} {attributeIconElement} {attribute} Monster</h4>;
}
