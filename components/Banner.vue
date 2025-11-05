<template>
	<div class="banner">
		<Swiper
			:modules="[SwiperNavigation, SwiperPagination]"
			:slides-per-view="1"
			:space-between="0"
			:loop="true"
			:navigation="{
				nextEl: '.banner-button-next',
				prevEl: '.banner-button-prev',
			}"
			:pagination="{
				el: '.banner-pagination',
				clickable: true,
			}"
			@swiper="onSwiper"
			@slideChange="onSlideChange"
		>
			<SwiperSlide v-for="(slide, index) in slides" :key="index">
				<div
					class="banner-slide"
					:style="{ backgroundImage: `url(${slide.image})` }"
				>
					<div class="banner-content banner-content-overlay">
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
											:target="slide.primaryButton.is_external ? '_blank' : '_self'"
										>
											{{ slide.primaryButton.text }}
										</NuxtLink>
										<NuxtLink
											v-if="slide.secondaryButton"
											:to="slide.secondaryButton.url"
											class="button white"
											:target="slide.secondaryButton.is_external ? '_blank' : '_self'"
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

			<div class="banner-button-prev">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
				>
					<path
						d="M19.9998 11L7.74984 11L12.9998 5.75L12.3398 5L5.83984 11.5L12.3398 18L12.9998 17.25L7.74984 12L19.9998 12L19.9998 11Z"
						fill="white"
					/>
				</svg>
			</div>
			<div class="banner-button-next">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					fill="none"
				>
					<path
						d="M4.00016 11L16.2502 11L11.0002 5.75L11.6602 5L18.1602 11.5L11.6602 18L11.0002 17.25L16.2502 12L4.00016 12L4.00016 11Z"
						fill="white"
					/>
				</svg>
			</div>
			<div class="banner-pagination"></div>
		</Swiper>

		<div class="banner-content banner-content-mobile">
			<div class="container">
				<div class="row">
					<div class="col-12">
						<h1 class="banner-title">{{ currentSlide.title }}</h1>
						<p class="banner-description">{{ currentSlide.description }}</p>
						<div class="banner-buttons">
							<NuxtLink
								v-if="currentSlide.primaryButton"
								:to="currentSlide.primaryButton.url"
								class="button black"
							>
								{{ currentSlide.primaryButton.text }}
							</NuxtLink>
							<NuxtLink
								v-if="currentSlide.secondaryButton"
								:to="currentSlide.secondaryButton.url"
								class="button white"
							>
								{{ currentSlide.secondaryButton.text }}
							</NuxtLink>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
	const props = defineProps({
		slides: {
			type: Array,
			required: true,
		},
	});

	const currentSlideIndex = ref(0);
	const swiperInstance = ref(null);

	const currentSlide = computed(() => {
		return props.slides[currentSlideIndex.value] || props.slides[0];
	});

	const onSwiper = (swiper) => {
		swiperInstance.value = swiper;
	};

	const onSlideChange = (swiper) => {
		currentSlideIndex.value = swiper.realIndex;
	};
</script>
