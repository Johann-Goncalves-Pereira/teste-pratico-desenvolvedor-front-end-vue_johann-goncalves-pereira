import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'

import HomeView from '../../views/HomeView.vue'
import SignInView from '@/views/SignInView.vue'

describe('HomeView', () => {
	it('renders h1', () => {
		const wrapper = mount(HomeView)
		expect(wrapper.find('h1').text()).toBe('Welcome to my app')
	})
})

describe('SignInView', () => {
	it('renders h1', () => {
		const wrapper = mount(SignInView)
		expect(wrapper.find('h1').text()).toBe('Sign In')
	})
})
