import fetch from "node-fetch";
import fs from "fs";
import { ListObjectsV2CommandInput, S3 } from "@aws-sdk/client-s3";
import {compressDbCardJson} from "../src/dbCompression";

// import dotenv from "dotenv";
// if (process.env.NODE_ENV !== 'production') {
//   dotenv.config();
// }

const DB_FILE = "src/assets/cards.en.json";
const DB_VERSION_FILE = "db_version.txt";

async function fetchCurrentDbVersion(): Promise<string | null> {
  if (!fs.existsSync(DB_VERSION_FILE)) {
    return null;
  }
  return fs.readFileSync(DB_VERSION_FILE, "utf8");
}

interface DbVersionResponse {
  database_version: string;
}

async function fetchLatestDbVersion(): Promise<string> {
  return await fetch("https://db.ygoprodeck.com/api/v7/checkDBVer.php")
    .then(response => response.json() as Promise<DbVersionResponse[]>)
    .then((data: DbVersionResponse[]) => data[0]["database_version"]);
}

async function loadCardDb(): Promise<any> {
  return await fetch("https://db.ygoprodeck.com/api/v7/cardinfo.php")
    .then(response => response.json())
    .then(data => {
      console.log("Aggregate card data loaded.");
      return data;
    });
}

function saveDb(cardDb: any): void {
  const db = cardDb['data'];
  const dbNoSkills = db.filter((card: any) => !isSkillCard(card));
  const compressedDb = dbNoSkills.map((card: any) => compressCard(card));

  console.log(`Saving card DB.`)
  fs.writeFileSync(DB_FILE, JSON.stringify(compressedDb, null, undefined), "utf8");
  console.log(`Saved ${DB_FILE}`);
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
  saveDb(cardDb);
  fs.writeFileSync(DB_VERSION_FILE, latestDbVersion, "utf8");

  await saveNewCardImages(cardDb);
}

function configureR2Client() {
  if (!process.env.R2_ACCESS_KEY_ID)
    throw new Error("R2_ACCESS_KEY_ID environment variable not set.");
  if (!process.env.R2_SECRET_ACCESS_KEY)
    throw new Error("R2_SECRET_ACCESS_KEY environment variable not set.");
  if (!process.env.R2_ACCOUNT_ID)
    throw new Error("R2_ACCOUNT_ID environment variable not set.");

  return new S3({
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
    region: 'auto',
    forcePathStyle: true,
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  });
}

async function listR2Images(): Promise<Set<string>> {
  const s3 = configureR2Client();

  if (!process.env.R2_BUCKET_NAME) {
    throw new Error("R2_BUCKET_NAME environment variable not set.");
  }
  console.log(`Listing images from ${process.env.R2_BUCKET_NAME}`);

  const params: ListObjectsV2CommandInput = { Bucket: process.env.R2_BUCKET_NAME };
  const imageSet = new Set<string>();

  let data;
  do {
    data = await s3.listObjectsV2(params);
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

async function uploadCardImage(croppedUrl: string, imageId: string, s3: S3, bucketName: string): Promise<void> {
  try {
    const response = await fetch(croppedUrl);

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Cloudflare R2
    try {
      await s3.putObject({
        Bucket: bucketName,
        Key: `official/${imageId}`,
        Body: buffer,
        ContentType: 'image/jpeg'
      });
      console.log(`Uploaded ${imageId} to R2`);
    } catch (e) {
      console.error(`Error uploading ${imageId}`);
      return;
    }
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

function compressCard(card: any): any {
  return compressDbCardJson(card);
}

await main();
