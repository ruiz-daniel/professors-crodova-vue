<template>
  <div class="form">
    <label for="username">Usuario</label>
    <input type="text" name="username" class="input" />
    <label for="password">Contrasña</label>
    <input type="password" name="password" class="input" />
    <button class="btn" @click="loginFunction">Login</button>
  </div>
</template>
<script>
export default {
  name: "login",
  methods: {
    loginFunction() {}
  }
};
</script>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  max-width: 300px;
  margin: 0 auto;
  align-self: center;
}
.input {
  border: 1px solid green;
  padding: 10px;
  margin-bottom: 10px;
}
.btn {
  background-color: aqua;
  color: white;
  padding: 10px;
}
</style>
