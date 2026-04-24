// src/stores/useFavoritesStore.js
import { defineStore } from 'pinia'


export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    favorites: [],  // массив избранных постов
    loading: false, // флаг загрузки
    error: null // ошибка(если есть)
  }),
  getters: {
    hasFavorites: (state) => state.favorites.length > 0,
    // можно добавить другие геттеры
  },
  actions: {
    // 1. Загрузка избранного (асинхронная)
    async loadFavorites() {
      this.loading = true
      this.error = null
      try {
          const stored = localStorage.getItem('favorites')
          const parsed = stored ? JSON.parse(stored) : []
          
          // ✅ Очищаем и заполняем существующий массив
          this.favorites.splice(0, this.favorites.length)
          parsed.forEach(post => this.favorites.push(post))
      } catch(err) {
          this.error = 'Ошибка загрузки избранного'
          console.error(err)  // ✅ Было console.errror
      } finally {
          this.loading = false
      }
  },
    // 2. Сохранение избранного (приватный метод, вызывается после каждого изменения) 
    async saveFavorites() {
      try {
        //Сохранение в localStorage
        localStorage.setItem('favorites', JSON.stringify(this.favorites))
      }  
      catch(err) {
        this.error = 'Ошибка сохранения избранного'
      }
    },
    // 3. Добавление поста (синхронное изменение + асинхронное сохранение)
    async addToFavorites(post) {
      // проверяем, нет ли уже такого поста в избранном
      if (!this.favorites.some(p => p.id === post.id)) {
        this.favorites.push(post)
        await this.saveFavorites()
      }
    },
    // 4. Удаление поста
    async removeFromFavorites(postId) {
      this.favorites = this.favorites.filter(p => p.id !== postId)
      await this.saveFavorites()
    },
    // 5. Переключение статуса
    async toggleFavorite(post) {
      const exists = this.favorites.some(p => p.id === post.id)
      if (exists) {
        await this.removeFromFavorites(post.id)
      } else {
        await this.addToFavorites(post)
      }
    }
  }
})