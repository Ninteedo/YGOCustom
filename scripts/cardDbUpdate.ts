import fetch from "node-fetch";
import fs from "fs";
import { ListObjectsV2CommandInput, S3 } from "@aws-sdk/client-s3";
import {compressDbCardJson} from "../src/dbCompression";

import dotenv from "dotenv";
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const DB_FILE = "src/assets/cards.en.json";

async function loadCardDb(): Promise<any> {
  return await fetch("https://dawnbrandbots.github.io/yaml-yugi/cards.json")
    .then(response => response.json())
    .then(data => {
      console.log("Aggregate card data loaded.");
      return data;
    });
}

async function loadYgoProDeckCardDb(): Promise<any> {
  return await fetch("https://db.ygoprodeck.com/api/v7/cardinfo.php")
    .then(response => response.json())
    .then(data => {
      console.log("YGOProDeck card data loaded.");
      return data;
    });
}

function saveDb(cardDb: any, ygoProDeckCardDb: any): void {
  // const db = cardDb['data'];
  // const dbNoSkills = db;  //.filter((card: any) => !isSkillCard(card));
  const zippedCardDb = zipCardDbImages(cardDb, ygoProDeckCardDb);
  const compressedDb = zippedCardDb.map((card: any) => compressCard(card)).filter((card: any) => card !== null);

  console.log(`Saving card DB.`)
  fs.writeFileSync(DB_FILE, JSON.stringify(compressedDb, null, undefined), "utf8");
  console.log(`Saved ${DB_FILE}`);
}

function zipCardDbImages(cardDb: any, ygoProDeckCardDb: any): any {
  const result: any = [];
  for (const card of cardDb) {
    const newCard = card;
    const ygoProDeckCard = ygoProDeckCardDb["data"].find((ygoProDeckCard: any) => ygoProDeckCard["name"] === card["name"]["en"]);
    if (ygoProDeckCard) {
      newCard["card_images_new"] = ygoProDeckCard["card_images"];
      newCard["id_alt"] = ygoProDeckCard["id"];
    }
    result.push(newCard);
  }
  return result;
}

async function main(): Promise<void> {
  const cardDb = await loadCardDb();
  const ygoProDeckCardDb = await loadYgoProDeckCardDb();
  saveDb(cardDb, ygoProDeckCardDb);

  await saveNewCardImages(ygoProDeckCardDb);
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

    if (!response.ok) {
      console.error(`Failed to download ${croppedUrl}: ${response.status}`);
      return;
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Check if the image is empty
    if (buffer.byteLength === 0) {
      console.error(`Empty image ${imageId}`);
      return;
    }

    console.log(`${imageId} size: ${buffer.byteLength}`);

    // Upload to Cloudflare R2
    try {
      await s3.putObject({
        Bucket: bucketName,
        Key: imageId,
        Body: buffer,
        ContentType: 'image/jpeg'
      });

      console.log(`Uploaded ${imageId} to R2 https://images.ygo.rgh.dev/${imageId}`);
    } catch (e) {
      console.error(`Error uploading ${imageId}`, e);
    }
  } catch (e) {
    console.error(`Error downloading or uploading ${imageId}`, e);
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

function compressCard(card: any): any | null {
  try {
    return compressDbCardJson(card);
  } catch (e) {
    console.error(`Error compressing card ${card["password"]} "${card["name"]["en"]}"`, e);
    return null;
  }
}

await main();
