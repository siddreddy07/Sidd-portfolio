// Tells Bing (which powers ChatGPT search), Yandex, Seznam and other IndexNow engines that the site's pages
// changed, so they recrawl now instead of in weeks. Run after a production deploy: node scripts/indexnow.mjs
// The key is public by design: it must be served at /<key>.txt (public/296dccfa….txt) to prove site ownership.
const SITE = "https://siddharth-portfolio-delta.vercel.app";
const KEY = "296dccfa63bd9f4d5904df597ecfe7dc";

const sitemap = await fetch(`${SITE}/sitemap.xml`).then((r) => r.text());
const urlList = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]).concat(`${SITE}/llms.txt`);

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: new URL(SITE).host, key: KEY, keyLocation: `${SITE}/${KEY}.txt`, urlList }),
});
console.log(`IndexNow: ${res.status} ${res.statusText} for ${urlList.length} URLs`);
// 200/202 = accepted. 403 = key file not live yet (deploy first). 422 = URLs don't match the host.
