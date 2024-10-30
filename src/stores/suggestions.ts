import type { UFProps, CitiesProps } from '@/@types/field'
import { defineStore } from 'pinia'

export const useStateSuggestions = defineStore('suggestions', {
	state: () => ({
		states: [] as UFProps[],
		cities: [] as CitiesProps[],
	}),
	actions: {
		async fetchSuggestions(query: string) {
			if (!query) {
				throw new Error('No query string provided')
			}

			try {
				const response = await fetch(query)

				if (!response.ok) {
					throw new Error(
						`Erro na busca dos dados: ${response.status} ${response.statusText}`,
					)
				}

				const data = await response.json()

				if (!data) {
					throw new Error('No data was returned from the API')
				}

				return data
			} catch (err) {
				if (err instanceof Error) {
					throw Error(`Erro na busca do banco de dados: ${err.message}`)
				} else {
					throw Error('Erro desconhecido ao buscar dados')
				}
			}
		},
		async fetchStateSuggestions() {
			if (this.states.length !== 0) return

			this.states = await this.fetchSuggestions(
				'https://servicodados.ibge.gov.br/api/v1/localidades/estados',
			)
			if (this.states.length === 0) {
				throw new Error(`Erro na busca dos estados: ${this.states}`)
			}
			this.cities = []
		},

		async fetchCitySuggestions(uf: string) {
			if (this.states.length === 0) return

			this.cities = await this.fetchSuggestions(
				`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${encodeURIComponent(
					uf,
				)}/municipios`,
			)
		},
	},
})
