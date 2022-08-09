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
      :items="anggaran"
      :items-per-page="5"
      class="elevation-1"
      >
       <template
            v-slot:body="{ items }"
          >
            <tbody v-if="items.length > 0">
              <tr
                v-for="item in items[0]"
                :key="item.kategori_id"
              >
                <td>{{ item.nama_kategori }}</td>
                <td>Rp {{ formatPrice(item.rencana_anggaran)  }}</td>
                <td>Rp {{ formatPrice(item.anggaran_digunakan)  }}</td>
                <td>Rp {{ formatPrice(item.anggaran_sisa)  }}</td>
              </tr>
            </tbody>
            <tbody v-else>
                <tr>
                  <td :colspan="headers.length" style="text-align: center">Data tidak tersedia.</td>
                </tr>
              </tbody>
        </template>
      </v-data-table>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        sm="6"
        md="4">
        <v-card
        class="pa-5">
          <Bar
          :chart-options="chartOptions"
          :chart-data="chartData"
          :chart-id="chartId"
          :dataset-id-key="datasetIdKey"
          :plugins="plugins"
          :css-classes="cssClasses"
          :styles="styles"
          :width="width"
          :height="height"
        /></v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from 'axios'
import { Bar } from 'vue-chartjs/legacy'

import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  components: { Bar },
  props: {
    chartId: {
      type: String,
      default: 'bar-chart'
    },
    datasetIdKey: {
      type: String,
      default: 'label'
    },
    width: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 400
    },
    cssClasses: {
      default: '',
      type: String
    },
    styles: {
      type: Object,
      default: () => {}
    },
    plugins: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      token: localStorage.getItem('token'),
      user_id: localStorage.getItem('id_user'),
      tanggal_awal: '',
      tanggal_akhir: '',
      url:'',
      chartData: {
        labels: [ 'January', 'February', 'March' ],
        datasets: [ { data: [40, 20, 12] } ]
      },
      chartOptions: {
        responsive: true
      },
      date: [],
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
      anggaran: []
    }
  },

  created(){
    this.date = [new Date(new Date().setDate(1)).toISOString().substr(0, 10), (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)],
    this.initialize()    
  },

  methods:{
      initialize(){
        this.url = 'http://localhost:8000/api/dashboard'
        // console.log(this.date)
        this.tanggal_awal = this.date[0]
        this.tanggal_akhir = this.date[1]
        axios.get(this.url,  {headers: {'Authorization': 'Bearer '+this.token, 'Content-Type': 'application/json', 'Accept': 'application/json'}, params:{user_id:this.user_id, tanggal_awal:this.tanggal_awal, tanggal_akhir:this.tanggal_akhir}})
            .then(response => {
              this.anggaran = response.data.data.list_anggaran
            })
            .catch(errors => {
              console.log(errors)
            });
      },

      formatPrice(value) {
        let val = (value/1).toFixed(2).replace('.', ',')
        return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
      },

      reloadTabel(){
        this.tanggal_awal = this.date[0]
        this.tanggal_akhir = this.date[1]
        console.log(this.tanggal_awal)

        axios.get(this.url,  {headers: {'Authorization': 'Bearer '+this.token, 'Content-Type': 'application/json', 'Accept': 'application/json'}, params:{user_id:this.user_id, tanggal_awal:this.tanggal_awal, tanggal_akhir:this.tanggal_akhir}})
            .then(response => {
              this.anggaran = response.data.data.list_anggaran
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