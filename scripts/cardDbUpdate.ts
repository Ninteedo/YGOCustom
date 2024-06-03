import axios from "axios";
import fs from "fs";

const DB_VERSION_FILE = "public/db/version.txt";

async function fetchCurrentDbVersion(): Promise<string | null> {
  if (!fs.existsSync(DB_VERSION_FILE)) {
    return null;
  }
  return fs.readFileSync(DB_VERSION_FILE, "utf8");
}

async function fetchLatestDbVersion(): Promise<string> {
  return await fetch("https://db.ygoprodeck.com/api/v7/checkDBVer.php")
    .then(response => response.json())
    .then(data => data[0]["database_version"]);
}

async function loadCardDb(): Promise<any> {
  return await fetch("https://db.ygoprodeck.com/api/v7/cardinfo.php")
    .then(response => response.json())
    .then(data => {
      console.log("Aggregate card data loaded.");
      return data;
    });
}

async function saveNewCardImages(cardDb: any): Promise<void> {
  for (const card of cardDb["data"]) {
    const imagesList = card["card_images"];
    for (const dict of imagesList) {
      const imageId = dict["id"];
      const croppedUrl = dict["image_url_cropped"];
      const imagePath = `public/images/official/${imageId}.jpg`;
      if (!fs.existsSync(imagePath)) {
        console.log(`Downloading ${imageId}.jpg`);
        try {
          const response = await axios({
            url: croppedUrl,
            method: 'GET',
            responseType: 'stream'
          });

          const writer = fs.createWriteStream(imagePath);

          response.data.pipe(writer);

          await new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
          });
        } catch (e) {
          console.error(`Error downloading ${imageId}.jpg`);
          console.error(e);
        }

        // wait 0.1 seconds
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  }
}

function saveDbByLanguages(cardDb: any[]): void {
  const LANGUAGES = ["en", "de", "es", "fr", "it", "pt", "ja", "ko", "zh-TW", "zh-CN"];

  for (const language of LANGUAGES) {
    const db = getCardDbByLanguage(cardDb, language);
    console.log(`Saving card data for ${language}.`)
    fs.writeFileSync(`public/db/cards.${language}.json`, JSON.stringify(db, null, 2), "utf8");
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
  const currentDbVersion = await fetchCurrentDbVersion();
  const latestDbVersion = await fetchLatestDbVersion();

  if (currentDbVersion === latestDbVersion) {
    console.log("Database is already up to date. " + currentDbVersion);
    return;
  }
  console.log("Database update required. " + currentDbVersion + " -> " + latestDbVersion);

  const cardDb = await loadCardDb();
  await saveNewCardImages(cardDb);
  saveDbByLanguages(cardDb);
  fs.writeFileSync(DB_VERSION_FILE, latestDbVersion, "utf8");
}

await main();
