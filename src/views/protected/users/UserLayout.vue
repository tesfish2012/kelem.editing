<template>
  <div class="flex min-h-screen bg-gray-100">

    <!-- ================= SIDEBAR ================= -->
    <aside
      :class="[
        'bg-gradient-to-b from-[#288FB2] to-[#1d6f88] text-white flex flex-col shadow-xl',
        sidebarOpen ? 'w-64' : 'w-16'
      ]"
      class="transition-width duration-300"
    >

      <!-- Hamburger toggle -->
      <button
        @click="sidebarOpen = !sidebarOpen"
        class="p-4 focus:outline-none md:hidden"
      >
        <font-awesome-icon :icon="['fas', 'bars']" class="text-white text-xl" />
      </button>

      <!-- Brand -->
      <div
        class="p-6 text-2xl font-bold tracking-wide border-b border-white/20 flex items-center justify-between"
        v-if="sidebarOpen"
      >
        <span><span class="text-white">Kaleb</span> <span class="text-white/80">Portal</span></span>
      </div>

      <!-- User Info -->
      <div
        class="p-6 flex items-center gap-3 border-b border-white/20"
        v-if="sidebarOpen"
      >
        <img
          src="https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff"
          class="w-12 h-12 rounded-full border-2 border-white shadow-md"
        />
        <div>
          <p class="text-sm text-white/70">Welcome</p>
          <p class="font-semibold">User</p>
        </div>
      </div>

      <!-- Sidebar Menu -->
      <nav class="flex-1 px-2 py-4 space-y-2">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="flex items-center gap-3 px-4 py-3 rounded-lg text-white/90 hover:bg-white/20 hover:shadow transition-all"
          active-class="bg-white/25 border-l-4 border-white pl-3"
        >
          <font-awesome-icon :icon="item.icon" class="w-5 h-5"/>
          <span v-if="sidebarOpen">{{ item.label }}</span>
        </router-link>
      </nav>

      <!-- Logout -->
      <button
        @click="showLogoutModal = true"
        class="m-4 px-4 py-3 rounded-lg bg-red-500 hover:bg-red-600 transition-all text-white font-semibold"
        v-if="sidebarOpen"
      >
        Logout
      </button>
    </aside>

    <!-- ================= MAIN ================= -->
    <div class="flex-1 flex flex-col">
      <header class="w-full bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <h1 class="text-xl font-semibold text-gray-700">Student Dashboard</h1>
        <p class="text-sm text-gray-400">Visit available resources</p>
      </header>

      <main class="flex-1 p-8">
        <router-view />
      </main>
    </div>

    <!-- ================= LOGOUT CONFIRM MODAL ================= -->
    <div
      v-if="showLogoutModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4"
    >
      <div class="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm animate-fadeIn">

        <h2 class="text-xl font-bold text-gray-800 mb-4">Confirm Logout</h2>
        <p class="text-gray-600 mb-6">Are you sure you want to log out?</p>

        <div class="flex justify-end gap-3">
          <button
            @click="showLogoutModal = false"
            class="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-800"
          >
            Cancel
          </button>

          <button
            @click="logout"
            class="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white"
          >
            Yes, Logout
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const router = useRouter()
const authStore = useAuthStore()

const sidebarOpen = ref(true)
const showLogoutModal = ref(false)

const menuItems = ref([
  { label: 'Dashboard', path: '/users/dashboard', icon: ['fas', 'tachometer-alt'] },
  { label: 'Profile', path: '/users/profile', icon: ['fas', 'user'] },
  { label: 'My Books', path: '/users/books', icon: ['fas', 'book'] }
])

// Responsive sidebar
const handleResize = () => {
  sidebarOpen.value = window.innerWidth >= 768
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})

// Logout action
const logout = () => {
  showLogoutModal.value = false
  localStorage.removeItem('access_token')
  router.push('/e-learning')
}
</script>


<style scoped>
aside {
  backdrop-filter: blur(6px);
}

.transition-width {
  transition-property: width;
}

@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.animate-fadeIn {
  animation: fadeIn 0.2s ease-out;
}
</style>

