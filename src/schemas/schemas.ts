import { z } from "zod";

const messages = {
  min: "必須項目です",
  max: "文字数が多すぎます",
  emoji: "絵文字を入力してください",
};

export const postSchema = z.object({
  name: z
    .string()
    .min(1, { message: messages.min })
    .max(10, { message: messages.max }),
  title: z
    .string()
    .min(1, { message: messages.min })
    .max(30, { message: messages.max }),
  message: z
    .string()
    .min(1, { message: messages.min })
    .max(200, { message: messages.max }),
  emoji: z
    .string()
    .emoji({ message: messages.emoji })
    .max(2, { message: messages.max })
    .optional(),
});

export type Post = z.infer<typeof postSchema>;
