<script setup lang="ts">
import { reactive, ref } from 'vue'

import type {
	AddressFieldsProps,
	UFProps,
	CitiesProps,
} from './@types/field.js'

const address = reactive({
	cep: {
		value: '',
		formatted: '',
	},
	logradouro: '',
	complemento: '',
	bairro: '',
	localidade: '',
	uf: '',
	estado: '',
	numero: '',
})

const error = ref<string | null>(null)
const states = ref<UFProps[]>([])
const cities = ref<CitiesProps[]>([])

const handleCep = (formatted: string) => {
	address.cep.formatted = formatted
		.replace(/[^0-9]/g, '')
		.slice(0, 8)
		.replace(/(\d{5})(\d{3})/, '$1-$2')

	address.cep.value = address.cep.formatted.replace(/[^0-9]/g, '')

	console.log(address.cep)
}

const useCepToFetchAddress = async (cep: string) => {
	try {
		error.value = null
		const validCep = /^[0-9]{8}$/.test(cep)
		if (!validCep) {
			error.value = 'CEP inválido'
			return
		}

		const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
		if (!response.ok) {
			error.value = 'Erro na busca do CEP'
			return
		}

		const responseAddress = (await response.json()) as AddressFieldsProps

		address.logradouro = responseAddress.logradouro || ''
		address.complemento = responseAddress.complemento || ''
		address.bairro = responseAddress.bairro || ''
		address.localidade = responseAddress.localidade || ''
		address.uf = responseAddress.uf || ''
		address.estado = responseAddress.estado || ''
	} catch (err) {
		error.value = 'Erro ao buscar o endereço'
		console.error(err)
	}
}

async function getStates() {
	if (states.value.length !== 0) return

	try {
		const response = await fetch(
			'https://servicodados.ibge.gov.br/api/v1/localidades/estados',
		)
		if (!response.ok) {
			throw new Error('Erro ao buscar os estados')
		}

		const data = (await response.json()) as UFProps[]
		states.value = data || []
		cities.value = []
	} catch (err) {
		console.error('Erro ao buscar os estados:', err)
	}
}

async function getCity(uf: string | null) {
	if (!uf) return

	try {
		const response = await fetch(
			`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`,
		)
		if (!response.ok) {
			throw new Error(
				`Erro ${response.status} ao buscar cidades do estado ${uf}`,
			)
		}

		const data = (await response.json()) as CitiesProps[]
		cities.value = data || []
	} catch (err) {
		console.error('Erro ao buscar cidades:', err)
	}
}
</script>

<template>
	<main>
		<h1>Preencha o seu endereço</h1>
		<form class="form" action="input">
			<fieldset class="form__wrapper">
				<legend class="form__title">
					Endereço:
					<p v-if="error">{{ error }}</p>
					<p v-else-if="address.logradouro">
						{{ address.logradouro }} - {{ address.numero }},
						{{ address.complemento }} {{ address.bairro }},
						{{ address.localidade }} - {{ address.uf }}/{{ address.estado }}
					</p>
				</legend>

				<div class="form__field">
					<label for="cep-code">
						CEP*:
						<p v-if="error">{{ error }}</p>
					</label>
					<input
						type="number"
						id="cep-code"
						name="cep-code"
						placeholder="00000-000"
						maxlength="9"
						v-bind:value="address.cep.value"
						v-on:input="
							$event => handleCep(($event.target as HTMLInputElement)?.value)
						"
						v-on:blur="useCepToFetchAddress(address.cep.value)"
					/>
					<p class="cep">{{ address.cep.formatted }}</p>
				</div>

				<div class="form__field" @mouseover="getStates()">
					<label for="state">Estado/UF:</label>
					<input
						type="text"
						id="state"
						name="state"
						list="state-list"
						placeholder="SP"
						v-model="address.uf"
					/>
					<datalist id="state-list">
						<option
							v-for="state in states"
							:key="state.id"
							:value="state.sigla"
						>
							{{ state.nome }}
						</option>
					</datalist>
				</div>

				<div class="form__field" @mouseover="getCity(address.uf)">
					<label for="locality">Cidade:</label>
					<input
						type="text"
						id="locality"
						name="locality"
						placeholder="São Paulo"
						list="city-list"
						v-model="address.localidade"
					/>
					<datalist id="city-list">
						<option
							v-for="city in cities"
							:key="city.microrregiao.id"
							:value="city.nome"
						>
							{{ city.nome }}
						</option>
					</datalist>
				</div>

				<div class="form__field">
					<label for="logradouro">Logradouro*:</label>
					<input
						type="text"
						id="logradouro"
						name="logradouro"
						placeholder="R. das Mangueiras"
						v-model="address.logradouro"
					/>
				</div>

				<div class="form__field">
					<label for="numero">Numero*:</label>
					<input
						type="number"
						id="numero"
						name="numero"
						placeholder="2001"
						v-model="address.numero"
					/>
				</div>

				<div class="form__field">
					<label for="complemento">Complemento:</label>
					<input
						type="text"
						id="complemento"
						name="complemento"
						placeholder="Apto 101"
					/>
				</div>
			</fieldset>

			<button type="submit">Avancar</button>
		</form>
	</main>
</template>
