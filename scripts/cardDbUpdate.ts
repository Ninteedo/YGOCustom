import axios from "axios";
import fs from "fs";
import AWS from "aws-sdk";
import {ListObjectsV2Request} from "aws-sdk/clients/s3";

// if (process.env.NODE_ENV !== 'production') {
//   dotenv.config();
// }

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

function saveDbByLanguages(cardDb: any): void {
  const LANGUAGES = ["en"];  // , "de", "es", "fr", "it", "pt", "ja", "ko", "zh-TW", "zh-CN"];

  const db = cardDb['data'];
  const dbNoSkills = db.filter((card: any) => !isSkillCard(card));

  for (const language of LANGUAGES) {
    // const db = getCardDbByLanguage(cardDb, language);

    console.log(`Saving card data for ${language}.`)
    fs.writeFileSync(`public/db/cards.${language}.json`, JSON.stringify(dbNoSkills, null, 2), "utf8");
    console.log(`Saved public/db/cards.${language}.json`);
  }
}

async function main(): Promise<void> {
  const currentDbVersion = await fetchCurrentDbVersion();
  const latestDbVersion = await fetchLatestDbVersion();

  // if (currentDbVersion === latestDbVersion) {
  //   console.log("Database is already up to date. " + currentDbVersion);
  //   return;
  // }
  console.log("Database update required. " + currentDbVersion + " -> " + latestDbVersion);

  const cardDb = await loadCardDb();
  saveDbByLanguages(cardDb);
  fs.writeFileSync(DB_VERSION_FILE, latestDbVersion, "utf8");

  await saveNewCardImages(cardDb);
}

function configureR2Client() {
  return new AWS.S3({
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    region: 'auto',
    s3ForcePathStyle: true,
    endpoint: new AWS.Endpoint(`https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`),
  })
}

async function listR2Images(): Promise<Set<string>> {
  const s3 = configureR2Client();

  if (!process.env.R2_BUCKET_NAME) {
    throw new Error("R2_BUCKET_NAME environment variable not set.");
  }

  const params: ListObjectsV2Request = { Bucket: process.env.R2_BUCKET_NAME };
  const imageSet = new Set<string>();

  let data;
  do {
    data = await s3.listObjectsV2(params).promise();
    if (!data.Contents) {
      throw new Error("No contents found in R2 bucket.");
    }

    for (const item of data.Contents) {
      if (item.Key) {
        imageSet.add(item.Key);
      }
    }

    params.ContinuationToken = data.NextContinuationToken;
    console.log(`Listed ${imageSet.size} images from R2.`)
  } while (data.IsTruncated);

  console.log(`Finished listing ${imageSet.size} images from R2.`);
  return imageSet;
}

async function uploadCardImage(croppedUrl: string, imageId: string, s3: AWS.S3, bucketName: string): Promise<void> {
  try {
    const response = await axios({
      url: croppedUrl,
      method: 'GET',
      responseType: 'stream'
    });

    let buffer;
    try {
      buffer = await new Promise<Buffer>((resolve, reject) => {
        const chunks: Uint8Array[] = [];
        response.data.on('data', (chunk: Uint8Array) => chunks.push(chunk));
        response.data.on('end', () => resolve(Buffer.concat(chunks)));
        response.data.on('error', reject);
      });
    } catch (e) {
      console.error(`Error downloading ${croppedUrl}`);
      return;
    }

    // Upload to Cloudflare R2
    try {
      await s3.putObject({
        Bucket: bucketName,
        Key: `official/${imageId}`,
        Body: buffer,
        ContentType: 'image/jpeg'
      }).promise();
    } catch (e) {
      console.error(`Error uploading ${imageId}`);
      return;
    }

    console.log(`Uploaded ${imageId} to R2`);
  } catch (e) {
    console.error(`Error downloading or uploading ${imageId}`);
  }
}

async function saveNewCardImages(cardDb: any): Promise<void> {
  const r2Images = await listR2Images();
  const s3 = configureR2Client();
  const bucketName = process.env.R2_BUCKET_NAME;

  if (!bucketName) {
    throw new Error("R2_BUCKET_NAME environment variable not set.");
  }

  for (const card of cardDb["data"]) {
    const imagesList = card["card_images"];
    for (const dict of imagesList) {
      const imageId = `${dict["id"]}.jpg`;
      const croppedUrl = dict["image_url_cropped"];

      if (isSkillCard(card)) {
        continue;
      }

      if (!r2Images.has(imageId)) {
        console.log(`Downloading ${croppedUrl}`);
        await uploadCardImage(croppedUrl, imageId, s3, bucketName);
        // Wait to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }
  }
}

function isSkillCard(card: any): boolean {
  return card["type"].toLowerCase() === "skill card";
}

await main();
