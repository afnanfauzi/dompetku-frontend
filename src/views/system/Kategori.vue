<template>
  <v-container>
    <v-toolbar-title class="mb-3">Kategori</v-toolbar-title>
    <v-row>
      <v-col
        cols="12"
        sm="12"
        md="12">
        <v-data-table
        :headers="headers"
        :items="dataku"
        sort-by="nama_kategori"
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
                  Tambah Kategori
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
                          v-model="editedItem.nama_kategori"
                          label="Nama Kategori"
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
                       <v-select
                          v-model="editedItem.jenis_transaksi"
                          label="Jenis Transaksi"
                          outlined
                          :items="jenis_transaksi"
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
                            v-model="editedItem.rencana_anggaran"
                            label="Rencana Anggaran"
                            outlined
                            prefix="Rp "
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
        <template v-slot:item.jenis_transaksi="{ item }">
          <td v-if="item.jenis_transaksi == 0">
                  <v-chip
                    color="red"
                    outlined
                    small
                  >
                    Pengeluaran
                  </v-chip>
          </td>
          <td v-else>
            <v-chip
              color="blue"
              outlined
              small
            >
              Pemasukan
            </v-chip>
          </td>
        </template>
        <template v-slot:item.rencana_anggaran="{ item }">
           <td>Rp {{ formatPrice(item.rencana_anggaran)  }}</td>
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
          text: 'Nama Kategori',
          align: 'start',
          sortable: false,
          value: 'nama_kategori',
        },
        { text: 'Status', value: 'is_active', sortable: false },
        { text: 'Jenis Transaksi', value: 'jenis_transaksi' },
        { text: 'Rencana Anggaran', value: 'rencana_anggaran' },
        { text: 'Aksi', value: 'actions', sortable: false },
      ],
      dataku: [],
      editedIndex: -1,
      editedItem: {
        id: '',
        nama_kategori: '',
        status: null,
        jenis_transaksi: null,
        rencana_anggaran: '',
      },
      defaultItem: {
        id: '',
        nama_kategori: '',
        status: null,
        jenis_transaksi: null,
        rencana_anggaran: '',
      },
      status: [{text: 'Aktif', value: 1}, {text: 'Nonaktif', value: 0}],
      jenis_transaksi: [{text: 'Pemasukan', value: 1}, {text: 'Pengeluaran', value: 0}],
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
      this.url = 'http://127.0.0.1:8000/api/kategori'
      this.initialize()
    },

    methods: {
      initialize () {
        axios.get(this.url,  {headers: {'Authorization': 'Bearer '+this.token, 'Content-Type': 'application/json', 'Accept': 'application/json'}, params:{paging: this.paging, search:this.search, user_id:this.user_id}})
        .then(response => {
          // console.log(response.data.data.kategori)
          this.dataku = response.data.data.kategori.data
        })
        .catch(errors => {
          console.log(errors)
        });

      },

      editItem (item) {
        this.editedIndex = 0
        // console.log( this.editedIndex )
        axios.get(this.url +'/' +item, {headers: {'Authorization': 'Bearer '+this.token, 'Content-Type': 'application/json', 'Accept': 'application/json'}})
            .then(response => { 
              // console.log(this.editedItem.id )
              this.editedItem.id = response.data.data.id
              this.editedItem.nama_kategori = response.data.data.nama_kategori
              this.editedItem.status = response.data.data.is_active
              this.editedItem.jenis_transaksi = response.data.data.jenis_transaksi
              this.editedItem.rencana_anggaran = response.data.data.rencana_anggaran
              this.dialog = true

            })
            .catch(errors => {
              console.log(errors)
            })
      },

      // deleteItem (item) {
      //   this.editedIndex = this.dataku.indexOf(item)
      //   this.editedItem = Object.assign({}, item)
      //   this.dialogDelete = true
      // },

      // deleteItemConfirm () {
      //   this.dataku.splice(this.editedIndex, 1)
      //   this.closeDelete()
      // },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      // closeDelete () {
      //   this.dialogDelete = false
      //   this.$nextTick(() => {
      //     this.editedItem = Object.assign({}, this.defaultItem)
      //     this.editedIndex = -1
      //   })
      // },

      save () {
        if (this.editedIndex > -1) {
            let id = this.editedItem.id
            let data = {
              // id: this.editedItem.id,
              nama_kategori: this.editedItem.nama_kategori,
              is_active: this.editedItem.status,
              jenis_transaksi: this.editedItem.jenis_transaksi,
              rencana_anggaran: this.editedItem.rencana_anggaran,
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
              console.log(errors)
            })


        } else {
          // console.log(this.editedIndex)
          let data = {
            nama_kategori: this.editedItem.nama_kategori,
            is_active: this.editedItem.status,
            jenis_transaksi: this.editedItem.jenis_transaksi,
            rencana_anggaran: this.editedItem.rencana_anggaran,
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
          }).catch(() => {
            this.loading = false
            this.snackbar.text = 'Gagal menambahkan data'
            this.snackbar.color = 'red'
            this.snackbar.action = 'white'
            this.snackbar.show = true
          });
        
        }
        // this.snackbar.text = ''
        // this.snackbar.color = 'red'
        // this.snackbar.action = 'white'
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