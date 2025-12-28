<script setup>
import { onMounted, ref } from 'vue'
import { BASE_AVATAR } from '@/config'
import ApiService from '@/services/ApiService'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'

const { language } = storeToRefs(useAuthStore())

const service = new ApiService()
const managements = ref([])

async function getAllmanagements() {
  const request = {
    method: 'GET',
    url: '/admin/professionals'
  }

  const response = await service.request(request)

  if (response.success) {
    managements.value = response.data.map((item) => ({
      ...item,
      fullName: JSON.parse(item.fullName),
      profession: JSON.parse(item.profession),
      titlePrefix: JSON.parse(item.titlePrefix)
    }))
  }
}

onMounted(getAllmanagements)
</script>



<template>
  <section class="w-full px-[1%] md:px-[10%] py-6">

    <!-- ===================== HEADER SECTION ===================== -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-6 rounded-xl mb-10">
      <div class="col-span-8 bg-white shadow-xl p-6 rounded-xl">
        <h1 class="text-4xl font-bold text-[#288fb2] mb-4">
          {{ $t('Board of Directories') }}
        </h1>

        <p class="text-gray-700 leading-relaxed">
          {{
            $t(
              'Led by an 11 member team of dedicated and visionary Directors representing different Government Ministries, Department of Defense, Ministries, and parastatals Meyla Sacco is today the marvel of other Sacco’s in the region. At the apex of Meyla Sacco’s Governance structure, stands the Annual Delegates Meeting which elect amongst themselves members of the Board of Directors who help formulate the Society’s policies that drive its business.'
            )
          }}
        </p>
      </div>

      <div class="col-span-4 max-h-[350px] shadow-xl rounded-xl overflow-hidden">
        <img
          src="@/assets/board-meeting.jpg"
          class="w-full h-full object-cover"
        />
      </div>
    </div>

    <!-- ===================== MEET THE BOARD ===================== -->
    <div class="px-[1%] md:px-[7%] w-full py-10 bg-white rounded-xl shadow-md">
      <h1 class="text-3xl md:text-4xl font-bold text-[#288fb2] mb-8 text-center">
        {{ $t('Lets Meet the Board') }}
      </h1>

      <div
        class="bg-[#F5F5F5] w-full p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 rounded-xl"
      >
        <div
          v-for="(manager, index) in managements"
          :key="index"
          class="border bg-white shadow-lg rounded-2xl flex flex-col items-center justify-start group p-6 transition hover:bg-[#288fb2] hover:shadow-2xl"
        >

          <!-- IMAGE -->
          <div class="h-28 w-28 mb-4 rounded-full overflow-hidden shadow-md">
            <img
              :src="BASE_AVATAR + '11.png-1716331107506-127810897.png'"
              class="w-full h-full object-cover"
            />
          </div>

          <!-- NAME -->
          <h1
            class="font-bold text-[18px] text-center mb-2 transition group-hover:text-white"
          >
            {{
              language === 'en'
                ? manager.titlePrefix.en + ' ' + manager.fullName.en
                : manager.titlePrefix.ti + ' ' + manager.fullName.ti
            }}
          </h1>

          <!-- PROFESSION -->
          <p
            class="font-medium text-sm text-gray-600 text-center transition group-hover:text-[#F5F5F5]"
          >
            {{ language === 'en' ? manager.profession.en : manager.profession.ti }}
          </p>
        </div>
      </div>
    </div>

    <!-- FOOTER TITLE -->
    <h1 class="text-4xl text-center mt-12 font-bold text-[#288fb2]">
      {{ $t('Our Memories') }}
    </h1>
  </section>
</template>
