<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import BaseInput from '@/components/base/BaseInput.vue';
import BaseButton from '@/components/base/BaseButton.vue';
import StatisticsService from '@/services/StatisticsService';
import swal from 'sweetalert';

const router = useRouter();

const statistics = ref({
  studentEnrolled: '',
  classCompeted: '',
  certifiedTeachers: '',
  trash: false,
});

function goBack() {
  router.back();
}

const statisticsList = ref([]);
const errorMessage = ref('');
const successMessage = ref('');
const editMode = ref(false);
const editId = ref(null);
const showModal = ref(false);

const saveStatistics = async () => {
  const payload = {
    studentEnrolled: statistics.value.studentEnrolled,
    classCompeted: statistics.value.classCompeted,
    certifiedTeachers: statistics.value.certifiedTeachers,
    trash: statistics.value.trash,
  };

  try {
    const response = await StatisticsService.createOrUpdateStatistics(
      editMode.value ? editId.value : '',
      payload
    );
    if (response.success) {
      successMessage.value = response.message;
      swal({
        title: response.message,
        icon: 'success',
      });
      fetchStatistics();
      resetForm();
      closeModal();
    }
  } catch (error) {
    if (error.response && error.response.status === 404) {
      errorMessage.value = error.response.data.message;
    } else {
      router.push({ name: 'NetworkError' });
    }
  }
};

const fetchStatistics = async () => {
  try {
    const response = await StatisticsService.getAllStatistics();
    statisticsList.value = response.data;
  } catch (error) {
    errorMessage.value = 'Failed to fetch statistics';
  }
};

const editItem = (id) => {
  const item = statisticsList.value.find((stat) => stat.id === id);
  if (item) {
    statistics.value = {
      studentEnrolled: item.studentEnrolled,
      classCompeted: item.classCompeted,
      certifiedTeachers: item.certifiedTeachers,
      trash: item.trash,
    };
    editMode.value = true;
    editId.value = id;
    showModal.value = true;
  }
};

const deleteItem = async (id) => {
  try {
    const response = await StatisticsService.deleteStatisticsById(id);
    if (response.success) {
      successMessage.value = response.message;
      fetchStatistics();
    }
  } catch (error) {
    errorMessage.value = 'Failed to delete statistics';
  }
};

const searchStatistics = ref('');

const filteredStatistics = computed(() => {
  if (searchStatistics.value) {
    return statisticsList.value.filter((stat) =>
      Object.values(stat).some((value) =>
        JSON.stringify(value).toLowerCase().includes(searchStatistics.value.toLowerCase())
      )
    );
  } else {
    return statisticsList.value;
  }
});

const resetForm = () => {
  statistics.value = {
    studentEnrolled: '',
    classCompeted: '',
    certifiedTeachers: '',
    trash: false,
  };
  editMode.value = false;
  editId.value = null;
};

const closeModal = () => {
  showModal.value = false;
  resetForm();
};

onMounted(() => {
  fetchStatistics();
});
</script>


<template>
  <section class="w-full py-4 bg-white border rounded-xl px-[2%] min-h-screen">
    <div class="flex flex-col w-full">
      <div class="flex flex-start gap-4">
        <font-awesome-icon
          size="20"
          @click="goBack"
          icon="chevron-left"
          class="bg-white rounded mt-2"
        />
        <h2 class="text-xl font-bold">Statistics</h2>
      </div>
      <div class="flex self-end gap-4 items-center justify-center">
        <base-input
          inputClass="border outline-none border-[#288fb2]"
          type="search"
          class="px-2 py-1"
          v-model="searchStatistics"
          placeholder="Search ..."
        />
        <font-awesome-icon icon="sync" class="text-lg text-[#288fb2]" />
        <BaseButton @click="showModal = true" class="p-0 w-full">Add</BaseButton>
      </div>
    </div>
    <div v-if="statisticsList.length" class="w-full">
      <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
      <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
      <div class="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 place-items-start bg-[#F5F5F5]">
        <div v-for="stat in filteredStatistics" :key="stat.id" class="w-full">
          <div class="shadow p-4 bg-white">
            <div>
              <h3 class="font-bold">Students Enrolled: {{ stat.studentEnrolled }}</h3>
              <p>Classes Completed: {{ stat.classCompeted }}</p>
              <p>Certified Teachers: {{ stat.certifiedTeachers }}</p>
            </div>
            <div class="flex justify-end space-x-2">
              <button @click="editItem(stat.id)" class="text-blue-500">Edit</button>
              <button @click="deleteItem(stat.id)" class="text-red-500">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="showModal"
      class="overflow-auto fixed inset-0 z-50 bg-black/70 modal flex justify-center items-center"
    >
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div class="text-center">
          <h3 class="text-lg font-medium text-gray-900">
            {{ editMode ? 'Edit Statistics' : 'Add Statistics' }}
          </h3>
          <div class="mt-4">
            <form @submit.prevent="saveStatistics" class="flex flex-col gap-4">
              <div class="flex flex-wrap -mx-2">
                <div class="w-full px-2 mb-4">
                  <BaseInput
                    v-model="statistics.studentEnrolled"
                    type="number"
                    required
                    inputClass="p-2 border border-gray-300 rounded"
                    placeholder="Students Enrolled"
                  />
                </div>
                <div class="w-full px-2 mb-4">
                  <BaseInput
                    v-model="statistics.classCompeted"
                    type="number"
                    required
                    inputClass="p-2 border border-gray-300 rounded"
                    placeholder="Classes Completed"
                  />
                </div>
                <div class="w-full px-2 mb-4">
                  <BaseInput
                    v-model="statistics.certifiedTeachers"
                    type="number"
                    required
                    inputClass="p-2 border border-gray-300 rounded"
                    placeholder="Certified Teachers"
                  />
                </div>
              </div>
              <div class="flex justify-center gap-6">
                <BaseButton
                  @click="closeModal"
                  type="button"
                  class="bg-gray-500 text-white px-4 py-2 rounded"
                >Cancel</BaseButton>
                <BaseButton type="submit" class="bg-[#288fb2] text-white px-2 py-2 rounded">
                  {{ editMode ? 'Save changes' : 'Save Statistics' }}
                </BaseButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
