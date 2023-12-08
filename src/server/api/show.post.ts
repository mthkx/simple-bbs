import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const runtimeConfig = useRuntimeConfig();
const tableName = "simple-bbs";

// DynamoDBクライアントの設定
const dbClient = new DynamoDBClient({
  endpoint: runtimeConfig.awsEndpointUrlDynamodb,
  credentials: {
    accessKeyId: runtimeConfig.awsAccessKeyId,
    secretAccessKey: runtimeConfig.awsSecretAccessKey,
  },
});
const documentClient = DynamoDBDocumentClient.from(dbClient);

export default defineEventHandler(async (e) => {
  try {
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
  } catch (err) {
    console.log(err);
  }
});
