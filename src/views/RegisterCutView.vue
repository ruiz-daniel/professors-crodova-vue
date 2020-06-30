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
            :options="evaluationsOptions"
            placeholder="NE"
          />
        </template>
      </Column>
      <Column field="AssistPerecent" header="Ausenc.">
        <template #body="slotProps">
          {{slotProps.data.AssistPercent +"%"}}
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
      selectedCut: {},
      evaluationsOptions: ["B", "R", "M", "NE"],
      evaluation: {}
    };
  },
  methods: {
    getCuts() {
      this.cuts = this.$store.state.info;
    },
    registerCut() {
      this.cuts.forEach(element => {
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
#form {
  margin: 0 auto;
  max-width: 300px;
}
#save_btn {
  margin-right: 10px;
}
</style>
