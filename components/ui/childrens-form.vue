<template>
  <div class="childrens-form">
    <div>
      <label class="mnz-input childrens-form__count">
        <div class="label">Nombres d'enfants</div>
        <input v-model="childrenNumber" type="number" @input="handlergenerateChildrens">
      </label>
    </div>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, ref } from 'vue'

export type Childrens = {
  age?: number;
  salary?: number;
};

const emits = defineEmits<{(e: 'update:childrens', value: Childrens): void}>()

const props = defineProps<{
  childrens: Childrens[];
}>()

const childrenNumber = ref<number>(0)

const childs = reactive<Childrens[]>(props.childrens)

function handlergenerateChildrens (event: Event) {
  const childsSave = childs.filter(item => item.age)
  childs.splice(0)
  const target = event.target as HTMLInputElement
  if (target.value) {
    for (let i = 0; i < +target.value; i++) {
      childs.push(childsSave[i] || { age: undefined })
    }
  }
}

watch(childs, (newValue: Childrens) => {
  emits('update:childrens', newValue)
})

</script>

<style scoped lang="scss">

.childrens-form {

  margin-top: 40px;

  &__count {
    width: 265px;
  }

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
