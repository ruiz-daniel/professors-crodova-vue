<template>
  <div id="container">
    <Card id="card" class="p-shadow-2">
      <template slot="header">
        <img alt="user header" src="@/assets/checklist.jpg" />
      </template>
      <template slot="title">
        Registrar Asistencia
      </template>
      <template slot="footer">
        <Button
          v-if="checkSelectedAction() === 'select'"
          icon="pi pi-arrow-right"
          label="Seleccionar Grupo"
          class="p-button-primary"
          v-on:click="selectTask('asistencia')"
        />
        <Button
          v-if="checkSelectedAction() === 'accept'"
          icon="pi pi-check"
          label="Seleccionar Tarea"
          class="p-button-primary"
          v-on:click="$router.push({ name: 'RegisterAssist' })"
        />
      </template>
    </Card>

    <Card id="card" class="p-shadow-2">
      <template slot="header">
        <img alt="user header" src="@/assets/qualitativeEvaluation.png" />
      </template>
      <template slot="title">
        Cortes Evaluativos
      </template>
      <template slot="footer">
        <Button
          v-if="checkSelectedAction() === 'select'"
          icon="pi pi-arrow-right"
          label="Seleccionar Grupo"
          class="p-button-primary"
          v-on:click="selectTask('cortes')"
        />
        <Button
          v-if="checkSelectedAction() === 'accept'"
          icon="pi pi-check"
          label="Seleccionar Tarea"
          class="p-button-primary"
          v-on:click="
            $root.Database.getEvaluativeCutsFromGroup(
              $store.state.groupPlanningID,
              function(cuts) {
                $store.commit('SAVE_INFO', cuts);
                $router.push({ name: 'RegisterCut' });
              }
            )
          "
        />
      </template>
    </Card>

    <Card id="card" class="p-shadow-2">
      <template slot="header">
        <img alt="user header" src="@/assets/periodicEvaluation.png" />
      </template>
      <template slot="title">
        Evaluaciones Periódicas
      </template>
      <template slot="footer">
        <Button
          v-if="checkSelectedAction() === 'select'"
          icon="pi pi-arrow-right"
          label="Seleccionar Grupo"
          class="p-button-primary"
          v-on:click="selectTask('periodicas')"
        />
        <Button
          v-if="checkSelectedAction() === 'accept'"
          icon="pi pi-check"
          label="Seleccionar Tarea"
          class="p-button-primary"
          v-on:click="$router.push({ name: 'InsertPeriodicEvaluation' })"
        />
      </template>
    </Card>
    <Card id="card" class="p-shadow-2">
      <template slot="header">
        <img alt="user header" src="@/assets/periodicEvaluation.png" />
      </template>
      <template slot="title">
        Evaluaciones Finales
      </template>
      <template slot="footer">
        <Button
          v-if="checkSelectedAction() === 'select'"
          icon="pi pi-arrow-right"
          label="Seleccionar Grupo"
          class="p-button-primary"
          v-on:click="selectTask('finales')"
        />
        <Button
          v-if="checkSelectedAction() === 'accept'"
          icon="pi pi-check"
          label="Seleccionar Tarea"
          class="p-button-primary"
          v-on:click="
            $root.Database.getEndEvaluationsFromPlanification(
              $store.state.groupPlanningID,
              function(evaluations) {
                evaluations.forEach(element => {
                  element.OrdinalEvaluationValueID = $store.getters.getEvaluationValueFromID(
                    element.OrdinalEvaluationValueID
                  );
                  element.RevEvaluationValueID = $store.getters.getEvaluationValueFromID(
                    element.RevEvaluationValueID
                  );
                  element.ExtraEvaluationValueID = $store.getters.getEvaluationValueFromID(
                    element.ExtraEvaluationValueID
                  );
                  element.FinalEvaluationID = $store.getters.getEvaluationValueFromID(
                    element.FinalEvaluationID
                  );
                });
                $store.commit('SAVE_INFO', evaluations);
                $router.push({ name: 'InsertEndEvaluations' });
              }
            )
          "
        />
      </template>
    </Card>
  </div>
</template>

<script>
export default {
  methods: {
    selectTask(task) {
      this.$store.commit("STATE_TASK", task);
      this.$store.commit("STATE_ACTION", "selectedTask");
      this.$router.push("/planifications");
    },
    checkSelectedAction() {
      var selectedAction = this.$store.state.action;
      if (selectedAction === "selectedGroup") {
        return "accept";
      } else {
        return "select";
      }
    }
  }
};
</script>

<style></style>
