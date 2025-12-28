// main.js

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/main.css'

import AOS from 'aos'
import 'aos/dist/aos.css'

import i18n from '@/plugins/i18n'

// Google analytics
import VueGtag from 'vue-gtag'

//fontawesome icons start
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import {
  faCoffee,
  faBook,
  faUser,
  faCog,
  faHome,
  faSignOutAlt,
  faEnvelope,
  faPhone,
  faChevronLeft,
  faChevronRight,
  faChevronUp,
  faChevronDown,
  faMapMarkerAlt,
  faComment,
  faStickyNote,
  faTag,
  faTachometerAlt,
  faCheck,
  faCalendar,
  faLongArrowAltRight,
  faLongArrowAltUp,
  faCalendarAlt,
  faEdit,
  faTrash,
  faCommentDots,
  faCogs,
  faSuitcase,
  faBoxOpen,
  faQuoteLeft,
  faHandshake,
  faNewspaper,
  faLineChart,
  faUserCircle,
  faEye,
  faBell,
  faCamera,
  faBars,
  faGlobe,
  faBullseye,
  faBinoculars,
  faBalanceScale,
  faBrain,
  faPlus,
  faSync,
  faSearch,
  faClock,
  faMoneyBillAlt,
  faChartLine,
  faFile,
  faLanguage,
  faUsers,
  faHandHoldingUsd,
  faUserFriends,
  faDollarSign,
  faMemory,
  faNetworkWired,
  faTimes,
  faBookOpen
} from '@fortawesome/free-solid-svg-icons'

import {
  faFacebook,
  faTwitter,
  faYoutube,
  faTelegram,
  faLinkedin
} from '@fortawesome/free-brands-svg-icons'

library.add(
  faBookOpen,
  faBook,
  faCoffee,
  faUser,
  faCog,
  faHome,
  faSignOutAlt,
  faEnvelope,
  faPhone,
  faFacebook,
  faTwitter,
  faTelegram,
  faLinkedin,
  faYoutube,
  faChevronLeft,
  faChevronRight,
  faChevronDown,
  faChevronUp,
  faMapMarkerAlt,
  faComment,
  faStickyNote,
  faTag,
  faTachometerAlt,
  faCheck,
  faCalendar,
  faCalendarAlt,
  faLongArrowAltRight,
  faLongArrowAltUp,
  faEdit,
  faTrash,
  faCommentDots,
  faCogs,
  faSuitcase,
  faBoxOpen,
  faQuoteLeft,
  faHandshake,
  faNewspaper,
  faLineChart,
  faUserCircle,
  faEye,
  faBell,
  faCamera,
  faBars,
  faGlobe,
  faBullseye,
  faBinoculars,
  faBalanceScale,
  faBrain,
  faPlus,
  faSync,
  faSearch,
  faClock,
  faMoneyBillAlt,
  faChartLine,
  faFile,
  faLanguage,
  faUsers,
  faHandHoldingUsd,
  faUserFriends,
  faDollarSign,
  faMemory,
  faNetworkWired,
  faTimes
)
//
AOS.init({ duration: 1000 })
//Fontawesomes importing end

// import VueToastify from 'vue-toastify'
import App from './App.vue'
import router from './router'

const app = createApp(App)

//register font awesome
app.component('font-awesome-icon', FontAwesomeIcon)

app.use(createPinia())
app.use(router)

app.use(i18n)

app.use(VueGtag, {
  config: {
    id: 'G-GB5FV9PDD1'
  }
})

// app.use(VueToastify)
app.mount('#app')
