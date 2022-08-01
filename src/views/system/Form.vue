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
                @click="$refs.dialog.save(date)"
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
        sort-by="kategori"
        class="elevation-1"
        >
          <template v-slot:top>
            <v-toolbar
              flat
            >
              <!-- <v-toolbar-title>Data Harian</v-toolbar-title>
              <v-divider
                class="mx-4"
                inset
                vertical
              ></v-divider> -->
              <v-spacer></v-spacer>
              
              <v-menu
                transition="slide-y-transition"
                bottom
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="accent"
                    dark
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
                  >
                    Tambah Data
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    v-for="(item, i) in jenis"
                    :key="i"
                  >
                   <v-dialog
                      v-model="dialog"
                      max-width="500px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-list-item-action
                          color="accent"
                          dark
                          class="mb-2"
                          v-bind="attrs"
                          v-on="on"
                        >
                          {{item.text}}
                        </v-list-item-action>
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
                                  v-model="editedItem.judul"
                                  label="Judul"
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
                                <!-- <v-select
                                  v-model="editedItem.kategori"
                                  :items="kategori"
                                  label="Kategori"
                                  outlined
                                ></v-select> -->
                                <v-autocomplete
                                  v-model="editedItem.kategori"
                                  :items="kategori"
                                  label="Kategori"
                                  clearable
                                  outlined
                                ></v-autocomplete>
                              </v-col>
                            </v-row>
                            <v-row no-gutters>
                              <v-col
                                cols="12"
                                sm="12"
                                md="12"
                              >
                                <v-text-field
                                  v-model="editedItem.total"
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
                            <v-row no-gutters>
                              <v-col
                                cols="12"
                                sm="12"
                                md="12"
                              >
                                <v-textarea
                                  v-model="editedItem.keterangan"
                                  outlined
                                  auto-grow
                                  label="Keterangan"
                                ></v-textarea>
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
                  </v-list-item>
                </v-list>
              </v-menu>

             
              <v-dialog v-model="dialogDelete" max-width="500px">
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
              </v-dialog>
            </v-toolbar>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-icon
              small
              class="mr-2"
              @click="editItem(item)"
            >
              mdi-pencil
            </v-icon>
            <v-icon
              small
              @click="deleteItem(item)"
            >
              mdi-delete
            </v-icon>
          </template>
          <template v-slot:no-data>
            <v-btn
              color="accent"
              @click="initialize"
            >
              Reset
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
   
  </v-container>
</template>

<script>
  export default {
    data: () => ({
      dialog: false,
      dialogDelete: false,
      headers: [
        {
          text: '#',
          align: 'start',
          sortable: false,
          value: 'judul',
        },
        { text: 'Jenis Transaksi', value: 'jenis' },
        { text: 'Kategori', value: 'kategori' },
        { text: 'Total Uang', value: 'total' },
        { text: 'Keterangan', value: 'keterangan' },
        { text: 'Aksi', value: 'actions', sortable: false },
      ],
      dataku: [],
      editedIndex: -1,
      editedItem: {
        judul: '',
        jenis: '',
        kategori: '',
        keterangan: '',
        tanggal: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      },
      defaultItem: {
        judul: '',
        jenis:'',
        kategori: '',
        keterangan: '',
        tanggal: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      },
      kategori: ['Makanan & Minuman', 'Jajan', 'Listrik'],
      jenis: [ { text: 'Pemasukan', value: 'Pemasukan' },{ text:  'Pengeluaran', value:  'Pengeluaran' }],
      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      menu: false,
      modal: false,
      menu2: false,
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
      this.initialize()
    },

    methods: {
      initialize () {
        this.dataku = [
          {
            judul: 'Makan Siang',
            kategori: 'Makanan & Minuman',
            total: 60000,
            keterangan: '-',
            tanggal: '23/07/2022',
          },
        ]
      },

      editItem (item) {
        this.editedIndex = this.dataku.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        this.editedIndex = this.dataku.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      deleteItemConfirm () {
        this.dataku.splice(this.editedIndex, 1)
        this.closeDelete()
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
          Object.assign(this.dataku[this.editedIndex], this.editedItem)
        } else {
          this.dataku.push(this.editedItem)
        }
        this.close()
      },
    },
  }
</script>

<style>

</style>