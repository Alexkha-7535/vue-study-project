<template>
  <div class="container">
    <h1>Избранные посты</h1>
    <div v-if="!hasFavorites" class="alert alert-info">
      Нет избранных постов
    </div>
    <div v-else class="row">
      <div v-for="post in favorites" :key="post.id" class="col-md-6 col-lg-4 mb-4">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">{{ post.title }}</h5>
            <p class="card-text">{{ post.body }}</p>
            <button class="btn btn-danger btn-sm" @click="removeFromFavorites(post.id)">
              Удалить из избранного
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useFavoritesStore } from '@/PiniaStore/useFavoritesStore'
import { mapState, mapGetters, mapActions } from 'pinia'

export default {
  computed: {
    ...mapState(useFavoritesStore, ['favorites']),
    ...mapGetters(useFavoritesStore, ['hasFavorites']),
  },
  methods: {
    ...mapActions(useFavoritesStore, ['removeFromFavorites']),
  },
}
</script>