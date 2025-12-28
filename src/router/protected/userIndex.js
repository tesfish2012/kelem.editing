const USER_ROUTES = [
  {
    path: '/users',
    component: () => import('@/views/protected/users/UserLayout.vue'),
    meta: {
      requiresAuth: true,
      role: ['user'],
      title: 'Kaleb - Users'
    },
    children: [
      {
        path: 'dashboard',
        name: 'user-dashboard',
        component: () => import('@/views/protected/users/UserDashboard.vue')
      },
      {
        path: 'books',
        name: 'user-books',
        component: () => import('@/views/protected/users/UserBooks.vue')  
      },
      {
        path: 'profile',
        name: 'user-profile',
        component: () => import('@/views/protected/users/UserProfile.vue')
      },
    ]
  }
];

export default USER_ROUTES;
