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
      <DataTable :value="evaluations" :paginator="true" :rows="5">
        <Column field="student" header="Estud.">
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
              :disabled="slotProps.data.SetEvaluationAvailable === 'false'"
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
      evaluationsOld: [],
      evaluationValues: {}
    };
  },
  methods: {
    registerEvaluations() {
      var toast = this.$toast;
      var evaluationsForUpdate = [];
      this.evaluations.forEach((element, index) => {
        if (
          element.OrdinalEvaluationValueID !==
            this.evaluationsOld[index].OrdinalEvaluationValueID ||
          element.RevEvaluationValueID !==
            this.evaluationsOld[index].RevEvaluationValueID ||
          element.ExtraEvaluationValueID !==
            this.evaluationsOld[index].ExtraEvaluationValueID ||
          element.FinalEvaluationID !==
            this.evaluationsOld[index].FinalEvaluationID
        ) {
          evaluationsForUpdate.push({
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
          });
        }
      });
      this.$root.Database.updateEndEvaluations(
        evaluationsForUpdate,
        function() {
          toast.add({
            severity: "success",
            summary: "Éxito",
            detail: "Se han actualizado las evaluaciones",
            life: 3000
          });
        }
      );
    },
    getEvaluations() {
      this.evaluations = this.$store.state.info;
      this.evaluations.forEach(element => {
        this.evaluationsOld.push({
          GroupPlanningID: element.GroupPlanningID,
          StudentID: element.StudentID,
          StudentName: element.StudentName,
          OrdinalEvaluationValueID: element.OrdinalEvaluationValueID,
          RevEvaluationValueID: element.RevEvaluationValueID,
          ExtraEvaluationValueID: element.ExtraEvaluationValueID,
          FinalEvaluationID: element.FinalEvaluationID
        });
      });
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
.p-dropdown {
  max-width: 50px;
}
.p-formgroup-inline {
  margin-top: 1rem;
}
.p-field {
  width: 100%;
  align-self: center;
  margin-top: 1rem;
}
</style>
