<template>
  <v-container>
    <v-toolbar-title class="mb-3">Kategori</v-toolbar-title>
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
                    <v-text-field
                      v-model="editedItem.plot_uang"
                      label="Plot Keuangan"
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
                color="blue darken-1"
                text
                @click="close"
              >
                Tutup
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="save"
              >
                Simpan
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
              <v-card-title class="text-h5">
              Hapus Data
              </v-card-title>
              <v-card-text>Apakah kamu yakin akan menghapus data ini?</v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">Tutup</v-btn>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm">Hapus</v-btn>
              </v-card-actions>
          </v-card>
        </v-dialog> -->
      </v-toolbar>
    </template>
    <template
        v-slot:body="{ items }"
      >
        <tbody>
          <tr
            v-for="item in items"
            :key="item.id"
          >
            <td>{{ item.nama_kategori }}</td>
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
            <td>Rp {{ formatPrice(item.plot_uang)  }}</td>
            <td>
              <v-icon
                small
                class="mr-2"
                @click="editItem(item.id)"
              >
                mdi-pencil
              </v-icon>
              <!-- <v-icon
                small
                @click="deleteItem(item.id)"
              >
                mdi-delete
              </v-icon> -->
            </td>
          </tr>
        </tbody>
    </template>
    <template v-slot:no-data>
      <v-btn
        color="accent"
        @click="initialize"
      >
        Reset
      </v-btn>
    </template>

     <!-- <template v-slot:item.is_active="{ item }">
      <v-chip
        :color="getColor(item.is_active)"
        dark
      >
        {{ item.status }}
      </v-chip>
    </template> -->
    </v-data-table>

    <v-snackbar
      v-model="snackbar"
      color="red"
      right
    >
      {{ text }}

      <template v-slot:action="{ attrs }">
        <v-btn
          color="white"
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
        { text: 'Status', value: 'status', sortable: false },
        { text: 'Plot Keuangan', value: 'plot_uang' },
        { text: 'Aksi', value: 'actions', sortable: false },
      ],
      dataku: [],
      editedIndex: -1,
      editedItem: {
        id: '',
        nama_kategori: '',
        status: null,
        plot_uang: 0,
      },
      defaultItem: {
        id: '',
        nama_kategori: '',
        status: null,
        plot_uang: 0,
      },
      status: [{text: 'Aktif', value: 1}, {text: 'Nonaktif', value: 0}],
      loading: false,
      snackbar: false,
      text: `Gagal`,
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
      this.url = 'http://localhost:8000/api/kategori'
      this.initialize()
    },

    methods: {
      initialize () {
        axios.get(this.url,  {headers: {'Authorization': 'Bearer '+this.token, 'Content-Type': 'application/json', 'Accept': 'application/json'}, params:{paging: this.paging, search:this.search}})
        .then(response => {
          this.dataku = response.data.data.data
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
              this.editedItem.id = response.data.data.id
              this.editedItem.nama_kategori = response.data.data.nama_kategori
              this.editedItem.status = response.data.data.is_active
              this.editedItem.plot_uang = response.data.data.plot_uang
              this.dialog = true
              // console.log(this.editedItem.id )

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
              plot_uang: this.editedItem.plot_uang,
            };

          this.loading = true

           axios.put(this.url +'/' + id, data, {headers: {'Authorization': 'Bearer '+this.token, 'Content-Type': 'application/json', 'Accept': 'application/json'}})
            .then(() => { 
              this.initialize()
              this.loading = false
            })
            .catch(errors => {
              this.loading = false
              this.snackbar = true
              console.log(errors)
            })
        } else {
          // console.log(this.editedIndex)
          let data = {
            nama_kategori: this.editedItem.nama_kategori,
            is_active: this.editedItem.status,
            plot_uang: this.editedItem.plot_uang,
          };

          this.loading = true

          axios.post(this.url, data, {headers: {'Authorization': 'Bearer '+this.token, 'Content-Type': 'application/json', 'Accept': 'application/json'}})
            .then(() => {
            this.initialize()
            this.loading = false
          }).catch((error) => {
            this.loading = false
            this.snackbar = true
            console.log(error)
          });
        
        }
        this.editedIndex = -1
        this.close()
      },

      getColor (status) {
        if (status == '1') return 'green'
        else return 'red'
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