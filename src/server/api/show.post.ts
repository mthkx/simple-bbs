import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const tableName = "simple-bbs";
// DynamoDBクライアントの設定
const dbClient = new DynamoDBClient();
const documentClient = DynamoDBDocumentClient.from(dbClient);

export default defineEventHandler(async (e) => {
  // POSTされたデータを取得
  const body = await readBody(e);

  // クエリを送り、レスポンスを取得
  const command = new QueryCommand({
    TableName: tableName,
    ExpressionAttributeValues: {
      ":id": Number(body.id),
    },
    KeyConditionExpression: "id = :id",
  });
  const { Items } = await documentClient.send(command);

  return Items?.[0];
});
