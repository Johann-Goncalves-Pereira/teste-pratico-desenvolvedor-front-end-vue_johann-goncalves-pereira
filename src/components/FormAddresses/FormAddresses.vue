<script setup lang="ts">
import { useStateSuggestions } from '@/stores/suggestions'
import { defineProps } from 'vue'
import FormField from '../SignIn/FormField/FormField.vue'
import InputField from '../SignIn/FormField/InputField.vue'
import {
	emptyAddress,
	useAddress,
	useAddressesStore,
	type AddressFieldsProps,
} from '@/stores/address'
import type { PropType } from 'vue'

const props = defineProps({
	address: Object as PropType<AddressFieldsProps>,
	push: Boolean,
})

const suggestions = useStateSuggestions()
const addresses = useAddressesStore()
const addrStore = useAddress()
addrStore.set(props.address || emptyAddress())
</script>

<template>
	<form
		class="form"
		@submit.prevent="
			() => {
				if (props.push) {
					addresses.push(
						JSON.parse(JSON.stringify({ ...addrStore.$state.data })),
					)
					addrStore.reset()
				}
			}
		"
	>
		<fieldset class="form__wrapper">
			<legend class="form__title">
				{{ $t('sing_in.title') }}
				<p>
					{{ addrStore.$state.data.logradouro.value }}
					- {{ addrStore.$state.data.numero.value }},
					{{ addrStore.$state.data.complemento }}
					{{ addrStore.$state.data.bairro }},
					{{ addrStore.$state.data.localidade.value }} -
					{{ addrStore.$state.data.uf.value }} /
					{{ addrStore.$state.data.estado }}
				</p>
			</legend>

			<FormField
				required
				:id="$t('sing_in.form.cep.id')"
				:label="$t('sing_in.form.cep.label')"
				:error="addrStore.$state.data.cep.valid"
			>
				<InputField
					required
					:id="$t('sing_in.form.cep.id')"
					:placeholder="$t('sing_in.form.cep.placeholder')"
					v-bind:value="addrStore.$state.data.cep.formatted"
					v-on:input="addrStore.handleCEP($event.target?.value)"
					v-on:blur="
						() => {
							addrStore.fetchAddressByCep()

							if (addrStore.$state.data.cep.value.length === 0) {
								addrStore.$state.data.cep.valid =
									'Erro: CEP não pode ser um campo vazio'
							}
							if (addrStore.$state.data.cep.value.length !== 9) {
								addrStore.$state.data.cep.valid = 'Erro: CEP deve ter 8 digitos'
							}
							if (addrStore.$state.data.cep.value.length === 8) {
								addrStore.$state.data.cep.valid = ''
							}
						}
					"
				/>
			</FormField>

			<FormField
				required
				:id="$t('sing_in.form.uf.id')"
				:label="$t('sing_in.form.uf.label')"
				:error="addrStore.$state.data.uf.valid"
			>
				<InputField
					required
					list="state-uf-list"
					:id="$t('sing_in.form.uf.id')"
					:placeholder="$t('sing_in.form.uf.placeholder')"
					v-bind:value="addrStore.$state.data.uf.value"
					v-on:blur="
						$event => {
							const state = suggestions.states.find(
								state => state.sigla === $event.target?.value,
							)

							if (state) {
								addrStore.$state.data.uf.value = state?.sigla || ''
								addrStore.$state.data.uf.valid = ''
								addrStore.$state.data.estado = state?.nome || ''
							} else {
								addrStore.$state.data.uf.valid = 'Erro: Campo UF não existe'
							}

							if ($event.target?.value.length === 0) {
								addrStore.$state.data.uf.valid = 'Erro: Campo UF está vazio'
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
				:error="addrStore.$state.data.localidade.valid"
			>
				<InputField
					required
					list="city-list"
					:id="$t('sing_in.form.localidade.id')"
					:placeholder="$t('sing_in.form.localidade.placeholder')"
					v-bind:value="addrStore.$state.data.localidade.value"
					v-on:input="
						addrStore.$state.data.localidade.valid = $event.target?.value
					"
					v-on:blur="
						() => {
							if (addrStore.$state.data.localidade.valid.length === 0) {
								addrStore.$state.data.localidade.valid =
									'Erro: Cidade não pode ser um campo vazio'
							} else {
								addrStore.$state.data.localidade.valid = ''
							}
						}
					"
					v-on:mouseover="
						suggestions.fetchCitySuggestions(addrStore.$state.data.uf.value)
					"
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
				:error="addrStore.$state.data.logradouro.valid"
			>
				<InputField
					required
					:id="$t('sing_in.form.logradouro.id')"
					:placeholder="$t('sing_in.form.logradouro.placeholder')"
					v-bind:value="addrStore.$state.data.logradouro.value"
					v-on:input="
						$event => {
							addrStore.$state.data.logradouro = $event.target?.value
						}
					"
					v-on:blur="
						() => {
							if (addrStore.$state.data.logradouro.value.length === 0) {
								addrStore.$state.data.logradouro.valid =
									'Erro: Logradouro não pode ser um campo vazio'
							} else {
								addrStore.$state.data.logradouro.valid = ''
							}
						}
					"
				/>
			</FormField>

			<FormField
				required
				:id="$t('sing_in.form.numero.id')"
				:label="$t('sing_in.form.numero.label')"
				:error="addrStore.$state.data.numero.valid"
			>
				<InputField
					type="number"
					maxlength="6"
					required
					:id="$t('sing_in.form.numero.id')"
					:placeholder="$t('sing_in.form.numero.placeholder')"
					v-bind:value="addrStore.$state.data.numero"
					v-on:input="
						$event => {
							addrStore.$state.data.numero.value = $event.target?.value
								.match(/^\d+$/, '')
								?.join('')
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
					v-bind:value="addrStore.$state.data.complemento"
					v-on:input="addrStore.$state.data.complemento = $event.target?.value"
				/>
			</FormField>

			<label class="sr-only" :for="$t('sing_in.form.submit.id')">Avançar</label>
			<input
				type="submit"
				value="Avancar"
				:id="$t('sing_in.form.submit.id')"
				:name="$t('sing_in.form.submit.id')"
			/>
		</fieldset>
	</form>
</template>

<style lang="scss" scoped>
@use './FormAddresses.scss';
</style>
