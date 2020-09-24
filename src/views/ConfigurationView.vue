<template>
  <div class="p-grid p-justify-center" style="margin-top:1rem">
    <div class="p-col-8 p-lg-7 p-xl-7">
      <Button
        v-if="$root.controlData.inserted >= 10"
        label="Ver Planificaciones"
        v-on:click="
          $router.push({ name: 'planifications' });
          $root.controlData.inserted = 0;
        "
      />
      <h3 v-if="$root.controlData.databaseStatusOk === false" style="color:red">
        No se han encontrado planificaciones
      </h3>
      <h3 v-if="!$root.controlData.saveLogin">
        Inicie sesión en el servidor de sigenu
      </h3>
      <h3 v-if="$root.controlData.saveLogin">
        Configure sus credenciales
      </h3>
      <div class="p-col-12">
        <label for="host">Dominio</label>
        <InputText
          id="host"
          type="text"
          v-model="host"
          style="margin-bottom:1rem"
        />
        <label for="username">Usuario</label>
        <InputText
          id="username"
          type="text"
          v-model="user"
          style="margin-bottom:1rem"
        />
        <label for="pass">Contraseña</label>
        <InputText
          v-if="!showPass"
          id="pass"
          type="password"
          v-model="pass"
          style="margin-bottom:1rem"
        />
        <InputText
          v-if="showPass"
          id="pass"
          type="text"
          v-model="pass"
          style="margin-bottom:1rem"
        />
        <label
          v-if="!showPass"
          style="font-size:17px;"
          v-on:click="toggleShowPass"
          >Mostrar Contraseña</label
        >
        <label
          v-if="showPass"
          style="font-size:17px;"
          v-on:click="toggleShowPass"
          >Ocultar Contraseña</label
        >
      </div>
      <div class="p-col-12 p-grid p-justify-center">
        <Button
          v-if="!$root.controlData.saveLogin"
          label="Conectar"
          v-on:click="getDataFromServer()"
        />
        <Button
          v-if="$root.controlData.saveLogin"
          label="Guardar"
          v-on:click="saveLoginData()"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      host: this.$root.APICalls.getBaseURL(),
      user: "",
      pass: "",
      showPass: false
    };
  },
  methods: {
    getDataFromServer() {
      this.$root.APICalls.stateBaseURL(this.host);
      this.$root.APICalls.createHeaders(this.user, this.pass);
      this.$root.Database.insertLoginData(this.user, this.pass, this.host);
      this.$root.controlData.updated = 0;
      if (this.user != "" && this.pass != "") {
        this.$root.getAllDataFromServer();
      } else {
        this.$toast.add({
          severity: "error",
          detail: "Configure usuario y contraseña",
          life: 3000
        });
      }
    },
    saveLoginData() {
      this.$root.APICalls.stateBaseURL(this.host);
      this.$root.APICalls.createHeaders(this.user, this.pass);
      this.$root.Database.insertLoginData(this.user, this.pass, this.host);
      this.$toast.add({
        severity: "success",
        summary: "Exito",
        detail: "Se han guardado las configuraciones",
        life: 3000
      });
    },
    toggleShowPass() {
      if (this.showPass) this.showPass = false;
      else this.showPass = true;
    }
  }
};
</script>

<style scoped>
label {
  font-size: 20px;
}
</style>
