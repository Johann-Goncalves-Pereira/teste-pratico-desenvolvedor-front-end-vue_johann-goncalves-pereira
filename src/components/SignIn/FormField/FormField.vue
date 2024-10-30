<script lang="ts">
export default {
	props: {
		id: String,
		label: String,
		required: Boolean,
	},
}
</script>

<template>
	<div class="field">
		<label :for="id">{{ label }}<small v-if="required">*</small>:</label>
		<slot />
	</div>
</template>

<style lang="scss" scoped>
@use './FormField.scss';
</style>
