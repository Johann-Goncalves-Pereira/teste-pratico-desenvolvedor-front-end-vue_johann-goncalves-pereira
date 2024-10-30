<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { House, MapPinned } from 'lucide-vue-next'
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
			<RouterLink to="/" aria-label="Home"><House /></RouterLink>
			<div class="border" />
			<div class="dot" />
			<RouterLink to="/sign-in" aria-label="Sign In"><MapPinned /></RouterLink>
		</nav>
	</header>

	<RouterView />
</template>

<style lang="scss">
#app {
	display: grid;
	grid-template-columns: auto 1fr;
	place-items: center;
	gap: 2rem;
	padding-inline: 1rem;
	height: 100dvh;
}
</style>

<style lang="scss" scoped>
@use './App.scss';
</style>
