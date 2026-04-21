<template>
    <button
        class="btn"
    >
        <slot></slot>
    </button>
</template>

<script setup>
defineOptions({
    name: "my-button"
})
/*export default {
    name: 'my-button'
}*/
</script>

<style scoped>
.btn {
    margin: 15px 0;
    padding: 10px 15px;
    background: none;
    color: teal;
    border: 1px solid teal;
}
</style>