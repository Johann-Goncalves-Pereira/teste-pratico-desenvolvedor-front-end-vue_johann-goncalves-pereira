<script setup lang="ts">
import { reactive, watch } from 'vue'

type Address = {
	cep: string
	street: string
	city: string
	state: string
}

const { address, error } = reactive({
	value: {
		cep: '',
		street: '',
		city: '',
		state: '',
	},
	message: '',
})

function useFetch(url: string) {
	let err = null
	const fetchData = () => {
		fetch(url, {
			headers: {
				'X-Custom-Header': 'foobar',
			},
		})
			.then(res => res.json())
			.then(json => {
				url = json
			})
			.catch(error => {
				err = error
				console.error('Fetch error:', err)
			})
	}

	// Trigger fetchData immediately on mount and on any change to urlRef
	watch(() => url, fetchData, { immediate: true })

	const data = url
	return { data, err }
}

function handleCep(cep: string) {
	const validCep = /^[0-9]{8}$/

	if (!validCep.test(cep)) {
		error.message = 'CEP inválido'
	}

	const url = `https://viacep.com.br/ws/${cep}/json/`
	const { data, err } = useFetch(url) as { data: Address; err: null }

	if (err) {
		error.message = 'CEP inválido'
	}

	if (data) {
		address.value.cep = data.cep
		address.value.street = data.street
		address.value.city = data.city
		address.value.state = data.state
	}
}
</script>

<template>
	<main>
		<form
			class="form"
			action="input"
			@input="
				event => {
					address.cep = (event.target as HTMLInputElement)?.value ?? ''
					console.log(address.cep)
				}
			"
			@blur="handleCep(address.cep)"
		>
			<div @click="handleCep(address.cep)">test</div>
			<fieldset class="form__wrapper">
				<legend class="form__title">Address</legend>

				<div class="form__field">
					<label>CEP:</label>
					<input type="text" id="postal-code" name="postal-code" />
				</div>
				<div class="form__field">
					<label>Endereço da rua:</label>
					<input
						type="text"
						id="street-address"
						name="street-address"
						placeholder="R. das Mangueiras, 10"
					/>
				</div>
				<div class="form__field">
					<label>Cidade:</label>
					<input type="text" id="locality" name="locality" />
				</div>

				<div class="form__field">
					<label>Estado/UF:</label>
					<input type="text" id="state" name="state" list="state-list" />
					<datalist id="state-list"> </datalist>
				</div>
			</fieldset>
		</form>
	</main>
</template>

<style lang="scss" scoped>
@use './SignInView.scss';
</style>
