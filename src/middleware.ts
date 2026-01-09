import { defineMiddleware } from "astro:middleware";
import { getLanguageFromURL } from "./utils/i18n";

export const onRequest = defineMiddleware(async (context, next) => {
  // Get the current language from the URL
  const lang = getLanguageFromURL(context.url.pathname);

  // Store it in locals so it's available to all pages
  context.locals.lang = lang;

  return next();
});
