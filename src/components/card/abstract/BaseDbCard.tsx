import {ReactElement, ReactNode} from "react";
import CardTemplate from "./display/elements/CardTemplate.tsx";
import StatLine from "./display/elements/StatLine.tsx";
import EffectBlock from "./display/elements/EffectBlock.tsx";
import {parseEffects} from "./parse/parseEffects.ts";
import {CardKind, isSpellTrapCard, readCardKind} from "./CardKind.ts";
import {CardSubKind, isContinuousLike, isExtraDeck, readCardSubKind} from "./CardSubKind.ts";
import PendulumEffectBlock from "./display/elements/PendulumEffectBlock.tsx";
import NormalEffectLore from "./effect/NormalEffectLore.tsx";
import {getMonsterSpecialKinds} from "./MonsterSpecialKind.ts";
import {CompressedCardEntry, parseForbiddenValue} from "../../../dbCompression.ts";
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
  public readonly json: CompressedCardEntry;

  public readonly limitedTcg: number;
  public readonly limitedOcg: number;

  constructor(cardEntry: CompressedCardEntry) {
    this.id = cardEntry.id || "undefined";
    this.name = cardEntry.name;
    this.art = getBucketImageLink(cardEntry.imageId);
    this.kind = getDbCardKind(cardEntry);
    this.subKind = getDbCardSubKind(cardEntry);
    this.isPendulum = cardEntry.getIsPendulum();

    this.text = cardEntry.text;
    this.json = cardEntry;

    [this.limitedTcg, this.limitedOcg] = parseForbiddenValue(cardEntry.forbidden);
  }

  toText(): string {
    return `${this.id}\n${this.name}\n${this.text}`
  }

  getLinkUrl(): string {
    return `/card/official/${encodeURI(this.name)}`
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
      if (!this.json.monsterTypeLine) {
        throw new Error(`Missing monster type line for monster card ${this.id} "${this.name}"`);
      }

      const specialKinds = getMonsterSpecialKinds(this.json.monsterTypeLine);
      const monsterType = this.getMonsterType();
      if (!monsterType) {
        throw new Error(`Missing race for card ${this.id} "${this.name}"`);
      }
      const categories: string[] = [monsterType.toString(), ...specialKinds.map(k => k.toString()), this.subKind];

      if ((isExtraDeck(this.subKind) && this.getEffectText().length > 0)
        || (!categories.includes("Effect") && this.json.monsterTypeLine?.includes("Effect"))) {
        categories.push("Effect");
      }

      return <p>[{categories.join(" / ")}]</p>;
    }
  }

  getStatLine(): ReactNode {
    if (this.kind === CardKind.MONSTER) {
      function parseStat(stat: string | undefined): number {
        return stat === "?" ? -1 : stat !== undefined ? parseInt(stat) : 0
      }

      const atk = parseStat(this.json.atk);
      const def = this.subKind === CardSubKind.LINK ? null : parseStat(this.json.def);
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
        const materials = this.getMaterials();
        const monsterEffects = parseEffects({text: materials ? this.getEffectText() : this.text});
        const pendulumEffects = parseEffects({text: this.json.pendulumText || "", isSpellTrapCard: true, isContinuousSpellTrapCard: true})
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
    const materials = this.getMaterials();
    const effectText = materials ? this.getEffectText() : this.text;

    if (this.kind == CardKind.MONSTER && this.isPendulum) {
      return <PendulumEffectBlock materials={materials} pendulumEffects={this.json.pendulumText || ""} monsterEffects={effectText} cardId={this.id} />;
    }

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
      return this.json.level;
    }
  }

  getMonsterType(): MonsterType | undefined {
    if (this.kind === CardKind.MONSTER && this.json.monsterTypeLine) {
      return monsterTypeFromString(this.json.monsterTypeLine[0]);
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

function getBucketImageLink(id: string | undefined): string {
  return `${process.env.IMAGE_BASE_URL}/${id}.jpg`;
}

function getDbCardKind(json: CompressedCardEntry): CardKind {
  return readCardKind(json.superType.toLowerCase());
}

function getDbCardSubKind(json: CompressedCardEntry): CardSubKind {
  const kind = getDbCardKind(json);
  const frameType = json.superType || undefined;

  const race = json.property || json.getMonsterKind();
  if (!race) {
    throw new Error(`Missing race for card ${json.id} "${json.name}"`);
  }

  return readCardSubKind(kind, race, frameType);
}

function getLevelName(monsterSubKind: CardSubKind, json: CompressedCardEntry): string {
  const levelNumber = json.level;
  if (monsterSubKind === CardSubKind.LINK) {
    return `Link-${levelNumber}`;
  } else if (monsterSubKind === CardSubKind.XYZ) {
    return `Rank ${levelNumber}`;
  } else {
    return `Level ${levelNumber}`;
  }
}
