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
			address.uf.value !== '' &&
			address.localidade.value !== '',
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
					CEP: <strong>{{ address.cep.formatted }}</strong>
				</p>
				<p>
					Logradouro: <strong>{{ address.logradouro.value }}</strong>
				</p>
				<p>
					Complemento: <strong>{{ address.complemento }}</strong>
				</p>
				<p>
					Bairro: <strong>{{ address.bairro }}</strong>
				</p>
				<p>
					Cidade: <strong>{{ address.localidade.value }}</strong>
				</p>
				<p>
					UF: <strong>{{ address.uf.value }}/{{ address.estado }}</strong>
				</p>
			</li>
		</ul>
	</main>
</template>

<style lang="scss" scoped>
@use './HomeView.scss';
</style>
