<script setup lang="ts">
import FormAddresses from '@/components/FormAddresses/FormAddresses.vue'
import { useAddressesStore } from '@/stores/address'
import { HeartCrack } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import { ref } from 'vue'

const addresses = useAddressesStore()
const editAddress = ref(-1)

// check if there is any address in the store
const isEmpty = false
// !addresses.$state.find(
// 	address => address.cep.value !== '' && address.numero.value !== '',
// )

const handleOpenDialog = (id: string) => {
	const dialog = document.getElementById(id)

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
			editAddress.value = -1
			event.preventDefault()
		}
	}
}

const handleCloseDialog = () => {
	const dialog = document.getElementById('dialog')
	if (dialog) (dialog as HTMLDialogElement).close()
}
</script>

<template>
	<main>
		<h1>{{ $t('home.h1') }}</h1>
		<RouterLink to="/sign-in" class="no-result" v-if="isEmpty">
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
					Numero: <strong>{{ address.numero.value }}</strong>
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

				<div class="buttons">
					<button
						@click="
							() => {
								editAddress = addresses.$state.findIndex(
									ad => ad.cep.value === address.cep.value,
								)

								handleOpenDialog(`dialog`)
							}
						"
					>
						Edit
					</button>
					<button
						@click="
							addresses.delete(
								addresses.$state.findIndex(
									ad => ad.cep.value === address.cep.value,
								),
							)
						"
					>
						Delete
					</button>
					<p>
						{{
							addresses.$state.findIndex(
								ad => ad.cep.value === address.cep.value,
							)
						}}
					</p>
				</div>
			</li>
		</ul>
	</main>

	<dialog
		class="dialog"
		id="dialog"
		@click="
			$event => {
				handleCloseDialogOutOfBound($event, $event.target as HTMLDialogElement)
			}
		"
	>
		<FormAddresses
			v-if="editAddress !== -1"
			method="dialog"
			:address="addresses.$state[editAddress]"
			:index="editAddress"
			@close="() => handleCloseDialog()"
		/>
	</dialog>
</template>

<style lang="scss" scoped>
@use './HomeView.scss';
</style>
