<template>
  <div class="p-grid p-justify-center" style="margin-top:1rem">
    <div class="p-col-8 p-lg-7 pxl-7">
      <Button
        v-if="$root.controlData.inserted >= 10"
        label="Ver Planificaciones"
        v-on:click="
          $router.push({ name: 'planifications' });
          $root.controlData.inserted = 0;
        "
      />
      <h3 style="color:red">No se han encontrado planificaciones</h3>
      <h3>Inicie sesión en el servidor de sigenu</h3>
      <div class="p-col-12">
        <label for="username">Usuario</label>
        <InputText
          id="username"
          type="text"
          v-model="user"
          style="margin-bottom:1rem"
        />
        <label for="pass">Contraseña</label>
        <InputText
          id="pass"
          type="text"
          v-model="pass"
          style="margin-bottom:1rem"
        />
      </div>
      <div class="p-col-12 p-grid p-justify-center">
        <Button label="Aceptar" v-on:click="getDataFromServer()" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      user: "",
      pass: ""
    };
  },
  methods: {
    getDataFromServer() {
      this.$root.APICalls.createHeaders(this.user, this.pass);
      this.$root.Database.insertLoginData(this.user, this.pass);
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
    }
  }
};
</script>

<style scoped>
label {
  font-size: 20px;
}
</style>
