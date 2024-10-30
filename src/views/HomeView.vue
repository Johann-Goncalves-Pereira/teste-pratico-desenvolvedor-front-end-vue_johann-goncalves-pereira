<script setup lang="ts">
import FormAddresses from '@/components/FormAddresses/FormAddresses.vue'
import { useAddressesStore, type AddressFieldsProps } from '@/stores/address'
import { HeartCrack } from 'lucide-vue-next'
import { ref } from 'vue'
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

const editIndex = ref(0)

const updateIndex = (address: AddressFieldsProps) => {
	editIndex.value = addresses.$state.findIndex(
		i => i.cep.value === address.cep.value,
	)
}

const handleDeleteAddress = (address: AddressFieldsProps) => {
	updateIndex(address)
	addresses.deleteAddress(editIndex.value)
}

const handleOpenDialog = (address: AddressFieldsProps) => {
	updateIndex(address)

	const dialog = document.getElementById('dialog')

	if (dialog) (dialog as HTMLDialogElement).showModal()
}

const handleCloseDialogOutOfBound = (
	event: MouseEvent,
	element: HTMLDialogElement,
) => {
	if (element instanceof HTMLDialogElement) {
		const dimensions = element.getBoundingClientRect()

		if (
			event.clientX < dimensions.left ||
			event.clientX > dimensions.right ||
			event.clientY < dimensions.top ||
			event.clientY > dimensions.bottom
		) {
			element.close()
			event.preventDefault()
		}
	}
}
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
				:key="address.cep.value + addresses.$state.indexOf(address)"
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

				<button @click="handleOpenDialog(address)">Edit</button>
				<button @click="handleDeleteAddress(address)">Delete</button>
			</li>
		</ul>

		<dialog
			id="dialog"
			class="dialog"
			@click="
				handleCloseDialogOutOfBound($event, $event.target as HTMLDialogElement)
			"
		>
			<FormAddresses method="dialog" :index="editIndex" />
		</dialog>
	</main>
</template>

<style lang="scss" scoped>
@use './HomeView.scss';
</style>
