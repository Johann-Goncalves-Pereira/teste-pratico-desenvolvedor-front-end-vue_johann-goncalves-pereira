<script lang="ts" setup>
import { defineProps } from 'vue'

const props = defineProps({
	onClose: Function,
	id: {
		type: String,
		required: true,
	},
})

const handleCloseDialogOutOfBound = (
	event: MouseEvent,
	element: HTMLDialogElement,
) => {
	if (element instanceof HTMLDialogElement) {
		const dimensions = element.getBoundingClientRect()

		if (
			event.clientX < dimensions.left ||
			event.clientX > dimensions.right ||
			event.clientY < dimensions.top ||
			event.clientY > dimensions.bottom
		) {
			element.close()
			event.preventDefault()

			if (props.onClose) {
				props.onClose()
			}
		}
	}
}
</script>

<template>
	<dialog
		class="dialog"
		:id="id"
		@click="
			handleCloseDialogOutOfBound($event, $event.target as HTMLDialogElement)
		"
	>
		<slot />
	</dialog>
</template>

<style lang="scss" scoped>
@use './DialogModal.scss';
</style>
