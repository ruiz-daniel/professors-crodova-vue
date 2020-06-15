<template>
  <div id="p-formgroup-inline">
    <h4>Registrar Evaluaciones Finales</h4>
    <h4>{{ $store.state.subjectName }} Grupo {{ $store.state.groupName }}</h4>
    <div class="p-field">
      <Button
        icon="pi pi-save"
        label="Guardar Cambios"
        v-on:click="registerEvaluations()"
      />
    </div>
    <div class="p-field">
      <DataTable :value="evaluations">
        <Column field="student" header="Estudiante">
          <template #body="slotProps">
            {{ slotProps.data.StudentName }}
          </template>
        </Column>
        <Column field="ordinalEvaluation" header="Ord.">
          <template #body="slotProps">
            <Dropdown
              v-model="slotProps.data.OrdinalEvaluationValueID"
              :options="evaluationValues"
              placeholder="Ev"
            />
          </template>
        </Column>
        <Column field="revEvaluation" header="Rev.">
          <template #body="slotProps">
            <Dropdown
              v-model="slotProps.data.RevEvaluationValueID"
              :options="evaluationValues"
              placeholder="Ev"
            />
          </template>
        </Column>
        <Column field="extraEvaluation" header="Extra.">
          <template #body="slotProps">
            <Dropdown
              v-model="slotProps.data.ExtraEvaluationValueID"
              :options="evaluationValues"
              placeholder="Ev"
            />
          </template>
        </Column>
        <Column field="finalEvaluation" header="Final.">
          <template #body="slotProps">
            <Dropdown
              v-model="slotProps.data.FinalEvaluationID"
              :options="evaluationValues.slice(0, 4)"
              placeholder="Ev"
            />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      evaluations: {},
      evaluationValues: {}
    };
  },
  methods: {
    registerEvaluations() {
      var toast = this.$toast;
      var evaluations = this.evaluations;
      this.evaluations.forEach((element, index) => {
        this.$root.Database.updateEndEvaluations(
          {
            GroupPlanningID: element.GroupPlanningID,
            StudentID: element.StudentID,
            OrdinalEvaluationValueID: this.$store.getters.getEvaluationValueIDFromValue(
              element.OrdinalEvaluationValueID
            ),
            RevEvaluationValueID: this.$store.getters.getEvaluationValueIDFromValue(
              element.RevEvaluationValueID
            ),
            ExtraEvaluationValueID: this.$store.getters.getEvaluationValueIDFromValue(
              element.ExtraEvaluationValueID
            ),
            FinalEvaluationID: this.$store.getters.getEvaluationValueIDFromValue(
              element.FinalEvaluationID
            ),
            Updated: false
          },
          function() {
            if (index === evaluations.length - 1) {
              toast.add({
                severity: "success",
                summary: "Exito",
                detail: "Se han actualizado las evaluaciones",
                life: 3000
              });
            }
          }
        );
      });
    },
    getEvaluations() {
      this.evaluations = this.$store.state.info;
    },
    getEvaluationValues() {
      var values = [];
      this.$store.state.evaluationValues.forEach(element => {
        values.push(element.Value);
      });
      this.evaluationValues = values;
    }
  },
  created() {
    this.getEvaluations();
    this.getEvaluationValues();
  }
};
</script>

<style scoped>
.p-formgroup-inline {
  margin-top: 1rem;
}
.p-field {
  width: 100%;
  align-self: center;
  margin-top: 1rem;
}
</style>
