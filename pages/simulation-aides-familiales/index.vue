<template>
  <div>
    <div class="container">
      <div class="grid-left">
        <h1 class="column-title">
          Votre foyé
        </h1>
        <div class="grid-wrapper">
          <header class="grid-wrapper__header">
            <h2>Vos ressources</h2>
            <p class="italic">
              Doit être renseigné en net catégoriel par foyé
            </p>
          </header>
          <div class="salary-form-infos">
            <label class="isolate-parent">
              Parent isolé
              <input v-model="isolate" type="checkbox">
            </label>
            <salaries-form
              :salaries="options.salaries"
              :isolate="isolate"
              @update:salaries="options.salaries = $event"
            />
          </div>
          <div class="salary-form-childrens">
            <h2>Vos enfants</h2>
            <div>
              <childrens-form
                :childrens="options.childrens"
                @update:childrens="options.childrens = $event"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="grid-right">
        <div class="column-title">
          <p>Vos aides familiales</p>
          <p v-if="total > 0" class="total-price">
            <span>{{ total }}€</span> par mois
          </p>
        </div>
        <div class="grid-wrapper">
          <details-result :data="AF" label="Allocation familiale (AF)" />
          <details-result :data="ASF" label="Allocation parent isolé (ASF)" />
          <details-result :data="CF" label="Complément familiale (CF)" />
          <details-result :data="ARS" label="Allocation Rentré Scolaire (ARS)" per-year />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import DetailsResult from './ui/details.vue'
import ChildrensForm from '@/components/ui/childrens-form.vue'
import SalariesForm from '@/components/ui/salaries-form.vue'
import { FamilyOptionalPayload } from '@/types'
import { useAF } from '@/composables/aides-familiales/useAF'
import { useARS } from '@/composables/aides-familiales/useARS'
import { useASF } from '@/composables/aides-familiales/useASF'
import { useCF } from '@/composables/aides-familiales/useCF'
import { readdableRound } from '~/utils'

useHead({
  title: 'Simulateur aides familiales',
  charset: 'utf-8',
  meta: [
    {
      name: 'description',
      content: 'Simulateur aide familiales comprenant les calculs : allocation familiale (AF), allocation parent isolé (ASF), le complément familiale (CF), allocation rentré scolaire (ARS)'
    },
    {
      name: 'author',
      content: 'Cedric Pouilleux - mino.mnz@gmail.com'
    }
  ],
  bodyAttrs: {
    class: 'family-allowance-simulator'
  }
})

const options = reactive<FamilyOptionalPayload>({
  childrens: [],
  salaries: [12000, 12000]
})

const AF = useAF(options)
const ARS = useARS(options)
const ASF = useASF(options)
const CF = useCF(options)

const total = computed(() =>
  readdableRound(
    AF.sum.value +
        ASF.sum.value +
        CF.sum.value +
        ARS.sum.value / 12
  )
)

const isolate = ref(false)
</script>

<style scoped lang="scss">
.childrens-form__inner {
  margin-top: 20px;
}

.isolate-parent {
  margin: 12px;
}

.total-price {
  font-weight: 600;
  border-radius: 6px;
  color: #333;
}

.container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  grid-template-areas: '. .';

  .grid {
    &-wrapper {
      padding: 0 20px;
      box-sizing: border-box;
      &__header {
        display: flex;
        column-gap: 12px;
        padding: 0 10px;
        align-items: baseline;
      }
    }
  }
}

@media screen and (max-width:1280px){

  .salary-form {
    &-infos {
      padding: 12px 0;
    }
    &-childrens {
      h2 {
        padding: 0 8px;
        font-size: 1.2em;
      }
    }
  }

  .container{
    display: block;
    width: 100%;

    .column-title {
      margin: 0 8px;
      padding: 12px 0;
      border-bottom: 1px solid #ebebeb;

      .salary-form-infos {
        padding: 0;
      }
    }

    .grid {
      &-wrapper {
        width: 100%;
        padding: 0;
        &__header {
          display: block;
          h2 {
            font-size: 1.2em;
          }
        }
      }

      &-right {
        padding: 20px 0;
        margin: 20px 0;
      }

      &-left {
        width: 100%;
      }
    }
  }
}
</style>
