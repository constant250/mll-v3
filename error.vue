<template>
	<NuxtLayout>
		<div class="error-page">
			<div
				class="container d-flex flex-column align-items-center justify-content-center"
			>
				<h1>Error {{ pageData?.heading }}</h1>
				<div class="body-small" v-html="pageData?.desc"></div>
				<Button
					:to="pageData?.button_link"
					classes="small green"
					:arrow="true"
					>{{ pageData?.button_text }}</Button
				>
			</div>
		</div>
	</NuxtLayout>
</template>

<script setup>
	const error = useError();
	const pageData = {
		heading: error.value.statusCode,
		desc: error.value.statusMessage,
		button_text: "Return to homepage",
		button_link: "/",
	};
</script>
