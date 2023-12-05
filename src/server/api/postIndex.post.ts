import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  ScanCommandInput,
} from "@aws-sdk/lib-dynamodb";

const tableName = "simple-bbs";

// DynamoDBクライアントの設定
const dbClient = new DynamoDBClient();
const documentClient = DynamoDBDocumentClient.from(dbClient);

export default defineEventHandler(async () => {
  try {
    const command = new ScanCommand({
      TableName: tableName,
    } as ScanCommandInput);
    const { Items } = await documentClient.send(command);

    // IDで投稿をソート
    Items?.sort((a, b) => b.id - a.id);

    return Items;
  } catch (err) {
    console.log("ERROR:", err);
  }
});
