import {ReactElement, ReactNode} from "react";
import CardTemplate from "./display/elements/CardTemplate.tsx";
import StatLine from "./display/elements/StatLine.tsx";
import EffectBlock from "./display/elements/EffectBlock.tsx";
import {parseEffects} from "./parse/parseEffects.ts";
import {CardKind, isSpellTrapCard, readCardKind} from "./CardKind.ts";
import {CardSubKind, isContinuousLike, isExtraDeck, readCardSubKind} from "./CardSubKind.ts";
import PendulumEffectBlock from "./display/elements/PendulumEffectBlock.tsx";
import {parsePendulumText, splitPendulumText} from "./parse/parsePendulum.ts";
import NormalEffectLore from "./effect/NormalEffectLore.tsx";
import {getMonsterSpecialKinds} from "./MonsterSpecialKind.ts";
import {CardJsonEntry, parseForbiddenValue} from "../../../dbCompression.ts";
import {MonsterType, monsterTypeFromString} from "./monster/MonsterType.ts";
import {CardAttribute, monsterAttributeFromString, MonsterAttributeImage} from "./monster/CardAttribute.tsx";
import {readMaterialsText, readNonMaterialsText} from "./parse/parseMaterials.ts";

export default class BaseDbCard {
  public readonly id: string;
  public readonly name: string;
  public readonly art: string;
  public readonly kind: CardKind;
  public readonly subKind: CardSubKind;
  public readonly isPendulum: boolean;

  public readonly text: string;
  public readonly json: CardJsonEntry;

  public readonly limitedTcg: number;
  public readonly limitedOcg: number;

  constructor(cardEntry: CardJsonEntry) {
    this.id = cardEntry.id;
    this.name = cardEntry.name;
    this.art = getBucketImageLink(cardEntry.imageId);
    this.kind = getDbCardKind(cardEntry);
    this.subKind = getDbCardSubKind(cardEntry);
    this.isPendulum = cardEntry.type.toLowerCase().includes("pendulum");

    this.text = cardEntry.desc;
    this.json = cardEntry;

    [this.limitedTcg, this.limitedOcg] = parseForbiddenValue(cardEntry.forbidden);
  }

  toText(): string {
    return `${this.id}\n${this.name}\n${this.text}`
  }

  getLinkUrl(): string {
    return `/card/official/${this.id}`
  }

  getInfoLine(): ReactElement {
    switch (this.kind) {
      case CardKind.MONSTER:
        const attribute = this.getAttribute();
        return <p>{getLevelName(this.subKind, this.json)} {this.json.attribute} {attribute && <MonsterAttributeImage attribute={attribute}/>} Monster</p>
      case CardKind.SPELL:
        return <p>{this.subKind} Spell</p>
      case CardKind.TRAP:
        return <p>{this.subKind} Trap</p>
      case CardKind.TOKEN:
        return <p>Token</p>
      default:
        return <p>Unknown</p>
    }
  }

  getCategoryLine(): ReactElement | undefined {
    if (this.kind === CardKind.MONSTER) {
      const specialKinds = getMonsterSpecialKinds(this.json.type);
      if (!this.json.race) {
        throw new Error(`Missing race for card ${this.id} "${this.name}"`);
      }
      const categories: string[] = [this.json.race.toString(), ...specialKinds.map(k => k.toString()), this.subKind];

      if ((isExtraDeck(this.subKind) && this.getEffectText().length > 0)
        || (!categories.includes("Effect") && this.json.type.includes("Effect"))) {
        categories.push("Effect");
      }

      return <p>[{categories.join(" / ")}]</p>;
    }
  }

  getStatLine(): ReactNode {
    if (this.kind === CardKind.MONSTER) {
      const atk = this.json.atk ? parseInt(this.json.atk) : 0;
      const def = this.subKind === CardSubKind.LINK ? null : this.json.def ? parseInt(this.json.def) : 0;
      return <StatLine atk={atk} def={def} />;
    }
  }

  protected toElement(): ReactNode {
    return <CardTemplate
      id={this.id}
      name={this.name}
      artSrc={this.art}
      infoLine={this.getInfoLine()}
      effectBlock={this.getEffectBlock()}
      cardKind={this.kind}
      cardSubKind={this.subKind}
      overrideArtSrc={true}
      statLine={this.getStatLine()}
      categoryLine={this.getCategoryLine()}
      isPendulum={this.isPendulum}
      copyTextDiscord={this.getCopyTextDiscordBasic()}
    />;
  }

  getEffectBlock(): ReactNode {
    try {
      if (this.kind == CardKind.MONSTER && this.isPendulum) {
        const {materials, pendulumEffects, monsterEffects} = parsePendulumText(
          this.text, this.subKind === CardSubKind.NORMAL, isExtraDeck(this.subKind));
        return <PendulumEffectBlock materials={materials} pendulumEffects={pendulumEffects} monsterEffects={monsterEffects} cardId={this.id} />;
      }

      if (this.kind == CardKind.TOKEN || (this.kind == CardKind.MONSTER && this.subKind == CardSubKind.NORMAL)) {
        return <EffectBlock effects={new NormalEffectLore(this.text)} cardId={this.id} />;
      }

      const materials = this.getMaterials();
      const effects = parseEffects({
        text: materials ? this.getEffectText() : this.text,
        isFastCard: this.kind === CardKind.TRAP || this.subKind === CardSubKind.QUICK_PLAY,
        isSpellTrapCard: isSpellTrapCard(this.kind),
        isContinuousSpellTrapCard: (
          isSpellTrapCard(this.kind)
          && isContinuousLike(this.subKind)
        )
      });

      return <EffectBlock materials={materials} effects={effects} cardId={this.id}/>;
    } catch (e) {
      return <EffectBlock effects={this.text} cardId={this.id}/>;
    }
  }

  getEffectBlockNoFormatting(): ReactNode {
    if (this.kind == CardKind.MONSTER && this.isPendulum) {
      const {materials, pendulumText, monsterText} = splitPendulumText(
        this.text, isExtraDeck(this.subKind));
      return <PendulumEffectBlock materials={materials} pendulumEffects={pendulumText} monsterEffects={monsterText} cardId={this.id} />;
    }

    const materials = this.getMaterials();
    const effectText = materials ? this.getEffectText() : this.text;

    return <EffectBlock materials={materials} effects={effectText} cardId={this.id}/>;
  }

  getMaterials(): string | undefined {
    if (this.kind === CardKind.MONSTER && isExtraDeck(this.subKind)) {
      return readMaterialsText(this.text) || this.text;
    }
  }

  getEffectText(): string {
    return readNonMaterialsText(this.text);
  }

  getCopyTextDiscordBasic(): string {
    return `**${this.name}**
*${this.getInfoLine()}*
${this.getCategoryLine()}
${this.text}`;
  }

  /**
   * Get the level, rank, or link rating of the card if it has one.
   *
   * Spell/Trap cards will return undefined.
   */
  getAnyLevelNumber(): number | undefined {
    if (this.kind === CardKind.MONSTER) {
      return parseInt(this.json.level || this.json.linkval || "0");
    }
  }

  getMonsterType(): MonsterType | undefined {
    if (this.kind === CardKind.MONSTER && this.json.race) {
      return monsterTypeFromString(this.json.race);
    }
  }

  getAttribute(): CardAttribute | undefined {
    if (this.kind === CardKind.MONSTER && this.json.attribute) {
      return monsterAttributeFromString(this.json.attribute);
    } else if (this.kind === CardKind.SPELL) {
      return CardAttribute.SPELL;
    } else if (this.kind === CardKind.TRAP) {
      return CardAttribute.TRAP;
    }
  }
}

function getBucketImageLink(id: string): string {
  return `${process.env.IMAGE_BASE_URL}/${id}.jpg`;
}

function getDbCardKind(json: CardJsonEntry): CardKind {
  return readCardKind(json.type.toLowerCase());
}

function getDbCardSubKind(json: CardJsonEntry): CardSubKind {
  const typeString = json.type.toLowerCase();
  const kind = getDbCardKind(json);
  const frameType = json.frameType || undefined;

  if (!json.race) {
    throw new Error(`Missing race for card ${json.id} "${json.name}"`);
  }

  return readCardSubKind(kind, typeString, json.race, frameType);
}

function getLevelName(monsterSubKind: CardSubKind, json: CardJsonEntry): string {
  const levelNumber = json.level;
  if (monsterSubKind === CardSubKind.LINK) {
    const linkRating = json.linkval;
    return `Link-${linkRating}`;
  } else if (monsterSubKind === CardSubKind.XYZ) {
    return `Rank ${levelNumber}`;
  } else {
    return `Level ${levelNumber}`;
  }
}
