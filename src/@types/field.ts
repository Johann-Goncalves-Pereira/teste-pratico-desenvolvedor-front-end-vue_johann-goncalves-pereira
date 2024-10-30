export interface AddressFieldsProps {
	cep: string
	logradouro: string
	complemento: string
	unidade: string
	bairro: string
	localidade: string
	uf: string
	estado: string
	regiao: string
	ibge: string
	gia: string
	ddd: string
	siafi: string
}

export interface UFProps {
	id: number
	sigla: string
	nome: string
}

export interface CitiesProps {
	nome: string
	microrregiao: {
		id: number
		nome: string
		mesorregiao: {
			id: number
			nome: string
			UF: {
				id: number
				sigla: string
				regiao: {
					id: number
					sigla: string
					nome: string
				}
				nome: string
			}
		}
	}
}
