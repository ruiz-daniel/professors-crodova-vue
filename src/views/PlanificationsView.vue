<template>
  <div class="p-col-12 p-justify-center">
    <Carousel
      :value="groups"
      :numVisible="3"
      :numScroll="2"
      :responsiveOptions="responsiveOptions"
    >
      <template #header>
        <h2>Planificaciones</h2>
      </template>
      <template #item="slotProps">
        <div class="group-item">
          <div class="group-content">
            <div>
              <img src="@/assets/list.png" />
            </div>
            <div>
              <div class="group-title">
                {{ slotProps.data.SubjectName }}
              </div>
              <div class="group-subtitle">
                Grupo {{ slotProps.data.GroupName }}
              </div>

              <div class="group-buttons">
                <Button
                  icon="pi pi-list"
                  class="p-button-secondary"
                  label="Estudiantes"
                  v-on:click="setStudents(slotProps.data.GroupPlanningID)"
                />
                <Button
                  icon="pi pi-pencil"
                  class="p-button-secondary"
                  label="Registrar"
                  v-on:click="goToTasks(slotProps.data.GroupPlanningID)"
                />
              </div>
            </div>
          </div>
        </div>
      </template>
    </Carousel>
  </div>
</template>

<script>
export default {
  name: "groups",
  data() {
    return {
      groups: this.$store.state.planifications,
      responsiveOptions: [
        {
          breakpoint: "1024px",
          numVisible: 3,
          numScroll: 3
        },
        {
          breakpoint: "600px",
          numVisible: 2,
          numScroll: 2
        },
        {
          breakpoint: "480px",
          numVisible: 1,
          numScroll: 1
        }
      ]
    };
  },
  methods: {
    setStudents(groupPlanningID) {
      var store = this.$store;
      var router = this.$router;
      this.$root.Database.selectGroup(groupPlanningID, function(groupData) {
        store.commit("SELECT_GROUP", groupData);
      });
      this.$root.Database.getStudentsFromPlanification(
        groupPlanningID,
        function(students) {
          store.commit("STUDENTS", students);
          router.push({ name: "StudentsView" });
        }
      );
    },
    goToTasks(groupPlanningID) {
      var store = this.$store;
      var router = this.$router;
      this.$root.Database.getStudentsFromPlanification(
        groupPlanningID,
        function(students) {
          store.commit("STUDENTS", students);
        }
      );
      this.$root.Database.selectGroup(groupPlanningID, function(groupData) {
        store.commit("SELECT_GROUP", groupData);
        router.push({ name: "Tasks" });
      });
    }
  }
};
</script>

<style scoped>
.group-content {
  border: 1px solid var(--layer-2);
  border-radius: 3px;
  margin: 0.3rem;
  text-align: center;
  padding: 2em 0 2.25em 0;
}
.group-title {
  font-weight: 600;
  font-size: 20px;
  margin-top: 24px;
}
.group-subtitle {
  margin: 0.25em 0 2em 0;
}
button {
  margin-left: 0.5rem;
  margin-bottom: 0.5rem;
}
</style>
