<script setup lang="ts">
import { useAddressesStore } from '@/stores/address'
import { useStateSuggestions } from '@/stores/suggestions'
import { defineProps } from 'vue'
import FormField from '../SignIn/FormField/FormField.vue'
import InputField from '../SignIn/FormField/InputField.vue'

const props = defineProps({
	index: {
		type: Number,
		required: true,
	},
	push: Boolean,
})

const suggestions = useStateSuggestions()
const addresses = useAddressesStore()

console.log(props.index)
</script>

<template>
	<form
		class="form"
		@submit.prevent="
			() => {
				if (props.index >= 0 && props.index < addresses.$state.length) {
					addresses.pushAddress(addresses.$state, props.push, props.index)
				}
			}
		"
	>
		<fieldset class="form__wrapper">
			<legend class="form__title">
				{{ props.push ? String(props.index) : '' }}
				{{ $t('sing_in.title') }}
				<p>
					{{ addresses[props.index].logradouro.value }}
					- {{ addresses[props.index].numero.value }},
					{{ addresses[props.index].complemento }}
					{{ addresses[props.index].bairro }},
					{{ addresses[props.index].localidade.value }} -
					{{ addresses[props.index].uf.value }} /
					{{ addresses[props.index].estado }}
				</p>
			</legend>

			<FormField
				required
				:id="$t('sing_in.form.cep.id')"
				:label="$t('sing_in.form.cep.label')"
				:error="addresses[props.index].cep.valid"
			>
				<InputField
					required
					:id="$t('sing_in.form.cep.id')"
					:placeholder="$t('sing_in.form.cep.placeholder')"
					v-bind:value="addresses[props.index].cep.formatted"
					v-on:input="addresses.handleCEP($event.target?.value, props.index)"
					v-on:blur="
						() => {
							addresses.fetchAddressByCep(props.index)

							if (addresses[props.index].cep.value.length === 0) {
								addresses[props.index].cep.valid =
									'Erro: CEP não pode ser um campo vazio'
							}
							if (addresses[props.index].cep.value.length !== 9) {
								addresses[props.index].cep.valid =
									'Erro: CEP deve ter 8 digitos'
							}
							if (addresses[props.index].cep.value.length === 8) {
								addresses[props.index].cep.valid = ''
							}
						}
					"
				/>
			</FormField>

			<FormField
				required
				:id="$t('sing_in.form.uf.id')"
				:label="$t('sing_in.form.uf.label')"
				:error="addresses[props.index].uf.valid"
			>
				<InputField
					required
					list="state-uf-list"
					:id="$t('sing_in.form.uf.id')"
					:placeholder="$t('sing_in.form.uf.placeholder')"
					v-bind:value="addresses[props.index].uf.value"
					v-on:blur="
						$event => {
							const state = suggestions.states.find(
								state => state.sigla === $event.target?.value,
							)

							if (state) {
								addresses[props.index].uf.value = state?.sigla || ''
								addresses[props.index].uf.valid = ''
								addresses[props.index].estado = state?.nome || ''
							} else {
								addresses[props.index].uf.valid = 'Erro: Campo UF não existe'
							}

							if ($event.target?.value.length === 0) {
								addresses[props.index].uf.valid = 'Erro: Campo UF está vazio'
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
				:error="addresses[props.index].localidade.valid"
			>
				<InputField
					required
					list="city-list"
					:id="$t('sing_in.form.localidade.id')"
					:placeholder="$t('sing_in.form.localidade.placeholder')"
					v-bind:value="addresses[props.index].localidade.value"
					v-on:input="
						addresses[props.index].localidade.valid = $event.target?.value
					"
					v-on:blur="
						() => {
							if (addresses[props.index].localidade.valid.length === 0) {
								addresses[props.index].localidade.valid =
									'Erro: Cidade não pode ser um campo vazio'
							} else {
								addresses[props.index].localidade.valid = ''
							}
						}
					"
					v-on:mouseover="
						suggestions.fetchCitySuggestions(addresses[props.index].uf.value)
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
				:error="addresses[props.index].logradouro.valid"
			>
				<InputField
					required
					:id="$t('sing_in.form.logradouro.id')"
					:placeholder="$t('sing_in.form.logradouro.placeholder')"
					v-bind:value="addresses[props.index].logradouro.value"
					v-on:input="
						$event => {
							addresses[props.index].logradouro = $event.target?.value
						}
					"
					v-on:blur="
						() => {
							if (addresses[props.index].logradouro.value.length === 0) {
								addresses[props.index].logradouro.valid =
									'Erro: Logradouro não pode ser um campo vazio'
							} else {
								addresses[props.index].logradouro.valid = ''
							}
						}
					"
				/>
			</FormField>

			<FormField
				required
				:id="$t('sing_in.form.numero.id')"
				:label="$t('sing_in.form.numero.label')"
				:error="addresses[props.index].numero.valid"
			>
				<InputField
					type="number"
					maxlength="6"
					required
					:id="$t('sing_in.form.numero.id')"
					:placeholder="$t('sing_in.form.numero.placeholder')"
					v-bind:value="addresses[props.index].numero"
					v-on:input="
						$event => {
							addresses[props.index].numero.value = $event.target?.value
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
					v-bind:value="addresses[props.index].complemento"
					v-on:input="addresses[props.index].complemento = $event.target?.value"
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
