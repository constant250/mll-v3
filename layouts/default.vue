<template>
	<div :class="{ mac: isMac, 'windows-os': isWindows }">
		<!-- <Header :class="{ home: isHome }" /> -->
		<main role="main">
			<slot />
		</main>
		<!-- <Footer /> -->
	</div>
</template>

<script setup>
	const isMac = ref(false);
	const isWindows = ref(false);
	const isHome = ref(false);
	onMounted(() => {
		if (navigator.platform.indexOf("Mac") > -1) {
			isMac.value = true;
		} else if (navigator.platform.indexOf("Win") > -1) {
			isWindows.value = true;
		}

		if (window.location.pathname === "/") {
			isHome.value = true;
		}
	});
</script>
