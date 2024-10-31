import { defineStore } from 'pinia'
import axios from 'axios'

export type AddressProps = {
	cep: {
		value: string
		formatted: string
		valid: string
	}
	logradouro: {
		value: string
		valid: string
	}
	localidade: {
		value: string
		valid: string
	}
	uf: {
		value: string
		valid: string
	}
	numero: {
		value: string
		valid: string
	}
	estado: string
	bairro: string
	complemento: string
}

export const emptyAddress = (): AddressProps => ({
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

export const useAddressStore = defineStore('address', {
	state: () => ({
		data: emptyAddress(),
	}),
	actions: {
		reset() {
			this.$patch({ data: emptyAddress() })
		},
		set(addr: AddressProps) {
			this.$patch({ data: addr })
		},
		async fetchAddress() {
			if (this.$state.data.cep.value.length !== 8) return

			try {
				const { data } = await axios.get(
					`https://viacep.com.br/ws/${this.$state.data.cep.value}/json/`,
				)

				if (!data) {
					this.$state.data.cep.valid = 'Erro na busca do banco de dados'
					throw new Error('Erro na busca do banco de dados')
				}

				const { logradouro, bairro, localidade, uf, complemento, estado } =
					data ?? {}

				if (!logradouro || !localidade || !uf) {
					this.$state.data.cep.valid = 'CEP só deu um endereço vazio'
					throw new Error('CEP só deu um endereço vazio')
				}

				this.$state.data.logradouro.value = logradouro ?? ''
				this.$state.data.complemento = complemento ?? ''
				this.$state.data.bairro = bairro ?? ''
				this.$state.data.localidade.value = localidade ?? ''
				this.$state.data.uf.value = uf ?? ''
				this.$state.data.estado = estado ?? ''
			} catch (err) {
				if (err instanceof Error) {
					this.$state.data.cep.valid = err.message
				}
				throw err
			}
		},
		cepFormat(formatted: string | undefined | null) {
			if (formatted === null || formatted === undefined) {
				this.$state.data.cep.formatted = ''
				this.$state.data.cep.value = ''

				return
			}

			try {
				const parsedFormatted = formatted
					.replace(/[^0-9]/g, '')
					.slice(0, 8)
					.replace(/(\d{5})(\d{3})/, '$1-$2')

				if (parsedFormatted.length !== 9) {
					throw new Error('CEP must have 8 numbers')
				}

				this.$state.data.cep.formatted = parsedFormatted
				this.$state.data.cep.value = parsedFormatted.replace(/[^0-9]/g, '')
			} catch (err) {
				if (err instanceof Error) {
					this.$state.data.cep.valid = err.message
				}

				throw err
			}
		},
	},
})

export const useAddressesStore = defineStore('addresses', {
	state: (): AddressProps[] => [],
	actions: {
		push(address: AddressProps) {
			this.$patch(state => {
				state.push(address)
			})
		},
		delete(index: number) {
			this.$patch(state => {
				state.splice(index, 1)
			})
		},
		edit(address: AddressProps, index: number) {
			this.$state[index] = address
		},
	},
})
