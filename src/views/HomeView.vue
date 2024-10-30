<script setup lang="ts">
import { useAddressesStore } from '@/stores/address'
import { HeartCrack } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'

const addresses = useAddressesStore()

// check if there is any address in the store
const hasAddress = !addresses.$state
	.map(address => address.cep.value)
	.find(address => address !== '')

// addresses filter empty one
addresses.$patch(
	addresses.$state.filter(
		address =>
			address.cep.value !== '' &&
			address.uf !== '' &&
			address.localidade !== '',
	),
)
</script>

<template>
	<main>
		<h1>{{ $t('home.h1') }}</h1>
		<RouterLink to="/sign-in" class="no-result" v-if="hasAddress">
			<HeartCrack />
			<h2>{{ $t('home.h2') }}</h2>
		</RouterLink>
		<ul class="addresses" v-else>
			<li
				class="addresses__address"
				v-for="address in addresses.$state"
				:key="address.cep.value"
			>
				<p>
					CEP: <strong>{{ address.cep.value }}</strong>
				</p>
				<p>
					Logradouro: <strong>{{ address.logradouro }}</strong>
				</p>
				<p>
					Complemento: <strong>{{ address.complemento }}</strong>
				</p>
				<p>
					Bairro: <strong>{{ address.bairro }}</strong>
				</p>
				<p>
					Cidade: <strong>{{ address.localidade }}</strong>
				</p>
				<p>
					UF: <strong>{{ address.uf }}</strong>
				</p>
				<p>
					Estado: <strong>{{ address.estado }}</strong>
				</p>
			</li>
		</ul>
	</main>
</template>

<style lang="scss" scoped>
@use './HomeView.scss';
</style>
