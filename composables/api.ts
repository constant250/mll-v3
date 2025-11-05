export const imageUrl = (file:string = '', fit:string = 'cover', format:string = 'webp', quality:number = 100) => {

 	// Return empty string if no file is provided
	if (!file) {
		return '';
	}

 	const config = useRuntimeConfig();
	const fileUrl = config.public.FILE_URL;

	return fileUrl + file + `?fit=${fit}&format=${format}&quality=${quality}`
}

// export async function getHomePage() {

//   const { data, error } = await useFetch('/api/get-page-data', {
//     method: 'POST',
//     body: {
//       name: 'home',
//     },
//   });

//   return data.value.data

// }

// export const getPageData = async (pageName: string, slug: string = '') => {

//   const { data, error } = await useFetch('/api/get-page-data', {
//       method: 'POST',
//       body: {
//           name: pageName,
//           slug: slug
//       },
//   })


//   if (data.value.data.length === 1) { return data.value.data[0] } else { return data.value.data }
// }


export const getSettings = async () => {

  const { data, error } = await useFetch('/api/get-page-data', {
      method: 'POST',
      body: {
          name: 'settings',
          slug: ''
      },
  })

  if (data.value.length === 1) { return data.value[0] } else { return data.value }
}

// export const sendEnquiryForm = async(dataObject:any) => {

//   const { data, error } = await useFetch('/api/api-post', {
//       method: 'POST',
//       body: {
//           collection: 'entries',
//           payload: dataObject
//       },
//   })

//   return data.value

// }
