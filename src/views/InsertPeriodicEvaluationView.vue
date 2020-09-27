<template>
  <div id="p-formgroup-inline">
    <div class="p-field">
      <h4>Registrar Evaluación Periódica</h4>
      <h4>{{ $store.state.subjectName }} Grupo {{ $store.state.groupName }}</h4>
    </div>
    <div class="p-field">
      <label for="date" style="margin-right:0.3rem">Fecha</label>
      <Calendar
        id="date"
        placeholder="Fecha"
        v-model="date"
        dateFormat="dd/mm/yy"
      />
    </div>
    <div class="p-field">
      <Dropdown
        v-model="week"
        :options="listWeeks()"
        placeholder="Sem."
        style="margin-right:0.5rem"
      />
      <Dropdown
        v-model="evaluation_type"
        :options="$store.state.periodicEvaluationTypes"
        optionLabel="Code"
        placeholder="Act."
      />
      <Button
        icon="pi pi-question"
        v-on:click="toggle"
        style="margin-right: 0.5rem"
      />
    </div>
    <div class="p-field">
      <Button
        icon="pi pi-save"
        label="Guardar Cambios"
        v-on:click="registerEvaluation"
      />
    </div>
    <DataTable :value="this.evaluations" :paginator="true" :rows="5">
      <Column field="student" header="Estudiante">
        <template #body="slotProps">
          {{ slotProps.data.StudentName }}
        </template>
      </Column>
      <Column field="evaluation" header="Evaluación">
        <template #body="slotProps">
          <Dropdown
            v-model="slotProps.data.Evaluation_Value"
            :options="listEvaluationValues()"
            style="max-Width: 100px"
          />
        </template>
      </Column>
    </DataTable>
    <OverlayPanel ref="op" :showCloseIcon="true">
      <p style="color:orange; font-weight: bold;">
        Tipos de Evaluaciones Periodicas
      </p>
      <p>TCC: Trabajo de Control en Clases</p>
      <p>PI: Prueba Intrasemestral</p>
      <p>SE: Seminario Evaluado</p>
      <p>PE: Pregunta Escrita</p>
      <p>ET: Entrega de Tarea</p>
      <p>RT: Recogida de Tarea</p>
      <p>DT: Defensa de Tarea</p>
      <p>EP(1): Entrega de Proyecto</p>
      <p>EP(2): Recogida de Proyecto</p>
      <p>EP(3): Defensa de Proyecto</p>
    </OverlayPanel>
  </div>
</template>

<script>
export default {
  data() {
    return {
      evaluation_type: "",
      week: {},
      date: new Date(),
      evaluations: []
    };
  },
  methods: {
    createEvaluations() {
      var students = this.$store.state.students;
      students.forEach(element => {
        this.evaluations.push({
          Periodic_Evaluation_Type: "",
          Cancelled: false,
          Evaluation_Value: "",
          Date: this.date,
          Subject: this.$store.state.subjectID,
          Grupo: this.$store.state.groupID,
          Week: this.week,
          Student: element.StudentID,
          StudentName: element.StudentName,
          Deleted: false,
          Updated: false,
          User_Name: "",
          Host: ""
        });
      });
    },
    getPeriodicEvaluations(selectedStudent) {
      var store = this.$store;
      this.$root.Database.getPeriodicEvaluationsFromStudent(
        selectedStudent.StudentID,
        store.state.subjectID,
        function(evaluations) {
          store.commit("SAVE_INFO", evaluations);
          store.commit("STATE_INFO_TYPE", "showPeriodic");
        }
      );
    },
    listWeeks() {
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    },
    listEvaluationValues() {
      return ["2", "3", "4", "5"];
    },
    registerEvaluation() {
      var toast = this.$toast;
      if (this.evaluation_type != "" && this.week > 0) {
        this.evaluations.forEach(element => {
          element.Periodic_Evaluation_Type = this.evaluation_type.ID;
          element.Date = this.date;
          element.Week = this.week;
          if (element.Evaluation_Value === "") element.Evaluation_Value = "2";
        });
        this.$root.Database.insertPeriodicEvaluations(
          this.evaluations,
          function() {
            toast.add({
              severity: "success",
              summary: "Éxito",
              detail: "Se han registrado las evaluaciones",
              life: 3000
            });
          }
        );
      } else {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: "Campos vacíos",
          life: 3000
        });
      }
    },
    toggle(event) {
      this.$refs.op.toggle(event);
    }
  },
  created() {
    this.createEvaluations();
  }
};
</script>

<style>
.p-button {
  margin-left: 0.3rem;
  margin-right: 0.3rem;
}
</style>
