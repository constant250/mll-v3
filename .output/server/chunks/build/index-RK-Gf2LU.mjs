import { defineComponent, ref, computed, h, useSSRContext, watchEffect, watch, getCurrentInstance, unref, mergeProps, onUnmounted } from 'vue';
import { composableNames } from '@unhead/shared';
import { _ as _export_sfc, i as injectHead, r as resolveUnrefHeadInput, b as useNuxtApp, a as useRuntimeConfig } from './server.mjs';
import { J as encodeParam, p as hasProtocol, K as withLeadingSlash, v as joinURL, q as parseURL, m as defu, L as encodePath } from '../runtime.mjs';
import { ssrRenderClass, ssrRenderComponent, ssrRenderAttr, ssrRenderAttrs, ssrInterpolate, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderStyle } from 'vue/server-renderer';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'devalue';
import '@unhead/ssr';
import 'unhead';
import 'vue-router';
import 'dayjs';
import 'dayjs/plugin/updateLocale.js';
import 'dayjs/plugin/relativeTime.js';
import 'dayjs/plugin/utc.js';
import 'node:http';
import 'node:https';
import 'node:zlib';
import 'node:stream';
import 'node:buffer';
import 'node:util';
import 'node:url';
import 'node:net';
import 'node:fs';
import 'node:path';
import 'fs';
import 'path';
import 'consola/core';
import 'ipx';

function useHead(input, options = {}) {
  const head = options.head || injectHead();
  if (head) {
    if (!head.ssr)
      return clientUseHead(head, input, options);
    return head.push(input, options);
  }
}
function clientUseHead(head, input, options = {}) {
  const deactivated = ref(false);
  const resolvedInput = ref({});
  watchEffect(() => {
    resolvedInput.value = deactivated.value ? {} : resolveUnrefHeadInput(input);
  });
  const entry = head.push(resolvedInput.value, options);
  watch(resolvedInput, (e) => {
    entry.patch(e);
  });
  getCurrentInstance();
  return entry;
}
const coreComposableNames = [
  "injectHead"
];
({
  "@unhead/vue": [...coreComposableNames, ...composableNames]
});
async function imageMeta(_ctx, url) {
  const meta = await _imageMeta(url).catch((err) => {
    console.error("Failed to get image meta for " + url, err + "");
    return {
      width: 0,
      height: 0,
      ratio: 0
    };
  });
  return meta;
}
async function _imageMeta(url) {
  {
    const imageMeta2 = await import('image-meta').then((r) => r.imageMeta);
    const data = await fetch(url).then((res) => res.buffer());
    const metadata = imageMeta2(data);
    if (!metadata) {
      throw new Error(`No metadata could be extracted from the image \`${url}\`.`);
    }
    const { width, height } = metadata;
    const meta = {
      width,
      height,
      ratio: width && height ? width / height : void 0
    };
    return meta;
  }
}
function createMapper(map) {
  return (key) => {
    return key ? map[key] || key : map.missingValue;
  };
}
function createOperationsGenerator({ formatter, keyMap, joinWith = "/", valueMap } = {}) {
  if (!formatter) {
    formatter = (key, value) => `${key}=${value}`;
  }
  if (keyMap && typeof keyMap !== "function") {
    keyMap = createMapper(keyMap);
  }
  const map = valueMap || {};
  Object.keys(map).forEach((valueKey) => {
    if (typeof map[valueKey] !== "function") {
      map[valueKey] = createMapper(map[valueKey]);
    }
  });
  return (modifiers = {}) => {
    const operations = Object.entries(modifiers).filter(([_, value]) => typeof value !== "undefined").map(([key, value]) => {
      const mapper = map[key];
      if (typeof mapper === "function") {
        value = mapper(modifiers[key]);
      }
      key = typeof keyMap === "function" ? keyMap(key) : key;
      return formatter(key, value);
    });
    return operations.join(joinWith);
  };
}
function parseSize(input = "") {
  if (typeof input === "number") {
    return input;
  }
  if (typeof input === "string") {
    if (input.replace("px", "").match(/^\d+$/g)) {
      return Number.parseInt(input, 10);
    }
  }
}
function parseDensities(input = "") {
  if (input === void 0 || !input.length) {
    return [];
  }
  const densities = /* @__PURE__ */ new Set();
  for (const density of input.split(" ")) {
    const d = Number.parseInt(density.replace("x", ""));
    if (d) {
      densities.add(d);
    }
  }
  return Array.from(densities);
}
function checkDensities(densities) {
  if (densities.length === 0) {
    throw new Error("`densities` must not be empty, configure to `1` to render regular size only (DPR 1.0)");
  }
}
function parseSizes(input) {
  const sizes = {};
  if (typeof input === "string") {
    for (const entry of input.split(/[\s,]+/).filter((e) => e)) {
      const s = entry.split(":");
      if (s.length !== 2) {
        sizes["1px"] = s[0].trim();
      } else {
        sizes[s[0].trim()] = s[1].trim();
      }
    }
  } else {
    Object.assign(sizes, input);
  }
  return sizes;
}
function createImage(globalOptions) {
  const ctx = {
    options: globalOptions
  };
  const getImage2 = (input, options = {}) => {
    const image = resolveImage(ctx, input, options);
    return image;
  };
  const $img = (input, modifiers = {}, options = {}) => {
    return getImage2(input, {
      ...options,
      modifiers: defu(modifiers, options.modifiers || {})
    }).url;
  };
  for (const presetName in globalOptions.presets) {
    $img[presetName] = (source, modifiers, options) => $img(source, modifiers, { ...globalOptions.presets[presetName], ...options });
  }
  $img.options = globalOptions;
  $img.getImage = getImage2;
  $img.getMeta = (input, options) => getMeta(ctx, input, options);
  $img.getSizes = (input, options) => getSizes(ctx, input, options);
  ctx.$img = $img;
  return $img;
}
async function getMeta(ctx, input, options) {
  const image = resolveImage(ctx, input, { ...options });
  if (typeof image.getMeta === "function") {
    return await image.getMeta();
  } else {
    return await imageMeta(ctx, image.url);
  }
}
function resolveImage(ctx, input, options) {
  var _a, _b;
  if (input && typeof input !== "string") {
    throw new TypeError(`input must be a string (received ${typeof input}: ${JSON.stringify(input)})`);
  }
  if (!input || input.startsWith("data:")) {
    return {
      url: input
    };
  }
  const { provider, defaults } = getProvider(ctx, options.provider || ctx.options.provider);
  const preset = getPreset(ctx, options.preset);
  input = hasProtocol(input) ? input : withLeadingSlash(input);
  if (!provider.supportsAlias) {
    for (const base in ctx.options.alias) {
      if (input.startsWith(base)) {
        input = joinURL(ctx.options.alias[base], input.substr(base.length));
      }
    }
  }
  if (provider.validateDomains && hasProtocol(input)) {
    const inputHost = parseURL(input).host;
    if (!ctx.options.domains.find((d) => d === inputHost)) {
      return {
        url: input
      };
    }
  }
  const _options = defu(options, preset, defaults);
  _options.modifiers = { ..._options.modifiers };
  const expectedFormat = _options.modifiers.format;
  if ((_a = _options.modifiers) == null ? void 0 : _a.width) {
    _options.modifiers.width = parseSize(_options.modifiers.width);
  }
  if ((_b = _options.modifiers) == null ? void 0 : _b.height) {
    _options.modifiers.height = parseSize(_options.modifiers.height);
  }
  const image = provider.getImage(input, _options, ctx);
  image.format = image.format || expectedFormat || "";
  return image;
}
function getProvider(ctx, name) {
  const provider = ctx.options.providers[name];
  if (!provider) {
    throw new Error("Unknown provider: " + name);
  }
  return provider;
}
function getPreset(ctx, name) {
  if (!name) {
    return {};
  }
  if (!ctx.options.presets[name]) {
    throw new Error("Unknown preset: " + name);
  }
  return ctx.options.presets[name];
}
function getSizes(ctx, input, opts) {
  var _a, _b, _c, _d, _e;
  const width = parseSize((_a = opts.modifiers) == null ? void 0 : _a.width);
  const height = parseSize((_b = opts.modifiers) == null ? void 0 : _b.height);
  const sizes = parseSizes(opts.sizes);
  const densities = ((_c = opts.densities) == null ? void 0 : _c.trim()) ? parseDensities(opts.densities.trim()) : ctx.options.densities;
  checkDensities(densities);
  const hwRatio = width && height ? height / width : 0;
  const sizeVariants = [];
  const srcsetVariants = [];
  if (Object.keys(sizes).length >= 1) {
    for (const key in sizes) {
      const variant = getSizesVariant(key, String(sizes[key]), height, hwRatio, ctx);
      if (variant === void 0) {
        continue;
      }
      sizeVariants.push({
        size: variant.size,
        screenMaxWidth: variant.screenMaxWidth,
        media: `(max-width: ${variant.screenMaxWidth}px)`
      });
      for (const density of densities) {
        srcsetVariants.push({
          width: variant._cWidth * density,
          src: getVariantSrc(ctx, input, opts, variant, density)
        });
      }
    }
    finaliseSizeVariants(sizeVariants);
  } else {
    for (const density of densities) {
      const key = Object.keys(sizes)[0];
      let variant = getSizesVariant(key, String(sizes[key]), height, hwRatio, ctx);
      if (variant === void 0) {
        variant = {
          size: "",
          screenMaxWidth: 0,
          _cWidth: (_d = opts.modifiers) == null ? void 0 : _d.width,
          _cHeight: (_e = opts.modifiers) == null ? void 0 : _e.height
        };
      }
      srcsetVariants.push({
        width: density,
        src: getVariantSrc(ctx, input, opts, variant, density)
      });
    }
  }
  finaliseSrcsetVariants(srcsetVariants);
  const defaultVariant = srcsetVariants[srcsetVariants.length - 1];
  const sizesVal = sizeVariants.length ? sizeVariants.map((v) => `${v.media ? v.media + " " : ""}${v.size}`).join(", ") : void 0;
  const suffix = sizesVal ? "w" : "x";
  const srcsetVal = srcsetVariants.map((v) => `${v.src} ${v.width}${suffix}`).join(", ");
  return {
    sizes: sizesVal,
    srcset: srcsetVal,
    src: defaultVariant == null ? void 0 : defaultVariant.src
  };
}
function getSizesVariant(key, size, height, hwRatio, ctx) {
  const screenMaxWidth = ctx.options.screens && ctx.options.screens[key] || Number.parseInt(key);
  const isFluid = size.endsWith("vw");
  if (!isFluid && /^\d+$/.test(size)) {
    size = size + "px";
  }
  if (!isFluid && !size.endsWith("px")) {
    return void 0;
  }
  let _cWidth = Number.parseInt(size);
  if (!screenMaxWidth || !_cWidth) {
    return void 0;
  }
  if (isFluid) {
    _cWidth = Math.round(_cWidth / 100 * screenMaxWidth);
  }
  const _cHeight = hwRatio ? Math.round(_cWidth * hwRatio) : height;
  return {
    size,
    screenMaxWidth,
    _cWidth,
    _cHeight
  };
}
function getVariantSrc(ctx, input, opts, variant, density) {
  return ctx.$img(
    input,
    {
      ...opts.modifiers,
      width: variant._cWidth ? variant._cWidth * density : void 0,
      height: variant._cHeight ? variant._cHeight * density : void 0
    },
    opts
  );
}
function finaliseSizeVariants(sizeVariants) {
  var _a;
  sizeVariants.sort((v1, v2) => v1.screenMaxWidth - v2.screenMaxWidth);
  let previousMedia = null;
  for (let i = sizeVariants.length - 1; i >= 0; i--) {
    const sizeVariant = sizeVariants[i];
    if (sizeVariant.media === previousMedia) {
      sizeVariants.splice(i, 1);
    }
    previousMedia = sizeVariant.media;
  }
  for (let i = 0; i < sizeVariants.length; i++) {
    sizeVariants[i].media = ((_a = sizeVariants[i + 1]) == null ? void 0 : _a.media) || "";
  }
}
function finaliseSrcsetVariants(srcsetVariants) {
  srcsetVariants.sort((v1, v2) => v1.width - v2.width);
  let previousWidth = null;
  for (let i = srcsetVariants.length - 1; i >= 0; i--) {
    const sizeVariant = srcsetVariants[i];
    if (sizeVariant.width === previousWidth) {
      srcsetVariants.splice(i, 1);
    }
    previousWidth = sizeVariant.width;
  }
}
const operationsGenerator = createOperationsGenerator({
  keyMap: {
    format: "f",
    fit: "fit",
    width: "w",
    height: "h",
    resize: "s",
    quality: "q",
    background: "b"
  },
  joinWith: "&",
  formatter: (key, val) => encodeParam(key) + "_" + encodeParam(val)
});
const getImage = (src, { modifiers = {}, baseURL } = {}, ctx) => {
  if (modifiers.width && modifiers.height) {
    modifiers.resize = `${modifiers.width}x${modifiers.height}`;
    delete modifiers.width;
    delete modifiers.height;
  }
  const params = operationsGenerator(modifiers) || "_";
  if (!baseURL) {
    baseURL = joinURL(ctx.options.nuxt.baseURL, "/_ipx");
  }
  return {
    url: joinURL(baseURL, params, encodePath(src))
  };
};
const validateDomains = true;
const supportsAlias = true;
const ipxRuntime$TMlisXYuwj = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  getImage,
  supportsAlias,
  validateDomains
});
const imageOptions = {
  "screens": {
    "xs": 320,
    "sm": 640,
    "md": 768,
    "lg": 1024,
    "xl": 1280,
    "xxl": 1536,
    "2xl": 1536
  },
  "presets": {},
  "provider": "ipx",
  "domains": [],
  "alias": {},
  "densities": [
    1,
    2
  ],
  "format": [
    "webp"
  ]
};
imageOptions.providers = {
  ["ipx"]: { provider: ipxRuntime$TMlisXYuwj, defaults: {} }
};
const useImage = () => {
  const config = useRuntimeConfig();
  const nuxtApp = useNuxtApp();
  return nuxtApp.$img || nuxtApp._img || (nuxtApp._img = createImage({
    ...imageOptions,
    nuxt: {
      baseURL: config.app.baseURL
    }
  }));
};
const baseImageProps = {
  // input source
  src: { type: String, default: void 0 },
  // modifiers
  format: { type: String, default: void 0 },
  quality: { type: [Number, String], default: void 0 },
  background: { type: String, default: void 0 },
  fit: { type: String, default: void 0 },
  modifiers: { type: Object, default: void 0 },
  // options
  preset: { type: String, default: void 0 },
  provider: { type: String, default: void 0 },
  sizes: { type: [Object, String], default: void 0 },
  densities: { type: String, default: void 0 },
  preload: { type: Boolean, default: void 0 },
  // <img> attributes
  width: { type: [String, Number], default: void 0 },
  height: { type: [String, Number], default: void 0 },
  alt: { type: String, default: void 0 },
  referrerpolicy: { type: String, default: void 0 },
  usemap: { type: String, default: void 0 },
  longdesc: { type: String, default: void 0 },
  ismap: { type: Boolean, default: void 0 },
  loading: {
    type: String,
    default: void 0,
    validator: (val) => ["lazy", "eager"].includes(val)
  },
  crossorigin: {
    type: [Boolean, String],
    default: void 0,
    validator: (val) => ["anonymous", "use-credentials", "", true, false].includes(val)
  },
  decoding: {
    type: String,
    default: void 0,
    validator: (val) => ["async", "auto", "sync"].includes(val)
  },
  // csp
  nonce: { type: [String], default: void 0 }
};
const useBaseImage = (props) => {
  const options = computed(() => {
    return {
      provider: props.provider,
      preset: props.preset
    };
  });
  const attrs = computed(() => {
    return {
      width: parseSize(props.width),
      height: parseSize(props.height),
      alt: props.alt,
      referrerpolicy: props.referrerpolicy,
      usemap: props.usemap,
      longdesc: props.longdesc,
      ismap: props.ismap,
      crossorigin: props.crossorigin === true ? "anonymous" : props.crossorigin || void 0,
      loading: props.loading,
      decoding: props.decoding,
      nonce: props.nonce
    };
  });
  const $img = useImage();
  const modifiers = computed(() => {
    return {
      ...props.modifiers,
      width: parseSize(props.width),
      height: parseSize(props.height),
      format: props.format,
      quality: props.quality || $img.options.quality,
      background: props.background,
      fit: props.fit
    };
  });
  return {
    options,
    attrs,
    modifiers
  };
};
const imgProps = {
  ...baseImageProps,
  placeholder: { type: [Boolean, String, Number, Array], default: void 0 },
  placeholderClass: { type: String, default: void 0 }
};
const __nuxt_component_0 = defineComponent({
  name: "NuxtImg",
  props: imgProps,
  emits: ["load", "error"],
  setup: (props, ctx) => {
    const $img = useImage();
    const _base = useBaseImage(props);
    const placeholderLoaded = ref(false);
    const imgEl = ref();
    const sizes = computed(() => $img.getSizes(props.src, {
      ..._base.options.value,
      sizes: props.sizes,
      densities: props.densities,
      modifiers: {
        ..._base.modifiers.value,
        width: parseSize(props.width),
        height: parseSize(props.height)
      }
    }));
    const attrs = computed(() => {
      const attrs2 = { ..._base.attrs.value, "data-nuxt-img": "" };
      if (!props.placeholder || placeholderLoaded.value) {
        attrs2.sizes = sizes.value.sizes;
        attrs2.srcset = sizes.value.srcset;
      }
      return attrs2;
    });
    const placeholder = computed(() => {
      let placeholder2 = props.placeholder;
      if (placeholder2 === "") {
        placeholder2 = true;
      }
      if (!placeholder2 || placeholderLoaded.value) {
        return false;
      }
      if (typeof placeholder2 === "string") {
        return placeholder2;
      }
      const size = Array.isArray(placeholder2) ? placeholder2 : typeof placeholder2 === "number" ? [placeholder2, placeholder2] : [10, 10];
      return $img(props.src, {
        ..._base.modifiers.value,
        width: size[0],
        height: size[1],
        quality: size[2] || 50,
        blur: size[3] || 3
      }, _base.options.value);
    });
    const mainSrc = computed(
      () => props.sizes ? sizes.value.src : $img(props.src, _base.modifiers.value, _base.options.value)
    );
    const src = computed(() => placeholder.value ? placeholder.value : mainSrc.value);
    if (props.preload) {
      const isResponsive = Object.values(sizes.value).every((v) => v);
      useHead({
        link: [{
          rel: "preload",
          as: "image",
          nonce: props.nonce,
          ...!isResponsive ? { href: src.value } : {
            href: sizes.value.src,
            imagesizes: sizes.value.sizes,
            imagesrcset: sizes.value.srcset
          }
        }]
      });
    }
    const nuxtApp = useNuxtApp();
    nuxtApp.isHydrating;
    return () => h("img", {
      ref: imgEl,
      src: src.value,
      ...{ onerror: "this.setAttribute('data-error', 1)" },
      ...attrs.value,
      ...ctx.attrs,
      class: props.placeholder && !placeholderLoaded.value ? [props.placeholderClass] : void 0
    });
  }
});
function useAnimateOnScroll() {
  const isVisible = ref(false);
  const elementRef = ref(null);
  onUnmounted(() => {
  });
  return {
    isVisible,
    elementRef
  };
}
const _sfc_main$9 = /* @__PURE__ */ defineComponent({
  __name: "AppHeader",
  __ssrInlineRender: true,
  setup(__props) {
    const { isVisible, elementRef } = useAnimateOnScroll();
    const activeSection = ref("");
    const isScrolled = ref(false);
    const isMenuOpen = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = __nuxt_component_0;
      _push(`<!--[--><header class="${ssrRenderClass(["header", { "scrolled": unref(isScrolled) }, "animate-on-scroll", "fade-in", { "visible": unref(isVisible) }])}"><nav class="header-nav"><div class="header-logo"><a href="#top">`);
      _push(ssrRenderComponent(_component_NuxtImg, {
        src: "/images/MLL - LOGO - WEB.png",
        alt: "MLL Melbourne Legal Lawyers",
        class: "logo-img"
      }, null, _parent));
      _push(`</a></div><button class="${ssrRenderClass(["hamburger-button", { "is-open": unref(isMenuOpen) }])}" type="button"${ssrRenderAttr("aria-expanded", unref(isMenuOpen))} aria-controls="primary-navigation" aria-label="Toggle navigation menu"><span class="hamburger-line"></span><span class="hamburger-line"></span><span class="hamburger-line"></span></button><div class="${ssrRenderClass(["header-right", { "is-open": unref(isMenuOpen) }])}"><div id="primary-navigation" class="header-links"><a href="#about" class="${ssrRenderClass(["nav-link", { active: unref(activeSection) === "about" }])}">ABOUT US</a><a href="#services" class="${ssrRenderClass(["nav-link", { active: unref(activeSection) === "services" }])}">OUR SERVICES</a><a href="#client-promise" class="${ssrRenderClass(["nav-link", { active: unref(activeSection) === "client-promise" }])}">CLIENT PROMISE</a></div><a href="tel:+61312345678" class="call-button"><span class="call-text">CALL US</span><div class="call-icon-wrapper">`);
      _push(ssrRenderComponent(_component_NuxtImg, {
        src: "/images/CALL ICON.png",
        alt: "Call",
        class: "call-icon"
      }, null, _parent));
      _push(`</div><span class="call-number">+61 3 1234 5678</span></a></div></nav></header>`);
      if (unref(isMenuOpen)) {
        _push(`<div class="mobile-nav-backdrop" role="presentation"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AppHeader.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "HeroSection",
  __ssrInlineRender: true,
  setup(__props) {
    const { isVisible, elementRef } = useAnimateOnScroll();
    const { isVisible: isImageVisible, elementRef: imageRef } = useAnimateOnScroll();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "hero-section" }, _attrs))}><div class="${ssrRenderClass(["hero-background", "animate-on-scroll", "fade-in", { "visible": unref(isImageVisible) }])}">`);
      _push(ssrRenderComponent(_component_NuxtImg, {
        src: "/images/HEADER-IMAGE.jpg",
        alt: "Professional lawyer",
        class: "hero-image"
      }, null, _parent));
      _push(`</div><div class="${ssrRenderClass(["hero-content", "animate-on-scroll", "fade-in-up", { "visible": unref(isVisible) }])}"><h1 class="hero-title"> LEGAL SOLUTIONS THAT <br>PUT <span class="highlight">PEOPLE FIRST.</span></h1><a href="#contact" class="cta-button">BOOK A CONSULTATION TODAY!</a></div></section>`);
    };
  }
});
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/HeroSection.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "FeatureHighlights",
  __ssrInlineRender: true,
  setup(__props) {
    const { isVisible, elementRef } = useAnimateOnScroll();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({
        ref_key: "elementRef",
        ref: elementRef,
        class: ["feature-highlights", "animate-stagger", { "visible": unref(isVisible) }]
      }, _attrs))}><div class="feature-box">`);
      _push(ssrRenderComponent(_component_NuxtImg, {
        src: "/images/ICON-1.png",
        alt: "Fast consultation",
        class: "feature-icon"
      }, null, _parent));
      _push(`<p>Fast legal consultation <br>and response times</p></div><div class="feature-box">`);
      _push(ssrRenderComponent(_component_NuxtImg, {
        src: "/images/ICON-2.png",
        alt: "Australian compliance",
        class: "feature-icon"
      }, null, _parent));
      _push(`<p>Compliant with Australian legal requirements</p></div><div class="feature-box">`);
      _push(ssrRenderComponent(_component_NuxtImg, {
        src: "/images/ICON-3.png",
        alt: "Experienced team",
        class: "feature-icon"
      }, null, _parent));
      _push(`<p>Experienced team dedicated to client success</p></div></section>`);
    };
  }
});
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/FeatureHighlights.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "AboutUsSection",
  __ssrInlineRender: true,
  setup(__props) {
    const { isVisible, elementRef } = useAnimateOnScroll();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({
        id: "about",
        class: "about-section"
      }, _attrs))}><div class="${ssrRenderClass(["about-container", "animate-on-scroll", "fade-in-up", { "visible": unref(isVisible) }])}"><div class="about-content">`);
      _push(ssrRenderComponent(_component_NuxtImg, {
        src: "/images/MLL - LOGO - WEB.png",
        alt: "MLL Melbourne Legal Lawyers",
        class: "about-logo"
      }, null, _parent));
      _push(`<p class="about-text"><b>Melbourne Legal Lawyers</b> is a locally based law firm committed to supporting individuals, families, and businesses through every stage of life&#39;s legal journey. Our approach is client-first \u2013 combining legal precision with practical understanding. </p><p class="about-text"> We work closely with our clients to provide timely, clear, and cost-effective legal solutions. </p></div><div class="about-image">`);
      _push(ssrRenderComponent(_component_NuxtImg, {
        src: "/images/ABOUT-US-IMAGE.jpg",
        alt: "Our team",
        class: "team-image"
      }, null, _parent));
      _push(`</div></div></section>`);
    };
  }
});
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AboutUsSection.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "ServiceCard",
  __ssrInlineRender: true,
  props: {
    title: {},
    description: {},
    image: {},
    cta: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "service-card" }, _attrs))}><div class="service-card-background">`);
      _push(ssrRenderComponent(_component_NuxtImg, {
        src: _ctx.image,
        alt: "",
        class: "service-bg-image"
      }, null, _parent));
      _push(`</div><div class="service-card-content"><div class="service-text-group"><h3 class="service-title">${ssrInterpolate(_ctx.title)}</h3><p class="service-description">${ssrInterpolate(_ctx.description)}</p></div><a href="#contact" class="service-cta">${ssrInterpolate(_ctx.cta)}</a></div></div>`);
    };
  }
});
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ServiceCard.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "OurServicesSection",
  __ssrInlineRender: true,
  setup(__props) {
    const { isVisible: isTitleVisible, elementRef: titleRef } = useAnimateOnScroll();
    const { isVisible, elementRef } = useAnimateOnScroll();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ServiceCard = _sfc_main$5;
      _push(`<section${ssrRenderAttrs(mergeProps({
        id: "services",
        class: "services-section"
      }, _attrs))} data-v-7e3887d8><h2 class="${ssrRenderClass(["section-title", "animate-on-scroll", "fade-in-up", { "visible": unref(isTitleVisible) }])}" data-v-7e3887d8>Our Services</h2><div class="${ssrRenderClass(["services-grid", "animate-stagger", { "visible": unref(isVisible) }])}" data-v-7e3887d8>`);
      _push(ssrRenderComponent(_component_ServiceCard, {
        title: "Family Law",
        description: "From parenting plans to property settlements, we handle sensitive family matters with empathy and skill.",
        image: "/images/S-1.jpg",
        cta: "Discuss your matter \u2192"
      }, null, _parent));
      _push(ssrRenderComponent(_component_ServiceCard, {
        title: "Commercial Law",
        description: "Supporting small businesses with contracts, disputes, leases, and structuring.",
        image: "/images/S-2.jpg",
        cta: "Get guidance \u2192"
      }, null, _parent));
      _push(ssrRenderComponent(_component_ServiceCard, {
        title: "Immigration",
        description: "Migration support for individuals, families, and businesses \u2013 we simplify the visa process.",
        image: "/images/S-3.jpg",
        cta: "Talk to an attorney \u2192"
      }, null, _parent));
      _push(ssrRenderComponent(_component_ServiceCard, {
        title: "Wills & Estate",
        description: "Protecting your future through smart estate planning and probate assistance.",
        image: "/images/S-4.jpg",
        cta: "Plan your future \u2192"
      }, null, _parent));
      _push(`</div></section>`);
    };
  }
});
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/OurServicesSection.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_4 = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-7e3887d8"]]);
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "ClientPromiseSection",
  __ssrInlineRender: true,
  setup(__props) {
    const { isVisible, elementRef } = useAnimateOnScroll();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "client-promise-section" }, _attrs))}><div class="${ssrRenderClass(["client-promise-container", "animate-on-scroll", "fade-in-up", { "visible": unref(isVisible) }])}"><div class="client-promise-image">`);
      _push(ssrRenderComponent(_component_NuxtImg, {
        src: "/images/LADY.png",
        alt: "Professional lawyer",
        class: "lady-image"
      }, null, _parent));
      _push(`</div><div class="client-promise-content"><h2 class="client-promise-title">Client Promise</h2><h3 class="client-promise-subtitle">Why Choose Melbourne Legal Lawyers?</h3><p class="client-promise-text"> We understand that legal matters can be complex and stressful. That&#39;s why we&#39;re committed to providing clear, practical advice that puts your needs first. Our local presence in Lara means we understand the community, while our expertise ensures you get the best possible outcome. </p><ul class="client-promise-list"><li>`);
      _push(ssrRenderComponent(_component_NuxtImg, {
        src: "/images/CHECK-ICON.png",
        alt: "Check",
        class: "check-icon"
      }, null, _parent));
      _push(`<span>Clear, upfront advice</span></li><li>`);
      _push(ssrRenderComponent(_component_NuxtImg, {
        src: "/images/CHECK-ICON.png",
        alt: "Check",
        class: "check-icon"
      }, null, _parent));
      _push(`<span>Local service with national knowledge</span></li><li>`);
      _push(ssrRenderComponent(_component_NuxtImg, {
        src: "/images/CHECK-ICON.png",
        alt: "Check",
        class: "check-icon"
      }, null, _parent));
      _push(`<span>Timely communication</span></li><li>`);
      _push(ssrRenderComponent(_component_NuxtImg, {
        src: "/images/CHECK-ICON.png",
        alt: "Check",
        class: "check-icon"
      }, null, _parent));
      _push(`<span>Transparent pricing</span></li></ul><p class="client-promise-cta-text">Need legal advice you can trust? <strong>Let&#39;s talk.</strong></p><div class="client-promise-contact"><div class="client-promise-contact-left"><a href="#contact" class="consultation-button">BOOK A CONSULTATION</a></div><div class="contact-info"><a href="tel:+61312345678" class="contact-item">`);
      _push(ssrRenderComponent(_component_NuxtImg, {
        src: "/images/CALL ICON.png",
        alt: "Phone",
        class: "contact-icon"
      }, null, _parent));
      _push(`<span>+61 3 1234 5678</span></a><a href="mailto:info@melbournelegallawyers.com.au" class="contact-item">`);
      _push(ssrRenderComponent(_component_NuxtImg, {
        src: "/images/MAIL-ICON.png",
        alt: "Email",
        class: "contact-icon"
      }, null, _parent));
      _push(`<span>info@melbournelegallawyers.com.au</span></a></div></div></div></div></section>`);
    };
  }
});
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ClientPromiseSection.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const _sfc_main$2 = {
  __name: "ContactUsSection",
  __ssrInlineRender: true,
  setup(__props) {
    const { isVisible: isTitleVisible, elementRef: titleRef } = useAnimateOnScroll();
    const { isVisible, elementRef } = useAnimateOnScroll();
    const form = ref({
      fullName: "",
      email: "",
      phone: "",
      practiceArea: "",
      description: ""
    });
    const errors = ref({});
    const isSubmitting = ref(false);
    const validateEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };
    const validatePhone = (phone) => {
      const phoneRegex = /^[\d\s\+\-\(\)]+$/;
      return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 8;
    };
    computed(() => {
      return form.value.fullName.trim().length >= 2 && form.value.email.trim().length > 0 && validateEmail(form.value.email) && form.value.phone.trim().length > 0 && validatePhone(form.value.phone) && form.value.practiceArea.trim().length > 0 && form.value.description.trim().length >= 10;
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({
        id: "contact",
        class: "contact-section"
      }, _attrs))} data-v-e6f2ac99><h2 class="${ssrRenderClass(["section-title", "animate-on-scroll", "fade-in-up", { "visible": unref(isTitleVisible) }])}" data-v-e6f2ac99>Contact Us</h2><div class="${ssrRenderClass(["contact-container", "animate-on-scroll", "fade-in-up", { "visible": unref(isVisible) }])}" data-v-e6f2ac99><div class="contact-form-container" data-v-e6f2ac99><p class="contact-intro" data-v-e6f2ac99> Ready to discuss your legal matter? We&#39;re here to help with clear, practical advice. </p><div class="contact-form" data-v-e6f2ac99><div class="form-group" data-v-e6f2ac99><input type="text" id="fullName"${ssrRenderAttr("value", unref(form).fullName)} placeholder="FULL NAME" class="${ssrRenderClass({ "error": unref(errors).fullName })}" data-v-e6f2ac99>`);
      if (unref(errors).fullName) {
        _push(`<span class="error-message" data-v-e6f2ac99>${ssrInterpolate(unref(errors).fullName)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="form-group" data-v-e6f2ac99><input type="email" id="email"${ssrRenderAttr("value", unref(form).email)} placeholder="EMAIL" class="${ssrRenderClass({ "error": unref(errors).email })}" data-v-e6f2ac99>`);
      if (unref(errors).email) {
        _push(`<span class="error-message" data-v-e6f2ac99>${ssrInterpolate(unref(errors).email)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="form-group" data-v-e6f2ac99><input type="tel" id="phone"${ssrRenderAttr("value", unref(form).phone)} placeholder="PHONE" class="${ssrRenderClass({ "error": unref(errors).phone })}" data-v-e6f2ac99>`);
      if (unref(errors).phone) {
        _push(`<span class="error-message" data-v-e6f2ac99>${ssrInterpolate(unref(errors).phone)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="form-group" data-v-e6f2ac99><select id="practiceArea" class="${ssrRenderClass({ "error": unref(errors).practiceArea })}" data-v-e6f2ac99><option value="" disabled selected data-v-e6f2ac99>PRACTICE AREA</option><option value="Family Law" data-v-e6f2ac99${ssrIncludeBooleanAttr(Array.isArray(unref(form).practiceArea) ? ssrLooseContain(unref(form).practiceArea, "Family Law") : ssrLooseEqual(unref(form).practiceArea, "Family Law")) ? " selected" : ""}>Family Law</option><option value="Commercial Law" data-v-e6f2ac99${ssrIncludeBooleanAttr(Array.isArray(unref(form).practiceArea) ? ssrLooseContain(unref(form).practiceArea, "Commercial Law") : ssrLooseEqual(unref(form).practiceArea, "Commercial Law")) ? " selected" : ""}>Commercial Law</option><option value="Immigration" data-v-e6f2ac99${ssrIncludeBooleanAttr(Array.isArray(unref(form).practiceArea) ? ssrLooseContain(unref(form).practiceArea, "Immigration") : ssrLooseEqual(unref(form).practiceArea, "Immigration")) ? " selected" : ""}>Immigration</option><option value="Wills &amp; Estate" data-v-e6f2ac99${ssrIncludeBooleanAttr(Array.isArray(unref(form).practiceArea) ? ssrLooseContain(unref(form).practiceArea, "Wills & Estate") : ssrLooseEqual(unref(form).practiceArea, "Wills & Estate")) ? " selected" : ""}>Wills &amp; Estate</option></select>`);
      if (unref(errors).practiceArea) {
        _push(`<span class="error-message" data-v-e6f2ac99>${ssrInterpolate(unref(errors).practiceArea)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="form-group" data-v-e6f2ac99><textarea id="description" placeholder="DESCRIPTION" rows="5" class="${ssrRenderClass({ "error": unref(errors).description })}" data-v-e6f2ac99>${ssrInterpolate(unref(form).description)}</textarea>`);
      if (unref(errors).description) {
        _push(`<span class="error-message" data-v-e6f2ac99>${ssrInterpolate(unref(errors).description)}</span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><button type="button" class="submit-button"${ssrIncludeBooleanAttr(unref(isSubmitting)) ? " disabled" : ""} style="${ssrRenderStyle({ "position": "relative", "z-index": "100", "pointer-events": "auto", "cursor": "pointer" })}" data-v-e6f2ac99>${ssrInterpolate(unref(isSubmitting) ? "SUBMITTING..." : "BOOK A CONSULTATION")}</button></div></div><div class="contact-info-container" data-v-e6f2ac99><h3 class="visit-title" data-v-e6f2ac99>Visit Our Office</h3><div class="office-address" data-v-e6f2ac99><p data-v-e6f2ac99><b data-v-e6f2ac99>Melbourne Legal Lawyers</b><br data-v-e6f2ac99> 26 Hicks Street <br data-v-e6f2ac99> Lara, VIC 3212 <br data-v-e6f2ac99> Hours: Mon-Fri 9am-5pm </p></div><div class="office-contact" data-v-e6f2ac99><a href="tel:+61312345678" class="office-contact-item" data-v-e6f2ac99>`);
      _push(ssrRenderComponent(_component_NuxtImg, {
        src: "/images/CALL ICON.png",
        alt: "Phone",
        class: "office-contact-icon"
      }, null, _parent));
      _push(`<span data-v-e6f2ac99>+61 3 1234 5678</span></a><a href="mailto:info@melbournelegallawyers.com.au" class="office-contact-item" data-v-e6f2ac99>`);
      _push(ssrRenderComponent(_component_NuxtImg, {
        src: "/images/MAIL-ICON.png",
        alt: "Email",
        class: "office-contact-icon"
      }, null, _parent));
      _push(`<span data-v-e6f2ac99>info@melbournelegallawyers.com.au</span></a></div><div class="map-container" data-v-e6f2ac99><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3143.0640524709434!2d144.4132796505789!3d-38.02228619828556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad418b6e3c84fc1%3A0x84d02d6ff0753d4c!2s26%20Hicks%20St%2C%20Lara%20VIC%203212%2C%20Australia!5e0!3m2!1sen!2sph!4v1762295620640!5m2!1sen!2sph" width="100%" height="250" style="${ssrRenderStyle({ "border": "0" })}" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" data-v-e6f2ac99></iframe></div></div></div></section>`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ContactUsSection.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_6 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["__scopeId", "data-v-e6f2ac99"]]);
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "AppFooter",
  __ssrInlineRender: true,
  setup(__props) {
    const { isVisible, elementRef } = useAnimateOnScroll();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = __nuxt_component_0;
      _push(`<footer${ssrRenderAttrs(mergeProps({
        ref_key: "elementRef",
        ref: elementRef,
        class: ["footer", "animate-on-scroll", "fade-in-up", { "visible": unref(isVisible) }]
      }, _attrs))}><div class="footer-container"><div class="footer-logo">`);
      _push(ssrRenderComponent(_component_NuxtImg, {
        src: "/images/MLL - LOGO - WEB.png",
        alt: "MLL Melbourne Legal Lawyers",
        class: "footer-logo-img"
      }, null, _parent));
      _push(`</div><div class="footer-links"><div class="footer-link-column"><h4 class="footer-link-title">Our Services</h4><a href="#services" class="footer-link">Family Law</a><a href="#services" class="footer-link">Commercial Law</a><a href="#services" class="footer-link">Immigration</a><a href="#services" class="footer-link">Wills &amp; Estates</a></div><div class="footer-link-column"><h4 class="footer-link-title">Company</h4><a href="#about" class="footer-link">About</a><a href="#client-promise" class="footer-link">Client Promise</a><a href="#contact" class="footer-link">Contact</a><a href="#" class="footer-link">Privacy Policy</a></div></div><div class="footer-cta"><a href="#contact" class="footer-consultation-button">BOOK A CONSULTATION</a><div class="footer-contact"><a href="tel:+61312345678" class="footer-contact-item">`);
      _push(ssrRenderComponent(_component_NuxtImg, {
        src: "/images/CALL ICON.png",
        alt: "Phone",
        class: "footer-contact-icon"
      }, null, _parent));
      _push(`<span>+61 3 1234 5678</span></a><a href="mailto:info@melbournelegallawyers.com.au" class="footer-contact-item">`);
      _push(ssrRenderComponent(_component_NuxtImg, {
        src: "/images/MAIL-ICON.png",
        alt: "Email",
        class: "footer-contact-icon"
      }, null, _parent));
      _push(`<span>info@melbournelegallawyers.com.au</span></a></div></div></div><div class="footer-bottom"><p>Legal solutions that put people first. Based in Lara, serving Greater Geelong and Melbourne.</p></div></footer>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AppFooter.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_AppHeader = _sfc_main$9;
  const _component_HeroSection = _sfc_main$8;
  const _component_FeatureHighlights = _sfc_main$7;
  const _component_AboutUsSection = _sfc_main$6;
  const _component_OurServicesSection = __nuxt_component_4;
  const _component_ClientPromiseSection = _sfc_main$3;
  const _component_ContactUsSection = __nuxt_component_6;
  const _component_AppFooter = _sfc_main$1;
  _push(`<div${ssrRenderAttrs(mergeProps({ id: "top" }, _attrs))}>`);
  _push(ssrRenderComponent(_component_AppHeader, null, null, _parent));
  _push(`<div class="landing-page">`);
  _push(ssrRenderComponent(_component_HeroSection, null, null, _parent));
  _push(ssrRenderComponent(_component_FeatureHighlights, null, null, _parent));
  _push(ssrRenderComponent(_component_AboutUsSection, null, null, _parent));
  _push(ssrRenderComponent(_component_OurServicesSection, null, null, _parent));
  _push(ssrRenderComponent(_component_ClientPromiseSection, { id: "client-promise" }, null, _parent));
  _push(ssrRenderComponent(_component_ContactUsSection, null, null, _parent));
  _push(ssrRenderComponent(_component_AppFooter, null, null, _parent));
  _push(`</div></div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { index as default };
//# sourceMappingURL=index-RK-Gf2LU.mjs.map
