<template>
  <div class="signupContainer">
    <div class="signup">
      <div class="h1">Sign Up</div>
      <input placeholder="Email" id="email" name="email" type="text">
      <input placeholder="Name" id="name" name="name" type="text">
      <select id="gender">
        <option value="" disabled selected>Gender</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      <input placeholder="Birth Year" id="birthYear" name="birthYear" type="text">
      <input placeholder="Password" id="password" name="password" type="password">
      <input placeholder="Confirm Password" id="confirmPassword" name="confirmPassword" type="password">
      <input @click="submit()" value="Sign Up" class="btn" type="submit">
      <p>Already have an account? <a @click="router.push('/')">Login</a></p>
    </div>
  </div>
</template>

<script setup lang="ts">

import {useRouter} from "vue-router";

import { register } from "@/services/authService.ts";

const router = useRouter();

async function submit() {
  const email = (document.getElementById('email') as HTMLInputElement).value;
  const name = (document.getElementById('name') as HTMLInputElement).value;
  const gender = (document.getElementById('gender') as HTMLInputElement).value;
  let birthYear: number | string = (document.getElementById('birthYear') as HTMLInputElement).value;
  const password = (document.getElementById('password') as HTMLInputElement).value;
  const confirmPassword = (document.getElementById('confirmPassword') as HTMLInputElement).value;

  if (password !== confirmPassword) {
    alert('Passwords do not match');
    return;
  }

  birthYear = parseInt(birthYear, 10);

  const data = {
    email,
    name,
    password,
    birthYear,
    gender
  };

  await register(data);

  await router.push('login');
}
</script>

<style scoped>
.signupContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.signup {
  width: 340px;
  background: #2c2c2c;
  padding: 47px;
  color: #fff;
  border-radius: 17px;
  font-size: 1.3em;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}

.signup input[type="text"],
.signup input[type="password"] {
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

.signup input[type=submit],
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
  background: linear-gradient(144deg, #1e1e1e , 20%,#1e1e1e 50%,#1e1e1e );
  color: rgb(255, 255, 255);
  padding: 16px !important;
  cursor: pointer;
  transition: all 0.4s ease;
}

p {
  text-align: center;
  margin-top: 10px;
  font-size: 0.8em;
}

p a {
  color: #AB47BC;
  text-decoration: underline;
  cursor: pointer;
}
</style>
