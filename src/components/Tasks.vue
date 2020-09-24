<template>
  <div class="p-grid p-justify-center">
    <div
      class="p-col-10 p-sm-10 p-md-8 p-lg-7 p-xl-7"
      style="padding:0px; margin-top:1rem"
    >
      <Card id="card" class="p-shadow-2">
        <template slot="title">
          Registrar Asistencia
        </template>
        <template slot="content">
          <p>
            Cree un nuevo registro de asistencia para un grupo
          </p>
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
    </div>
    <div
      class="p-col-10 p-sm-10 p-md-8 p-lg-7 p-xl-7"
      style="padding:0px; margin-top:1rem"
    >
      <Card id="card" class="p-shadow-2">
        <template slot="title">
          Cortes Evaluativos
        </template>
        <template slot="content">
          <p>
            Registre las notas de los cortes evaluativos de cada estudiante en
            un grupo
          </p>
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
    </div>
    <div
      class="p-col-10 p-sm-10 p-md-8 p-lg-7 p-xl-7"
      style="padding:0px; margin-top:1rem"
    >
      <Card id="card" class="p-shadow-2">
        <template slot="title">
          Evaluaciones Periódicas
        </template>
        <template slot="content">
          <p>
            Nueva evaluación periódica en un grupo
          </p>
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
    </div>
    <div
      class="p-col-10 p-sm-10 p-md-8 p-lg-7 p-xl-7"
      style="padding:0px; margin-top:1rem"
    >
      <Card id="card" class="p-shadow-2">
        <template slot="title">
          Evaluaciones Finales
        </template>
        <template slot="content">
          <p>
            Registre las evaluaciones de cada convocatoria y la evaluación final
            de cada estudiante
          </p>
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
                function(evaluations, closedData) {
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
                  $store.commit('SAVE_CLOSED_EVALUATIONS_INFO', closedData);
                  $router.push({ name: 'InsertEndEvaluations' });
                }
              )
            "
          />
        </template>
      </Card>
    </div>
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
