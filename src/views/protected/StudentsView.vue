<script setup>
import DataTable from '@/components/base/DataTable.vue'
import StudentService from '@/services/StudentService'
import { onMounted, ref, computed } from 'vue'
import Swal from 'sweetalert2'

// ---------------- Table Headers ----------------
const tableHeaders = [
  { label: 'Student ID', field: 'studentId' },
  { label: 'Name', field: 'name' },
  { label: 'Email', field: 'email' },
  { label: 'Status', field: 'status' }, // computed field
  { label: 'Grade', field: 'grade' }, // computed field
]

// ---------------- Data ----------------
const students = ref([])

// computed mapped students to include grade and status fields
const mappedStudents = computed(() =>
  students.value.map(s => ({
    ...s,
    grade: s.Grade?.gradelevel || 'N/A',
    status: s.isApproved ? 'Approved' : 'Pending'
  }))
)

// ---------------- Fetch Students ----------------
const getAllStudents = async () => {
  try {
    const response = await StudentService.getAllStudents()
    if (response.success) {
      students.value = response.data
    }
  } catch (err) {
    console.error(err)
  }
}

// ---------------- Actions ----------------
const approveStudent = async (student) => {
  if (student.isApproved) {
    Swal.fire({
      icon: 'info',
      title: 'Already Approved',
      text: `${student.name} is already approved.`,
      confirmButtonColor: '#288FB2'
    })
    return
  }

  const result = await Swal.fire({
    title: `Approve ${student.name}?`,
    text: "This will mark the student as approved.",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Yes, Approve",
    cancelButtonText: "Cancel",
    confirmButtonColor: "#288FB2",
    cancelButtonColor: "#d33"
  })

  if (result.isConfirmed) {
    try {
      const response = await StudentService.approveStudent(student.id)
      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Approved!',
          text: `${student.name} is now approved.`,
          confirmButtonColor: "#288FB2"
        })
        getAllStudents()
      }
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: err.response?.data?.message || 'Something went wrong.',
        confirmButtonColor: "#d33"
      })
    }
  }
}

const isEditing = ref(false)
const editForm = ref(null)
const editStudent = (student) => {
  isEditing.value = true
  editForm.value = { ...student }
}

const deleteStudent = async (student) => {
  if (!confirm('Are you sure you want to delete this student?')) return
  try {
    const response = await StudentService.deleteStudent(student.id)
    if (response.success) getAllStudents()
  } catch (err) {
    console.error(err)
  }
}

// ---------------- Table Actions ----------------
const actions = [
  {
    label: 'approve',
    action: approveStudent,
    icon: 'check',
    style: 'hover:cursor-pointer text-green-600 py-1 px-2'
  },
  {
    label: 'edit',
    action: editStudent,
    icon: 'edit',
    style: 'hover:cursor-pointer text-blue-500 py-1 px-2'
  },
  {
    label: 'delete',
    action: deleteStudent,
    icon: 'trash',
    style: 'hover:cursor-pointer text-red-500 py-1 px-2'
  }
]

// ---------------- Lifecycle ----------------
onMounted(() => {
  getAllStudents()
})
</script>

<template>
  <section class="w-full py-4 bg-white border rounded-xl px-[2%] min-h-screen">
    <div class="flex justify-between w-full mb-6">
      <h2 class="text-xl font-bold text-[#1d4354]">Students</h2>
      <button @click="getAllStudents" class="p-2 bg-gray-100 rounded hover:bg-gray-200">
        <font-awesome-icon icon="sync" class="text-lg text-[#288fb2]" />
      </button>
    </div>

    <DataTable
      :tableHeaders="tableHeaders"
      :tableValues="mappedStudents"
      :actions="actions"
    />
  </section>
</template>
