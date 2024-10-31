import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import FormAddresses from '../FormAddresses/FormAddresses.vue'

describe('FormAddresses', () => {
	it('renders properly', () => {
		const wrapper = mount(FormAddresses, {
			props: {
				address: {
					cep: { value: '12345678', formatted: '12345-678', valid: '' },
					logradouro: { value: 'Rua das Mangueiras', valid: '' },
					complemento: 'Apto 1001',
					bairro: 'Bandeirinha',
					localidade: { value: 'S o Paulo', valid: '' },
					uf: { value: 'SP', valid: '' },
					numero: { value: '1001', valid: '' },
					estado: 'São paulo',
				},
			},
		})
		expect(
			wrapper.find('[data-test-id="cep"]').element.getAttribute('value'),
		).toBe('12345-678')
		expect(
			wrapper.find('[data-test-id="logradouro"]').element.getAttribute('value'),
		).toBe('Rua das Mangueiras')
		expect(
			wrapper
				.find('[data-test-id="complemento"]')
				.element.getAttribute('value'),
		).toBe('Apto 1001')
		expect(
			wrapper.find('[data-test-id="bairro"]').element.getAttribute('value'),
		).toBe('Bandeirinha')
		expect(
			wrapper.find('[data-test-id="localidade"]').element.getAttribute('value'),
		).toBe('São Paulo')
		expect(
			wrapper.find('[data-test-id="uf"]').element.getAttribute('value'),
		).toBe('SP')
		expect(
			wrapper.find('[data-test-id="numero"]').element.getAttribute('value'),
		).toBe('1001')
	})
})
