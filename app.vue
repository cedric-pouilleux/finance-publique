<template>
  <div>
    {{test}}
  </div>
</template>

<script setup lang="ts">
import {useCore} from "~/composables/aides-familiales/useCore";

const { test } = useCore();
</script>