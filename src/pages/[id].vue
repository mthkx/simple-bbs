<script setup lang="ts">
import { postSchema, type Post } from "@/schemas/schemas";

type FetchedPost = Post & { id: number; createdAt: string };
const route = useRoute();

// 投稿をフェッチする
const { data: post } = await useFetch<FetchedPost>("/api/show", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: route.params,
});
</script>

<template>
  <main v-if="post" class="w-50 m-5 mx-auto">
    <h2 class="my-5">投稿詳細</h2>
    <p v-if="post.emoji" class="my-3 fs-1 text-center">{{ post.emoji }}</p>
    <h3>{{ post.title }}</h3>
    <p>{{ post.name }}</p>
    <p>{{ post.createdAt }}</p>
    <p class="my-5">{{ post.message }}</p>
    <NuxtLink to="/">戻る</NuxtLink>
  </main>
  <p v-else>指定された投稿が見つかりませんでした</p>
</template>
