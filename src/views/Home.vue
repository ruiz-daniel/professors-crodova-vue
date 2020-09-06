<template>
  <div class="p-grid p-justify-center" style="margin-top:1rem">
    <div class="p-col-8">
      <Card id="card" class="p-shadow-2">
        <template slot="header"> </template>
        <template slot="title">
          Planificaciones
        </template>
        <template slot="content">
          <img alt="planificaciones" src="@/assets/list.png" />
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
    </div>
  </div>
</template>

<script>
export default {
  name: "Home"
};
</script>

<style scoped></style>
