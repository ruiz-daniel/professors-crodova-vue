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
          label: "Planificaciones",
          icon: "pi pi-list",
          command: () => {
            var store = this.$store;
            var router = this.$router;
            this.$root.Database.getPlanifications(function(planifications) {
              store.commit("PLANIFICATIONS", planifications);
              store.commit("STATE_ACTION", "nothingSelected");
              router.push("/planifications");
            });
            this.$root.sideMenuVisible = false;
          }
        },
        {
          label: "Tareas",
          icon: "pi pi-list",
          command: () => {
            this.$store.commit("STATE_ACTION", "nothingSelected");
            this.$router.push({ name: "Tasks" });
            this.$root.sideMenuVisible = false;
          }
        },
        {
          label: "Actualizar Datos",
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
                this.$root.getAllDataFromServer();
              }
            },
            {
              label: "Reiniciar Base de Datos local",
              icon: "pi pi-refresh",
              command: () => {
                this.$root.Database.resetDatabase();
              }
            }
          ]
        },
        {
          label: "Sincronizar datos con el servidor",
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
  background-color: #333;
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
