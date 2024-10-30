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
		handleCEP(formatted: string, index: number) {
			this[index].cep.formatted = formatted
				.replace(/[^0-9]/g, '')
				.slice(0, 8)
				.replace(/(\d{5})(\d{3})/, '$1-$2')

			this[index].cep.value = this[index].cep.formatted.replace(/[^0-9]/g, '')
		},
		async fetchAddressByCep(index: number) {
			if (this[index].cep.value.length !== 8) return

			try {
				const { data } = await axios.get(
					`https://viacep.com.br/ws/${this[index].cep.value}/json/`,
				)
				console.log(data)

				if (!data) {
					this[index].cep.valid = 'Erro na busca do banco de dados'
					throw new Error('Erro na busca do banco de dados')
				}

				const { logradouro, bairro, localidade, uf, complemento, estado } = data

				if (!logradouro || !localidade || !uf) {
					this[index].cep.valid = 'CEP só deu um endereço vazio'
					throw new Error('CEP só deu um endereço vazio')
				}

				this[index].logradouro.value = logradouro || ''
				this[index].complemento = complemento || ''
				this[index].bairro = bairro || ''
				this[index].localidade.value = localidade || ''
				this[index].uf.value = uf || ''
				this[index].estado = estado || ''
			} catch (err) {
				if (err instanceof Error) {
					this[index].cep.valid = err.message
				}
				throw err
			}
		},
		pushAddress(
			address: AddressFieldsProps[],
			pushOrEdit: boolean,
			index: number,
		) {
			if (address[index].cep?.value?.length !== 8)
				throw new Error('CEP inválido')
			if (address[index].logradouro.valid?.length !== 0)
				throw new Error('Logradouro inválido')
			if (address[index].uf.valid?.length !== 0) throw new Error('UF inválido')
			if (address[index].numero?.valid.length !== 0)
				throw new Error('Numero inválido')

			if (pushOrEdit) {
				address.push(address[index])
			} else {
				address[index] = address[index]
			}
		},
	},
})
