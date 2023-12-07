<script setup lang="ts">
import { postSchema, type Post } from "@/schemas/schemas";

// フォームにバインドするオブジェクト
const formData = ref({
  name: "",
  title: "",
  message: "",
  emoji: undefined,
});

// 投稿後のメッセージ
const result = ref("");

// 全ての投稿の配列
const posts = ref<Post[]>();

const errorMsg =
  ref<Partial<{ [K in keyof typeof formData.value]: string[] | undefined }>>();

// APIと通信して投稿一覧を更新する関数
async function fetchIndex() {
  const { data: fetchedPosts } = await useFetch<Post[]>("/api/fetchIndex", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (isRef<Post[]>(fetchedPosts)) posts.value = fetchedPosts.value;
}

// APIにフォームデータをポストする関数
async function onSubmit() {
  errorMsg.value = undefined;
  // 空文字列をundefinedに変換
  if (formData.value.emoji === "") formData.value.emoji = undefined;

  // バリデーション
  const parsedData = postSchema.safeParse(formData.value);

  // バリデーションが通った場合
  if (parsedData.success) {
    const { data: responce } = await useFetch("/api/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: parsedData.data,
    });

    if (responce.value?.ok) {
      result.value = "送信しました";
      await fetchIndex();
    } else {
      result.value = "エラーが発生しました";
    }
  } else {
    // 失敗した場合エラーを表示する
    errorMsg.value = parsedData.error.flatten().fieldErrors;
  }
  // 5秒後にメッセージを消去
  setTimeout(() => {
    result.value = "";
  }, 3000);
}

// 初期表示
await fetchIndex();
</script>

<template>
  <main class="container w-50">
    <h1 class="my-5">BBS</h1>
    <div class="my-5">
      <div class="mb-3">
        <label for="name" class="form-label"
          >お名前（10字以内）<span class="badge text-bg-danger mx-2"
            >必須</span
          ></label
        >
        <input
          id="name"
          v-model="formData.name"
          type="text"
          class="form-control"
        />
        <p v-if="errorMsg?.name" class="text-danger">
          {{ errorMsg.name.toString() }}
        </p>
      </div>
      <div class="mb-3">
        <label for="title" class="form-label"
          >タイトル（30字以内）<span class="badge text-bg-danger mx-2"
            >必須</span
          ></label
        >
        <input
          id="title"
          v-model="formData.title"
          type="text"
          class="form-control"
        />
        <p v-if="errorMsg?.title" class="text-danger">
          {{ errorMsg.title.toString() }}
        </p>
      </div>
      <div class="mb-3">
        <label for="message" class="form-label"
          >メッセージ（200字以内）<span class="badge text-bg-danger mx-2"
            >必須</span
          ></label
        >
        <textarea
          id="message"
          v-model="formData.message"
          class="form-control"
        ></textarea>
        <p v-if="errorMsg?.message" class="text-danger">
          {{ errorMsg.message.toString() }}
        </p>
      </div>
      <div class="mb-3">
        <label for="emoji" class="form-label">好きな絵文字</label>
        <input
          id="emoji"
          v-model="formData.emoji"
          type="text"
          class="form-control w-15"
        />
        <p v-if="errorMsg?.emoji" class="text-danger">
          {{ errorMsg.emoji.toString() }}
        </p>
      </div>
      <button class="btn btn-primary" @click="onSubmit">Submit</button>
      <div v-if="result">
        <p class="text-success">{{ result }}</p>
      </div>
    </div>
    <h2>投稿一覧</h2>
    <p v-if="!posts?.length" class="my-5">投稿がありません</p>
    <table v-else class="table">
      <thead>
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Title</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="post in posts" :key="post.id">
          <th scope="row">{{ post.id }}</th>
          <td>
            <NuxtLink :to="'/' + post.id">{{ post.title }}</NuxtLink>
          </td>
        </tr>
      </tbody>
    </table>
  </main>
</template>
