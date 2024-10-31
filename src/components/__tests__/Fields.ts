import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import FormField from '../SignIn/FormField/FormField.vue'
import InputField from '../SignIn/FormField/InputField.vue'


describe('FormField', () => {
	it('renders properly', () => {
		const wrapper = mount(FormField, {
			slots: {
				default: 'Form field - input field',
			},
		})
		expect(wrapper.text()).toContain('Form field - input field')
	})

	it('renders error message', () => {
		const wrapper = mount(FormField, {
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

