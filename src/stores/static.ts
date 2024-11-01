import { createI18n } from 'vue-i18n'

export const i18n = createI18n({
	locale: 'en',
	messages: {
		en: {
			home: {
				h1: 'Preencha o seu endereço',
				h2: 'Nenhum endereço encontrado',
        list: {
          cep: 'CEP:',
          numero: 'Numero da casa:',
          logradouro: 'Logradouro:',
          complemento: 'Complemento:',
          uf: 'UF:',
          bairro: 'Bairro:',
          localidade: 'Cidade:',
        }
			},
			sing_in: {
				title: 'Endereço: ',
				form: {
					cep: {
						label: 'CEP',
						id: 'form__id--cep-code',
						placeholder: '00000-000',
					},
					logradouro: {
						label: 'Logradouro',
						id: 'form__id--street-name',
						placeholder: 'R. das Mangueiras',
					},
					complemento: {
						label: 'Complemento',
						id: 'form__id--complement',
						placeholder: 'Apto 1001',
					},
					uf: {
						label: 'UF',
						id: 'form__id--state-uf',
						placeholder: 'SP',
					},
					bairro: {
						label: 'Bairro',
						id: 'form__id--neighborhood',
						placeholder: 'Bandeirinha',
					},
					localidade: {
						label: 'Cidade',
						id: 'form__id--city-name',
						placeholder: 'São Paulo',
					},
					numero: {
						label: 'N°',
						id: 'form__id--house-number',
						placeholder: '1001',
					},
					submit: {
						id: 'form__id--submit',
						value: 'Avancar',
					},
				},
			},
		},
	},
})
