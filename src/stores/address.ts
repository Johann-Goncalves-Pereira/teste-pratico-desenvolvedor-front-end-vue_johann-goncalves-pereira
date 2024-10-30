import { defineStore } from 'pinia'

export type AddressFieldsProps = {
	cep: {
		value: string
		formatted: string
		valid: string
	}
	logradouro: string
	complemento: string
	bairro: string
	localidade: string
	uf: string
	estado: string
	numero: string
}

export const useAddressStore = defineStore('address', {
  
	state: () => {
		return {
			cep: {
				value: '',
				formatted: '',
				valid: '',
			},
			logradouro: '',
			complemento: '',
			bairro: '',
			localidade: '',
			uf: '',
			estado: '',
			numero: '',
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
	state: () => {
		return [
			{
				cep: {
					value: '',
					formatted: '',
					valid: '',
				},
				logradouro: '',
				complemento: '',
				bairro: '',
				localidade: '',
				uf: '',
				estado: '',
				numero: '',
			},
		]
	},
	actions: {
		addAddressStore(address: AddressFieldsProps | null) {
			if (!address) return

			if (address.cep?.value?.length !== 8) {
				console.log('CEP inválido')

				return
			}

			if (address.logradouro?.length === 0) {
				console.log('Logradouro inválido')

				return
			}

			if (address.uf?.length === 0) {
				console.log('UF inválido')

				return
			}

			if (address.numero?.length === 0) {
				console.log('Numero inválido')

				return
			}

			this.$state.push(address)
		},
	},
})
