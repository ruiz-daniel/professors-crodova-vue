<template>
  <div id="app">
    <Navigation />
    <div v-if="$root.loading">
      <Message
        severity="info"
        :sticky="true"
        :closable="false"
        v-on:hide="$root.checkDatabase()"
        >Cargando datos...</Message
      >
      <ProgressBar :value="$root.controlData.inserted * 10" />
    </div>
    <Message
      v-if="$root.controlData.loadingRequest"
      severity="info"
      :sticky="true"
      :closable="false"
      >Recibiendo datos del servidor...</Message
    >
    <Message
      v-if="$root.loadingUpdate"
      severity="info"
      :sticky="true"
      :closable="false"
      >Enviando datos al servidor...</Message
    >
    <ProgressBar
      v-if="$root.loadingUpdate"
      :value="($root.controlData.updated + 2) * 10"
    />

    <Message
      v-if="$root.controlData.updated === 5"
      severity="warning"
      :sticky="true"
      :closable="false"
      >Datos enviados al servidor. Actualice sus datos locales</Message
    >

    <Button
      label="Actualizar"
      v-if="$root.controlData.updated === 5"
      v-on:click="getDataFromServer()"
    />

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
  },
  methods: {
    getDataFromServer() {
      this.$root.controlData.updated = 0;
      if (
        this.$root.APICalls.getUser() != "" &&
        this.$root.APICalls.getPass() != ""
      ) {
        this.$root.getAllDataFromServer();
      } else {
        this.$toast.add({
          severity: "error",
          detail: "Configure usuario y contraseña",
          life: 3000
        });
        this.$root.controlData.configUserForServer = true;
        this.$router.push({ name: "Configuration" });
      }
    }
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
#card {
  background-color: white;
  color: black;
  border-style: double;
}
.p-card-title {
  color: black;
}
.p-card-content {
  padding: 0rem;
}
</style>
