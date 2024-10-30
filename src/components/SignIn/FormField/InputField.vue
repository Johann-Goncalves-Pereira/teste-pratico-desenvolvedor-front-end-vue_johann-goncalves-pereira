<script lang="ts">
export default {
	props: {
		id: String,
		placeholder: String,
		required: Boolean,
	},
}
</script>

<template>
	<input
		class="input"
		:id="id"
		:name="id"
		:placeholder="placeholder"
		:required="required"
	/>
</template>

<style lang="scss" scoped>
@use './InputField.scss';
</style>
