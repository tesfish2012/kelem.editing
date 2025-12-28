import HomeView from '@/views/HomeView.vue'

const OPEN_ROUTES = [
  {
    path: '/',
    component: HomeView,
    meta: {
      title: 'Kaleb SACCO',
      requiresAuth: false
    },
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('@/views/OpenLayout.vue')
      },

      {
        path: '/contact-us',
        name: 'contact-us',
        meta: {
          title: 'Kaleb  - Contact us',
          requiresAuth: false
        },
        component: () => import('@/views/ContactUs.vue')
      },
      {
        path: '/services',
        name: 'services',
        meta: {
          title: 'Kaleb - Our Services',
          requiresAuth: false
        },
        component: () => import('@/views/ServicesView.vue')
      },
      {
        path: '/careers',
        name: 'careers',
        meta: {
          title: 'Kaleb - Our Careers',
          requiresAuth: false
        },
        component: () => import('@/views/VacancyView.vue')
      },
      {
        path: '/products',
        name: 'products',
        meta: {
          title: 'Kaleb - Our Works',
          requiresAuth: false,
          role: 'admin'
        },
        component: () => import('@/views/WorksView.vue')
      },
      {
        path: '/news',
        name: 'news',
        meta: {
          title: 'Kaleb  - News',
          requiresAuth: false
        },
        component: () => import('@/views/NewsView.vue'),
        exact: true
      },
      {
        path: '/e-learning',
        name: 'e-learning',
        meta: {
          title: 'Kaleb  - E-Learning',
          requiresAuth: false
        },
        component: () => import('@/views/ElerningLogin.vue')  
      },
      {
       path: '/e-learning-register',
          name: 'e-learning-register',
          meta: {
            title: 'Kaleb - E-Learning',
            requiresAuth: false
          },
          component: () => import('@/views/ElerningRegister.vue')  
      },

      {
        path: '/works/:title',
        name: 'product-detail',
        meta: {
          title: 'Kaleb  - Product Detail',
          requiresAuth: false
        },
        component: () => import('@/views/ProductDetail.vue'),
        props: true,
        exact: false
      },
      {
        path: '/news/:title',
        name: 'new-detail',
        meta: {
          title: 'Kaleb - New Detail',
          requiresAuth: false
        },
        component: () => import('@/views/NewsDetail.vue'),

        props: true
      },
      {
        path: '/services/:title',
        name: 'serviceDetail',
        meta: {
          title: 'Kaleb - Service Detail',
          requiresAuth: false
        },
        component: () => import('@/views/ServiceDetail.vue'),
        props: true
      },
      {
        path: '/faqs',
        name: 'open-faqs',
        meta: {
          title: 'Kaleb  -FAQs',
          requiresAuth: false
        },
        component: () => import('@/views/FaqsLayout.vue')
      },
      {
        path: '/partnership',
        name: 'partnership',
        meta: {
          title: 'Kaleb - Our Services',
          requiresAuth: false
        },
        component: () => import('@/views/PartnershipView.vue')
      },
      {
        path: '/careers',
        name: 'career',
        meta: {
          title: 'Kaleb - Our Careers',
          requiresAuth: false
        },
        component: () => import('@/views/VacancyView.vue')
      },
      {
        path: '/careers/:title',
        name: 'career-detail',
        meta: {
          title: 'Kaleb - Career Detail',
          requiresAuth: false
        },
        component: () => import('@/views/CareerDetail.vue'),
        props: true
      },
      {
        path: '/about',
        name: 'about-us',
        meta: {
          title: 'Kaleb - About Us',
          requiresAuth: false
        },
        // route level code-splitting
        // this generates a separate chunk (About.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import('@/views/AboutUs.vue')
      },
      {
        path: '/management',
        name: 'management',
        meta: {
          title: 'Kaleb - Management',
          requiresAuth: false
        },
        component: () => import('@/views/ManagementView.vue')
      },
      {
        path: '/achievements',
        name: 'achievements',
        meta: {
          title: 'Kaleb  - Achievements',
          requiresAuth: false
        },
        component: () => import('@/views/AchievementsView.vue'),
        exact: true
      },
      {
        path: '/register',
        name: 'open-register',
        meta: {
          title: 'Kaleb -Students',
          requiresAuth: false
        },
        component: () => import('@/views/StudentView.vue')
      },
      {
        path: '/gallery',
        name: 'open-gallery',
        meta: {
          title: 'Kaleb  - Galleries',
          requiresAuth: false
        },
        component: () => import('@/views/GalleryView.vue'),
        exact: true
      },

      {
        path: '/structure',
        name: 'structure',
        meta: {
          title: 'Kaleb  - Organizational Structure',
          requiresAuth: false
        },
        component: () => import('@/views/OrganizationalStructure.vue'),
        exact: true
      },
      // {
      //   path: '/calculator',
      //   name: 'Loan',
      //   meta: {
      //     title: 'Kaleb  - Loan calculator',
      //     requiresAuth: false
      //   },
      //   component: () => import('@/views/LoanCalculator.vue'),
      //   exact: true
      // },
      {
        path: '/sitemap',
        name: 'sitemap',
        meta: {
          title: 'Kaleb -Sitemap',
          requiresAuth: false
        },
        component: () => import('@/views/SitemapView.vue')
      },
      {
        path: '/privacy',
        name: 'privacy',
        meta: {
          title: 'Kaleb -Privacy',
          requiresAuth: false
        },
        component: () => import('@/views/PrivacyView.vue')
      }
    ]
  },

  {
    path: '/forgot-password',
    name: 'forgot-password',
    meta: {
      title: 'Kaleb',
      requiresAuth: false
    },
    component: () => import('@/views/ForgotPassword.vue')
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Kaleb',
      requiresAuth: false
    },
    component: () => import('@/views/LoginView.vue')
  },

  {
    path: '/reset-password',
    name: 'reset-password',
    meta: {
      title: 'Kaleb',
      requiresAuth: false
    },
    component: () => import('@/views/ResetPassword.vue')
  },

  
]

export default OPEN_ROUTES
