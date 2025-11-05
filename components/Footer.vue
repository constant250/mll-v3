<template>
	<footer>
		<div class="container">
			<div class="row top-row">
				<div class="col-12 col-lg-4">
					<div class="logo">
						<NuxtImg src="/images/logo-footer.svg" alt="Logo" />
					</div>
				</div>
				<div class="col-12 col-lg-5">
					<div class="cta">
						<p>{{ pageData.cta.leadcopy }}</p>
						<a
							:href="pageData.cta.button_link"
							class="button white"
							:target="pageData.cta.button_is_external ? '_blank' : '_self'"
							>{{ pageData.cta.button_text }}</a
						>
					</div>
				</div>
				<div class="col-12 col-lg-3 social-links">
					<a :href="pageData.facebook" class="facebook">
						<FacebookLogo />
					</a>
					<a :href="pageData.instagram" class="instagram">
						<InstagramLogo />
					</a>
					<a :href="pageData.linkedin" class="linkedin">
						<LinkedinLogo />
					</a>
				</div>
			</div>
			<div class="row bottom-row">
				<div
					class="col-12 d-flex flex-column justify-content-center align-items-center"
				>
					<div class="copyright">
						<p>Ateco NZ © {{ new Date().getFullYear() }}</p>
					</div>
					<div class="links">
						<a href="/privacy-policy">Privacy Policy</a>
						<a href="/terms">Terms of Use</a>
					</div>
				</div>
			</div>
		</div>
	</footer>
</template>

<script setup>
	const settings = await getSettings();

	const pageData = {
		facebook: settings?.facebook ?? "",
		instagram: settings?.instagram ?? "",
		linkedin: settings?.linkedin ?? "",

		cta: {
			leadcopy: settings?.footer_text ?? "",
			button_text: settings?.footer_button?.text ?? "",
			button_link: settings?.footer_button?.url ?? "",
			button_is_external: settings?.footer_button?.is_external ?? false,
		},
	};
</script>
