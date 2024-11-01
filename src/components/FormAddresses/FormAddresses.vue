<script setup lang="ts">
import { useStateSuggestions } from '@/stores/suggestions'
import { defineProps } from 'vue'
import FormField from '../FormAddresses/ItemField/ItemField.vue'
import InputField from '../FormAddresses/InputField/InputField.vue'
import {
	emptyAddress,
	useAddressStore,
	useAddressesStore,
	type AddressProps,
} from '@/stores/address'
import type { PropType } from 'vue'

const props = defineProps({
	index: Number,
	address: Object as PropType<AddressProps>,
	onClose: Function,
})

console.log('index', props.index)
const suggestions = useStateSuggestions()
const addresses = useAddressesStore()
const addr = useAddressStore()
addr.set(props.address || emptyAddress())
</script>

<template>
	<form
		class="form"
		@submit.prevent="
			() => {
				if (props.index !== undefined) {
					addresses.edit(addr.$state.data, props.index)
					if (props.onClose) props.onClose()
				} else {
					addresses.push(addr.$state.data)
					addr.reset()
				}
			}
		"
	>
		<fieldset class="form__wrapper">
			<legend class="form__title">
				{{ $t('sing_in.title') }}
				<p>
					{{ addr.$state.data.logradouro.value }}
					- {{ addr.$state.data.numero.value }},
					{{ addr.$state.data.complemento }}
					{{ addr.$state.data.bairro }},
					{{ addr.$state.data.localidade.value }} -
					{{ addr.$state.data.uf.value }} /
					{{ addr.$state.data.estado }}
				</p>
			</legend>

			<FormField
				required
				:id="$t('sing_in.form.cep.id')"
				:label="$t('sing_in.form.cep.label')"
				:error="addr.$state.data.cep.valid"
			>
				<InputField
					required
					:id="$t('sing_in.form.cep.id')"
					:placeholder="$t('sing_in.form.cep.placeholder')"
					v-bind:value="addr.$state.data.cep.formatted"
					v-on:input="
						$event => {
							addr.cepFormat($event.target?.value)
							$event.target.value = addr.$state.data.cep.formatted
							if (addr.$state.data.cep.value.length === 8) {
								addr.fetchAddress()
							} else {
								addr.$state.data.estado = ''
								addr.$state.data.localidade.value = ''
								addr.$state.data.logradouro.value = ''
								addr.$state.data.bairro = ''
								addr.$state.data.uf.value = ''
							}
						}
					"
					v-on:blur="
						() => {
							if (addr.$state.data.cep.value.length === 0) {
								addr.$state.data.cep.valid =
									'Erro: CEP não pode ser um campo vazio'
							}
							if (addr.$state.data.cep.value.length !== 9) {
								addr.$state.data.cep.valid = 'Erro: CEP deve ter 8 digitos'
							}
							if (addr.$state.data.cep.value.length === 8) {
								addr.$state.data.cep.valid = ''
							}
						}
					"
				/>
			</FormField>

			<FormField
				required
				:id="$t('sing_in.form.uf.id')"
				:label="$t('sing_in.form.uf.label')"
				:error="addr.$state.data.uf.valid"
			>
				<InputField
					required
					list="state-uf-list"
					:id="$t('sing_in.form.uf.id')"
					:placeholder="$t('sing_in.form.uf.placeholder')"
					v-bind:value="addr.$state.data.uf.value"
					v-on:blur="
						$event => {
							const state = suggestions.states.find(
								state => state.sigla === $event.target?.value,
							)

							if (state) {
								addr.$state.data.uf.value = state?.sigla || ''
								addr.$state.data.uf.valid = ''
								addr.$state.data.estado = state?.nome || ''

								$event.target.value = addr.$state.data.uf.value
							} else {
								addr.$state.data.uf.valid = 'Erro: Campo UF não existe'
							}

							if ($event.target?.value.length === 0) {
								addr.$state.data.uf.valid = 'Erro: Campo UF está vazio'
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
				:error="addr.$state.data.localidade.valid"
			>
				<InputField
					required
					list="city-list"
					:id="$t('sing_in.form.localidade.id')"
					:placeholder="$t('sing_in.form.localidade.placeholder')"
					v-bind:value="addr.$state.data.localidade.value"
					v-on:input="addr.$state.data.localidade.valid = $event.target?.value"
					v-on:blur="
						() => {
							if (addr.$state.data.localidade.value.length === 0) {
								addr.$state.data.localidade.valid =
									'Erro: Cidade não pode ser um campo vazio'
							} else {
								addr.$state.data.localidade.valid = ''
							}
						}
					"
					v-on:mouseover="
						suggestions.fetchCitySuggestions(addr.$state.data.uf.value)
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
				:error="addr.$state.data.logradouro.valid"
			>
				<InputField
					required
					:id="$t('sing_in.form.logradouro.id')"
					:placeholder="$t('sing_in.form.logradouro.placeholder')"
					v-bind:value="addr.$state.data.logradouro.value"
					v-on:input="
						$event => {
							addr.$state.data.logradouro = $event.target?.value
							$event.target.value = addr.$state.data.logradouro.value
						}
					"
					v-on:blur="
						() => {
							if (addr.$state.data.logradouro.value.length === 0) {
								addr.$state.data.logradouro.valid =
									'Erro: Logradouro não pode ser um campo vazio'
							} else {
								addr.$state.data.logradouro.valid = ''
							}
						}
					"
				/>
			</FormField>

			<FormField
				required
				:id="$t('sing_in.form.numero.id')"
				:label="$t('sing_in.form.numero.label')"
				:error="addr.$state.data.numero.valid"
			>
				<InputField
					type="number"
					maxlength="6"
					required
					:id="$t('sing_in.form.numero.id')"
					:placeholder="$t('sing_in.form.numero.placeholder')"
					v-bind:value="addr.$state.data.numero.value"
					v-on:input="
						$event => {
							addr.$state.data.numero.value = $event.target?.value
								.match(/^\d+$/, '')
								?.join('')

							$event.target.value = addr.$state.data.numero.value
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
					v-bind:value="addr.$state.data.complemento"
					v-on:input="
						$event => {
							addr.$state.data.complemento = $event.target?.value
							$event.target.value = addr.$state.data.complemento
						}
					"
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
