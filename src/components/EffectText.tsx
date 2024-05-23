import {ReactNode} from "react";
import '../style/CardText.scss'

function EffectCondition(conditionText: ReactNode) {
  return (
    <>
    <span className={"effect-condition"}>{conditionText}</span>:&nbsp;
    </>
  )
}

function EffectCost(costText: ReactNode) {
  return (
    <>
      <span className={"effect-cost"}>{costText}</span>;&nbsp;
    </>
  )
}

function EffectMain(effectText: ReactNode) {
  return (
    <span className={"effect-main"}>{effectText}</span>
  )
}

function ContinuousEffect(effectText: ReactNode) {
  return (
    <span className={"continuous-effect"}>{effectText}</span>
  )
}

function EffectText(effectText: ReactNode) {
  return (
    <span className={"effect"}>{effectText}</span>
  );
}

export { ContinuousEffect, EffectCondition, EffectCost, EffectMain, EffectText }
