<script setup lang="ts">
import FormAddresses from '@/components/FormAddresses/FormAddresses.vue'
import { useAddressesStore, type AddressProps } from '@/stores/address'
import { HeartCrack } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import { ref } from 'vue'
import DialogModal from '@/components/DialogModal/DialogModal.vue'

const addresses = useAddressesStore()
const dialogID = 'dialog'
const editAddress = ref(-1)
const isEmpty = ref(false)

console.log(!addresses.$state.length)

const checkEmpty = () => {
	isEmpty.value = !addresses.$state.find(
		address => address.cep.value !== '' && address.numero.value !== '',
	)
}
const handleGetIndex = (address: AddressProps) => {
	return addresses.$state.findIndex(ad => {
		if (
			ad.cep.value === address.cep.value &&
			ad.numero.value === address.numero.value &&
			ad.complemento === address.complemento
		)
			return true

		return false
	})
}
const handleOpenDialog = (id: string, address: AddressProps) => {
	editAddress.value = handleGetIndex(address)
	const dialog = document.getElementById(id)
	if (dialog) (dialog as HTMLDialogElement).showModal()
}
const handleCloseDialog = () => {
	const dialog = document.getElementById('dialog')
	if (dialog) (dialog as HTMLDialogElement).close()
}

const deleteAddress = (address: AddressProps) => {
	addresses.delete(handleGetIndex(address))
	checkEmpty()
}

checkEmpty()
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
					{{ $t('home.list.cep') }} <strong>{{ address.cep.formatted }}</strong>
				</p>
				<p>
					{{ $t('home.list.uf') }}
					<strong>{{ address.uf.value }}/{{ address.estado }}</strong>
				</p>
				<p>
					{{ $t('home.list.localidade') }}
					<strong>{{ address.localidade.value }}</strong>
				</p>
				<p>
					{{ $t('home.list.logradouro') }}
					<strong>{{ address.logradouro.value }} - {{ address.bairro }}</strong>
				</p>

				<p>
					{{ $t('home.list.numero') }}
					<strong>{{ address.numero.value }}</strong>
				</p>
				<p v-if="address.complemento">
					{{ $t('home.list.complemento') }}
					<strong>{{ address.complemento }}</strong>
				</p>

				<div class="buttons">
					<button @click="handleOpenDialog(dialogID, address)">Edit</button>
					<button @click="deleteAddress(address)">Delete</button>
					<p>
						{{ handleGetIndex(address) + 1 }}
					</p>
				</div>
			</li>
		</ul>
	</main>

	<DialogModal :id="dialogID" @close="editAddress = -1">
		<FormAddresses
			v-if="editAddress !== -1"
			method="dialog"
			:address="addresses.$state[editAddress]"
			:index="editAddress"
			@close="() => handleCloseDialog()"
		/>
	</DialogModal>
</template>

<style lang="scss" scoped>
@use './HomeView.scss';
</style>
