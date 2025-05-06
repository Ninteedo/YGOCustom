import fetch from "node-fetch";
import fs from "fs";
import { ListObjectsV2CommandInput, S3 } from "@aws-sdk/client-s3";
import {compressDbCardJson, CompressedCardEntry, parseForbiddenValue} from "../src/dbCompression";

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

function loadOldCardDb(): CompressedCardEntry[] | null {
  if (fs.existsSync(DB_FILE)) {
    const json = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
    const res: CompressedCardEntry[] = json.map((card: any) => CompressedCardEntry.fromCompressedJson(card));
    console.log(`Old card DB loaded, containing ${res.length} cards.`);
    return res;
  } else {
    console.log(`No old card DB found at ${DB_FILE}`);
    return null;
  }
}

async function loadYgoProDeckCardDb(): Promise<any> {
  return await fetch("https://db.ygoprodeck.com/api/v7/cardinfo.php")
    .then(response => response.json())
    .then(data => {
      console.log("YGOProDeck card data loaded.");
      return data;
    });
}

function saveDb(cardDb: any, ygoProDeckCardDb: any): CompressedCardEntry[] {
  const zippedCardDb = zipCardDbImages(cardDb, ygoProDeckCardDb);
  const compressedDb: CompressedCardEntry[] = zippedCardDb
    .map((card: any) => compressCard(card))
    .filter((card: any) => card !== null);

  console.log(`Saving card DB.`)
  fs.writeFileSync(DB_FILE, JSON.stringify(compressedDb.map(c => c.toCompressedJson()), null, undefined), "utf8");
  console.log(`Saved ${DB_FILE}`);
  return compressedDb;
}

function zipCardDbImages(cardDb: any, ygoProDeckCardDb: any): any {
  const result: any = [];
  for (const card of cardDb) {
    const newCard = card;
    const ygoProDeckCard = ygoProDeckCardDb["data"].find((ygoProDeckCard: any) =>
      ygoProDeckCard["name"] === card["name"]["en"] || ygoProDeckCard["id"] === card["password"]);
    if (ygoProDeckCard) {
      newCard["card_images_new"] = ygoProDeckCard["card_images"];
      newCard["id_alt"] = ygoProDeckCard["id"];
      if (ygoProDeckCard["humanReadableCardType"]) {
        newCard["is_effect"] = ygoProDeckCard["humanReadableCardType"].includes("Effect");
      } else {
        newCard["is_effect"] = undefined;
      }
    }
    result.push(newCard);
  }
  return result;
}

async function main(): Promise<void> {
  const oldCardDb = loadOldCardDb();
  const cardDb = await loadCardDb();
  const ygoProDeckCardDb = await loadYgoProDeckCardDb();
  const compressedDb = saveDb(cardDb, ygoProDeckCardDb);

  const failedUploads = await saveNewCardImages(oldCardDb, compressedDb);
  writeMissingImagesList(failedUploads);
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

/**
 * Uploads a card image to R2.
 * @return false if the image was uploaded successfully, true if there was an error.
 */
async function uploadCardImage(croppedUrl: string, imageId: string, s3: S3, bucketName: string): Promise<boolean> {
  try {
    const response = await fetch(croppedUrl);

    if (!response.ok) {
      console.error(`Failed to download ${croppedUrl}: ${response.status}`);
      return true;
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Check if the image is empty
    if (buffer.byteLength === 0) {
      console.error(`Empty image ${imageId}`);
      return true;
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
      return false;
    } catch (e) {
      console.error(`Error uploading ${imageId}`, e);
      return true;
    }
  } catch (e) {
    console.error(`Error downloading or uploading ${imageId}`, e);
    return true;
  }
}

/**
 * Downloads and uploads new card images to R2.
 * @return a list of image IDs that failed to upload.
 */
async function saveNewCardImages(oldCardDb: CompressedCardEntry[] | null, cardDb: CompressedCardEntry[]): Promise<string[]> {
  const r2Images = await listR2Images();
  const s3 = configureR2Client();
  const bucketName = process.env.R2_BUCKET_NAME;

  if (!bucketName) {
    throw new Error("R2_BUCKET_NAME environment variable not set.");
  }

  function hasLimitedStatusChanged(newCard: CompressedCardEntry): boolean {
    const oldCard = oldCardDb?.find(card => card.id === newCard.id);
    if (!oldCard) {
      return false;
    }

    if (oldCard.forbidden !== newCard.forbidden) {
      const oldStatus = parseForbiddenValue(oldCard.forbidden);
      const newStatus = parseForbiddenValue(newCard.forbidden);

      if (oldStatus !== newStatus && (oldStatus[0] <= 3 || newStatus[0] <= 3)) {
        console.log(`Limited status changed for ${newCard.name}: ${oldStatus} -> ${newStatus}`);
        return true;
      }
    }
    return false;
  }

  const failedUploads: string[] = [];
  let anyForbiddenChanges = false;

  for (const card of cardDb) {
    const imageFile = `${card.imageId}.jpg`;
    if (imageFile === "undefined.jpg") {
      failedUploads.push(imageFile);
      continue;
    }

    const croppedUrl = "https://images.ygoprodeck.com/images/cards_cropped/" + imageFile;

    if (hasLimitedStatusChanged(card)) {
      console.log(`Replacing ${croppedUrl} due to limited status change`);
      anyForbiddenChanges = true;
      if (r2Images.has(imageFile)) {
        // delete the old image
        try {
          await s3.deleteObject({Bucket: bucketName, Key: imageFile});
        } catch (e) {
          console.error(`Error deleting ${imageFile}`, e);
        }
      }

      // upload the new image
      if (await uploadCardImage(croppedUrl, imageFile, s3, bucketName)) {
        failedUploads.push(imageFile);
      }

      // rate limit
      await new Promise(resolve => setTimeout(resolve, 200));
    } else if (!r2Images.has(imageFile)) {
      console.log(`Downloading ${croppedUrl}`);
      const failedUpload = await uploadCardImage(croppedUrl, imageFile, s3, bucketName);
      if (failedUpload) {
        failedUploads.push(imageFile);
      }
      // rate limit
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  }

  console.log(`Finished uploading images. Failed: ${failedUploads.length}`);
  if (!anyForbiddenChanges) {
    console.log("No forbidden status changes detected.");
  }
  return failedUploads;
}

function compressCard(card: any): CompressedCardEntry | null {
  try {
    return compressDbCardJson(card);
  } catch (e) {
    console.error(`Error compressing card ${card["password"]} "${card["name"]["en"]}"`, e);
    return null;
  }
}

function writeMissingImagesList(missingImages: string[]): void {
  const missingImagesFile = "src/assets/missingImages.ts";
  const imageIds = missingImages.filter(id => id !== "undefined.jpg").map(id => id.substring(0, id.length - 4));
  const missingImagesFileContents = "export const missingImageIds: number[] = [\r\n  " + imageIds.join(",\r\n  ") + "\r\n];\r\n";
  fs.writeFileSync(missingImagesFile, missingImagesFileContents, "utf8");
}

await main();
