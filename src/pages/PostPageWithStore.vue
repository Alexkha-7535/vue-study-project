<template>
    <div>
        <h1>Страница с постами</h1>
        <my-input
            :model-value="searchQuery"
            @update:model-value="setSearchQuery"
            placeholder="Поиск..."
            v-focus
        />
        <div class="app__btns">
            <my-button
            @click="showDialog"
            >
                Создать пост
            </my-button>
            <my-select 
                :model-value="selectedSort"
                @update:model-value="setSelectedSort"
                :options="sortOptions"
            />
        </div>
        <my-dialog v-model:show="dialogVisible">
            <post-form
                @create="createPost"
            /> 
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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
import PostForm from "@/components/PostForm.vue";
import PostList from "@/components/PostList.vue";
import MyButton from "@/components/UI/MyButton.vue";
import MySelect from '@/components/UI/MySelect.vue';
/*import {mapState, mapGetters, mapActions, mapMutations} from 'vuex'*/
import axios from 'axios';

const store = useStore()

const observer = ref(null)
const observerTarget = ref(null)

// Локальное состояние (было в data)
const dialogVisible = ref(false)

// Вычисляемые свойства из Store (Заменяют mapState и mapGetters)
const posts = computed(() => store.state.post.posts)
const isPostsLoading = computed(() => store.state.post.isPostsLoading)
const selectedSort = computed(() => store.state.post.selectedSort)
const searchQuery = computed(() => store.state.post.searchQuery)
const page = computed(() => store.state.post.page)
const limit = computed(() => store.state.post.limit)
const totalPages = computed(() => store.state.post.totalPages)
const sortOptions = computed(() => store.state.post.sortOptions)

// Геттеры
const sortedAndSearchedPosts = computed(() => store.getters['post/sortedAndSearchedPosts'])

// Методы (Заменяют mapActions и mapMutations)
const setSearchQuery = (value) => store.commit('post/setSearchQuery', value)
const setSelectedSort = (value) => store.commit('post/setSelectedSort', value)
const setPage = (value) => store.commit('post/setPage', value) // если понадобится
const fetchPosts = () => store.dispatch('post/fetchPosts')
const loadMorePosts = () => store.dispatch('post/loadMorePosts')

// Локальные методы (были в methods)
const createPost = (post) =>{
    store.dispatch('post/createPost', post)
    dialogVisible = false
}
const removePost = (post) =>{
    store.dispatch('post/removePost', post.id)
}
const showDialog = () => {
    dialogVisible.value = true
}

// Хуки жизненного цикла (заменяют mounted и beforeUnmount)
onMounted(() => {
    fetchPosts()
    const callback = (entries) => {
        if (entries[0].isIntersecting && page.value < totalPages.value && !isPostsLoading.value) {
            loadMorePosts()
        }
    }
    observer.value = new IntersectionObserver(callback, { rootMargin: '0px', threshold: 1.0 })
    const target = observer.value
    if (observerTarget.value) {
        observer.value.observe(observerTarget.value)
    }
})

onBeforeUnmount(() => {
    if (observer.value) {
        observer.value.disconnect()
    }
})

/* export default{
    components: {
        PostList, PostForm, MySelect  
    },
    data() {
        return {
            dialogVisible: false,
        }
    },
    methods: {
        ...mapMutations({
            setPage: 'post/setPage',
            setSearchQuery: 'post/setSearchQuery',
            setSelectedSort: 'post/setSelectedSort'
        }),
        ...mapActions({
            fetchPosts: 'post/fetchPosts',
            loadMorePosts: 'post/loadMorePosts'
        }),
        createPost(post) {
            this.posts.push(post);
            this.dialogVisible = false;
        },
        removePost(post) {
            this.posts = this.posts.filter(p => p.id !== post.id);
        },
        showDialog() {
            this.dialogVisible = true;
        },

    },
    mounted() {
        this.fetchPosts();
        const callback = (entries) => {
            if (entries[0].isIntersecting && this.page < this.totalPages && !this.isPostsLoading) {
                this.loadMorePosts();
            }
        };
        const observer = new IntersectionObserver(callback, { rootMargin: '0px', threshold: 1.0 });
        observer.observe(this.$refs.observer);
        this._observer = observer;
},
beforeUnmount() {
    if (this._observer) this._observer.disconnect();
    },
    computed: {
        ...mapState({
            posts: state => state.post.posts,
            isPostsLoading: state => state.post.isPostsLoading,
            selectedSort: state => state.post.selectedSort,
            searchQuery: state => state.post.searchQuery,
            page: state => state.post.page,
            limit: state => state.post.limit,
            totalPages: state => state.post.totalPages,
            sortOptions: state => state.post.sortOptions   
        }),
        ...mapGetters({
            sortedPosts: 'post/sortedPosts',
            sortedAndSearchedPosts: 'post/sortedAndSearchedPosts'
        })
    }

} */
</script>

<style>
.app__btns  {
    display: flex;
    justify-content: space-between;
    margin: 15px 0;
}

.page__wrapper {
    display: flex;
    margin-top: 15px;
}

.page {
    border: 1px solid black;
    padding: 10px;
}

.current-page {
    border: 2px solid teal;
}

.observer {
    height: 30px;
    background: green;
}
</style>
