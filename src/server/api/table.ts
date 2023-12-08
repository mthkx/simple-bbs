import { DynamoDBClient, CreateTableCommand } from "@aws-sdk/client-dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

const dbClient = new DynamoDBClient();

export default defineEventHandler(async () => {
  try {
    const command = new CreateTableCommand({
      TableName: "simple-bbs", // テーブル名
      KeySchema: [
        { AttributeName: "id", KeyType: "HASH" }, // パーティションキー
      ],
      AttributeDefinitions: [
        { AttributeName: "id", AttributeType: "N" }, // 文字列属性
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 2,
        WriteCapacityUnits: 2,
      },
    });
    const output = await dbClient.send(command);

    const command2 = new CreateTableCommand({
      TableName: "atomic-counter", // テーブル名
      KeySchema: [
        { AttributeName: "tableName", KeyType: "HASH" }, // パーティションキー
      ],
      AttributeDefinitions: [
        { AttributeName: "tableName", AttributeType: "S" }, // 文字列属性
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    });
    const output2 = await dbClient.send(command2);

    const param = {
      TableName: "atomic-counter",
      Item: {
        tableName: "simple-bbs",
        seq: 0,
      },
    };
    await dbClient.send(new PutCommand(param));

    return {
      "SUCCESS: Table created": output,
      "SUCCESS2: Table created": output2,
    };
  } catch (err) {
    return { ERROR: err };
  }
});
