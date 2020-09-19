<template>
  <div id="wrapper">
    <h3>Configuración</h3>
    <div class="p-field p-grid">
      <label for="url" class="p-col-fixed" style="width:150px"
        >URL del servidor</label
      >
      <div class="p-col">
        <InputText id="url" type="text" v-model="serverURL" />
      </div>
    </div>
    <div class="p-field p-grid">
      <label for="username" class="p-col-fixed" style="width:150px"
        >Usuario</label
      >
      <div class="p-col">
        <InputText id="username" type="text" v-model="username" />
      </div>
    </div>
    <div class="p-field p-grid">
      <label for="password" class="p-col-fixed" style="width:150px"
        >Contraseña</label
      >
      <div class="p-col">
        <InputText id="password" type="password" v-model="password" />
      </div>
    </div>
    <Button
      icon="pi pi-check"
      label="Aceptar"
      style="margin-left:10%"
      v-on:click="submit()"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      serverURL: this.$root.APICalls.getBaseURL(),
      username: "",
      password: ""
    };
  },
  methods: {
    submit() {
      this.$root.APICalls.stateBaseURL(this.serverURL);
      this.$root.APICalls.createHeaders(this.username, this.password);
      this.$root.Database.insertLoginData(this.username, this.password);
      //In case the user is coming to this view after attemting to get data from server without setting credentials
      if (this.$root.controlData.configUserForServer === true) {
        this.$root.getAllDataFromServer();
        this.$root.controlData.configUserForServer = false;
      }
      this.$toast.add({
        severity: "success",
        summary: "Exito",
        detail: "Se han guardado las configuraciones",
        life: 3000
      });
    }
  }
};
</script>

<style scoped>
span {
  margin-bottom: 1rem;
}
</style>
