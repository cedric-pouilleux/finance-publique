<template>
  <div class="salary-form">
    <div class="salary-form__salary">
      <label class="mnz-input">
        <div class="label">Salaire 1</div>
        <input v-model="resources.salaries[0]" type="number">
        <div class="unit">€ net/an</div>
      </label>
      <label v-if="!props.isolate" class="mnz-input">
        <div class="label">Salaire 2</div>
        <input v-model="resources.salaries[1]" type="number">
        <div class="unit">€ net/an</div>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRef, watch } from 'vue'

const props = defineProps<{
  salaries: number[];
  isolate: boolean;
}>()

const emits = defineEmits<{(e: 'update:salaries', value: number[]): void }>()

const resources = reactive({
  salaries: props.salaries || [12000, 12000],
  isolate: toRef(props, 'isolate')
})

watch(resources, () => {
  const firstSalary = resources.salaries[0]
  const salaries = [firstSalary]
  if (!props.isolate) {
    salaries.push(resources.salaries[1])
  }
  emits('update:salaries', salaries)
})
</script>

<style scoped lang="scss">
.salary-form {
  &__salary {
    display: flex;
    flex-wrap: wrap;
  }
}

@media screen and (max-width:1280px){
  .salary-form {
    &-infos {
      padding: 0;
    }
  }
}
</style>
