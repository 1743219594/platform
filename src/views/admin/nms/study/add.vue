<template>
  <article-detail :is-edit="false"></article-detail>
</template>

<script>
import ArticleDetail from "./components/ArticleDetail";
export default {
  name: "addArticle",
  components: { ArticleDetail },
};
</script>

<style>
</style>