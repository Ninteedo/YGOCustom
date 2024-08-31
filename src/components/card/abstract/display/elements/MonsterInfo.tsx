import {CardAttribute, monsterAttributeImagePath} from "../../monster/CardAttribute.tsx";
import {ReactNode} from "react";
import {AttributeIcon} from "../../../display/AttributeIcon.tsx";

export default function MonsterInfo({level, attribute}: { level: number, attribute: CardAttribute }): ReactNode {
  const attributeIcon = monsterAttributeImagePath(attribute);
  const attributeIconElement = <AttributeIcon src={attributeIcon} alt={attribute + " icon"}/>;
  return <h4 className={"monster-info"}>Level {level} {attributeIconElement} {attribute} Monster</h4>;
}
