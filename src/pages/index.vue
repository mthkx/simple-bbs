<script setup lang="ts">
// フォームにバインドするオブジェクト
const formData = ref({
  name: "",
  title: "",
  message: "",
  emoji: "",
});
type Posts = (typeof formData.value & { id: number; createdAt: string })[];

// 投稿後のメッセージ
const result = ref("");

// 全ての投稿の配列
const posts = ref<Posts>();

// APIと通信して投稿一覧を更新する関数
async function fetchIndex() {
  const { data: fetchedPosts } = await useFetch<Posts>("/api/postIndex", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (isRef<Posts>(fetchedPosts)) posts.value = fetchedPosts.value;
}

// APIにポストする関数
async function onSubmit() {
  const { data: responce } = await useFetch("/api/regist", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: formData,
  });

  if (responce.value?.ok) {
    result.value = "送信しました";
    await fetchIndex();
  } else {
    result.value = "エラーが発生しました";
  }
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
        <label for="name" class="form-label">お名前</label>
        <input
          id="name"
          v-model="formData.name"
          type="text"
          class="form-control"
        />
      </div>
      <div class="mb-3">
        <label for="title" class="form-label">タイトル</label>
        <input
          id="title"
          v-model="formData.title"
          type="text"
          class="form-control"
        />
      </div>
      <div class="mb-3">
        <label for="message" class="form-label">メッセージ</label>
        <textarea
          id="message"
          v-model="formData.message"
          class="form-control"
        ></textarea>
      </div>
      <div class="mb-3">
        <label for="emoji" class="form-label">好きな絵文字</label>
        <input
          id="emoji"
          v-model="formData.emoji"
          type="text"
          class="form-control w-15"
        />
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

<style>
@import url(https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css);
</style>
