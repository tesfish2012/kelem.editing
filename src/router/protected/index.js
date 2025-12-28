const PROTECTED_ROUTES = [
  {
    path: '/app',
    component: () => import('@/views/protected/ProtectedLayout.vue'),
    meta: {
      requiresAuth: true,
      title: 'kaleb - Home',
      role: ['admin', 'staff']
    },
    children: [
      {
        path: '',
        name: 'dashboard',

        component: () => import('@/components/protected/MainContent.vue')
      },
      {
        path: 'brand',
        name: 'brand',
        meta: {
          title: 'Kaleb - Branding'
        },
        component: () => import('@/views/protected/BrandingView.vue')
      },
      {
        path: 'messages',
        name: 'messages',
        meta: {
          title: 'kaleb - Messages'
        },
        component: () => import('@/views/protected/MessageLayout.vue')
      },
      {
        path: 'management',
        name: 'app-management',
        meta: {
          title: 'kaleb - Management'
        },
        component: () => import('@/views/protected/ManagementView.vue')
      },

      {
        path: 'news',
        name: 'posts',
        meta: {
          title: 'kaleb - News'
        },
        component: () => import('@/views/protected/NewsView.vue')
      },
      {
        path: 'testimonials',
        name: 'testimonials',
        meta: {
          title: 'kaleb - Testimonials'
        },
        component: () => import('@/views/protected/TestimonialsView.vue')
      },
      {
        path: 'products',
        name: 'products',
        meta: {
          title: 'kaleb - Prooducts'
        },
        component: () => import('@/views/protected/ProductsView.vue')
      },
      {
        path: 'services',
        name: 'in-services',
        meta: {
          title: 'kaleb - Services'
        },
        component: () => import('@/views/protected/ServicesView.vue')
      },
      {
        path: 'subServices/:id',
        name: 'in-subServices',
        meta: {
          title: 'kaleb - SubServices'
        },
        component: () => import('@/views/protected/SubServicesView.vue'),
        props: true
      },
      {
        path: 'services/trashed',
        name: 'trashedServices',
        meta: {
          title: 'kaleb - Services'
        },
        component: () => import('@/views/protected/TrashedService.vue')
      },
      {
        path: 'vacancies/trashed',
        name: 'trashedVacancy',
        meta: {
          title: 'kaleb - Vacancy'
        },
        component: () => import('@/views/protected/TrashedVacancy.vue')
      },
      {
        path: 'achivements/trashed',
        name: 'trashedAchivements',
        meta: {
          title: 'kaleb - achivements'
        },
        component: () => import('@/views/protected/TrashedAchivement.vue')
      },
      {
        path: 'news/trashed',
        name: 'trashedNews',
        meta: {
          title: 'kaleb -News'
        },
        component: () => import('@/views/protected/TrashedNews.vue')
      },
      {
        path: 'partners/trashed',
        name: 'trashedPartners',
        meta: {
          title: 'kaleb -Partners'
        },
        component: () => import('@/views/protected/TrashedPartners.vue')
      },
      {
        path: 'testimonials/trashed',
        name: 'trashedTestimonials',
        meta: {
          title: 'kaleb -testimonials'
        },
        component: () => import('@/views/protected/TrashedTestimonials.vue')
      },
      {
        path: 'service-detail',
        name: 'service-detail',
        meta: {
          title: 'kaleb - Services'
        },
        component: () => import('@/views/protected/ServiceDetail.vue')
      },
      // added
      {
        path: 'achievements',
        name: 'Achievements',
        meta: {
          title: 'kaleb - Achievements'
        },
        component: () => import('@/views/protected/AchievementsView.vue')
      },
      {
        path: 'calculators',
        name: 'calculators',
        meta: {
          title: 'kaleb - Calculators'
        },
        component: () => import('@/views/protected/LoanView.vue')
      },
      {
        path: 'gallery',
        name: 'closed-gallery',
        meta: {
          title: 'kaleb - Galleries'
        },
        component: () => import('@/views/protected/createGallery.vue')
      },
      {
        path: 'videos',
        name: 'Videos',
        meta: {
          title: 'kaleb - videos'
        },
        component: () => import('@/views/protected/createVideo.vue')
      },
      {
        path: 'organization',
        name: 'Organizational',
        meta: {
          title: 'kaleb - Organizational stracture'
        },
        component: () => import('@/views/protected/createOrganization.vue')
      },

      {
        path:'kaleb-students',
        name:'kaleb-students',
        meta:{
          title:'Kaleb-Students'
        },
        component: () => import('@/views/protected/StudentsView.vue')
      },
      {
        path: 'grades',
        name: 'grades',
        meta: {    
          title: 'kaleb - Grades'
        },
        component: () => import('@/views/protected/GradesView.vue')   
      } ,
      {
        path: 'books',
        name: 'books',
        meta: {
          title: 'kaleb - Books'
        },
        component: () => import('@/views/protected/BooksView.vue')
      },  
      // ended
      {
        path: '/services/:title',
        name: 'service-detail',
        props: true,
        meta: {
          title: 'kaleb - Service Detail'
        },
        component: () => import('@/views/protected/ServiceDetail.vue')
      },
      {
        path: 'vacancy',

        children: [
          {
            path: '',
            name: 'in-vacancy',
            meta: {
              requiresAuth: true,
              title: 'kaleb - Messages'
            },
            component: () => import('@/views/protected/VacancyView.vue')
          },
          {
            path: 'add',
            name: 'createvacancy',
            component: () => import('@/views/protected/CreateCareer.vue')
          },
          {
            path: ':id',
            name: 'jobApplicants',

            component: () => import('@/views/protected/CareerApplicants.vue')
          }
        ]
      },
      {
        path: 'partners',
        name: 'partners',
        meta: {
          title: 'kaleb - Partners'
        },
        component: () => import('@/views/protected/PartnersView.vue')
      },
      {
        path: 'setting',
        component: () => import('@/views/protected/SettingView.vue'),
        children: [
          // {
          //   path: '',
          //   name: 'setting',
          //   meta: {
          //     title: 'kaleb - System Settings'
          //   },
          //   component: () => import('@/components/protected/HeroContent.vue')
          // },
          {
            path: 'infography',
            name: 'infographic',
            meta: {
              title: 'kaleb - System Settings'
            },
            component: () => import('@/components/protected/SettingContent.vue')
          },
          {
            path: '',
            name: 'setting',
            meta: {
              title: 'kaleb - System Settings'
            },
            component: () => import('@/views/protected/AboutUs.vue')
          },
          {
            path: 'faqs',
            name: 'faqs',
            meta: {
              title: 'kaleb - FAQs',
              requiresAuth: true,
              role: 'admin'
            },
            component: () => import('@/views/protected/FaqsView.vue')
          },
          {
            path: 'policy',
            name: 'policy',
            meta: {
              title: 'kaleb - policy',
              requiresAuth: true,
              role: 'admin'
            },
            component: () => import('@/views/protected/PrivacyPolicyView.vue')
          },
          // {
          //   path: 'terms',
          //   name: 'terms',
          //   meta: {
          //     title: 'kaleb - Terms',
          //     requiresAuth: true,
          //     role: 'admin'
          //   },
          //   component: () => import('@/views/protected/TermsView.vue')
          // }
        ]
      },

      {
        path: 'subscribers',
        name: 'subscribers',
        meta: {
          title: 'kaleb - Subscribers'
        },
        component: () => import('@/views/protected/SubscribersView.vue')
      },

      {
        path: 'analytics',
        name: 'analytics',
        meta: {
          title: 'kaleb - Analytics'
        },
        component: () => import('@/views/protected/AnalyticsView.vue')
      },
      {
        path: 'account',
        name: 'account',
        meta: {
          title: 'My - Profile'
        },
        component: () => import('@/views/protected/AccountLayout.vue')
      },
    ]
  }
]

export default PROTECTED_ROUTES
