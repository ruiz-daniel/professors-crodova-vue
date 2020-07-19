<template>
  <div>
    <div class="p-field">
      <h3>Registrar Cortes Evaluativos</h3>
      <h4>{{ $store.state.subjectName }} Grupo {{ $store.state.groupName }}</h4>
    </div>
    <div class="p-field">
      <Button
        icon="pi pi-save"
        label="Guardar Cambios"
        v-on:click="registerCut()"
      />
    </div>
    <DataTable :value="cuts">
      <Column field="student" header="Est.">
        <template #body="slotProps">
          {{ slotProps.data.StudentName }}
        </template>
      </Column>
      <Column field="first_cut" header="Ev. CC1">
        <template #body="slotProps">
          <Dropdown
            v-model="slotProps.data.CualitativeEvaluation1"
            :options="evaluationsOptions"
            placeholder="NE"
          />
        </template>
      </Column>
      <Column field="second_cut" header="Ev. CC2">
        <template #body="slotProps">
          <Dropdown
            v-model="slotProps.data.CualitativeEvaluation2"
            v-if="slotProps.data.FirstDelivered === true"
            :options="evaluationsOptions"
            placeholder="NE"
          />
        </template>
      </Column>
      <Column field="AssistPerecent" header="Aus. %">
        <template #body="slotProps">
          {{ slotProps.data.AssistPercent + "%" }}
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedStudent: {},
      cutsOptions: ["01", "02"],
      cuts: {},
      cutsOld: [],
      selectedCut: {},
      evaluationsOptions: ["B", "R", "M", "NE"],
      evaluation: {}
    };
  },
  methods: {
    getCuts() {
      this.cuts = this.$store.state.info;
      this.cuts.forEach(element => {
        this.cutsOld.push({
          GroupPlanningID: element.GroupPlanningID,
          FirstDelivered: element.FirstDelivered,
          SecondDelivered: element.SecondDelivered,
          CualitativeEvaluation1: element.CualitativeEvaluation1,
          CualitativeEvaluation2: element.CualitativeEvaluation2,
          StudentID: element.StudentID,
          StudentName: element.StudentName,
          AbsenceHoursCut1: element.AbsenceHoursCut1,
          AbsenceHoursCut2: element.AbsenceHoursCut2,
          AssistPercent: element.AssistPercent
        });
      });
    },
    registerCut() {
      this.cuts.forEach((element, index) => {
        if (
          element.CualitativeEvaluation1 !==
            this.cutsOld[index].CualitativeEvaluation1 ||
          element.CualitativeEvaluation2 !==
            this.cutsOld[index].CualitativeEvaluation2
        )
          this.$root.Database.updateEvaluativeCut(element);
      });
    }
  },
  created() {
    this.getCuts();
  }
};
</script>

<style scoped>
.p-dropdown {
  max-width: 60px;
}
#form {
  margin: 0 auto;
  max-width: 300px;
}
#save_btn {
  margin-right: 10px;
}
</style>
