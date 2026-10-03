const feeds = [
    { name: 'BBC', url: 'https://feeds.bbci.co.uk/news/world/rss.xml', category: 'World' },
    { name: 'The Guardian', url: 'https://www.theguardian.com/world/rss', category: 'World' },
    { name: 'BBC', url: 'https://feeds.bbci.co.uk/news/business/rss.xml', category: 'Finance' },
    { name: 'CNBC', url: 'https://www.cnbc.com/id/100003114/device/rss/rss.html', category: 'Finance' },
    { name: 'The Guardian', url: 'https://www.theguardian.com/business/rss', category: 'Finance' },
    { name: 'BBC', url: 'https://feeds.bbci.co.uk/news/politics/rss.xml', category: 'Politics' },
    { name: 'The Guardian', url: 'https://www.theguardian.com/us-news/us-politics/rss', category: 'Politics' },
    { name: 'RNZ', url: 'https://www.rnz.co.nz/rss/political.xml', category: 'Politics' },
    { name: 'TechCrunch', url: 'https://techcrunch.com/category/artificial-intelligence/feed/', category: 'AI' },
    { name: 'The Verge', url: 'https://www.theverge.com/rss/ai-artificial-intelligence/index.xml', category: 'AI' },
    { name: 'Google News', url: 'https://news.google.com/rss/search?q=artificial+intelligence+(breakthrough+OR+regulation+OR+OpenAI+OR+Anthropic+OR+Nvidia)+when:2d&hl=en&gl=US&ceid=US:en', category: 'AI' },
    { name: 'Al Jazeera', url: 'https://www.aljazeera.com/xml/rss/all.xml', category: 'World' },
    { name: 'The New York Times', url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml', category: 'World' },
    { name: 'The New York Times', url: 'https://rss.nytimes.com/services/xml/rss/nyt/Business.xml', category: 'Finance' },
    { name: 'The New York Times', url: 'https://rss.nytimes.com/services/xml/rss/nyt/Politics.xml', category: 'Politics' },
    { name: 'NPR', url: 'https://feeds.npr.org/1004/rss.xml', category: 'World' },
    { name: 'NPR', url: 'https://feeds.npr.org/1014/rss.xml', category: 'Politics' },
    { name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index', category: 'AI' },
    { name: 'MIT Technology Review', url: 'https://www.technologyreview.com/topic/artificial-intelligence/feed/', category: 'AI' },
    { name: 'WIRED', url: 'https://www.wired.com/feed/tag/ai/latest/rss', category: 'AI' },
    { name: 'CoinDesk', url: 'https://www.coindesk.com/arc/outboundfeeds/rss/', category: 'Crypto' },
    { name: 'Cointelegraph', url: 'https://cointelegraph.com/rss', category: 'Crypto' },
];
function photoUrl(s) { return s; }
function decode(s) { return s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1').replace(/<[^>]+>/g, '').replace(/&#(x[0-9a-f]+|\d+);/gi, (_, n) => String.fromCodePoint(n[0] === 'x' ? parseInt(n.slice(1), 16) : parseInt(n, 10))).replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&apos;|&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim(); }
function tag(item, name) { return decode(item.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, 'i'))?.[1] || ''); }
const low = /\b(quiz|celebrity|horoscope|recipe|review|podcast|opinion|live updates|what to wear|best deals|shopping|football|rugby|stocks? to (?:watch|buy)|better .* stock|i sold|was i wrong|motley fool|top tips|tickets|high school|monk|mosque|film|mansion|centenary|prophet|hotel|as it happened|ast it happened|disrupt|expo|deal for|pass(?:es)?|cultured economist|won the war|environmentalist|robbery|speculation|the consciousness|consciousness of)\b/i;
const trustedGoogle = /Reuters|Associated Press|AP News|Bloomberg|Financial Times|Wall Street Journal|Washington Post|New York Times|BBC|CNBC|Guardian|TechCrunch|The Verge|MIT Technology Review|Wired|Fox Business|Fortune|Ars Technica/i;
function classify(title, fallback) {
    if (/\b(bitcoin|BTC|crypto\w*|ethereum|ETH|stablecoins?|blockchain|solana|tokenization)\b/i.test(title) || fallback === 'Crypto')
        return 'Crypto';
    if (/\b(AI|artificial intelligence|OpenAI|Anthropic|DeepSeek|Nvidia)\b/i.test(title))
        return 'AI';
    if (/\b(oil|diesel|inflation|tariff|trade war|Fed|federal reserve|central bank|interest rates?|stocks?|markets?|IPO|pension|recession|economy|economic)\b/i.test(title))
        return 'Finance';
    if (/\b(war|missile|nuclear|invasion|ceasefire|strikes|earthquake|flood|terrorism|carrier group)\b/i.test(title))
        return 'World';
    return fallback;
}
function topicKey(title) {
    const t = title.toLowerCase();
    if (/\bg7\b/.test(t) && /oil|diesel|fuel/.test(t) && /releas/.test(t))
        return 'g7-fuel-release';
    return '';
}
const severity = [
    [/\b(war|invasion|nuclear|ballistic|missile|ceasefire|coup|terror|strikes?|attack|peace deal)\b/i, 35],
    [/\b(crisis|collapse|default|recession|pandemic|emergency|shutdown)\b/i, 30],
    [/\b(G7|G20|NATO|UN Security Council|tariffs?|sanctions|inflation|interest rates?|federal reserve|central bank|Fed|oil|diesel|export controls?|antitrust|FTC|regulat\w*|bans?)\b/i, 22],
    [/\b(election|referendum|manifesto|president|Trump|Biden|Xi|Putin|Zelensky|prime minister|Brexit|border wall|court|judge)\b/i, 14],
    [/\b(breakthrough|launch\w*|releases?|frontier|model|chip\w*|data cent\w*|layoffs?|billion|trillion|IPO|stock|pension)\b/i, 12],
    [/\b(bitcoin|crypto\w*|ethereum|stablecoins?|blockchain|SEC|ETF)\b/i, 16],
    [/\b(OpenAI|Anthropic|Nvidia|DeepSeek|Google|Microsoft|Meta|Amazon|Apple|earthquake|flood|hurricane|outbreak)\b/i, 6],
];
function tokens(s) { return new Set(s.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter(w => w.length > 3 && !['with', 'from', 'that', 'this', 'after', 'over', 'says', 'have', 'will', 'into', 'more', 'their', 'about', 'what', 'news', 'amid'].includes(w))); }
function similarity(a, b) { let n = 0; for (const x of a)
    if (b.has(x))
        n++; return n / Math.max(1, Math.min(a.size, b.size)); }
let cached = null;
let pending = null;
async function collect() {
    const results = await Promise.allSettled(feeds.map(async (f) => {
        const r = await fetch(f.url, { signal: AbortSignal.timeout(10000), headers: { 'User-Agent': 'SignalReport/1.0 (+news aggregator)', 'Accept': 'application/rss+xml, application/atom+xml, text/xml' } });
        if (!r.ok)
            throw new Error(f.name);
        const xml = await r.text();
        const entries = xml.match(/<item[\s\S]*?<\/item>|<entry[\s\S]*?<\/entry>/g) || [];
        if (!entries.length)
            throw new Error(f.name);
        return entries.slice(0, 40).map(item => {
            let title = tag(item, 'title');
            let source = f.name;
            if (f.name === 'Google News') {
                source = tag(item, 'source') || f.name;
                title = title.replace(new RegExp(' - ' + source.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$'), '');
            }
            const url = tag(item, 'link') || item.match(/<link[^>]*href=["']([^"']+)["'][^>]*\/?>/)?.[1] || '';
            const media = item.match(/<media:(?:content|thumbnail)[^>]*url=["']([^"']+)["']/i)?.[1] || item.match(/<enclosure[^>]*url=["']([^"']+)["'][^>]*type=["']image/i)?.[1] || item.match(/<img[^>]*src=["']([^"']+)["']/i)?.[1];
            const image = media && /^https:\/\//.test(media) ? photoUrl(decode(media)) : undefined;
            const published = tag(item, 'pubDate') || tag(item, 'published') || tag(item, 'updated');
            const age = (Date.now() - Date.parse(published)) / 3600000;
            const impact = severity.reduce((sum, [pattern, weight]) => sum + (pattern.test(title) ? weight : 0), 0);
            const score = impact + Math.max(0, 10 - (Number.isFinite(age) ? age : 48) / 2);
            return { title, url, source, published, category: classify(title, f.category), score, image, imageSource: image ? source : undefined, sources: [source], related: [] };
        }).filter(s => /^https?:\/\//.test(s.url) && s.title && Number.isFinite(Date.parse(s.published)) && (Date.now() - Date.parse(s.published)) < 72 * 3600000 && !low.test(s.title) && !/(?:commentisfree|opinion|podcast|\/live\/)/i.test(s.url) && (f.name !== 'Google News' || trustedGoogle.test(s.source)) && (f.name !== 'Ars Technica' || /\b(AI|artificial intelligence|machine learning|OpenAI|Anthropic|Nvidia|DeepSeek|data cent\w*|model)\b/i.test(s.title)) && severity.some(([pattern]) => pattern.test(s.title)));
    }));
    const rows = results.flatMap(r => r.status === 'fulfilled' ? r.value : []).sort((a, b) => b.score - a.score);
    const groups = [];
    const urls = new Set();
    for (const s of rows) {
        if (urls.has(s.url))
            continue;
        urls.add(s.url);
        const words = tokens(s.title);
        const same = groups.find(g => (similarity(g.words, words) >= .6 && Math.min(g.words.size, words.size) >= 4) || (topicKey(s.title) !== '' && topicKey(s.title) === topicKey(g.story.title)));
        if (same) {
            if (!same.story.sources.includes(s.source)) {
                same.story.sources.push(s.source);
                if (s.title.toLowerCase() !== same.story.title.toLowerCase())
                    same.story.score += 12;
            }
            if (!same.story.image && s.image) {
                same.story.image = s.image;
                same.story.imageSource = s.imageSource;
            }
            same.story.related.push({ title: s.title, url: s.url, source: s.source });
        }
        else
            groups.push({ story: s, words });
    }
    const available = results.filter(r => r.status === 'fulfilled').length;
    const ranked = groups.map(g => g.story).sort((a, b) => b.score - a.score);
    const photoCandidates = [ranked[0], ...['AI', 'Finance', 'Politics', 'World', 'Crypto'].flatMap(c => ranked.filter(s => s.category === c).slice(0, 2))].filter((s) => Boolean(s));
    await Promise.allSettled([...new Set(photoCandidates)].filter(s => !s.image || s === ranked[0]).slice(0, 9).map(async (s) => {
        const host = new URL(s.url).hostname;
        if (!/(?:^|\.)(?:bbc\.(?:co\.uk|com)|theguardian\.com|cnbc\.com|nytimes\.com|npr\.org|rnz\.co\.nz|techcrunch\.com|theverge\.com|arstechnica\.com|technologyreview\.com|wired\.com|aljazeera\.com)$/.test(host))
            return;
        const r = await fetch(s.url, { signal: AbortSignal.timeout(6000), headers: { 'User-Agent': 'SignalReport/1.0' } });
        if (!r.ok)
            return;
        const html = (await r.text()).slice(0, 2000000);
        const meta = html.match(/<meta[^>]*(?:property|name)=["']og:image["'][^>]*>/i)?.[0];
        const image = meta?.match(/content=["']([^"']+)["']/i)?.[1];
        if (image && /^https:\/\//.test(image)) {
            s.image = photoUrl(decode(image));
            s.imageSource = s.source;
        }
    }));
    const data = { stories: ranked, updated: new Date().toISOString(), available, total: feeds.length, failed: results.flatMap((r, i) => r.status === 'rejected' ? [feeds[i].name + ' · ' + feeds[i].category] : []) };
    if (!available) {
        if (cached)
            return { ...cached.data, stale: true, available: 0, failed: data.failed };
        throw new Error('News sources are temporarily unavailable.');
    }
    cached = { data, at: Date.now() };
    return data;
}
export async function getNews() { if (cached && Date.now() - cached.at < 300000)
    return cached.data; if (!pending)
    pending = collect().finally(() => { pending = null; }); return pending; }
