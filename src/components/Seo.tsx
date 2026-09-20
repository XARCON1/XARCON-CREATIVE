import { useEffect } from "react";
import pages from "../content/seo.json";
export default function Seo({ page }: { page: keyof typeof pages }) {
  const meta = pages[page];
  useEffect(() => {
    document.title = meta.title;
    const set = (selector: string, value: string) =>
      document.querySelector(selector)?.setAttribute("content", value);
    set('meta[name="description"]', meta.description);
    set('meta[property="og:title"]', meta.title);
    set('meta[property="og:description"]', meta.description);
    set(
      'meta[property="og:url"]',
      "https://xarcon-creative.vercel.app" + meta.path,
    );
    document
      .querySelector('link[rel="canonical"]')
      ?.setAttribute("href", "https://xarcon-creative.vercel.app" + meta.path);
  }, [meta]);
  return null;
}
