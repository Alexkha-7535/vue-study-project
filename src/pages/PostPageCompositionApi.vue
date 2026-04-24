<template>
    <div>
        <h1>Страница с постами</h1>
        
        <my-input
            v-model="searchQuery"
            placeholder="Поиск..."
            v-focus
        />
        
        <div class="app__btns">
            <my-button @click="showDialog">
                Создать пост
            </my-button>
            
            <my-select
                v-model="selectedSort"
                :options="sortOptions"
            />
        </div>
        
        <my-dialog v-model:show="dialogVisible">
            <post-form @create="createPost" /> 
        </my-dialog>
        
        <post-list
            :posts="sortedAndSearchedPosts"
            @remove="removePost"
            v-if="!isPostsLoading"
        />
        <div v-else>Идёт загрузка...</div>
        
        <div ref="observerTarget" class="observer"></div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import PostForm from "@/components/PostForm.vue"
import PostList from "@/components/PostList.vue"
import MyButton from "@/components/UI/MyButton.vue"
import MySelect from '@/components/UI/MySelect.vue'

import { usePosts } from '@/hooks/usePosts.js'
import { useSortedPosts } from '@/hooks/useSortedPosts.js'
import { useSortedAndSearchedPosts } from '@/hooks/useSortedAndSearchedPosts.js'

// Локальное состояние
const dialogVisible = ref(false)

// Вызов хуков
const { 
    posts, 
    totalPages, 
    isPostsLoading,
    page,
    loadMorePosts,
    addPost,
    removePostFromStore,
    fetching,
} = usePosts(10)

// Если sortOptions нет в хуке — оставляем локально
const sortOptions = [
    { value: 'title', name: 'По названию' },
    { value: 'body', name: 'По содержимому' },
]

const { sortedPosts, selectedSort } = useSortedPosts(posts)
const { searchQuery, sortedAndSearchedPosts } = useSortedAndSearchedPosts(sortedPosts)

onMounted(() => {
    fetching()
})

// Обработчики событий
const showDialog = () => {
    dialogVisible.value = true
}

const createPost = (post) => {
    addPost?.(post)
    dialogVisible.value = false
}

const removePost = (post) => {
    removePostFromStore?.(post.id)
}

// IntersectionObserver
const observerTarget = ref(null)
const observer = ref(null)

onMounted(() => {
    const callback = (entries) => {
        if (entries[0].isIntersecting && 
            page.value < totalPages.value && 
            !isPostsLoading.value) {
            loadMorePosts?.()
        }
    }
    
    observer.value = new IntersectionObserver(callback, {
        rootMargin: '100px',
        threshold: 0.1
    })
    
    if (observerTarget.value) {
        observer.value.observe(observerTarget.value)
    }
})

onBeforeUnmount(() => {
    if (observer.value) {
        observer.value.disconnect()
        observer.value = null
    }
})
</script>

<style>
.app__btns {
    display: flex;
    justify-content: space-between;
    margin: 15px 0;
}
.observer {
    height: 30px;
    background: green;
}
</style>