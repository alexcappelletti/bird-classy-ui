/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import colors from 'vuetify/lib/util/colors'

// Composables
import { createVuetify } from 'vuetify'


// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
/*export default createVuetify({
  theme: {
    defaultTheme: 'light',
  },
})*/

export default createVuetify({
  theme: {
    themes: {
      light: {
        dark: false,
        colors: {
          'Primary20':'#003826',
          'Primary':'#206A4E',
          'Secondary95':'#D8F8E5',
          'SurfaceVariant':'#DBE5DD',
          'OnSurfaceVariant':'#404943',
          'Tertiary35':'#24586C',
          'Tertiary':'#3D6373',
          'TertiaryContainer':'#001F29',
          'Highlight':'#6750A4',
          'White': '#FFFFFF'
        },
      },
    },
  },
})
