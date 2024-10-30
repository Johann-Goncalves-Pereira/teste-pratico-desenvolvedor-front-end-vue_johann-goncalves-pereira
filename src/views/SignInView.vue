<script setup lang="ts">
import { ref } from 'vue'

import FormField from '@/components/SignIn/FormField/FormField.vue'
import InputField from '@/components/SignIn/FormField/InputField.vue'

import { useAddressesStore, useAddressStore } from '@/stores/address'
import { useStateSuggestions } from '@/stores/suggestions'

const suggestions = useStateSuggestions()
const addresses = useAddressesStore()
const address = useAddressStore()
</script>

<template>
	<main>
		<h1>Preencha o seu endereço</h1>
		<form class="form" @submit.prevent="addresses.addAddressStore(address)">
			<fieldset class="form__wrapper">
				<legend class="form__title">
					{{ $t('sing_in.title') }}
					<p>
						<span v-if="address.logradouro">
							{{ address.logradouro.value }}
						</span>
						<span v-if="address.numero.valid.length !== 0">
							- {{ address.numero.value }},
						</span>
						<span v-if="address.complemento">{{ address.complemento }}, </span>
						<span v-if="address.bairro">, {{ address.bairro }}, </span>
						<span v-if="address.localidade.valid.length !== 0"
							>{{ address.localidade.value }} -
						</span>
						<span v-if="address.uf.valid.length !== 0"
							>{{ address.uf.value }} / {{ address.estado }}</span
						>
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
								if ($event.target?.value.length === 0) {
									address.uf.valid = 'Erro: Campo UF está vazio'
								}
								if (state) {
									address.uf.value = state?.sigla || ''
									address.uf.valid = ''
									address.estado = state?.nome || ''
								} else {
									address.uf.valid = 'Erro: Campo UF não existe'
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
						v-on:input="
							$event => {
								if ($event.target?.value.length === 0) {
									address.localidade.valid =
										'Erro: Cidade não pode ser um campo vazio'
								} else {
									address.localidade.valid = ''
									address.localidade.valid = $event.target?.value
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
								if ($event.target?.value.length === 0) {
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
					:erro="address.numero.valid"
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
								address.numero = $event.target?.value
									.match(/^\d+$/, '')
									.join('')

								if ($event.target?.value.length === 0) {
									address.numero.valid = 'Erro: Campo Número está vazio'
								} else {
									address.numero.valid = ''
								}
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
