import { defineStore } from 'pinia'

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
				const response = await fetch(
					`https://viacep.com.br/ws/${this.cep.value}/json/`,
				)

				if (!response.ok) {
					this.cep.valid = 'Erro na busca do banco de dados'
					throw new Error(`Erro na busca do banco de dados: ${this.cep.value}`)
				}

				const { logradouro, complemento, bairro, localidade, uf, estado } =
					(await response.json()) || {}

				if (!logradouro || !localidade || !uf) {
					this.cep.valid = 'CEP só deu um endereço vazio'
					// throw new Error(`CEP só deu um endereço vazio: ${response}`)
				}

				this.logradouro = logradouro || ''
				this.complemento = complemento || ''
				this.bairro = bairro || ''
				this.localidade = localidade || ''
				this.uf = uf || ''
				this.estado = estado || ''
			} catch (err) {
				this.cep.valid = `${err}`
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
		addAddressStore(address: AddressFieldsProps | null) {
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
