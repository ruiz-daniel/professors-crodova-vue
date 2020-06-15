<template>
  <div id="p-formgroup-inline">
    <div class="p-field">
      <h4>Registrar Evaluaciones Periódicas</h4>
      <h4>{{ $store.state.subjectName }} Grupo {{ $store.state.groupName }}</h4>
    </div>

    <div class="p-field">
      <Dropdown
        v-model="student"
        :options="$store.state.students"
        optionLabel="StudentName"
        placeholder="Seleccione un estudiante"
      />
      <Button
        icon="pi pi-check"
        v-on:click="
          getPeriodicEvaluations(student);
          studentSelected = true;
        "
      />
      <Button
        icon="pi pi-times"
        v-on:click="
          student = {};
          studentSelected = false;
        "
      />
    </div>
    <div class="p-field" v-if="studentSelected">
      <h5>Agregar Evaluación</h5>

      <Dropdown
        v-model="evaluation_type"
        :options="$store.state.periodicEvaluationTypes"
        optionLabel="Code"
        placeholder="Act."
      />
      <Button icon="pi pi-question" v-on:click="toggle" />
      <Dropdown v-model="week" :options="listWeeks()" placeholder="Sem." />
      <Dropdown
        v-model="evaluation"
        :options="listEvaluationValues()"
        placeholder="Nota"
      />
      <Button
        icon="pi pi-plus"
        v-on:click="
          addtoInfo();
          registerEvaluation();
        "
      />
      <Button
        icon="pi pi-times"
        v-on:click="
          evaluation_type = {};
          week = {};
          evaluation = {};
        "
      />
    </div>
    <DataTable :value="this.$store.state.info" v-if="studentSelected">
      <Column field="type" header="Actividad">
        <template #body="slotProps">
          {{ slotProps.data.EvaluationTypeCode }}
        </template>
      </Column>
      <Column field="evaluation" header="Evaluación">
        <template #body="slotProps">
          {{ slotProps.data.EvaluationValue }}
        </template>
      </Column>
    </DataTable>
    <OverlayPanel ref="op">
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
      student: {},
      studentSelected: false,
      evaluation_type: {},
      week: {},
      evaluation: {}
    };
  },
  methods: {
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
    addtoInfo() {
      this.$store.commit("ADD_INFO", {
        EvaluationTypeCode: this.evaluation_type.Code,
        EvaluationType: this.evaluation_type.ID,
        EvaluationValue: this.evaluation,
        Date: new Date(),
        Week: this.week,
        Deleted: false,
        Updated: false
      });
    },
    registerEvaluation() {
      var toast = this.$toast;
      if (this.evaluation_type !== null && this.week !== null && this.evaluation !== null)
      this.$root.Database.insertPeriodicEvaluations([
        {
          Periodic_Evaluation_Type: this.evaluation_type.ID,
          Cancelled: false,
          Evaluation_Value: this.evaluation,
          Date: new Date(),
          Subject: this.$store.state.subjectID,
          Grupo: this.$store.state.groupID,
          Week: this.week,
          Student: this.student.StudentID,
          Deleted: false,
          Updated: false,
          User_Name: "",
          Host: ""
        }
      ]);
      else {
        toast.add({severity:'error', summary: 'Error', detail:'Campos vacíos', life: 3000})
      }
    },
    toggle(event) {
      this.$refs.op.toggle(event);
    }
  }
};
</script>

<style>
.p-formgroup-inline {
  margin-top: 1rem;
}
.p-field {
  width: 100%;
  align-self: center;
  margin-top: 1rem;
}
</style>
