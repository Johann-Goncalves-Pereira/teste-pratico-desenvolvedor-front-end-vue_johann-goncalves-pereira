import { defineStore } from 'pinia'
import axios from 'axios'

export type AddressFieldsProps = {
	cep: {
		value: string
		formatted: string
		valid: string
	}
	logradouro: {
		value: string
		valid: string
	}
	complemento: string
	bairro: string
	localidade: {
		value: string
		valid: string
	}
	uf: {
		value: string
		valid: string
	}
	estado: string
	numero: {
		value: string
		valid: string
	}
}

export const emptyAddress = (): AddressFieldsProps => ({
	cep: {
		value: '',
		formatted: '',
		valid: '',
	},
	logradouro: { value: '', valid: '' },
	complemento: '',
	bairro: '',
	localidade: {
		value: '',
		valid: '',
	},
	uf: {
		value: '',
		valid: '',
	},
	estado: '',
	numero: {
		value: '',
		valid: '',
	},
})

export const useAddress = defineStore('address', {
	state: () => ({
		data: emptyAddress(),
	}),
	actions: {
		reset() {
			this.$patch({ data: emptyAddress() })
		},
		set(addr: AddressFieldsProps) {
			this.$patch({ data: addr })
		},
		async fetchAddressByCep() {
			if (this.$state.data.cep.value.length !== 8) return

			try {
				const { data } = await axios.get(
					`https://viacep.com.br/ws/${this.$state.data.cep.value}/json/`,
				)

				if (!data) {
					this.$state.data.cep.valid = 'Erro na busca do banco de dados'
					throw new Error('Erro na busca do banco de dados')
				}

				const { logradouro, bairro, localidade, uf, complemento, estado } = data

				if (!logradouro || !localidade || !uf) {
					this.$state.data.cep.valid = 'CEP só deu um endereço vazio'
					throw new Error('CEP só deu um endereço vazio')
				}

				this.$state.data.logradouro.value = logradouro || ''
				this.$state.data.complemento = complemento || ''
				this.$state.data.bairro = bairro || ''
				this.$state.data.localidade.value = localidade || ''
				this.$state.data.uf.value = uf || ''
				this.$state.data.estado = estado || ''
			} catch (err) {
				if (err instanceof Error) {
					this.$state.data.cep.valid = err.message
				}
				throw err
			}
		},
		handleCEP(formatted: string) {
			this.$state.data.cep.formatted = formatted
				.replace(/[^0-9]/g, '')
				.slice(0, 8)
				.replace(/(\d{5})(\d{3})/, '$1-$2')

			this.$state.data.cep.value = this.$state.data.cep.formatted.replace(
				/[^0-9]/g,
				'',
			)
		},
	},
})

export const useAddressesStore = defineStore('addresses', {
	state: (): AddressFieldsProps[] => [],
	actions: {
		push(address: AddressFieldsProps) {
			this.$patch(state => {
				state.push(address)
			})
		},
		deleteAddress(index: number) {
			this.$patch(state => {
				state.splice(index, 1)
			})
		},
		editAddress(address: AddressFieldsProps, index: number) {
			this.$state[index] = address
		},
	},
})
