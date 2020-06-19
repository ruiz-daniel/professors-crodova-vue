<template>
  <div id="p-formgroup-inline">
    <div class="p-field">
      <h3>Registrar Asistencia</h3>
      <h4>{{ $store.state.subjectName }} Grupo {{ $store.state.groupName }}</h4>
      <Dropdown
        v-model="activity_type"
        :options="getActivityTypesNames()"
        placeholder="Tipo de Actividad"
      />
      <Dropdown v-model="week" :options="listWeeks()" placeholder="Semana" />
    </div>
    <div class="p-field">
      <Button
        icon="pi pi-save"
        label="Guardar Cambios"
        v-on:click="saveAssist()"
      />
    </div>
    <div>
      <DataTable :value="assists">
        <Column field="student" header="Estudiante">
          <template #body="slotProps">
            {{ slotProps.data.StudentName }}
          </template>
        </Column>
        <Column field="firstTurn" header="1er Turno">
          <template #body="slotProps">
            <Checkbox :binary="true" v-model="slotProps.data.First_Turn" />
          </template>
        </Column>
        <Column field="secondTurn" header="2do Turno">
          <template #body="slotProps">
            <Checkbox :binary="true" v-model="slotProps.data.Second_Turn" />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script>
export default {
  name: "RegisterAssist",
  data() {
    return {
      assists: [],
      activity_type: "",
      week: {},
      selectActivityDialog: false
    };
  },
  methods: {
    getActivityTypes() {
      var store = this.$store;
      this.$root.Database.getActivityTypes(function(results) {
        store.commit("LOAD_ACTIVITY_TYPES", results);
      });
    },
    getActivityTypesNames() {
      var names = [];
      this.$store.state.activityTypes.forEach(element => {
        names.push(element.Name);
      });
      return names;
    },
    createAssists() {
      var students = this.$store.state.students;
      students.forEach(element => {
        this.assists.push({
          Date: new Date(),
          Week: 1,
          Activity_Type: {},
          Student: element.StudentID,
          StudentName: element.StudentName,
          Grupo: this.$store.state.groupID,
          Teacher: this.$store.state.teacher_id,
          Subject: this.$store.state.subjectID,
          First_Turn: true,
          Second_Turn: true,
          updated: false
        });
      });
    },
    listWeeks() {
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    },
    saveAssist() {
      var toast = this.$toast;
      if (this.activity_type !== "" && Object.keys(this.week).length > 0) {
        this.assists.forEach(element => {
          element.Week = this.week;
          element.Activity_Type = this.$store.getters.getActivityTypeIDFromName(
            this.activity_type
          );
        });
        this.$root.Database.insertAssists(this.assists, function(index, size) {
          if (index === size - 1)
            toast.add({
              severity: "success",
              summary: "Exito",
              detail: "Se han insertado las asistencias",
              life: 3000
            });
        });
      } else
        toast.add({
          severity: "error",
          summary: "Error",
          detail: "Campos vacíos",
          life: 3000
        });
    }
  },
  created() {
    this.createAssists();
  }
};
</script>

<style scoped>
#form {
  margin: 0 auto;
  max-width: 300px;
}
.p-formgroup-inline {
  margin-top: 1rem;
}
.p-field {
  width: 100%;
  align-self: center;
  margin-top: 1rem;
}
.p-dropdown {
  margin-right: 0.5rem;
}
.p-button {
  margin-right: 0.5rem;
}
</style>
