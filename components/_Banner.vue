<template>
	<div class="banner">
		<Swiper
			:modules="[SwiperNavigation, SwiperPagination, SwiperAutoplay]"
			:slides-per-view="1"
			:space-between="0"
			:loop="true"
			:autoplay="{
				delay: 5000,
				disableOnInteraction: false,
			}"
			:navigation="{
				nextEl: '.banner-button-next',
				prevEl: '.banner-button-prev',
			}"
			:pagination="{
				el: '.banner-pagination',
				clickable: true,
			}"
		>
			<SwiperSlide v-for="(slide, index) in slides" :key="index">
				<div
					class="banner-slide"
					:style="{ backgroundImage: `url(${slide.image})` }"
				>
					<div class="banner-content">
						<div class="container">
							<div class="row">
								<div class="col-12">
									<h1 class="banner-title">{{ slide.title }}</h1>
									<p class="banner-description">{{ slide.description }}</p>
									<div class="banner-buttons">
										<NuxtLink
											v-if="slide.primaryButton"
											:to="slide.primaryButton.url"
											class="button black"
										>
											{{ slide.primaryButton.text }}
										</NuxtLink>
										<NuxtLink
											v-if="slide.secondaryButton"
											:to="slide.secondaryButton.url"
											class="button white"
										>
											{{ slide.secondaryButton.text }}
										</NuxtLink>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</SwiperSlide>
		</Swiper>

		<div class="banner-button-prev">
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M15 18L9 12L15 6"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</div>
		<div class="banner-button-next">
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					d="M9 18L15 12L9 6"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			</svg>
		</div>
		<div class="banner-pagination"></div>
	</div>
</template>

<script setup>
	defineProps({
		slides: {
			type: Array,
			required: true,
		},
	});
</script>
