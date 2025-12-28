<template>
  <div id="leaflet-map" class="w-full h-auto"></div>
</template>

<script lang="">
import { ref, onMounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
// import markerIcon from 'leaflet/dist/images/marker-icon.png'
// import 'leaflet/dist/images/marker-shadow.png'

export default {
  name: 'LeafletMap',
  setup() {
    const map = ref(null)

    onMounted(() => {
      map.value = L.map('leaflet-map').setView([13.49, 39.468], 13)
      const marker = L.marker([13.49, 39.468]).addTo(map.value)

      // Add popup to the marker
      marker.bindPopup('IQ Business Group').openPopup()
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 40,
        attributionControl: false // Disable default attribution
      }).addTo(map.value)
    })

    return {
      map
    }
  }
}
</script>

<style scoped>
#leaflet-map {
  height: 450px;
  width: 100%;
}
</style>
