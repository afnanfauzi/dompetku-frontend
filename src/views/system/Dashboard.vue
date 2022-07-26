<template>
  <v-container>
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
              append-icon="mdi-calendar"
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
              @click="$refs.dialog.save(date)"
            >
              OK
            </v-btn>
          </v-date-picker>
        </v-dialog>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
        sm="4"
      >
        <v-card
        elevation="2"
        >
          <v-card-title>Pemasukan</v-card-title>
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
          <v-card-title>Pengeluaran</v-card-title>
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
    
  </v-container>
</template>

<script>
export default {
  data: () => ({
      date: [new Date(new Date().setDate(1)).toISOString().substr(0, 10), (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)],
      modal: false,
    }),
  computed: {
    dateRangeText () {
      return this.date.join(' ~ ')
    },
  },
}
</script>

<style>

</style>