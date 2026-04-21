<template>
  <select :value="modelValue" @change="changeOption">
    <option disabled value="">Выберите</option>
    <option
    v-for="option in options"
    :key="option.value"
    :value="option.value"
    >
        {{option.name}}
    </option>
  </select>
</template>

<script setup>
defineOptions({ name: "my-select"})
defineProps({ 
  modelValue: { type: String },
  options: {
    type: Array,
    default: () => []
  }
})

//эмиты
const emit = defineEmits(["update:ModelValue"])

//обработчик выбора
const changeOption = (event) => {
  console.log(event)
  emit('update:modelValue', event.target.value)
}

/*export default {
  name: 'my-select',
  props: {
    modelValue: {
        type: String
    },
    options: {
        type: Array,
        default: () => []
    }
  },
  methods: {
        changeOption(event) {
            console.log(event)
            this.$emit('update:modelValue', event.target.value);
        }
    }
}*/
</script>

<style scoped>

</style>