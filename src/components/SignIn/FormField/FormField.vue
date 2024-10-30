<script lang="ts">
export default {
	props: {
		id: String,
		label: String,
		required: Boolean,
		error: String,
	},
}
</script>

<template>
	<div class="field">
		<label :for="id">{{ label }}<small v-if="required">*</small>:</label>
		<slot />
		<p class="error" v-if="error?.length !== 0">
			{{ error }}
		</p>
	</div>
</template>

<style lang="scss" scoped>
@use './FormField.scss';
</style>
