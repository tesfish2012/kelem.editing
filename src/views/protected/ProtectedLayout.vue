<!-- A component visited when a user is loggedIn -->
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import SideBar from '@/components/protected/SideBar.vue'
import BaseLoader from '@/components/base/BaseLoading.vue'
import { BASE_AVATAR } from '@/config'
import { useMainStore } from '@/stores/index.js'

const store = useMainStore()
import { useAuthStore } from '@/stores/auth'
// import BaseFileInput from '@/components/base/BaseFileInput.vue'
import UserService from '@/services/UserService'
const avatar = ref(localStorage.getItem('avatar'))
const name = ref(localStorage.getItem('name'))

import SIDEBARITEMS from '@/constants/protected'
// import { faL } from '@fortawesome/free-solid-svg-icons'
const items = SIDEBARITEMS.ADMIN_TABS
const { logOut } = useAuthStore()
const router = useRouter()

let showModal = ref(false)
const hideDropdown = () => {
  showModal.value = false
}

let image = ref('')
const captureImage = async ($event) => {
  image.value = $event.target.files[0]

  const formData = new FormData()
  formData.append('avatar', image.value)
  const response = await UserService.changeProfile(formData)
  if (response.success) {
    // alert('profile picture successfuly updated')
    localStorage.setItem('avatar', response.data.avatar)
    avatar.value = response.data.avatar
    // alert(avatar.value)
  }
}

const userLogOut = () => {
  if (logOut()) {
    router.push('/')
  }
}
const handleClickOutside = (event) => {
  const dropdown = document.querySelector('.toggleDropdown')

  // Check if the clicked element is outside of the dropdown
  if (dropdown && !dropdown.contains(event.target)) {
    // Hide the dropdown
    showModal.value = false
  }
}

onMounted(() => {
  // Attach click event listener to the entire document
  document.addEventListener('click', handleClickOutside)
})

function toggleNavBar() {
  store.navOpened = !store.navOpened
}
// Clean up the event listener on component unmount
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

let showSidebar = ref(false)

const hideSidebar = () => {
  showSidebar.value = false
}
</script>

<template>
  <section class="w-full bg-[#288fb2]/5">
    <div class="grid grid-cols-12 relative">
      <SideBar
        barClass="md:col-span-2 max-sm:hidden py-4 flex flex-col gap-4  shadow-lgx px-2 h-screen sticky left-0 top-0 z-10 bottom-0 max-md:overflow-auto"
      ></SideBar>

      <aside
        class="fixed inset-0 flex flex-col gap-4 px-2 h-screen bg-white border rounded-xl shadow-xl z-50 transition-all ease-in-out duration-500 delay-150 py-4"
        v-if="showSidebar"
      >
        <div class="flex justify-between px-4 md:hidden items-center h-[48px]">
          <img src="@/assets/login.jpg" alt="Logo" class="w-[48px] rounded-full" />
          <button @click="hideSidebar">
            <font-awesome-icon icon="times" class="text-2xl"></font-awesome-icon>
          </button>
          <!-- <p class="text-xl font-semibold ml-2">Meyla</p> -->
        </div>
        <hr class="border-b border-0 border-[#288fb2]" />
        <ul class="flex flex-col max-h-screen overflow-auto items-centerz justify-center">
          <li v-for="(item, index) in items" :key="index" class="text-whiteX">
            <router-link
              :to="{ name: item.name }"
              @click="hideSidebar"
              :class="{
                'text-[#288fb2] font-bold  bg-white border-2 border-t-0 border-b-0 border-r-0 border-l-[#288fb2]':
                  $route.name === item.name
              }"
              exact
              active-class=""
              class="py-1 px-2 rounded-lgx hover:bg-[#288fb2] hover:text-white transition-colors duration-200 flex gap-4"
              exact-path="true"
            >
              <font-awesome-icon
                v-if="item.icon"
                :icon="item.icon"
                class="bg-white rounded w-[10%]"
              />
              <span class="w-[90%]"> {{ $t(`${item.label}`) }}</span>
            </router-link>
          </li>
        </ul>
      </aside>
      <section
        class="md:col-span-10 col-span-12 w-full relative rounded flex flex-col gap-4 p-2 h-full"
      >
        <header class="flex items-center justify-between zsticky top-0 p-2 bg-[#288fb2]/5x p">
        
          <div class="md:hidden">
            
            <button @click="showSidebar = !showSidebar">
              <font-awesome-icon
                icon="bars"
                @click="toggleNavBar"
                class="text-yellow-500x"
              ></font-awesome-icon>
            </button>
          </div>

          <div></div>

          <div class="w-fullz flex justify-center items-center gap-2">
            <!-- <div class="w-fullz">
              <input type="search" placeholder="Search" class="px-2 py-1" />
            </div> -->

            <div class="relative text-center">
              <!-- <font-awesome-icon icon="bell" class="text-blue-900 text-xl"></font-awesome-icon> -->
            </div>
            <button @click="showModal = !showModal" class="flex gap-4 relative">
              <div class="w-8 h-8 overflow-hidden relative">
                <img
                  v-if="avatar"
                  :src="BASE_AVATAR + `${avatar}`"
                  alt="Profile"
                  class="w-full h-full rounded-full"
                />
                <img
                  v-else
                  src="@/assets/account.png"
                  alt="my profile"
                  class="w-full h-full rounded-full"
                />
              </div>
              <div class="flex px-2 py-1 gap-4 justify-between items-center bg-white/70">
                <p class="">{{ name }}</p>
                <font-awesome-icon
                  icon="chevron-down"
                  class="absolutex text-lgz font-semibold"
                ></font-awesome-icon>
              </div>
              <div
                v-if="showModal"
                class="absolute bg-white/100 shadow-lg top-[100%] flex flex-col right-0 px-12 py-4 z-20 gap-4"
                ref="toggleDropdown"
                zdata-aos="fade-up"
              >
                <button class="self-end text-red-400 text-2xl" @click="showModal = false">x</button>
                <div class="w-20 h-20 relative p-1">
                  <img
                    v-if="avatar"
                    :src="BASE_AVATAR + `${avatar}`"
                    alt="Profile"
                    class="w-full h-full rounded-full"
                  />
                  <img v-else src="@/assets/account.png" alt="my profile" class="w-full h-full" />

                  <button class="absolute right-0 bottom-3 cursor-pointer">
                    <input
                      class="absolute right-0 bottom-0 w-full h-full opacity-0 cursor-pointer"
                      type="file"
                      @change="captureImage($event)"
                    />
                    <font-awesome-icon
                      icon="camera"
                      class="text-xl inset-0 cursor-pointer"
                    ></font-awesome-icon>
                  </button>
                </div>
                <hr class="border w-full" />
                <div class="flex flex-col gap-4">
                  <div class="flex flex-col">
                    <router-link
                      :to="{ name: 'setting' }"
                      class="flex gap-2 items-center text-sm"
                      exact
                      active-class="meyla-color4"
                      @click="hideDropdown"
                      ><font-awesome-icon icon="cog"></font-awesome-icon>
                      <span>{{ $t('Settings') }}</span></router-link
                    >
                    <!-- <router-link
                      :to="{ name: 'analytics' }"
                      class="flex gap-2 items-center text-sm"
                      exact-active-class="meyla-color4"
                      @click="hideDropdown"
                      ><font-awesome-icon icon="line-chart"></font-awesome-icon
                      ><span>Analytics</span>
                    </router-link> -->
                  </div>
                  <hr class="border" />
                  <router-link
                    :to="{ name: 'account' }"
                    class="flex gap-2 items-center text-sm"
                    exact-active-class="meyla-color4"
                    @click="hideDropdown"
                  >
                    <font-awesome-icon icon="user-circle" class="text-sm"></font-awesome-icon>
                    <span> {{ $t('My Account') }}</span></router-link
                  >

                  <button class="flex gap-2 items-center text-red-600 text-sm" @click="userLogOut">
                    <font-awesome-icon icon="sign-out-alt" class="text-red-600"></font-awesome-icon>
                    <span> {{ $t('Log out') }}</span>
                  </button>
                </div>
              </div>
            </button>
          </div>
        </header>
        <div>
          <base-loader
            class="bg-white mx-auto my-auto"
            v-if="store.isComponentLoading"
          ></base-loader>
          <router-view v-else></router-view>
        </div>
      </section>
    </div>
  </section>
</template>
