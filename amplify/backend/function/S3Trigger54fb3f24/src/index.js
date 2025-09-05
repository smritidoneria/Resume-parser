/* Amplify S3 Trigger Lambda - Resume Parser */
const AWS = require('aws-sdk');
const textract = new AWS.Textract();
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  console.log("S3 event received:", JSON.stringify(event, null, 2));

  // Get bucket & file name from event
  const bucket = event.Records[0].s3.bucket.name;
  const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));

  try {
    // Call Textract to extract text from the uploaded file
    const params = {
      Document: {
        S3Object: {
          Bucket: bucket,
          Name: key
        }
      },
      FeatureTypes: ["TABLES", "FORMS"] // extract structured data
    };

    const textractResult = await textract.analyzeDocument(params).promise();
    console.log("Textract output:", JSON.stringify(textractResult, null, 2));

    // Save results to DynamoDB
    const dbParams = {
      TableName: "ResumesTable", // you’ll need to create this with amplify add storage
      Item: {
        resumeId: key,
        rawText: textractResult
      }
    };
    await dynamodb.put(dbParams).promise();
    console.log(`Saved resume data for ${key} into DynamoDB`);

  } catch (err) {
    console.error("Error processing file:", err);
    throw err;
  }

  return { status: "done" };
};
