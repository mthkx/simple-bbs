import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  UpdateCommand,
  PutCommand,
  UpdateCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { postSchema } from "~/schemas/schemas";

const tableName = "simple-bbs";
// DynamoDBクライアントの設定
const dbClient = new DynamoDBClient();
const documentClient = DynamoDBDocumentClient.from(dbClient);

// カウンタの数値を+1して新しい数値を取得する
async function updateSeq() {
  const command = new UpdateCommand({
    TableName: "atomic-counter",
    Key: {
      tableName,
    },
    UpdateExpression: "set seq = seq + :val",
    ExpressionAttributeValues: {
      ":val": 1,
    },
    ReturnValues: "UPDATED_NEW",
  } as UpdateCommandInput);
  const output = await documentClient.send(command);
  return output.Attributes?.seq;
}

export default defineEventHandler(async (e) => {
  try {
    // Postされたデータを読み取る
    const body = await readValidatedBody(e, postSchema.parse);

    // タイムスタンプを取得
    const nowDate = new Date();
    const createdAt = nowDate.toISOString();

    // IDを取得
    const nextSeq = await updateSeq();

    const item = {
      id: nextSeq,
      name: body.name,
      title: body.title,
      message: body.message,
      emoji: body.emoji,
      createdAt,
    };
    if (!item.emoji) delete item.emoji;

    // アイテムのコマンドを設定して挿入
    const param = {
      TableName: tableName,
      Item: item,
    };
    await documentClient.send(new PutCommand(param));

    return { ok: true };
  } catch (err) {
    console.log(err);
  }
});
