<template>
    <div>
     <v-list-item >
        <v-list-item-avatar>
          <v-img :src="dompet"></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title class="secondary--text"><b>DOMPETKU</b></v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <!-- <v-divider></v-divider> -->

      <v-list
        dense
        nav 
        rounded
      >
        <v-list-item-group v-model="model">
        <v-list-item
          v-for="item in items"
          :key="item.title"
          link
          :to="item.link"
        >
        
          <v-list-item-icon>
            <router-link to="/dashboard"></router-link>
            <v-icon class="secondary--text">{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title class="secondary--text">{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        </v-list-item-group>
      </v-list>
    </div>
</template>

<script>
  export default {
    data () {
      return {
        items: [
          { title: 'Dashboard', icon: 'mdi-view-dashboard', link: '/' },
          { title: 'Data Harian', icon: 'mdi-cash-multiple', link: '/form' },
          { title: 'Kategori', icon: 'mdi-archive', link: '/kategori' },
          { title: 'Mitra', icon: 'mdi-contacts', link: '/mitra' },
          { title: 'Hutang', icon: 'mdi-notebook', link: '/hutang' },
          { title: 'Pengaturan', icon: 'mdi-cogs', link: '/pengaturan' },
        ],
        right: null,
        model:'',
        dompet: require('@/assets/wallet.svg')
      }
    },
  }
</script>

<style scoped>
.v-list .v-list-item-group .v-list-item--active{
  /* background-color: red; */
  color: #FFFFFF!important;
}
</style>