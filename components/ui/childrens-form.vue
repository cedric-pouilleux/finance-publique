<template>
  <div class="childrens-form">
    <div class="childrens-form__inner">
      <div v-for="(child, index) in childs" :key="index+'_childrens-form'" class="childrens-form__input">
        <div class="childrens-form__input-combi mnz-input">
          <input
            v-model="child.age"
            type="number"
            class="age"
            placeholder="Age"
            :min="0"
            :max="21"
            @keydown.backspace="listen($event, index)"
          >
          <input
            v-if="child.age > 14"
            v-model="child.salary"
            type="number"
            class="salary"
            placeholder="Salaire"
            :min="0"
          >
          <span v-if="child.age > 14" class="unit"> € net/an </span>
        </div>
      </div>
      <button @click="childs.push({ age: null })">
        Ajouter
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import { Childrens } from '../../types'

const emits = defineEmits<{(e: 'update:childrens', value: Childrens): void}>()

const props = defineProps<{
  childrens: Childrens[];
}>()

const childs = reactive<Childrens[]>(props.childrens)

function listen (key: Event, index: number) {
  const elem = key.target as HTMLInputElement
  if (!elem.value) { childs.splice(index, 1) }
}

watch(childs, (newValue: Childrens) => {
  emits('update:childrens', newValue)
})

</script>

<style scoped lang="scss">
.childrens-form {
  &__inner {
    display: flex;
    width: auto;
    flex-wrap: wrap;
    button {
      margin: 8px;
      padding: 0 14px;
      color: #fff;
      background-color: #333;
      border: 2px solid #000;
      height: 47px;
    }
    input {
      width: 40px;
      border: 0;
      border-radius: 8px;
    }
  }

  &__input-combi {
    margin: 8px;
    border: 2px solid #ccc;
    border-radius: 8px;

    &.mnz-input {
      width: auto;
    }

    input.salary {
      width: 65px;
    }
  }

  &__input {
    display: flex;
    flex-direction: column;
  }
}
</style>
