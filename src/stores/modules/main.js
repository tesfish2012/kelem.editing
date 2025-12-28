import { defineStore } from "pinia"

const state = () => ({
  isComponentLoading:false,
  navExpanded: true,
  navOpened: true,
  error: "",
})

const actions = {
  setErrorEmpty() {
    this.setError({
      message: "",
    })
  },
  setLoading(loading) {
    this.isComponentLoading =loading
  }, 
}
const main = {
  namespaced: true,
  state,
  actions,
}

export default defineStore("mainStore", main)
