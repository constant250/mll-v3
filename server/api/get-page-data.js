export default defineEventHandler(async (event) => {
	const { name, slug } = await readBody(event);
	const config = useRuntimeConfig();

	let collection = "pages";
	let filter = {};
	let fields = "*";
	let valid = false;
	let sort = "";
	let type = "list";

	const buttons = [
		'text',
		'url',
		'is_external',
	]

	const banners = [
		'title',
		'subtitle',
		'status',
		'image.id',
		'image.title',
		'image_mobile.id',
		'image_mobile.title',
		...buttons.map(button => `button_1.${button}`),
		...buttons.map(button => `button_2.${button}`),
	]

	switch (name) {
		case "landing_home":
			valid = true;
			collection = "landing_home";
			fields = [
				...banners.map(banner => `banners.banners_id.${banner}`),
				'enable_section',
				'description',
				...buttons.map(button => `button_1.${button}`),
				...buttons.map(button => `button_2.${button}`),
				'form_enable_section',
				'form_title',
				'agree_description',
				'info_description',
				'seo_fields.*',
			];
			break;

		case "form_submitted":
			valid = true;
			collection = "pages";
			fields =[
				'c_text',
				'title',
				'slug',
				'seo_fields.*',
			];
			filter = {
				id : {
					_eq: 4
				}
			}
			type = "detail";
			break;
		case "privacy_policy":
			valid = true;
			collection = "pages";
			fields =[
				'title',
				'slug',
				'c_description',
				'seo_fields.*',
			];
			filter = {
				id : {
					_eq: 5
				}
			}
			type = "detail";
			break;
		case "terms_of_use":
			valid = true;
			collection = "pages";
			fields =[
				'title',
				'slug',
				'c_description',
				'seo_fields.*',
			];
			filter = {
				id : {
					_eq: 6
				}
			}
			type = "detail";
			break;
		// case "home":
		// 	valid = true;
		// 	collection = "home";
		// 	fields ="";
		// 	break;

		case "settings":
			valid = true;
			collection = "settings";
			fields = [
				'*',
				...buttons.map(button => `footer_button.${button}`),
			];
			break;
	}

	const headers = {
		"Content-Type": "application/json",
		Authorization: `Bearer ${process.env.DIRECTUS_API_KEY}`,
		Accept: "application/json",
		"Access-Control-Allow-Origin": "*",
	};

	console.log(
		process.env.CMS_URL +
			"items/" +
			collection +
			"?filter=" +
			JSON.stringify(filter) +
			"&fields=" +
			fields +
			sort
	);

	if (valid) {
		try {
			const response = await fetch(
				process.env.CMS_URL +
					"items/" +
					collection +
					"?filter=" +
					JSON.stringify(filter) +
					"&fields=" +
					fields +
					sort,
				{
					method: "GET",
					headers: headers,
				}
			);

			const data = await response.json();
			
			// if data?.data is array and type is detail, return the first item
			if(Array.isArray(data?.data) && type === "detail") {
				return data?.data[0] ?? data ?? null;
			}

			return data?.data ?? data ?? null;
		} catch (error) {
			console.error("Error fetching data:", error);
			throw createError({ statusCode: 500, message: "Failed to fetch data" });
		}
	} else {
		console.error("Error fetching data:");
		throw createError({ statusCode: 500, message: "Failed to fetch data" });
	}
});
