import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import FormField from '../SignIn/FormField/FormField.vue'

describe('FormField', () => {
	it('renders properly', () => {
		const wrapper = mount(FormField, { props: { msg: 'Hello Vitest' } })
		expect(wrapper.text()).toContain('Hello Vitest')
	})
})
