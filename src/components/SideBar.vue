<template>
  <div class="layout-sidebar layout-sidebar-dark">
    <Sidebar
      :visible.sync="$root.sideMenuVisible"
      :baseZIndex="1000"
      :showCloseIcon="false"
      style="justify-content: stretch"
    >
      <i class="pi pi-user" style="fontSize: 3em"></i>
      <h3>{{ $store.state.teacher_name }}</h3>
      <PanelMenu :model="items" />
    </Sidebar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        {
          label: "Actualizar Planificaciones",
          items: [
            {
              label: "Juego de Datos de Prueba",
              command: () => {
                this.$root.populateDB(this.$root.fileData);
              }
            },
            {
              label: "Desde el servidor",
              command: () => {
                this.$root.sideMenuVisible = false;
                if (
                  this.$root.APICalls.getUser() != "" &&
                  this.$root.APICalls.getPass() != ""
                ) {
                  this.$router.push("/");
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
          ]
        },
        {
          label: "Sincronizar cambios",
          icon: "pi pi-upload",
          command: () => {
            this.$root.updateToServer();
          }
        },
        {
          label: "Configuraciones",
          icon: "pi pi-cog",
          command: () => {
            this.$router.push({ name: "Configuration" });
            this.$root.sideMenuVisible = false;
          }
        }
      ]
    };
  }
};
</script>

<style scoped>
#sidebar-header {
  background-color: #000099;
}
h3 {
  margin-bottom: 10%;
}
.p-panelmenu {
  width: auto;
  display: block;
  font-size: 100%;
  padding: 0px;
}
.p-sidebar {
  padding-left: 0px;
  padding-right: 0px;
}
</style>
