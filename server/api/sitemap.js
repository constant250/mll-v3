import dayjs from "dayjs";

export default defineSitemapEventHandler(async (event) => {
	/*
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.DIRECTUS_API_KEY}`,
    'Accept': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }
     // Homepage
    const homepageRes = await fetch(
      `${process.env.CMS_URL}/items/homepage?fields=id,date_updated`,
      {
        method: 'GET',
        headers: headers
      }
    );

    const homepageData = await homepageRes.json();

    // Pages
    const pagesRes = await fetch(
      `${process.env.CMS_URL}/items/pages?fields=id,slug,title&filter={"_and":[{"status":{"_eq":"published"}}]}&limit=-1&sort=title`,
      {
        method: 'GET',
        headers: headers
      }
    );

    const pagesData = await pagesRes.json();

    let res = [
      {
        loc: '/',
        changefreq: 'daily',
        priority: 1,
        lastmod: dayjs(homepageData.date_updated).format('YYYY-MM-DD'),
      }
    ]
    pagesData.data.forEach((page) => {

      res.push({
        loc: `/${page.slug}`,
        changefreq: 'daily',
        priority: 0.8,
        lastmod: dayjs(page.date_updated).format('YYYY-MM-DD'),
      })

    });

  return [
    ...res
  ]*/
});
