import axios from "axios";
import {onMounted, ref} from 'vue';

export function usePosts(limit) {
    const posts = ref([])
    const page = ref(1)
    const totalPages = ref(0)
    const isPostsLoadings = ref(true)
    const fetching = async () => {
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
            isPostsLoadings.value = false;
        }        
    }

    onMounted(fetching)
    return{
        posts, page, isPostsLoadings, totalPages, fetching
    }
}