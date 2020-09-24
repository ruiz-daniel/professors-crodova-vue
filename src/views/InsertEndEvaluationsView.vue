<template>
  <div id="p-formgroup-inline">
    <h4>Registrar Evaluaciones Finales</h4>
    <h4>{{ $store.state.subjectName }} Grupo {{ $store.state.groupName }}</h4>
    <div class="p-field">
      <Button
        v-if="registerPermitted === 'true'"
        icon="pi pi-save"
        label="Guardar Cambios"
        v-on:click="registerEvaluations()"
      />
      <h3 v-if="registerPermitted === 'false'" style="color:red">
        Usted no puede registrar evaluaciones en este grupo
      </h3>
      <h3 v-if="registerPermitted">Cerrar Convocatorias</h3>
      <Button
        v-if="registerPermitted === 'true'"
        icon="pi pi-save"
        label="1ra"
        v-on:click="
          closedEvaluationsInfo.OrdinalClosed = 'true';
          closeExam('01');
        "
      />
      <Button
        v-if="registerPermitted === 'true'"
        icon="pi pi-save"
        label="2da"
        v-on:click="
          closedEvaluationsInfo.RevClosed = 'true';
          closeExam('02');
        "
      />
      <Button
        v-if="registerPermitted === 'true'"
        icon="pi pi-save"
        label="3ra"
        v-on:click="
          closedEvaluationsInfo.ExtraClosed = 'true';
          closeExam('03');
        "
      />
    </div>
    <div class="p-field">
      <DataTable :value="evaluations" :paginator="true" :rows="4">
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
              :disabled="
                registerPermitted === 'false' ||
                  closedEvaluationsInfo.OrdinalClosed === 'true'
              "
            />
          </template>
        </Column>
        <Column
          v-if="closedEvaluationsInfo.OrdinalClosed === 'true'"
          field="revEvaluation"
          header="Rev."
        >
          <template #body="slotProps">
            <Dropdown
              v-model="slotProps.data.RevEvaluationValueID"
              :options="evaluationValues"
              placeholder="Ev"
              :disabled="
                registerPermitted === 'false' ||
                  closedEvaluationsInfo.RevClosed === 'true'
              "
            />
          </template>
        </Column>
        <Column
          v-if="closedEvaluationsInfo.RevClosed === 'true'"
          field="extraEvaluation"
          header="Extra."
        >
          <template #body="slotProps">
            <Dropdown
              v-model="slotProps.data.ExtraEvaluationValueID"
              :options="evaluationValues"
              placeholder="Ev"
              :disabled="
                registerPermitted === 'false' ||
                  closedEvaluationsInfo.ExtraClosed === 'true'
              "
            />
          </template>
        </Column>
        <Column field="finalEvaluation" header="Final.">
          <template #body="slotProps">
            <Dropdown
              v-model="slotProps.data.FinalEvaluationID"
              :options="evaluationValues.slice(0, 4)"
              placeholder="Ev"
              :disabled="registerPermitted === 'false'"
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
      evaluationValues: {},
      registerPermitted: "false",
      closedEvaluationsInfo: this.$store.state.closedEvaluationsInfo
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
      this.registerPermitted = this.$store.getters.getEvalPermittedFromPlanning(
        this.evaluations[0].GroupPlanningID
      );
    },
    getEvaluationValues() {
      var values = [];
      this.$store.state.evaluationValues.forEach(element => {
        values.push(element.Value);
      });
      this.evaluationValues = values;
    },
    closeExam(convocatoria) {
      var toast = this.$toast;
      this.$root.Database.closeEndEvaluation(
        {
          ordinalClosed: this.closedEvaluationsInfo.OrdinalClosed,
          revClosed: this.closedEvaluationsInfo.RevClosed,
          extraClosed: this.closedEvaluationsInfo.ExtraClosed,
          groupPlanningID: this.$store.state.groupPlanningID
        },
        function() {
          toast.add({
            severity: "success",
            summary: "Éxito",
            detail: "Se ha cerrado la convocatoria",
            life: 3000
          });
        }
      );
      this.$root.Database.updateClosedEvaluation(
        this.$store.state.groupID,
        this.$store.state.subjectID,
        convocatoria
      );
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
