<template>
    <input :value="modelValue" @input="updateInput" class="input" type="text">
</template>

<script setup>
defineOptions({
    name: "my-input"
})

const props = defineProps({ modelValue: [String, Number] })

const emit = defineEmits(['update:modelValue'])

const updateInput = (event) => {
    emit('update:modelValue', event.target.value)
}

/*export default {
    name: 'my-input',
    props: {
        modelValue: [String, Number]
    },
    methods: {
        updateInput(event) {
            this.$emit('update:modelValue', event.target.value)
        }
    }
}*/
</script>

<style scoped>
.input {
    width: 100%;
    border: 1px solid teal; 
    padding: 10px 15px;
    margin-top: 15px;
}
</style>