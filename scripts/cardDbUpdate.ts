import fs from "fs";

async function loadCardDb(): Promise<any[]> {
  return await fetch("https://dawnbrandbots.github.io/yaml-yugi/cards.json")
    .then(response => response.json())
    .then(data => {
      console.log('Aggregate card data loaded.');
      return data;
    });
}

function saveDbByLanguages(cardDb: any[]): void {
  const LANGUAGES = ['en', 'de', 'es', 'fr', 'it', 'pt', 'ja', 'ko', 'zh-TW', 'zh-CN'];

  for (const language of LANGUAGES) {
    const db = getCardDbByLanguage(cardDb, language);
    console.log(`Saving card data for ${language}.`)
    fs.writeFileSync(`public/db/cards.${language}.json`, JSON.stringify(db, null, 2), 'utf8');
    console.log(`Saved public/db/cards.${language}.json`);
  }
}

function getCardDbByLanguage(cardDb: any[], language: string): any[] {
  return cardDb.map(card => getCardByLanguage(card, language));
}

function getCardByLanguage(card: any, language: string): any {
  const data = {...card};

  // remove language fields
  try {
    data.name = data.name[language];
    data.text = data.text[language];
    data.sets = data.sets[language];
  } catch (e) {
    console.error(`Error processing card ${data.name} for language ${language}.`);
    console.error(e);
    throw e;
  }

  return data;
}

async function main(): Promise<void> {
  const cardDb = await loadCardDb();
  saveDbByLanguages(cardDb);
}

await main();
