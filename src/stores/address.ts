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

export const useAddressStore = defineStore('address', {
	state: (): AddressFieldsProps => {
		return {
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
		}
	},
	actions: {
		handleCEP(formatted: string) {
			this.cep.formatted = formatted
				.replace(/[^0-9]/g, '')
				.slice(0, 8)
				.replace(/(\d{5})(\d{3})/, '$1-$2')

			this.cep.value = this.cep.formatted.replace(/[^0-9]/g, '')
		},
		async fetchAddressByCep() {
			if (this.cep.value.length !== 8) return

			try {
				const { data } = await axios.get(
					`https://viacep.com.br/ws/${this.cep.value}/json/`,
				)
				console.log(data)

				if (!data) {
					this.cep.valid = 'Erro na busca do banco de dados'
					throw new Error('Erro na busca do banco de dados')
				}

				const { logradouro, bairro, localidade, uf, complemento, estado } = data

				if (!logradouro || !localidade || !uf) {
					this.cep.valid = 'CEP só deu um endereço vazio'
					throw new Error('CEP só deu um endereço vazio')
				}

				this.logradouro.value = logradouro || ''
				this.complemento = complemento || ''
				this.bairro = bairro || ''
				this.localidade.value = localidade || ''
				this.uf.value = uf || ''
				this.estado = estado || ''
			} catch (err) {
				if (err instanceof Error) {
					this.cep.valid = err.message
				}
				throw err
			}
		},
	},
})

export const useAddressesStore = defineStore('addresses', {
	state: (): AddressFieldsProps[] => {
		return [
			{
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
			},
		]
	},
	actions: {
		pushAddress(address: AddressFieldsProps | null) {
			if (!address) return
			if (address.cep?.value?.length !== 8) throw new Error('CEP inválido')
			if (address.logradouro.valid?.length !== 0)
				throw new Error('Logradouro inválido')
			if (address.uf.valid?.length !== 0) throw new Error('UF inválido')
			if (address.numero?.valid.length !== 0) throw new Error('Numero inválido')

			this.$state.push(address)
		},
	},
})
