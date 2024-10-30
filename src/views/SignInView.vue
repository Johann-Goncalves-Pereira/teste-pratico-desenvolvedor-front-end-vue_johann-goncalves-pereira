<script setup lang="ts">
import FormField from '@/components/SignIn/FormField/FormField.vue'
import InputField from '@/components/SignIn/FormField/InputField.vue'

import { useAddressesStore, useAddressStore } from '@/stores/address'
import { useStateSuggestions } from '@/stores/suggestions'

const suggestions = useStateSuggestions()
const addresses = useAddressesStore()
const address = useAddressStore()

const hasAllRequiredFields = () => {
	console.table([
		address.cep.valid,
		address.logradouro.valid,
		address.localidade.valid,
		address.uf.valid,
	])

	if (
		address.cep.valid.length !== 0 &&
		address.logradouro.valid.length !== 0 &&
		// address.bairro.length !== 0 &&
		address.localidade.valid.length !== 0 &&
		address.uf.valid.length !== 0
	)
		return true

	return false
}
</script>

<template>
	<main>
		<h1>Preencha o seu endereço</h1>
		<form class="form" @submit.prevent="addresses.addAddressStore(address)">
			<fieldset class="form__wrapper">
				<legend class="form__title">
					{{ $t('sing_in.title') }}
					<p>
						{{ address.logradouro.value }}
						- {{ address.numero.value }}, {{ address.complemento }}
						{{ address.bairro }}, {{ address.localidade.value }} -
						{{ address.uf.value }} / {{ address.estado }}
					</p>
				</legend>

				<FormField
					required
					:id="$t('sing_in.form.cep.id')"
					:label="$t('sing_in.form.cep.label')"
					:error="address.cep.valid"
				>
					<InputField
						required
						:id="$t('sing_in.form.cep.id')"
						:placeholder="$t('sing_in.form.cep.placeholder')"
						v-bind:value="address.cep.formatted"
						v-on:input="address.handleCEP($event.target?.value)"
						v-on:blur="
							() => {
								address.fetchAddressByCep()

								if (address.cep.value.length === 0) {
									address.cep.valid = 'Erro: CEP não pode ser um campo vazio'
								}
								if (address.cep.value.length !== 9) {
									address.cep.valid = 'Erro: CEP deve ter 8 digitos'
								}
								if (address.cep.value.length === 8) {
									address.cep.valid = ''
								}
							}
						"
					/>
				</FormField>

				<FormField
					required
					:id="$t('sing_in.form.uf.id')"
					:label="$t('sing_in.form.uf.label')"
					:error="address.uf.valid"
				>
					<InputField
						required
						list="state-uf-list"
						:id="$t('sing_in.form.uf.id')"
						:placeholder="$t('sing_in.form.uf.placeholder')"
						v-bind:value="address.uf.value"
						v-on:blur="
							$event => {
								const state = suggestions.states.find(
									state => state.sigla === $event.target?.value,
								)

								if (state) {
									address.uf.value = state?.sigla || ''
									address.uf.valid = ''
									address.estado = state?.nome || ''
								} else {
									address.uf.valid = 'Erro: Campo UF não existe'
								}

								if ($event.target?.value.length === 0) {
									address.uf.valid = 'Erro: Campo UF está vazio'
								}
							}
						"
						v-on:mouseover="suggestions.fetchStateSuggestions()"
					/>
					<datalist id="state-uf-list">
						<option
							v-for="state in suggestions.states"
							:key="state.sigla"
							:value="`${state.sigla}`"
						>
							{{ state.nome }}
						</option>
					</datalist>
				</FormField>

				<FormField
					required
					:id="$t('sing_in.form.localidade.id')"
					:label="$t('sing_in.form.localidade.label')"
					:error="address.localidade.valid"
				>
					<InputField
						required
						list="city-list"
						:id="$t('sing_in.form.localidade.id')"
						:placeholder="$t('sing_in.form.localidade.placeholder')"
						v-bind:value="address.localidade.value"
						v-on:input="address.localidade.valid = $event.target?.value"
						v-on:blur="
							() => {
								if (address.localidade.valid.length === 0) {
									address.localidade.valid =
										'Erro: Cidade não pode ser um campo vazio'
								} else {
									address.localidade.valid = ''
								}
							}
						"
						v-on:mouseover="suggestions.fetchCitySuggestions(address.uf.value)"
					/>
					<datalist id="city-list">
						<option
							v-for="city in suggestions.cities"
							:key="city.id"
							:value="city.nome"
						>
							{{ city.nome }}
						</option>
					</datalist>
				</FormField>

				<FormField
					required
					:id="$t('sing_in.form.logradouro.id')"
					:label="$t('sing_in.form.logradouro.label')"
					:error="address.logradouro.valid"
				>
					<InputField
						required
						:id="$t('sing_in.form.logradouro.id')"
						:placeholder="$t('sing_in.form.logradouro.placeholder')"
						v-bind:value="address.logradouro.value"
						v-on:input="
							$event => {
								address.logradouro = $event.target?.value
							}
						"
						v-on:blur="
							() => {
								if (address.logradouro.value.length === 0) {
									address.logradouro.valid =
										'Erro: Logradouro não pode ser um campo vazio'
								} else {
									address.logradouro.valid = ''
								}
							}
						"
					/>
				</FormField>

				<FormField
					required
					:id="$t('sing_in.form.numero.id')"
					:label="$t('sing_in.form.numero.label')"
					:error="address.numero.valid"
				>
					<InputField
						type="number"
						maxlength="6"
						required
						:id="$t('sing_in.form.numero.id')"
						:placeholder="$t('sing_in.form.numero.placeholder')"
						v-bind:value="address.numero"
						v-on:input="
							$event => {
								address.numero.value = $event.target?.value
									.match(/^\d+$/, '')
									.join('')
							}
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
