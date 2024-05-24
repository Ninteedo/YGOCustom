import {ReactNode} from "react";
import "../../style/CardText.scss"
import ContinuousIcon from "../../assets/images/properties/Continuous.svg";
import QuickIcon from "../../assets/images/properties/Quick-Play.svg";
import TriggerIcon from "../../assets/images/properties/Trigger.svg";

export function EffectCondition(conditionText: ReactNode) {
  return (
    <>
      <span className={"effect-condition"}>{conditionText}</span>:&nbsp;
    </>
  )
}

export function EffectCost(costText: ReactNode) {
  return (
    <>
      <span className={"effect-cost"}>{costText}</span>;&nbsp;
    </>
  )
}

export function EffectMain(effectText: ReactNode) {
  return (
    <span className={"effect-main"}>{effectText}</span>
  )
}

export function ContinuousEffect(effectText: ReactNode) {
  return (
    <>
      <img className={"inline-logo"} src={ContinuousIcon} alt={"Continuous Icon"}/>
      <span className={"continuous-effect"}>{effectText}</span>
    </>
  )
}

export function QuickEffect(effectText: ReactNode) {
  return (
    <>
      <img className={"inline-logo"} src={QuickIcon} alt={"Quick Icon"}/>
      <span className={"quick-effect"}>{effectText}</span>
    </>
  )
}

export function TriggerEffect(effectText: ReactNode) {
  return (
    <>
      <img className={"inline-logo"} src={TriggerIcon} alt={"Trigger Icon"}/>
      <span className={"trigger-effect"}>{effectText}</span>
    </>
  );
}

export function IgnitionEffect(effectText: ReactNode) {
  return (
    <>
      <span className={"ignition-effect"}>{effectText}</span>
    </>
  );
}

export function EffectText(effectText: ReactNode) {
  return (
    <span className={"effect"}>{effectText}</span>
  );
}
