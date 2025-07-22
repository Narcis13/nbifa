<template>
  <div class="fixed-center text-center">
    <p>
      <img
        src="~assets/sad.svg"
        style="width:30vw;max-width:150px;"
      >
    </p>
    <p class="text-faded">Sorry, nothing here...<strong>(404)</strong></p>
    <q-btn
      color="secondary"
      style="width:200px;"
      @click="goBack"
    >Go back</q-btn>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

defineOptions({
  name: 'Error404'
})

const router = useRouter()

const goBack = () => {
  router.push('/')
}
</script>