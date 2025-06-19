<template>
  <div class="loginContainer">
    <div class="login">
      <div class="h1">Login</div>
      <input
        @keydown.enter="changeFocus('password')"
        placeholder="Email"
        id="email"
        name="email"
        type="text"
      />
      <input
        @keydown.enter="submit()"
        placeholder="Password"
        id="password"
        name="password"
        type="password"
      />
      <input @click="submit()" value="Login" class="btn" type="submit" />
      <p>No account? <a @click="router.push('signup')">Sign up</a></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { onMounted } from "vue";

import { useAuthStore } from "@/stores/auth.ts";
import { setCookie } from "@/utility/cookie.ts";
import { login } from "@/services/authService.ts";

const authStore = useAuthStore();

const router = useRouter();

function changeFocus(elementId: string) {
  const element = document.getElementById(elementId);
  if (element) {
    element.focus();
  }
}

async function submit() {
  const email = (document.getElementById("email") as HTMLInputElement).value;
  const password = (document.getElementById("password") as HTMLInputElement).value;

  const token = await login(email, password);

  authStore.setToken(token);

  setCookie("token", token, 1);

  await route();
}

async function route() {
  if (authStore.isAuthenticated) {
    await router.push({ name: "home" });
  }
}

onMounted(() => {
  try {
    route();
  } catch (e) {
    return e;
  }
});
</script>

<style scoped>
p {
  text-align: center;
  margin-top: 10px;
  font-size: 0.8em;
}

p a {
  color: #ab47bc;
  text-decoration: underline;
  cursor: pointer;
}

.loginContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.login {
  width: 340px;
  background: #2c2c2c;
  padding: 47px;
  color: #fff;
  border-radius: 17px;
  font-size: 1.3em;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.login input[type="text"],
.login input[type="password"] {
  opacity: 1;
  display: block;
  border: none;
  outline: none;
  width: 100%;
  padding: 13px 18px;
  margin: 20px 0 0 0;
  font-size: 0.8em;
  border-radius: 100px;
  background: #3c3c3c;
  color: #fff;
}

.login input[type="submit"],
.h1 {
  border: 0;
  outline: 0;
  width: 100%;
  padding: 13px;
  margin: 40px 0 0 0;
  border-radius: 500px;
  font-weight: 600;
  animation: bounce2 1.6s;
}

.h1 {
  padding: 0;
  position: relative;
  top: -35px;
  display: block;
  margin-bottom: -0px;
  font-size: 1.3em;
}

.btn {
  background: linear-gradient(144deg, #af40ff, #5b42f3 50%, #00ddeb);
  color: #fff;
  padding: 16px !important;
}

.btn:hover {
  background: linear-gradient(144deg, #1e1e1e, 20%, #1e1e1e 50%, #1e1e1e);
  color: rgb(255, 255, 255);
  padding: 16px !important;
  cursor: pointer;
  transition: all 0.4s ease;
}
</style>
