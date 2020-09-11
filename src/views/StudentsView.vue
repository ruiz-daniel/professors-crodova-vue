<template>
  <div>
    <DataTable :value="this.$store.state.students" :paginator="true" :rows="5">
      <template #header>
        <h3>
          {{ $store.state.subjectName }} Grupo {{ $store.state.groupName }}
        </h3>
        <h3>Estudiantes</h3>
      </template>
      <Column field="Name" header="Nombre">
        <template #body="slotProps">
          {{ slotProps.data.StudentName }}
        </template>
      </Column>
      <Column field="Info" header="Ver Info">
        <template #body="slotProps">
          <Button
            icon="pi pi-eye"
            label="Asist."
            v-on:click="showAssists(slotProps.data)"
          />
          <Button
            icon="pi pi-eye"
            label="Eval."
            v-on:click="showPeriodicEvaluations(slotProps.data)"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script>
export default {
  name: "StudentsView",
  methods: {
    showAssists(selectedStudent) {
      var store = this.$store;
      var root = this.$root;
      this.$root.Database.getAssistFromStudent(
        selectedStudent.StudentID,
        store.state.subjectID,
        function(assists) {
          store.commit("SELECT_STUDENT", selectedStudent);
          store.commit("SAVE_INFO", assists);
          store.commit("STATE_INFO_TYPE", "showAssists");
          root.sideInfoVisible = true;
        }
      );
    },
    showPeriodicEvaluations(selectedStudent) {
      var store = this.$store;
      var root = this.$root;
      this.$root.Database.getPeriodicEvaluationsFromStudent(
        selectedStudent.StudentID,
        store.state.subjectID,
        function(evaluations) {
          store.commit("SELECT_STUDENT", selectedStudent);
          store.commit("SAVE_INFO", evaluations);
          store.commit("STATE_INFO_TYPE", "showPeriodic");
          root.sideInfoVisible = true;
        }
      );
    }
  }
};
</script>

<style scoped>
#list {
  max-width: 300px;
  margin: 0 auto;
}
.item {
  max-width: 250px;
  width: 250px;
}
b-button {
  margin-bottom: 10px;
}
b-navbar-nav {
  align-items: center;
}
div {
  margin: 0 auto;
}
.p-button {
  margin-right: 0.5rem;
}
.p-datatable {
  margin-top: 0.5rem;
}
</style>
