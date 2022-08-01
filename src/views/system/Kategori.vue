<template>
  <v-container>
    <v-toolbar-title class="mb-3">Kategori</v-toolbar-title>
    <v-data-table
    :headers="headers"
    :items="dataku"
    sort-by="calories"
    class="elevation-1"
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
                      v-model="editedItem.nama"
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
                      v-model="editedItem.plot"
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

     <template v-slot:item.status="{ item }">
      <v-chip
        :color="getColor(item.status)"
        dark
      >
        {{ item.status }}
      </v-chip>
    </template>
  </v-data-table>
  </v-container>
</template>

<script>
  export default {
    data: () => ({
      dialog: false,
      dialogDelete: false,
      headers: [
        {
          text: 'Nama Kategori',
          align: 'start',
          sortable: false,
          value: 'nama',
        },
        { text: 'Status', value: 'status' },
        { text: 'Plot Keuangan', value: 'plot' },
        { text: 'Aksi', value: 'actions', sortable: false },
      ],
      dataku: [],
      editedIndex: -1,
      editedItem: {
        nama: '',
        status: '',
        plot: 0,
      },
      defaultItem: {
        nama: '',
        status: '',
        plot: 0,
      },
      status: ['Aktif', 'Nonaktif'],
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
            nama: 'Makanan & Minuman',
            status: 'Aktif',
            plot: 70000,
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

      getColor (status) {
        if (status == 'Aktif') return 'green'
        else return 'red'
      },
    },
  }
</script>

<style>

</style>