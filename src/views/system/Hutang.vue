<template>
  <v-container>
    <v-toolbar-title class="mb-3">Hutang Piutang</v-toolbar-title>
    <v-row>
      <v-col
          cols="12"
          sm="6"
          md="3"
        >
         <v-select
            v-model="nama_mitra"
            :items="mitra"
            item-text="nama_mitra"
            item-value="id"
            label="Pilih nama"
            solo
            @change=reloadTabel()
          ></v-select>
        
        </v-col>
    </v-row>
    <v-row class="mt-n7">
      <v-col
        cols="12"
        sm="4"
      >
        <v-card
        elevation="2"
        >
          <v-card-title class="text-h5">Hutang</v-card-title>
          <v-card-text>Rp {{ formatPrice(hutang_value)  }}</v-card-text>
        </v-card>
      </v-col>

      <v-col
        cols="12"
        sm="4"
      >
        <v-card
        elevation="2"
        >
          <v-card-title class="text-h5">Piutang</v-card-title>
          <v-card-text>Rp {{ formatPrice(piutang_value)  }}</v-card-text>
        </v-card>
      </v-col>

      <v-col
        cols="12"
        sm="4"
      >
        <v-card
        elevation="2"
        >
          <v-card-title class="text-h5">Selisih</v-card-title>
          <v-card-text>Rp {{ formatPrice(selisih_value)  }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>
     <v-row >
      <v-col>
        <v-data-table
        :headers="headers"
        :items="dataku"
        sort-by="total_uang"
        class="elevation-1"
        :loading="loading"
        >
          <template v-slot:top>
            <v-toolbar
              flat
            >
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
                        <v-select
                          v-model="editedItem.jenis"
                          label="Jenis Transaksi"
                          :items="jenis"
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
                            label="mitra"
                            clearable
                            outlined
                          > -->
                          <v-select
                            v-model="editedItem.mitra_id"
                            :items="mitra"
                            item-text="nama_mitra"
                            item-value="id"
                            label="Mitra"
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
                      <v-row no-gutters class="mt-n5 ml-3">
                        <v-col
                          cols="12"
                          sm="12"
                          md="12"
                        >
                         <p class="text-subtitle-2">Rp {{ formatPrice(editedItem.total_uang)  }}</p>
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
          <template v-slot:item.catatan="{ item }">
             <td>{{ item.catatan }}</td>
          </template>
          <template v-slot:item.jenis="{ item }">
            <td v-if="item.jenis == 1">
              <v-chip
                color="blue"
                outlined
                small
              >
              Piutang
              </v-chip>
            </td>
            <td v-else>
              <v-chip
              color="red"
              outlined
              small
              >
              Hutang
              </v-chip>
            </td>
          </template>
          <template v-slot:item.tanggal="{ item }">
             <td>{{ konversi_tanggal(item.tanggal_transaksi) }}</td>
          </template>
          <template v-slot:item.mitra_id="{ item }">
            <td>{{ item.mitra.nama_mitra }}</td>
          </template>
          <template v-slot:item.total_uang="{ item }">
            <td>Rp {{ formatPrice(item.total_uang)  }}</td>
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
              <v-icon
                small
                @click="deleteItem(item.id)"
              >
                mdi-delete
              </v-icon>
            </td>
          </template>
          <template
            v-slot:no-data
          >
            Tidak ada data.
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
import moment from 'moment'
  export default {
    data: () => ({
      dialog: false,
      dialogDelete: false,
      token: localStorage.getItem('token'),
      user_id: localStorage.getItem('id_user'),
      url:'',
      urlMitra:'',
      headers: [
        {
          text: 'Mitra',
          align: 'start',
          sortable: false,
          value: 'mitra_id',
        },
        { text: 'Jenis Transaksi', value: 'jenis' },
        { text: 'Tanggal', value: 'tanggal' },
        { text: 'Total Uang', value: 'total_uang' },
        { text: 'Catatan', value: 'catatan' },
        { text: 'Aksi', value: 'actions', sortable: false },
      ],
      dataku: [],
      editedIndex: -1,
      editedItem: {
        jenis: null,
        id: '',
        catatan: '',
        total_uang: '',
        mitra_id: '',
        tanggal: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      },
      defaultItem: {
        jenis: null,
        id: '',
        catatan: '',
        total_uang: '',
        mitra_id: '',
        tanggal: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      },
      deletedItem: {
        id: '',
      },
      mitra: [],
      jenis: [{text: 'Hutang', value: 0}, {text: 'Piutang', value: 1}],
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
      nama_mitra:null,
      cari_mitra:null,
      hutang_value:'',
      piutang_value:'',
      selisih_value:'',
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
       this.urlMitra = 'https://dompetku-api.herokuapp.com/api/mitra'
       axios.get(this.urlMitra,  {headers: {'Authorization': 'Bearer '+this.token, 'Content-Type': 'application/json', 'Accept': 'application/json'}, params:{paging: this.paging, search:this.search, user_id:this.user_id}})
          .then(response => {
            this.mitra = response.data.data.mitra_aktif.data
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

      this.initialize()
    },

    methods: {
      initialize () {
          this.url = 'https://dompetku-api.herokuapp.com/api/hutang'
          this.cari_mitra = this.nama_mitra
          axios.get(this.url,  {headers: {'Authorization': 'Bearer '+this.token, 'Content-Type': 'application/json', 'Accept': 'application/json'}, params:{mitra_id:this.cari_mitra, user_id:this.user_id}})
          .then(response => {
            // console.log(response.data)
            this.dataku = response.data.data.hutangpiutang
            this.hutang_value = response.data.data.hutang
            this.piutang_value = response.data.data.piutang
            this.selisih_value = response.data.data.selisih
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
        this.urlMitra = 'https://dompetku-api.herokuapp.com/api/mitra'

        axios.get(this.urlMitra,  {headers: {'Authorization': 'Bearer '+this.token, 'Content-Type': 'application/json', 'Accept': 'application/json'}, params:{paging: this.paging, search:this.search, user_id:this.user_id}})
        .then(response => {
          // console.log(response.data.data.mitra_aktif.data)
          this.mitra = response.data.data.mitra_aktif.data
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

        axios.get(this.url +'/' +item, {headers: {'Authorization': 'Bearer '+this.token, 'Content-Type': 'application/json', 'Accept': 'application/json'}})
          .then(response => { 
            this.editedItem.id = response.data.data.id
            this.editedItem.catatan = response.data.data.catatan
            this.editedItem.mitra_id = response.data.data.mitra_id
            this.editedItem.total_uang = response.data.data.total_uang
            this.editedItem.tanggal = response.data.data.tanggal_transaksi
            this.editedItem.jenis = response.data.data.jenis
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
          });
      },

      deleteItem (item) {
        axios.get(this.url +'/' +item, {headers: {'Authorization': 'Bearer '+this.token, 'Content-Type': 'application/json', 'Accept': 'application/json'}})
          .then(response => { 
            this.deletedItem.id = response.data.data.id
            this.dialogDelete = true
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
              jenis: this.editedItem.jenis,
              catatan:  this.editedItem.catatan,
              mitra_id:  this.editedItem.mitra_id,
              total_uang:  this.editedItem.total_uang,
              tanggal_transaksi: this.editedItem.tanggal,
            };

          this.loading = true
          // console.log(data)
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
              mitra_id:  this.editedItem.mitra_id,
              total_uang:  this.editedItem.total_uang,
              tanggal_transaksi: this.editedItem.tanggal,
              user_id: this.user_id,
              jenis: this.editedItem.jenis,
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

      reloadTabel(){
        this.cari_mitra = this.nama_mitra

        axios.get(this.url,  {headers: {'Authorization': 'Bearer '+this.token, 'Content-Type': 'application/json', 'Accept': 'application/json'}, params:{mitra_id:this.cari_mitra, user_id:this.user_id}})
          .then(response => {
            // console.log(response.data)
            this.dataku = response.data.data.hutangpiutang
            this.hutang_value = response.data.data.hutang
            this.piutang_value = response.data.data.piutang
            this.selisih_value = response.data.data.selisih
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

      konversi_tanggal() {
        moment.locale('id') 
        return moment().format('LL');
      },

      dialogOpen(){
        this.dialog = true

        this.urlMitra = 'https://dompetku-api.herokuapp.com/api/mitra'

        axios.get(this.urlMitra,  {headers: {'Authorization': 'Bearer '+this.token, 'Content-Type': 'application/json', 'Accept': 'application/json'}, params:{paging: this.paging, search:this.search, user_id:this.user_id}})
        .then(response => {
          this.mitra = response.data.data.mitra_aktif.data
          // console.log(response.data.data.mitra_aktif.data)
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
      }
    },
  }
</script>

<style>

</style>