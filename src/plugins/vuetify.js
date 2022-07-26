import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';


Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        themes: {
          light: {
            primary: '#000A12',
            secondary: '#FFFFFF',
            sidebar:'#1F263E',
            accent: '#339989',
            error: '#FF6B6B',
            base:'#E7E9EB',
          },
        },
      },
});
