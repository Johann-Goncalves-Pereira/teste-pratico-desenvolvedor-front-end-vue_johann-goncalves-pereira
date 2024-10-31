<script setup lang="ts">
import FormAddresses from '@/components/FormAddresses/FormAddresses.vue'
import { emptyAddress } from '@/stores/address'
</script>

<template>
	<main>
		<h1>Preencha o seu endereço</h1>
		<FormAddresses :address="emptyAddress()" :push="true" />
	</main>
</template>

<style lang="scss" scoped>
@use './SignInView.scss';
</style>
