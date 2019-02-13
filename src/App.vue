<template>
  <v-app>
    <Navbar />

    <v-content>
      <router-view></router-view>
    </v-content>
    <v-footer app class="pl-3">@2019 Narcis Petru Brindusescu</v-footer>
  </v-app>
</template>

<script>
import Navbar from '@/components/Navbar'

export default {
  name: 'App',
  components:{Navbar},
  data () {
    return {
      //
    }
  }
}
</script>
