<template>
  <div id="app">
    <Navigation />
    <div v-if="$root.loading">
      <Message severity="info" :sticky="true" :closable="false"
        >Cargando datos...</Message
      >
      <ProgressBar :value="$root.controlData.inserted * 10" />
    </div>
    <Message
      v-if="$root.controlData.loadingRequest"
      severity="info"
      :sticky="true"
      :closable="false"
      >Conectando con el servidor...</Message
    >

    <Toast></Toast>
    <router-view />
    <Sidebar />
    <InfoSidebar />
  </div>
</template>

<script>
import Navigation from "@/components/Navigation.vue";
import Sidebar from "@/components/SideBar.vue";
import InfoSidebar from "@/components/InfoSideBar.vue";
export default {
  name: "App",
  components: {
    Navigation,
    Sidebar,
    InfoSidebar
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
#container {
  display: grid;
  grid-template-columns: auto auto;
}
#card {
  background-color: white;
  color: black;
  border-style: double;
  margin: 0.5rem;
}
.p-card-title {
  color: black;
}
.p-card-content {
  padding: 0rem;
}
</style>
