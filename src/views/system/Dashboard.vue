<template>
  <v-container>
    <v-toolbar-title class="mb-3">Dashboard</v-toolbar-title>
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
              solo
              dense
              v-model="dateRangeText"
              label="Pilih Periode"
              prepend-inner-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="date"
            scrollable
            range
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
              @click="$refs.dialog.save(date), reloadTabel()"
            >
              OK
            </v-btn>
          </v-date-picker>
        </v-dialog>
      </v-col>
    </v-row>
    <v-row class="mt-n7">
      <v-col
       cols="12"
        sm="12"
        md="12">
      <v-data-table
      :headers="headers"
      :items="anggaran[0]"
      :items-per-page="5"
      class="elevation-1"
      hide-default-footer
      >
        <template v-slot:item.nama_kategori="{ item }">
          <td>{{ item.nama_kategori }}</td>
        </template>
        <template v-slot:item.rencana_anggaran="{ item }">
          <td>Rp {{ formatPrice(item.rencana_anggaran)  }}</td>
        </template>
        <template v-slot:item.anggaran_terpakai="{ item }">
          <td>Rp {{ formatPrice(item.anggaran_digunakan)  }}</td>
        </template>
        <template v-slot:item.sisa_anggaran="{ item }">
          <td class="green--text" v-if="item.anggaran_sisa > 0">Rp {{ formatPrice(item.anggaran_sisa)  }}</td>
          <td class="red--text" v-else > Rp {{ formatPrice(item.anggaran_sisa)  }}</td>
        </template>
        <template
          v-slot:no-data
        >
          Tidak ada data.
        </template>
      </v-data-table>
      </v-col>
    </v-row>
     <v-row>
      <v-col
         cols="12"
        sm="6"
        md="4"
        >
         <v-autocomplete
            v-model="kategori_id"
            :items="kategori"
            item-text="nama_kategori"
            item-value="id"
            label="Pilih kategori"
            solo
            @change=reloadTabel()
          ></v-autocomplete>
        
        </v-col>
    </v-row>
    <v-row class="mt-n7">
      <v-col
       cols="12"
        sm="12"
        md="12">
      <v-data-table
      :headers="ringkasanHeader"
      :items="ringkasan"
      :items-per-page="5"
      class="elevation-1"
      >
        <template v-slot:item.catatan="{ item }">
          <td>{{ item.catatan }}</td>
        </template>
         <template v-slot:item.tanggal_transaksi="{ item }">
         <td>{{ konversi_tanggal(item.tanggal_transaksi) }}</td>
        </template>
        <template v-slot:item.jenis_transaksi="{ item }">
         <td v-if="item.kategori.jenis_transaksi == 0">
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
        <template v-slot:item.nama_kategori="{ item }">
          <td>{{ item.kategori.nama_kategori  }}</td>
        </template>
        <template v-slot:item.total_uang="{ item }">
          <td>Rp {{ formatPrice(item.total_uang)  }}</td>
        </template>
        <template
          v-slot:no-data
        >
          Tidak ada data.
        </template>
      </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import 'moment/locale/id';

export default {
  data() {
    return {
      token: localStorage.getItem('token'),
      user_id: localStorage.getItem('id_user'),
      tanggal_awal: '',
      tanggal_akhir: '',
      url:'',
      urlKategori:'',
      urlRingkasan:'',
      date: [],
      ringkasan: [],
      kategori: [],
      kategori_id:'',
      modal: false,
      headers: [
          {
            text: 'Nama Kategori',
            align: 'start',
            sortable: false,
            value: 'nama_kategori',
          },
          { text: 'Rencana Anggaran', value: 'rencana_anggaran' },
          { text: 'Anggaran Terpakai', value: 'anggaran_terpakai' },
          { text: 'Sisa Anggaran', value: 'sisa_anggaran' },
        ],
      ringkasanHeader: [
          {
            text: 'Catatan',
            align: 'start',
            sortable: false,
            value: 'catatan',
          },
          { text: 'Tanggal Transaksi', value: 'tanggal_transaksi' },
          { text: 'Jenis Transaksi', value: 'jenis_transaksi' },
          { text: 'Nama Kategori', value: 'nama_kategori' },
          { text: 'Total Uang', value: 'total_uang' },
        ],
      anggaran: [],
    }
  },

  created(){
    this.date = [new Date(new Date().setDate(1)).toISOString().substr(0, 10), (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)],
    
    this.urlKategori = 'https://dompetku-api.herokuapp.com/api/kategori'
      axios.get(this.urlKategori,  {headers: {'Authorization': 'Bearer '+this.token, 'Content-Type': 'application/json', 'Accept': 'application/json'}, params:{paging: this.paging, user_id:this.user_id}})
        .then(response => {
          // console.log(response.data.data.kategori_aktif.data)
          this.kategori = response.data.data.kategori_aktif.data
          
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

  methods:{
      initialize(){
        this.url = 'https://dompetku-api.herokuapp.com/api/dashboard'
        // console.log(this.date)
        this.tanggal_awal = this.date[0]
        this.tanggal_akhir = this.date[1]
        axios.get(this.url,  {headers: {'Authorization': 'Bearer '+this.token, 'Content-Type': 'application/json', 'Accept': 'application/json'}, params:{user_id:this.user_id, tanggal_awal:this.tanggal_awal, tanggal_akhir:this.tanggal_akhir,  kategori:this.kategori_id }})
            .then(response => {
              // console.log(response.data.data.ringkasan_transaksi)
              this.anggaran = response.data.data.list_anggaran
              this.ringkasan = response.data.data.ringkasan_transaksi.data
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

          // this.urlRingkasan = 'https://dompetku-api.herokuapp.com/api/dashboard'
      },

      formatPrice(value) {
        let val = (value/1).toFixed(2).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      },

      konversi_tanggal(date) {
        moment.locale('id') 
        return moment(date).format("DD MMMM YYYY")
      },

      reloadTabel(){
        this.tanggal_awal = this.date[0]
        this.tanggal_akhir = this.date[1]

        axios.get(this.url,  {headers: {'Authorization': 'Bearer '+this.token, 'Content-Type': 'application/json', 'Accept': 'application/json'}, params:{user_id:this.user_id, tanggal_awal:this.tanggal_awal, tanggal_akhir:this.tanggal_akhir, kategori:this.kategori_id}})
            .then(response => {
              this.anggaran = response.data.data.list_anggaran,
              this.ringkasan = response.data.data.ringkasan_transaksi.data
            })
            .catch(() => {
              this.anggaran = []
            });

      },
  },
  computed: {
    dateRangeText () {
      return this.date.join(' ~ ')
    },
  },

  
  
}
</script>

<style>

</style>