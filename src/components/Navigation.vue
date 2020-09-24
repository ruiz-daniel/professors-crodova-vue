<template>
  <Toolbar>
    <template slot="left">
      <i
        class="pi pi-align-justify"
        style="fontSize: 2em"
        v-on:click="$root.sideMenuVisible = true"
      ></i>
      <Button
        label="Módulo de profesores"
        icon="pi pi-home"
        class="p-button-success"
        style="margin-left:5px"
        v-on:click="$root.checkDatabase()"
      />
    </template>

    <template slot="right">
      <Button
        icon="pi pi-arrow-left"
        style="margin-right: .5em"
        v-on:click="goBack"
      />
    </template>
  </Toolbar>
</template>

<script>
export default {
  methods: {
    goBack() {
      if (this.$route.path !== "/Planifications" && this.$route.path !== "/")
        return this.$router.go(-1);
    }
  }
};
</script>

<style scoped></style>
