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
      <v-spacer></v-spacer>
      <template>
        <div class="text-center">
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
            <v-container>
              <v-row class="mt-1">
               <p class="mr-1 font-weight-medium">
                  {{nama_user}}
                </p>
                <p>
                  <v-icon  color="primary" dark   v-bind="attrs"
                  v-on="on">
                    mdi-account-circle
                  </v-icon>
                </p>
              </v-row>
            </v-container>
          
              <!-- <v-avatar
                color="primary"
                size="30"
                  v-bind="attrs"
                v-on="on"
              ></v-avatar> -->
              <!-- <v-btn
                v-bind="attrs"
                v-on="on"
              >
                
                Afnan Fauzi
              </v-btn> -->
            </template>
            <v-list>
              <v-list-item
                v-for="(item, index) in items"
                :key="index"
                @click="menuActionClick(item.action)"
              >
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </template>
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
import axios from 'axios'

  export default {
    data: () => ({ 
      drawer: null,
      items: [
        { title: 'Logout', action: "logout" },
      ],
      
      token: localStorage.getItem('token'),
      nama_user: localStorage.getItem('name'),
      }),
    components: { Sidebar, Footer },
    methods:{
       menuActionClick(action) {
        if (action === "logout") {
          axios.get('http://localhost:8000/api/logout', {headers: {'Authorization': 'Bearer '+this.token, 'Content-Type': 'application/json', 'Accept': 'application/json'}})
            .then(() => {
              localStorage.removeItem('loggedIn')
              localStorage.removeItem('token')
              localStorage.removeItem('id_user')
              localStorage.removeItem('name')
              this.loggedIn = false
              this.$router.push({ name: 'login' })
            })
        }
      }
    }
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