<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import router from './router'

import { ref } from 'vue'

const currentRoute = ref(router.currentRoute.value)

router.beforeEach((to, _, next) => {
	currentRoute.value = to
	next()
})
</script>

<template>
	<header>
		<div class="image">
			<img
				alt="Vue logo"
				class="logo"
				src="@/assets/logo.svg"
				width="125"
				height="125"
			/>
		</div>

		<nav>
			<RouterLink to="/" :class="{ active: currentRoute.name === '/' }"
				>Home</RouterLink
			>
			<div />
			<RouterLink
				to="/sign-in"
				:class="{ active: currentRoute.name === '/sign-in' }"
				>Sign In</RouterLink
			>
		</nav>
	</header>

	<RouterView />
</template>

<style lang="scss" module>
#app {
	display: grid;
	grid-template-rows: auto 1fr;
}
</style>

<style lang="scss" scoped>
@use './App.scss';
</style>
