    
export default defineNuxtRouteMiddleware(async (to, from) => {
  /*

    if (process.env.DIRECTUS_API_KEY!==undefined) {
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.DIRECTUS_API_KEY}`,
            Accept: 'application/json',
            'Access-Control-Allow-Origin': '*',
        };

        

    
        const response = await fetch(
            process.env.CMS_URL + 'items/redirection?fields=*&filter=' + JSON.stringify({status:'published'}),
            {
                method: 'GET',
                headers: headers,
            }
        );

        
        const result = await response.json();
        
        // console.log(result.data)
        // console.log(to.path)
        
        const index = result.data.findIndex((item) => {
            return item.old_url === to.path 
        })
       

        if (index!==-1) {
            return navigateTo(result.data[index].new_url, {
                redirectCode: 301
            });
        } 
        
        if (to.path === "/" || !to.path.endsWith("/")) return;

        const nextPath = to.path.replace(/\/+$/, "") || "/";
    
        return navigateTo(nextPath)
    }
          */
  });


  
  