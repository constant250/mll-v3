export default defineEventHandler(async (event) => {
	const config = useRuntimeConfig();

	const headers = {
		"Content-Type": "application/json",
		Authorization: `Bearer ${process.env.DIRECTUS_API_KEY}`,
		Accept: "application/json",
		"Access-Control-Allow-Origin": "*",
	};

	const body = await readBody(event);
	const { payload, collection } = body;

	//// console.log(collection)

	try {
		const response = await fetch(process.env.CMS_URL + "/items/" + collection, {
			method: "POST",
			headers: headers,
			body: JSON.stringify(payload),
		});

		//  // console.log(response.json())

		return response;
	} catch (error) {
		console.error(error);
		throw createError({
			statusCode: 500,
			message: "Error interacting with Directus API",
		});
	}
});
