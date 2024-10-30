<script setup lang="ts">
import { useAddressesStore } from '@/stores/address'
import { HeartCrack } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

const addresses = useAddressesStore()

// check if there is any address in the store
const hasAddress = !addresses.$state
	.map(address => address.cep.value)
	.find(address => address !== '')
</script>

<template>
	<main>
		<h1>{{ $t('home.h1') }}</h1>
		<RouterLink to="/sign-in" class="no-result" v-if="hasAddress">
			<HeartCrack />
			<h2>{{ $t('home.h2') }}</h2>
		</RouterLink>
		<ul class="addresses" v-else>
			<li v-for="address in addresses.$state" :key="address.cep.value">
				<div v-if="address.cep.value.length !== 0">
					<p>CEP: {{ address.cep.value }}</p>
					<p>Logradouro: {{ address.logradouro }}</p>
					<p>Complemento: {{ address.complemento }}</p>
					<p>Bairro: {{ address.bairro }}</p>
					<p>Cidade: {{ address.localidade }}</p>
					<p>UF: {{ address.uf }}</p>
					<p>Estado: {{ address.estado }}</p>
				</div>
			</li>
		</ul>
	</main>
</template>

<style lang="scss" scoped>
@use './HomeView.scss';
</style>
