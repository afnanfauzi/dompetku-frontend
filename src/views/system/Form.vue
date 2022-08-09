<template>
  <v-container>
    <v-toolbar-title class="mb-3">Data Harian</v-toolbar-title>
    <v-row>
        <v-col
          cols="12"
          sm="6"
          md="4"
        >
          <v-dialog
            ref="dialog"
            v-model="modal"
            :return-value.sync="date"
            persistent
            width="290px"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-text-field
                v-model="date"
                solo
                dense
                label="Pilih tanggal"
                prepend-inner-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
              ></v-text-field>
            </template>
            <v-date-picker
              v-model="date"
              scrollable
            >
              <v-spacer></v-spacer>
              <v-btn
                text
                color="primary"
                @click="modal = false"
              >
                Cancel
              </v-btn>
              <v-btn
                text
                color="primary"
                @click="$refs.dialog.save(date), setDate()"
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-dialog>
        </v-col>
    </v-row>
    <v-row class="mt-n7">
      <v-col>
        <v-data-table
        :headers="headers"
        :items="dataku"
        sort-by="catatan"
        class="elevation-1"
        :loading="loading"
        >
          <template v-slot:top>
            <v-toolbar
              flat
            >
              <h6 v-if="total_transaksi >= 0" class="text-h6 green--text">Rp {{ formatPrice(total_transaksi)  }}</h6>
              <h6 v-else class="text-h6 red--text">Rp {{ formatPrice(total_transaksi)  }}</h6>
              <!-- <v-divider
                class="mx-4"
                inset
                vertical
              ></v-divider> -->
              <v-spacer></v-spacer>
              <v-btn
                  color="accent"
                  dark
                  class="mb-2"
                  @click="dialogOpen()"
                >
                  Tambah Data
                </v-btn>
              <v-dialog
                v-model="dialog"
                max-width="500px"
              >
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
                            v-model="editedItem.catatan"
                            label="Catatan"
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
                          <!-- <v-autocomplete
                            label="Kategori"
                            clearable
                            outlined
                          > -->
                          <v-select
                            v-model="editedItem.kategori_id"
                            :items="kategori"
                            item-text="nama_kategori"
                            item-value="id"
                            label="Kategori"
                            item-color="accent"
                            outlined
                          ></v-select>
                          <!-- </v-autocomplete> -->
                        </v-col>
                      </v-row>
                      <v-row no-gutters>
                        <v-col
                          cols="12"
                          sm="12"
                          md="12"
                        >
                          <v-text-field
                            v-model="editedItem.total_uang"
                            label="Total uang"
                            outlined
                            prefix="Rp "
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row no-gutters>
                        <v-col
                        cols="12"
                        sm="12"
                        md="12"
                      >
                        <v-menu
                          v-model="menu2"
                          :close-on-content-click="false"
                          :nudge-right="40"
                          transition="scale-transition"
                          offset-y
                          min-width="auto"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="editedItem.tanggal"
                              label="Tanggal"
                              prepend-inner-icon="mdi-calendar"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                              outlined
                            ></v-text-field>
                          </template>
                          <v-date-picker
                            v-model="editedItem.tanggal"
                            @input="menu2 = false"
                          ></v-date-picker>
                        </v-menu>
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

              <v-dialog v-model="dialogDelete" max-width="500px">
                <v-card>
                    <v-card-title class="text-h5">
                    Hapus Data
                    </v-card-title>
                    <v-card-text>Apakah kamu yakin akan menghapus data ini?</v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="accent" text @click="closeDelete">Tutup</v-btn>
                      <v-btn color="accent" text @click="deleteItemConfirm">Hapus</v-btn>
                    </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>
          <template
            v-slot:body="{ items }"
          >
              <tbody v-if="items.length > 0">
                <tr
                  v-for="item in items"
                  :key="item.id"
                >
                  <td>{{ item.catatan }}</td>
                  <td v-if="item.kategori.jenis_transaksi == 1">
                  <v-chip
                    color="blue"
                    outlined
                    small
                  >
                  Pemasukan
                  </v-chip></td>
                  <td v-else>
                    <v-chip
                    color="red"
                    outlined
                    small
                    >
                    Pengeluaran
                    </v-chip></td>
                    <td>{{ item.kategori.nama_kategori }}</td>
                    <td>Rp {{ formatPrice(item.total_uang)  }}</td>
                    <td>
                      <v-icon
                        small
                        class="mr-2"
                        @click="editItem(item.id)"
                      >
                        mdi-pencil
                      </v-icon>
                      <v-icon
                        small
                        @click="deleteItem(item.id)"
                      >
                        mdi-delete
                      </v-icon>
                    </td>
                </tr>
              </tbody>
              <tbody v-else>
                  <tr>
                    <td :colspan="headers.length" style="text-align: center">Data tidak tersedia.</td>
                  </tr>
                </tbody>
          </template>
        </v-data-table>

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
      </v-col>
    </v-row>
   
  </v-container>
</template>

<script>
import axios from 'axios'
  export default {
    data: () => ({
      dialog: false,
      dialogDelete: false,
      token: localStorage.getItem('token'),
      user_id: localStorage.getItem('id_user'),
      url:'',
      urlKategori:'',
      headers: [
        {
          text: 'Catatan',
          align: 'start',
          sortable: false,
          value: 'catatan',
        },
        { text: 'Jenis Transaksi', value: 'jenis_transaksi' },
        { text: 'Kategori', value: 'kategori_id' },
        { text: 'Total Uang', value: 'total_uang' },
        { text: 'Aksi', value: 'actions', sortable: false },
      ],
      dataku: [],
      editedIndex: -1,
      editedItem: {
        id: '',
        catatan: '',
        total: '',
        kategori: '',
        tanggal: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      },
      defaultItem: {
        id: '',
        catatan: '',
        total: '',
        kategori: '',
        tanggal: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      },
      deletedItem: {
        id: '',
      },
      kategori: [],
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      menu: false,
      modal: false,
      menu2: false,
      loading: false,
      snackbar: {
        text: ``,
        color: null,
        action: null,
        show: false
      },
      tanggal_data:'',
      total_transaksi: ''
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
      this.total_transaksi = '0'
      this.url = 'http://localhost:8000/api/transaksi'
      this.tanggal_data = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)
      this.initialize()
    },

    methods: {
      initialize () {
        // this.date = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)
          axios.get(this.url,  {headers: {'Authorization': 'Bearer '+this.token, 'Content-Type': 'application/json', 'Accept': 'application/json'}, params:{tanggal:this.tanggal_data, user_id:this.user_id}})
          .then(response => {
            this.dataku = response.data.data.transaksi
            this.total_transaksi = response.data.data.total_transaksi
            // console.log(this.total_transaksi)
          })
          .catch(errors => {
            console.log(errors)
          });
      },

      editItem (item) {
        this.editedIndex = 0
        this.urlKategori = 'http://localhost:8000/api/kategori'

        axios.get(this.urlKategori,  {headers: {'Authorization': 'Bearer '+this.token, 'Content-Type': 'application/json', 'Accept': 'application/json'}, params:{paging: this.paging, search:this.search, user_id:this.user_id}})
        .then(response => {
          // console.log(response.data.data.kategori_aktif.data)
          this.kategori = response.data.data.kategori_aktif.data
        })
        .catch(errors => {
          console.log(errors)
        });

        axios.get(this.url +'/' +item, {headers: {'Authorization': 'Bearer '+this.token, 'Content-Type': 'application/json', 'Accept': 'application/json'}})
          .then(response => { 
            this.editedItem.id = response.data.data.id
            this.editedItem.catatan = response.data.data.catatan
            this.editedItem.kategori_id = response.data.data.kategori_id
            this.editedItem.total_uang = response.data.data.total_uang
            this.editedItem.tanggal = response.data.data.tanggal_transaksi
            this.dialog = true
          })
          .catch(errors => {
            console.log(errors)
          });
      },

      deleteItem (item) {
        axios.get(this.url +'/' +item, {headers: {'Authorization': 'Bearer '+this.token, 'Content-Type': 'application/json', 'Accept': 'application/json'}})
          .then(response => { 
            this.deletedItem.id = response.data.data.id
            this.dialogDelete = true
          })
          .catch(errors => {
            console.log(errors)
          });

      },

      deleteItemConfirm () {
        // this.dataku.splice(this.editedIndex, 1)
        // console.log(this.deletedItem.id)
        let id_delete = this.deletedItem.id
        this.loading = true
        axios.delete(this.url +'/' + id_delete, {headers: {'Authorization': 'Bearer '+this.token, 'Content-Type': 'application/json', 'Accept': 'application/json'}})
          .then(() => { 
            this.initialize()
            this.closeDelete()
            this.loading = false
            this.snackbar.text = 'Berhasil menghapus data'
            this.snackbar.color = 'green'
            this.snackbar.action = 'white'
            this.snackbar.show = true
          })
          .catch(() => {
            this.loading = false
            this.snackbar.text = 'Gagal menghapus data'
            this.snackbar.color = 'red'
            this.snackbar.action = 'white'
            this.snackbar.show = true
          });
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete () {
        this.dialogDelete = false
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
              catatan:  this.editedItem.catatan,
              kategori_id:  this.editedItem.kategori_id,
              total_uang:  this.editedItem.total_uang,
              tanggal_transaksi: this.editedItem.tanggal,
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
            .catch(() => {
              this.loading = false
              this.snackbar.text = 'Gagal mengubah data'
              this.snackbar.color = 'red'
              this.snackbar.action = 'white'
              this.snackbar.show = true
            })

        } else {
          let data = {
              catatan:  this.editedItem.catatan,
              kategori_id:  this.editedItem.kategori_id,
              total_uang:  this.editedItem.total_uang,
              tanggal_transaksi: this.editedItem.tanggal,
              user_id: this.user_id,
              jenis_transaksi: this.jenis_transaksi,
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

        this.close()
      },

      formatPrice(value) {
        let val = (value/1).toFixed(2).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      },

      // pemasukanValue(){
      //   this.jenis_transaksi = 1
      // },

      // pengeluaranValue(){
      //   this.jenis_transaksi = 0
      // },

      setDate(){
        this.loading = true
        this.tanggal_data = this.date 
        this.initialize()
        this.loading = false
        // console.log("berhasil")
      },

      dialogOpen(){
        this.dialog = true

        this.urlKategori = 'http://localhost:8000/api/kategori'

        axios.get(this.urlKategori,  {headers: {'Authorization': 'Bearer '+this.token, 'Content-Type': 'application/json', 'Accept': 'application/json'}, params:{paging: this.paging, search:this.search, user_id:this.user_id}})
        .then(response => {
          this.kategori = response.data.data.kategori_aktif.data
          // console.log(response.data.data.kategori_aktif.data)
        })
        .catch(errors => {
          console.log(errors)
        });
      }
    },
  }
</script>

<style>

</style>