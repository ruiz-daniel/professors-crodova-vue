<template>
  <div class="container">
    <Card id="card" class="p-shadow-2">
      <template slot="header">
        <img alt="planificaciones" src="@/assets/listing.png" />
      </template>
      <template slot="title">
        Planificaciones
      </template>
      <template slot="content">
        <p>
          Vea sus grupos y asignaturas planificados y seleccione en cual desea
          trabajar
        </p>
      </template>
      <template slot="footer">
        <Button
          icon="pi pi-arrow-right"
          label="Ir"
          class="p-button-primary"
          v-on:click="
            $root.Database.getPlanifications(function(planifications) {
              $store.commit('PLANIFICATIONS', planifications);
              $store.commit('STATE_ACTION', 'nothingSelected');
              $router.push('/planifications');
            })
          "
        />
      </template>
    </Card>

    <Card id="card" class="p-shadow-2">
      <template slot="header">
        <img alt="tareas" src="@/assets/tasks.png" />
      </template>
      <template slot="title">
        Tareas
      </template>
      <template slot="content">
        <p>
          Registro de asistenca, cortes evaluativos, evaluaciones periódicas y
          finales
        </p>
      </template>
      <template slot="footer">
        <Button
          icon="pi pi-arrow-right"
          label="Ir"
          class="p-button-primary"
          v-on:click="
            $root.Database.getPlanifications(function(planifications) {
              $store.commit('PLANIFICATIONS', planifications);
              $store.commit('STATE_ACTION', 'nothingSelected');
              $router.push({ name: 'Tasks' });
            })
          "
        />
      </template>
    </Card>
  </div>
</template>

<script>
export default {
  name: "Home"
};
</script>

<style scoped></style>
