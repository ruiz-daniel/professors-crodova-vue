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
        v-on:click="$router.push('/')"
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
      return this.$router.go(-1);
    }
  }
};
</script>

<style scoped>
b-navbar {
  margin-bottom: 30px;
}
#nav {
  display: flex;
  align-items: center;
  flex-direction: row;
  margin: 0 auto;
}
#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
  /* margin-right: 20px; */
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
