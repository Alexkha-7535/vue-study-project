import axios from "axios";
import {onMounted, ref} from 'vue';

export function usePosts(limit) {
    const posts = ref([])
    const page = ref(1)
    const totalPages = ref(0)
    const isPostsLoading = ref(false)
    const fetching = async () => {
        isPostsLoading.value = true
        try {
            const response = await axios.get('https://jsonplaceholder.typicode.com/posts?', {
                params: {
                    _page: page.value,
                    _limit: limit
                }
            });
            totalPages.value = Math.ceil(response.headers['x-total-count'] / limit)
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
                _limit: limit
            }
        })

        const totalCount = response.headers['x-total-count'] || 100
        totalPages.value = Math.ceil(totalCount / limit)

        posts.value = [...posts.value, ...response.data]
    } catch (e) {
        console.error('Ошибка загрузки:', e)
        alert('Ошибка')
    }
}
const addPost = (post) => posts.value.unshift(post)
const removePost = (id) => posts.value = posts.value.filter(p => p.id !== id)
    
    return{
        posts, page, isPostsLoading, totalPages, fetching, loadMorePosts, addPost, removePost
    }
}