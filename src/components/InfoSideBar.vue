<template>
  <div class="layout-sidebar layout-sidebar-dark">
    <Sidebar
      id="infoSidebar"
      :visible.sync="$root.sideInfoVisible"
      :baseZIndex="1000"
      position="right"
      style="justify-content: stretch"
      v-on:hide="hideEditPanels()"
    >
      <i class="pi pi-user" style="fontSize: 3em"></i>
      <h3>{{ $store.state.selectedStudent.StudentName }}</h3>
      <DataTable
        :paginator="true"
        :rows="5"
        :value="this.$store.state.info"
        v-if="$store.state.infoType === 'showAssists'"
      >
        <Column field="Week" header="Sem.">
          <template #body="slotProps">
            {{ slotProps.data.Week }}
          </template>
        </Column>
        <Column field="Activity" header="Act.">
          <template #body="slotProps">
            {{ slotProps.data.ActivityTypeName.slice(0, 4) }}
          </template>
        </Column>
        <Column field="FirstTurn" header="1er Turno">
          <template #body="slotProps">
            {{ slotProps.data.FirstTurn.slice(0, 6) }}
          </template>
        </Column>
        <Column field="SecondTurn" header="2do Turno">
          <template #body="slotProps">
            {{ slotProps.data.SecondTurn.slice(0, 6) }}
          </template>
        </Column>
        <Column field="Edit" header="Editar">
          <template #body="slotProps">
            <Button
              icon="pi pi-pencil"
              v-on:click="
                editAssistVisible = true;
                editAssist = slotProps.data;
              "
            />
          </template>
        </Column>
      </DataTable>
      <DataTable
        :value="this.$store.state.info"
        :autoLayout="true"
        :paginator="true"
        :rows="5"
        v-if="$store.state.infoType === 'showPeriodic'"
      >
        <Column field="TypeEv" header="Ev.">
          <template #body="slotProps">
            {{ slotProps.data.EvaluationTypeCode }}
          </template>
        </Column>
        <Column field="Week" header="Sem.">
          <template #body="slotProps">
            {{ slotProps.data.Week }}
          </template>
        </Column>
        <Column field="Date" header="Fecha">
          <template #body="slotProps">
            {{ slotProps.data.Date }}
          </template>
        </Column>
        <Column field="Evaluation" header="Nota">
          <template #body="slotProps">
            {{ slotProps.data.EvaluationValue }}
          </template>
        </Column>
        <Column field="Edit" header="Editar">
          <template #body="slotProps">
            <Button
              icon="pi pi-pencil"
              v-on:click="
                editEvaluationVisible = true;
                editEvaluation = slotProps.data;
              "
            />
          </template>
        </Column>
      </DataTable>
      <div id="edit-panel">
        <div v-if="editAssistVisible" class="pi-field">
          <h4>Modificar Asistencia</h4>
          <Dropdown
            id="editTurn1"
            placeholder="Primer Turno"
            v-model="editAssist.FirstTurn"
            :options="assistOptions"
          />
          <Dropdown
            id="editTurn2"
            placeholder="Segundo Turno"
            v-model="editAssist.SecondTurn"
            :options="assistOptions"
          />
          <Button icon="pi pi-check" v-on:click="updateAssist()" />
          <Button
            icon="pi pi-times"
            v-on:click="
              editAssist = {};
              editAssistVisible = false;
            "
          />
        </div>
        <div v-if="editEvaluationVisible" class="pi-field">
          <h4>Modificar Evaluación</h4>
          <Dropdown
            id="editTurn1"
            placeholder="Evaluacion"
            v-model="editEvaluation.EvaluationValue"
            :options="evaluationOptions"
          />
          <Button icon="pi pi-check" v-on:click="updateEvaluation()" />
          <Button
            icon="pi pi-times"
            v-on:click="
              editEvaluation = {};
              editEvaluationVisible = false;
            "
          />
        </div>
      </div>
    </Sidebar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      editAssistVisible: false,
      editEvaluationVisible: false,
      editAssist: {},
      editEvaluation: {},
      assistOptions: ["Presente", "Ausente"],
      evaluationOptions: ["2", "3", "4", "5"]
    };
  },
  methods: {
    hideEditPanels() {
      this.editAssistVisible = false;
      this.editEvaluationVisible = false;
      this.editAssist = {};
      this.editEvaluation = {};
    },
    updateAssist() {
      var toast = this.$toast;
      this.$root.Database.updateAssist(
        {
          StudentID: this.editAssist.StudentID,
          SubjectID: this.editAssist.SubjectID,
          ActivityType: this.editAssist.ActivityType,
          Date: this.editAssist.Date,
          FirstTurn: this.parsePresenceToBoolean(this.editAssist.FirstTurn),
          SecondTurn: this.parsePresenceToBoolean(this.editAssist.SecondTurn),
          Updated: false,
          Modified: true
        },
        function() {
          toast.add({
            severity: "success",
            summary: "Éxito",
            detail: "Se ha actualizado el registro de asistencia",
            life: 7000
          });
        }
      );
    },
    updateEvaluation() {
      var toast = this.$toast;
      this.$root.Database.updatePeriodicEvaluation(
        {
          StudentID: this.editEvaluation.StudentID,
          SubjectID: this.editEvaluation.SubjectID,
          EvaluationType: this.editEvaluation.EvaluationType,
          Date: this.editEvaluation.Date,
          EvaluationValue: this.editEvaluation.EvaluationValue,
          Updated: false
        },
        function() {
          toast.add({
            severity: "success",
            summary: "Éxito",
            detail: "Se ha actualizado la evaluación",
            life: 7000
          });
        }
      );
    },
    parsePresenceToBoolean(presence) {
      var parsed;
      if (presence === "Presente") parsed = true;
      else if (presence === "Ausente") parsed = false;
      return parsed;
    }
  }
};
</script>

<style>
#infoSidebar {
  width: 100%;
}
</style>
