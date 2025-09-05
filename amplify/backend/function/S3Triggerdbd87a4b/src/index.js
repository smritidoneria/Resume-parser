/* Amplify S3 Trigger Lambda - Resume Parser using pdf-parse */

const fs = require("fs");
const path = require("path");
const os = require("os");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const pdf = require("pdf-parse");

const s3Client = new S3Client({ region: process.env.AWS_REGION });
const dynamodbClient = new DynamoDBClient({ region: process.env.AWS_REGION });

exports.handler = async (event) => {
  console.log("S3 event received:", JSON.stringify(event, null, 2));

  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(
    event.Records[0].s3.object.key.replace(/\+/g, " ")
  );

  const tmpFilePath = path.join(os.tmpdir(), path.basename(key));

  try {
    // Step 1: Download file from S3
    console.log("Step 1: Downloading file from S3...");
    const getObjectCommand = new GetObjectCommand({ Bucket: bucket, Key: key });
    const s3Response = await s3Client.send(getObjectCommand);

    const writeStream = fs.createWriteStream(tmpFilePath);
    await new Promise((resolve, reject) => {
      s3Response.Body.pipe(writeStream)
        .on("finish", resolve)
        .on("error", reject);
    });
    console.log(`Downloaded ${key} to ${tmpFilePath}`);

    // Step 2: Extract text using pdf-parse
    console.log("Step 2: Extracting text from PDF...");
    const pdfBuffer = fs.readFileSync(tmpFilePath);
    const data = await pdf(pdfBuffer);
    const fullText = data.text;
    console.log("Extracted text snippet:", fullText.substring(0, 300));

    // Step 3: Save extracted text to DynamoDB
    console.log("Step 3: Saving text to DynamoDB...");
    const dbParams = {
      TableName: "ResumesTable-dev",
      Item: {
        resumeId: { S: key },
        rawText: { S: fullText },
      },
    };
    await dynamodbClient.send(new PutItemCommand(dbParams));
    console.log(`Saved extracted text for ${key} into DynamoDB`);

    // Step 4: Clean up
    fs.unlinkSync(tmpFilePath);
    console.log("Cleanup done.");
  } catch (err) {
    console.error("Error processing file:", err);
    throw err;
  }

  console.log("Lambda execution finished successfully.");
  return { status: "done" };
};
