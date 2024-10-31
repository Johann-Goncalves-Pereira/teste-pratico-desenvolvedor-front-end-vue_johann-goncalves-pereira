<script setup lang="ts">
import FormAddresses from '@/components/FormAddresses/FormAddresses.vue'
import { useAddressesStore } from '@/stores/address'
import { HeartCrack } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import { ref } from 'vue'

const addresses = useAddressesStore()
const onendEdit = ref(0)

// check if there is any address in the store
const hasAddress = !addresses.$state.find(
	address => address.cep.value !== '' && address.numero.value !== '',
)

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

				<div class="buttons">
					<button
						@click="
							() => {
								onendEdit = addresses.$state.findIndex(
									ad => ad.cep.value === address.cep.value,
								)

								handleOpenDialog(
									`dialog-${address.cep.value}-${address.numero.value}`,
								)
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

					<dialog
						class="dialog"
						:id="`dialog-${address.cep.value}-${address.numero.value}`"
						@click="
							handleCloseDialogOutOfBound(
								$event,
								$event.target as HTMLDialogElement,
							)
						"
					>
						<FormAddresses
							method="dialog"
							:address="
								addresses.$state[
									addresses.$state.findIndex(
										ad => ad.cep.value === address.cep.value,
									)
								]
							"
						/>
					</dialog>
				</div>
			</li>
		</ul>
	</main>
</template>

<style lang="scss" scoped>
@use './HomeView.scss';
</style>
