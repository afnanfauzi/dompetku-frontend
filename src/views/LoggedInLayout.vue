<template>
  <v-app id="inspire">
    <v-navigation-drawer
      v-model="drawer"
      app
      class="sidebar"
    >
      <!--  -->
     <Sidebar></Sidebar>
    </v-navigation-drawer>

    <v-app-bar app class="secondary">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
    </v-app-bar>

     <!-- Sizes your content based upon application components -->
    <v-main class="base">

    <!-- Provides the application the proper gutter -->
        <v-container fluid>

        <!-- If using vue-router -->
        <router-view></router-view>
        </v-container>
    </v-main>

    <!-- <v-footer> -->
       <Footer></Footer>
    <!-- </v-footer> -->
  </v-app>
</template>

<script>
import Sidebar from '@/components/layouts/Sidebar.vue'
import Footer from '@/components/layouts/Footer.vue'

  export default {
    data: () => ({ drawer: null }),
    components: { Sidebar, Footer }
}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css? family=Oxygen:300,400,700&display=swap');
@import url('https://fonts.googleapis.com/css? family=Comfortaa&display=swap');

$body-font-family: 'Oxygen';
$title-font: 'Comfortaa';

.v-application {
   font-family: $body-font-family, sans-serif !important;
    .title { // To pin point specific classes of some components
       font-family: $title-font, sans-serif !important;
    }
 }
</style>