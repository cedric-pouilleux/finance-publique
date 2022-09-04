<template>
  <div class="family-allowance-details">
    <div class="family-allowance-details__title">
      <h3>{{ label }}</h3>
      <div class="separator" />
      <p class="family-allowance-details__title-right">
        <span class="price">{{ displaySum }}</span>
        <button class="icon-btn" :class="{ open: open }" @click="open = !open">
          <solid-chevron-down-icon v-if="!open" />
          <solid-chevron-up-icon v-else />
        </button>
      </p>
    </div>
    <div v-if="open" class="family-allowance-details__messages">
      <ol>
        <li
          v-for="(msg, index) in data.resume.value"
          :key="`${index}_messages_family_allowance`"
        >
          {{ msg }}
        </li>
      </ol>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { FamilyReturn } from '@/types'

const props = defineProps<{
  label: string;
  data: FamilyReturn;
  perYear?: boolean;
}>()

const open = ref<boolean>(false)

const displaySum = computed(() => {
  return props.data.sum.value > 0
    ? `${props.data.sum.value}€ ${props.perYear ? '/ ans' : ' / mois'}`
    : 'Non éligible'
})
</script>

<style scoped lang="scss">
.icon-btn {
  width: 35px;
  height: 25px;
  color: #333;
  background-color: #fff;
  border: 2px solid #ccc;
}

h3 {
  white-space: nowrap;
}
.separator {
  height: 2px;
  width: 100%;
  margin: 0 12px;
  background-color: #ebebeb;
}

.family-allowance-details {
  &__title {
    display: flex;
    justify-content: space-between;
    padding: 4px 8px;
    font-size: 0.9em;
    border-radius: 8px;
    align-items: center;

    &-right {
      display: flex;
      white-space: nowrap;
    }

    .price,
    button.details {
      color: #fff;
      padding: 1px 10px;
      margin: 0 4px;
      border-radius: 4px;
      &.open {
      }
    }

    .price {
      color: green;
    }
  }

  ol {
    font-size: 0.9em;
    text-align: left;
    list-style-type: circle;
  }
}

@media screen and (max-width:1280px) {
  .family-allowance-details {
    &__title {
      padding: 0 8px;
      display: block;

      .separator {
        display: none;
      }

      .price {
        padding: 0;
        margin: 0;
      }

      &-right {
        justify-content: space-between;
      }

      h3 {
        font-size: 1.2em;
        padding: 0;
        margin: 2px 0;
      }
    }
  }
}
</style>
