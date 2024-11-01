import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import ItemField from '../FormAddresses/ItemField/ItemField.vue'
import InputField from '../FormAddresses/InputField/InputField.vue'

describe('ItemField', () => {
	it('renders properly', () => {
		const wrapper = mount(ItemField, {
			slots: {
				default: 'Form field - input field',
			},
		})
		expect(wrapper.text()).toContain('Form field - input field')
	})

	it('renders error message', () => {
		const wrapper = mount(ItemField, {
			props: {
				error: 'Error message',
			},
			slots: {
				default: 'Form field - input field',
			},
		})
		expect(wrapper.text()).toContain('Error message')
	})
})

describe('InputField', () => {
	it('renders with correct placeholder and required attribute', () => {
		const wrapper = mount(InputField, {
			props: {
				id: 'test-id',
				placeholder: 'Enter text here',
				required: true,
			},
		})
		const input = wrapper.find('input')
		expect(input.attributes('placeholder')).toBe('Enter text here')
		expect(input.attributes('required')).toBeDefined()
	})
})
