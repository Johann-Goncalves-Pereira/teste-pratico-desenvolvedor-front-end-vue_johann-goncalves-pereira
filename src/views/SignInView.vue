<script setup lang="ts">
import FormAddresses from '@/components/FormAddresses/FormAddresses.vue'
import { useAddressesStore } from '@/stores/address'

const addresses = useAddressesStore()
const length = addresses.$state.length - 1

console.log(addresses.$state[0])
</script>

<template>
	<main>
		<h1>Preencha o seu endereço</h1>
		<FormAddresses :index="length" :push="true" />
	</main>
</template>

<style lang="scss" scoped>
@use './SignInView.scss';
</style>
