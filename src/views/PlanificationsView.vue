<template>
  <div id="vue-app">
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
                  v-if="checkCurrentAction() === 'select'"
                  icon="pi pi-list"
                  class="p-button-secondary"
                  label="Estudiantes"
                  v-on:click="setStudents(slotProps.data.GroupPlanningID)"
                />
                <Button
                  v-if="checkCurrentAction() === 'select'"
                  icon="pi pi-pencil"
                  class="p-button-secondary"
                  label="Registrar"
                  v-on:click="goToTasks(slotProps.data.GroupPlanningID)"
                />
                <Button
                  v-if="checkCurrentAction() === 'accept'"
                  icon="pi pi-check"
                  class="p-button-secondary"
                  label="Seleccionar"
                  v-on:click="goToSelectedTask(slotProps.data.GroupPlanningID)"
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
        store.commit("STATE_ACTION", "selectedGroup");
        router.push({ name: "Tasks" });
      });
    },
    checkCurrentAction() {
      if (
        this.$store.state.action === "nothingSelected" ||
        this.$store.state.action === "selectedGroup"
      ) {
        return "select";
      } else if (this.$store.state.action === "selectedTask") {
        return "accept";
      }
    },
    goToSelectedTask(groupPlanningID) {
      var store = this.$store;
      var router = this.$router;
      var root = this.$root;
      this.$root.Database.getStudentsFromPlanification(
        groupPlanningID,
        function(students) {
          store.commit("STUDENTS", students);
        }
      );
      this.$root.Database.selectGroup(groupPlanningID, function(groupData) {
        store.commit("SELECT_GROUP", groupData);
        var selectedTask = store.state.selectedTask;
        if (selectedTask === "asistencia") {
          router.push({ name: "RegisterAssist" });
        } else if (selectedTask === "cortes") {
          root.Database.getEvaluativeCutsFromGroup(groupPlanningID, function(
            cuts
          ) {
            store.commit("SAVE_INFO", cuts);
            router.push({ name: "RegisterCut" });
          });
        } else if (selectedTask === "periodicas") {
          router.push({ name: "InsertPeriodicEvaluation" });
        } else if (selectedTask === "finales") {
          root.Database.getEndEvaluationsFromPlanification(
            groupPlanningID,
            function(evaluations) {
              evaluations.forEach(element => {
                element.OrdinalEvaluationValueID = store.getters.getEvaluationValueFromID(
                  element.OrdinalEvaluationValueID
                );
                element.RevEvaluationValueID = store.getters.getEvaluationValueFromID(
                  element.RevEvaluationValueID
                );
                element.ExtraEvaluationValueID = store.getters.getEvaluationValueFromID(
                  element.ExtraEvaluationValueID
                );
                element.FinalEvaluationID = store.getters.getEvaluationValueFromID(
                  element.FinalEvaluationID
                );
              });
              store.commit("SAVE_INFO", evaluations);
              router.push({ name: "InsertEndEvaluations" });
            }
          );
        }
      });
    }
  }
};
</script>

<style scoped>
#list {
  max-width: 300px;
  margin: 0 auto;
}
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
