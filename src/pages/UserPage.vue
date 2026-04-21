<template>
    <div>
        <h1>Страница с постами</h1>
        <my-input
            v-model="searchQuery"
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
                v-model = "selectedSort"
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
        <div ref="observer" class="observer"></div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted} from "vue";
import PostForm from "@/components/PostForm.vue";
import PostList from "@/components/PostList.vue";
import MyButton from "@/components/UI/MyButton.vue";
import MySelect from '@/components/UI/MySelect.vue';
import axios from 'axios';

//Реактивно состояние (Аналог data)
const posts = ref([])
const dialogVisible =  ref(false)
const isPostsLoading = ref(false)
const selectedSort = ref('')
const searchQuery = ref('')
const page = ref(1)
const limit = ref(10)
const totalPages =  ref(0)
const sortOptions = [
    {value: 'title', name: 'По названию'},
    {value: 'body', name: 'По содержимому'},
]

// Вычисляемые свойства(аналог computed)
const soretedPosts = computed(() => {
    return [...posts.value].sort((a, b) =>
        a[selectedSort.value]?.lockalCompare(b[selectedSort.value])
    )
})

const sortedAndSearchedPosts = computed(() => {
    return sortedPosts.value.filter(post => 
        post.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
})

// Методы
const createPost = (post) => {
    posts.value.push(post)
    dialogVisible.value = false
}

const removePost = (post) => {
    posts.value = posts.value.filter(p => p.id !== post.id)
}

const showDialog = () => {
    dialogVisible.value = true
}

const fetchPosts = async () => {
    try {
        isPostsLoading.value = true;
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts?', {
            params: {
                _page: page.value,
                _limit: limit.value
            }
        })
        totalPages.value = Math.ceil(response.headers['x-total-count'] / limit.value)
        posts.value = response.data;
    } catch (e) {
        alert('Ошибка')
    } finally {
        isPostsLoading.value = false;
    }
}

const loadMorePosts = async () => {
    try {
        page.value += 1
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts', {
            params: {
                _page: page.value,
                _limit: limit.value
            }
        })
        const totalCount = response.headers['x-total-count'] 
            ? parseInt(response.headers['x-total-count']) 
            : 100
        totalPages.value = Math.ceil(totalCount / limit.value)
        posts.value = [...posts.value, ...response.data]
    } catch (e) {
        console.error('Ошибка загрузки:', e)
        alert('Ошибка')
    }
}

//Observer
const observerTarget = ref(null)  // ref для DOM-элемента

onMounted(() => {
    // Загрузка первой страницы
    fetchPosts()
    
    // Настройка наблюдателя
    const callback = (entries) => {
        if (entries[0].isIntersecting && page.value < totalPages.value) {
            loadMorePosts()
        }
    }
    
    const observer = new IntersectionObserver(callback, {
        rootMargin: '0px',
        threshold: 1.0
    })
    
    // Подключаем наблюдатель к элементу
    if (observerTarget.value) {
        observer.observe(observerTarget.value)
    }
})

/*export default{
    components: {
        PostList, PostForm, MySelect  
    },
    data() {
        return {
            posts: [],
            dialogVisible: false,
            isPostsLoading: false,
            selectedSort: '',
            searchQuery: '',
            page: 1,
            limit: 10,
            totalPages: 0,
            sortOptions: [
                {value: 'title', name: 'По названию'},
                {value: 'body', name: 'По содержимому'},
            ]
        }
    },
    methods: {
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
        async fetchPosts() {
            try {
                this.isPostsLoading = true;
                const response = await axios.get('https://jsonplaceholder.typicode.com/posts?', {
                    params: {
                        _page: this.page,
                        _limit: this.limit
                    }
                });
                this.totalPages = Math.ceil(response.headers['x-total-count'] / this.limit)
                this.posts = response.data;
            } catch (e) {
                alert('Ошибка')
            } finally {
                this.isPostsLoading = false;
            }
        },
        async loadMorePosts() {
            try {
                this.page += 1
                const response = await axios.get('https://jsonplaceholder.typicode.com/posts?', {
                    params: {
                        _page: this.page,
                        _limit: this.limit
                    }
                });
                this.totalPages = Math.ceil(response.headers['x-total-count'] / this.limit)
                this.posts = [...this.posts, ...response.data];
            } catch (e) {
                alert('Ошибка')
            }
        }
    },
    mounted() {
        this.fetchPosts();
        console.log(this.$refs.observer);
        const options = {
            rootMargin: '0px',
            threshold: 1.0
        }
        const callback = (entries, observer) => {
            if (entries[0].isIntersecting && this.page < this.totalPages) {
                this.loadMorePosts()
            }
        };
        const observer = new IntersectionObserver(callback, options);
        observer.observe(this.$refs.observer);
    },
    computed: {
        sortedPosts() {
            return [...this.posts].sort((post1, post2) => post1[this.selectedSort]?.localeCompare(post2[this.selectedSort]))
        },
        sortedAndSearchedPosts() {
            return this.sortedPosts.filter(post => post.title.toLowerCase().includes(this.searchQuery.toLowerCase()))
        }
    },
    watch: {

    }
}*/
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
