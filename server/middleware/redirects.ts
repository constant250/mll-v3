// import redirects from '@/redirects.json';

// export default defineEventHandler((event) => {
//   const url = getRequestURL(event).pathname;
//   if (redirects[url]) {
//     return sendRedirect(event, redirects[url], 301); // 301 = permanent redirect
//   }
// });

// Temporary default export to prevent build error
export default defineEventHandler(() => {
  // No redirects configured - middleware disabled
});
