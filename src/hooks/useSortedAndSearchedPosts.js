import { ref, computed } from 'vue';

export function useSortedAndSearchedPosts(sortedPosts) {
    const searchQuery = ref('');

    const sortedAndSearchedPosts = computed(() => {
        const query = searchQuery.value.toLowerCase();
        return sortedPosts.value.filter(post =>
            post.title.toLowerCase().includes(query)
        );
    });

    return { searchQuery, sortedAndSearchedPosts };
}