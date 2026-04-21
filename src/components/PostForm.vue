<template>
    <form @submit.prevent>
        <h4>Создание поста</h4>
        <my-input
            v-focus
            v-model="post.title"
            type="text"
            placeholder="Название"
        />
        <my-input
            v-model="post.body"
            type="text"
            placeholder="Описание"
        />
        <my-button
            style="align-self: flex-end"
            @click="createPost"
        >
            Создать
        </my-button>
    </form>
</template>

<script setup>
import { ref } from 'vue'

// Определяем эмиты
const emit = defineEmits(['create'])

// Реактивное состояние
const post = ref({
    title: '',
    body: ''
})

// Метод создания поста
const createPost = () => {
    post.value.id = Date.now();

    emit('create', {...post.value})

    post.value = {
        title: '',
        body: ''        
    }
}

/*export default {
    data() {
        return {
            post: {
                title: '',
                body: ''
            }
        }
    },
    methods: {
        createPost() {
            this.post.id = Date.now();
            this.$emit('create', this.post)
            this.post = {
                title: '',
                body: ''
            }
        }
    }
}*/
</script>

<style>
form {
    display: flex;
    flex-direction: column;
}
</style>
