<script setup lang="ts">
import type { CitiesProps, UFProps } from '@/@types/field'

import { ref } from 'vue'

import FormField from '@/components/SignIn/FormField/FormField.vue'
import InputField from '@/components/SignIn/FormField/InputField.vue'
import { useAddressesStore, useAddressStore } from '@/stores/address'

const states = ref<UFProps[]>([])
const cities = ref<CitiesProps[]>([])
const error = ref<string | null>(null)

const addresses = useAddressesStore()
const address = useAddressStore()

const fetchState = async () => {
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
		address.uf = 'Error: ao buscar os estados'
		throw new Error(`Erro ao buscar os estados: ${err}`)
	}
}

const fetchCity = async (uf: string | null) => {
	if (!uf) return

	try {
		const response = await fetch(
			`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${encodeURIComponent(
				uf,
			)}/municipios`,
		)

		if (!response.ok) {
			throw new Error(`Erro ao buscar as cidades: ${response.status}`)
		}

		const data = (await response.json()) as CitiesProps[]

		if (!data) {
			throw new Error('Erro ao buscar as cidades: dados nulos')
		}

		cities.value = data
	} catch (err) {
		address.localidade = 'Error: ao buscar as cidades'
		throw new Error(`Erro ao buscar as cidades: ${err}`)
	}
}
</script>

<template>
	<main>
		<h1>Preencha o seu endereço</h1>
		<form class="form" @submit.prevent="addresses.addAddressStore(address)">
			<fieldset class="form__wrapper">
				<legend class="form__title">
					{{ $t('sing_in.title') }}
					<p v-if="error">{{ error }}</p>
					<p>
						<span v-if="address.logradouro"> {{ address.logradouro }} </span>
						<span v-if="address.numero"> - {{ address.numero }}, </span>
						<span v-if="address.complemento">{{ address.complemento }}, </span>
						<span v-if="address.bairro">, {{ address.bairro }}, </span>
						<span v-if="address.localidade">{{ address.localidade }} - </span>
						<span v-if="address.uf"
							>{{ address.uf }} / {{ address.estado }}</span
						>
					</p>
				</legend>

				<FormField
					required
					:id="$t('sing_in.form.cep.id')"
					:label="$t('sing_in.form.cep.label')"
				>
					<InputField
						required
						:id="$t('sing_in.form.cep.id')"
						:placeholder="$t('sing_in.form.cep.placeholder')"
						v-bind:value="address.cep.formatted"
						v-on:input="address.handleCEP($event.target?.value)"
						v-on:blur="address.fetchAddressByCep()"
					/>
					<p class="error" v-if="address.cep.valid">{{ address.cep.valid }}</p>
				</FormField>

				<FormField
					required
					:id="$t('sing_in.form.uf.id')"
					:label="$t('sing_in.form.uf.label')"
				>
					<InputField
						required
						list="state-uf-list"
						:id="$t('sing_in.form.uf.id')"
						:placeholder="$t('sing_in.form.uf.placeholder')"
						v-bind:value="address.uf"
						v-on:blur="
							$event => {
								const selectedState = states.find(
									state => state.sigla === $event.target?.value,
								)
								if (selectedState) {
									address.uf = selectedState.sigla
								} else {
									throw new Error(error?.valueOf())
								}
							}
						"
						v-on:mouseover="fetchState()"
					/>
					<datalist id="state-uf-list">
						<option
							v-for="state in states"
							:key="state.sigla"
							:value="`${state.sigla}`"
						>
							{{ state.nome }}
						</option>
					</datalist>
					<p class="error" v-if="address.uf.includes('Error')">
						{{ address.uf }}
					</p>
				</FormField>

				<FormField
					required
					:id="$t('sing_in.form.localidade.id')"
					:label="$t('sing_in.form.localidade.label')"
				>
					<InputField
						required
						list="city-list"
						:id="$t('sing_in.form.localidade.id')"
						:placeholder="$t('sing_in.form.localidade.placeholder')"
						v-bind:value="address.localidade"
						v-on:input="
							address.localidade = cities.filter(
								city => city.nome === $event.target?.value,
							)[0].nome
						"
						v-on:mouseover="fetchCity(address.uf)"
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
					<p class="error" v-if="address.localidade.includes('Error')">
						{{ address.localidade }}
					</p>
				</FormField>

				<FormField
					required
					:id="$t('sing_in.form.logradouro.id')"
					:label="$t('sing_in.form.logradouro.label')"
				>
					<InputField
						required
						:id="$t('sing_in.form.logradouro.id')"
						:placeholder="$t('sing_in.form.logradouro.placeholder')"
						v-bind:value="address.logradouro"
						v-on:input="address.logradouro = $event.target?.value"
					/>
				</FormField>

				<FormField
					required
					:id="$t('sing_in.form.numero.id')"
					:label="$t('sing_in.form.numero.label')"
				>
					<InputField
						type="number"
						maxlength="6"
						required
						:id="$t('sing_in.form.numero.id')"
						:placeholder="$t('sing_in.form.numero.placeholder')"
						v-bind:value="address.numero"
						v-on:input="
							address.numero = $event.target?.value.match(/^\d+$/, '').join('')
						"
					/>
				</FormField>

				<FormField
					:id="$t('sing_in.form.complemento.id')"
					:label="$t('sing_in.form.complemento.label')"
				>
					<InputField
						:id="$t('sing_in.form.complemento.id')"
						:placeholder="$t('sing_in.form.complemento.placeholder')"
						v-bind:value="address.complemento"
						v-on:input="address.complemento = $event.target?.value"
					/>
				</FormField>

				<label class="sr-only" :for="$t('sing_in.form.submit.id')"
					>Avançar</label
				>
				<input
					type="submit"
					value="Avancar"
					:id="$t('sing_in.form.submit.id')"
					:name="$t('sing_in.form.submit.id')"
				/>
			</fieldset>
		</form>
	</main>
</template>

<style lang="scss" scoped>
@use './SignInView.scss';
</style>
