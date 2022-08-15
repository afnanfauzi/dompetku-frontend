<template>
  <v-container>
    <v-toolbar-title class="mb-3">Mitra</v-toolbar-title>
    <v-row>
      <v-col
        cols="12"
        sm="12"
        md="12">
        <v-data-table
        :headers="headers"
        :items="dataku"
        sort-by="nama_mitra"
        class="elevation-1"
        :loading="loading"
        >
          <template v-slot:top>
            <v-toolbar
              flat
            >
              <v-spacer></v-spacer>
              <v-dialog
                v-model="dialog"
                max-width="500px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="accent"
                    dark
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
                  >
                    Tambah Mitra
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="text-h5">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-container>
                      <v-row no-gutters>
                        <v-col
                          cols="12"
                          sm="12"
                          md="12"
                        >
                          <v-text-field
                            v-model="editedItem.nama_mitra"
                            label="Nama Mitra"
                            outlined
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row no-gutters>
                        <v-col
                          cols="12"
                          sm="12"
                          md="12"
                        >
                          <v-select
                            v-model="editedItem.status"
                            label="Status"
                            :items="status"
                            outlined
                          ></v-select>
                        </v-col>
                      </v-row>
                      <v-row no-gutters>
                        <v-col
                          cols="12"
                          sm="12"
                          md="12"
                        >
                          <v-text-field
                              v-model="editedItem.no_hp"
                              label="No Hp"
                              outlined
                          ></v-text-field>
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="accent"
                      text
                      @click="close"
                    >
                      Tutup
                    </v-btn>
                    <v-btn
                      color="accent"
                      text
                      @click="save"
                    >
                      Simpan
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:item.is_active="{ item }">
            <td v-if="item.is_active == 0">
              <v-chip
                color="red"
                dark
                small
              >
                Nonaktif
              </v-chip>
            </td>
            <td v-else>
              <v-chip
                color="green"
                dark
                small
              >
                Aktif
              </v-chip>
            </td>
          </template>
          <template v-slot:item.no_hp="{ item }">
            <td>{{ item.no_hp  }}</td>
          </template>
          <template v-slot:item.actions="{ item }">
            <td>
              <v-icon
                small
                class="mr-2"
                @click="editItem(item.id)"
              >
                mdi-pencil
              </v-icon>
            </td>
          </template>
          <template
            v-slot:no-data
          >
            Tidak ada data.
          </template>
        </v-data-table>
      </v-col>
    </v-row>
    

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      right
    >
      {{ snackbar.text }}

      <template v-slot:action="{ attrs }">
        <v-btn
          :color="snackbar.action"
          text
          v-bind="attrs"
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import axios from "axios";
  export default {
    data: () => ({
      token: localStorage.getItem('token'),
      user_id: localStorage.getItem('id_user'),
      url:'',
      dialog: false,
      dialogDelete: false,
      headers: [
        {
          text: 'Nama Mitra',
          align: 'start',
          sortable: false,
          value: 'nama_mitra',
        },
        { text: 'Status', value: 'is_active', sortable: false },
        { text: 'No HP', value: 'no_hp' },
        { text: 'Aksi', value: 'actions', sortable: false },
      ],
      dataku: [],
      editedIndex: -1,
      editedItem: {
        id: '',
        nama_mitra: '',
        status: null,
        no_hp: '',
      },
      defaultItem: {
        id: '',
        nama_mitra: '',
        status: null,
        no_hp: '',
      },
      status: [{text: 'Aktif', value: 1}, {text: 'Nonaktif', value: 0}],
      loading: false,
      snackbar: {
        text: ``,
        color: null,
        action: null,
        show: false
      },
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'Tambah Data' : 'Edit Data'
      },
    },

    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },

    created () {
      this.url = 'https://dompetku-api.herokuapp.com/api/mitra'
      this.initialize()
    },

    methods: {
      initialize () {
        axios.get(this.url,  {headers: {'Authorization': 'Bearer '+this.token, 'Content-Type': 'application/json', 'Accept': 'application/json'}, params:{paging: this.paging, search:this.search, user_id:this.user_id}})
        .then(response => {
          // console.log(response.data)
          this.dataku = response.data.data.mitra.data
        })
        .catch(errors => {
          if (errors.response.status === 401) {
            localStorage.removeItem('loggedIn')
            localStorage.removeItem('token')
            localStorage.removeItem('id_user')
            localStorage.removeItem('name')
            this.loggedIn = false
            this.$router.push({ name: 'login' })
          }
        });

      },

      editItem (item) {
        this.editedIndex = 0
        // console.log( this.editedIndex )
        axios.get(this.url +'/' +item, {headers: {'Authorization': 'Bearer '+this.token, 'Content-Type': 'application/json', 'Accept': 'application/json'}})
            .then(response => { 
              // console.log(this.editedItem.id )
              this.editedItem.id = response.data.data.id
              this.editedItem.nama_mitra = response.data.data.nama_mitra
              this.editedItem.status = response.data.data.is_active
              this.editedItem.jenis_transaksi = response.data.data.jenis_transaksi
              this.editedItem.no_hp = response.data.data.no_hp
              this.dialog = true

            })
            .catch(errors => {
               if (errors.response.status === 401) {
                localStorage.removeItem('loggedIn')
                localStorage.removeItem('token')
                localStorage.removeItem('id_user')
                localStorage.removeItem('name')
                this.loggedIn = false
                this.$router.push({ name: 'login' })
              }
            })
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      save () {
        if (this.editedIndex > -1) {
            let id = this.editedItem.id
            let data = {
              // id: this.editedItem.id,
              nama_mitra: this.editedItem.nama_mitra,
              is_active: this.editedItem.status,
              jenis_transaksi: this.editedItem.jenis_transaksi,
              no_hp: this.editedItem.no_hp,
            };

          this.loading = true

           axios.put(this.url +'/' + id, data, {headers: {'Authorization': 'Bearer '+this.token, 'Content-Type': 'application/json', 'Accept': 'application/json'}})
            .then(() => { 
              this.initialize()
              this.loading = false
              this.snackbar.text = 'Berhasil mengubah data'
              this.snackbar.color = 'green'
              this.snackbar.action = 'white'
              this.snackbar.show = true
            })
            .catch(errors => {
              this.loading = false
              this.snackbar.text = 'Gagal mengubah data'
              this.snackbar.color = 'red'
              this.snackbar.action = 'white'
              this.snackbar.show = true


               if (errors.response.status === 401) {
                localStorage.removeItem('loggedIn')
                localStorage.removeItem('token')
                localStorage.removeItem('id_user')
                localStorage.removeItem('name')
                this.loggedIn = false
                this.$router.push({ name: 'login' })
              }
            })


        } else {
          // console.log(this.editedIndex)
          let data = {
            nama_mitra: this.editedItem.nama_mitra,
            is_active: this.editedItem.status,
            jenis_transaksi: this.editedItem.jenis_transaksi,
            no_hp: this.editedItem.no_hp,
            user_id: this.user_id,
          };

          this.loading = true

          axios.post(this.url, data, {headers: {'Authorization': 'Bearer '+this.token, 'Content-Type': 'application/json', 'Accept': 'application/json'}})
            .then(() => {
            this.initialize()
            this.loading = false
            this.snackbar.text = 'Berhasil menambahkan data'
            this.snackbar.color = 'green'
            this.snackbar.action = 'white'
            this.snackbar.show = true
          }).catch(errors => {
            this.loading = false
            this.snackbar.text = 'Gagal menambahkan data'
            this.snackbar.color = 'red'
            this.snackbar.action = 'white'
            this.snackbar.show = true

             if (errors.response.status === 401) {
                localStorage.removeItem('loggedIn')
                localStorage.removeItem('token')
                localStorage.removeItem('id_user')
                localStorage.removeItem('name')
                this.loggedIn = false
                this.$router.push({ name: 'login' })
              }
          });
        
        }
       
        this.editedIndex = -1
        this.close()
      },

      formatPrice(value) {
        let val = (value/1).toFixed(2).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      }
    },
  }
</script>

<style>

</style>