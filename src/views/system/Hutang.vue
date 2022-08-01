<template>
  <v-container>
    <v-toolbar-title class="mb-3">Hutang</v-toolbar-title>
    <v-row>
      <v-col
          cols="12"
          sm="6"
          md="3"
        >
         <v-autocomplete
            v-model="nama"
            :items="nama"
            label="Pilih nama"
            placeholder="Cari..."
            solo
          ></v-autocomplete>
        
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
          <v-card-title>Memberi</v-card-title>
          <v-card-text>ini text</v-card-text>
        </v-card>
      </v-col>

      <v-col
        cols="12"
        sm="4"
      >
        <v-card
        elevation="2"
        >
          <v-card-title>Menerima</v-card-title>
          <v-card-text>ini text</v-card-text>
        </v-card>
      </v-col>

      <v-col
        cols="12"
        sm="4"
      >
        <v-card
        elevation="2"
        >
          <v-card-title>Selisih</v-card-title>
          <v-card-text>ini text</v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data: () => ({
      nama: ['Foo', 'Bar', 'Fizz', 'Buzz'],
      dialog: false,
      dialogDelete: false,
      headers: [
        {
          text: '#',
          align: 'start',
          sortable: false,
          value: 'judul',
        },
        { text: 'Kategori', value: 'kategori' },
        { text: 'Total Uang', value: 'total' },
        { text: 'Keterangan', value: 'keterangan' },
        { text: 'Aksi', value: 'actions', sortable: false },
      ],
      dataku: [],
      editedIndex: -1,
      editedItem: {
        judul: '',
        kategori: '',
        keterangan: '',
        tanggal: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      },
      defaultItem: {
        judul: '',
        kategori: '',
        keterangan: '',
        tanggal: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      },
    })
}
</script>

<style>

</style>