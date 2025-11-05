import { useRoute, useRequestURL } from '#imports'

interface SeoModel {
  browser_title: string;
  meta_description: string;
  canonical_url: string;
  og_image: string;
  twitter_card: string;
}

interface SettingValue {
  title: string;
  value: string | null;
}

interface Settings {
  [key: string]: SettingValue;
}

// Change `export default` to `export const useSeo`
export const useSeo = async (model: SeoModel | undefined, modelTitle?: string, defaultBanner?: string, extraObject = {}, siteSettings: Settings | null = null) => {
  const route = useRoute()
  const routePath = route.path

  const seo = model || {}

  // Use provided settings or fetch them
  const settings: Settings = siteSettings || await getSettings()

  // Access values using the new structure
  const seoPrefix = settings?.seo_title_prefix ? settings?.seo_title_prefix + ' | ' : ''
  const seoSuffix = settings?.seo_title_suffix ? ' | ' + settings?.seo_title_suffix : ''
  const siteName = settings?.site_name ?? ''

  const { browser_title, canonical_url, og_image, twitter_card } = seo || {}
  const fullUrl = (useRequestURL().origin + routePath).replace(/\/$/, '')

  const bannerImage = defaultBanner ? imageUrl(defaultBanner) : undefined

  const ogImageID = og_image
  const twitterCardID = twitter_card
  const canonicalUrl = canonical_url ?? fullUrl
  const metaDescription = seo?.meta_description ?? ''

  const title = modelTitle?.replace(/<\/?[^>]+(>|$)/g, '')

  const defaultTitle = routePath === '/' ? 'Home' : modelTitle
  const baseTitle = browser_title ?? defaultTitle
  const fullTitle = baseTitle ? `${seoPrefix}${baseTitle}${seoSuffix}` : ''

  return {
    title: fullTitle,
    meta: [
      metaDescription && { hid: 'description', name: 'description', content: metaDescription },
      { hid: 'og:site_name', property: 'og:site_name', content: siteName },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      { hid: 'og:title', property: 'og:title', content: browser_title ?? title ?? defaultTitle },
      canonicalUrl && { hid: 'og:url', property: 'og:url', content: canonicalUrl },
      metaDescription && { hid: 'og:description', property: 'og:description', content: metaDescription },
      (ogImageID || bannerImage) && { hid: 'og:image', property: 'og:image', content: ogImageID ? imageUrl(ogImageID) : bannerImage },
      { hid: 'twitter:title', name: 'twitter:title', content: browser_title ?? title ?? defaultTitle },
      canonicalUrl && { hid: 'twitter:url', name: 'twitter:url', content: canonicalUrl },
      metaDescription && { hid: 'twitter:description', name: 'twitter:description', content: metaDescription },
      (twitterCardID || bannerImage) && { hid: 'twitter:image', name: 'twitter:image', content: twitterCardID ? imageUrl(twitterCardID) : bannerImage },
    ].filter(Boolean),
    link: [
      canonicalUrl && {
        rel: 'canonical',
        href: canonicalUrl,
      },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ].filter(Boolean),
    ...extraObject,
  }
}
