# The Signal Report

A Drudge-style personal news front page inspired by Kiwi Report. Uses the same Mac system font, 16px bold uppercase underlined headlines, 26–44px centred lead, publisher photos and a red siren treatment. Five sections cover AI, finance, Bitcoin and crypto, politics and world news. The full-width layout has a compact masthead and a lead photo alongside its headline.

## Run locally

With Node.js 20 or later installed, run `npm start`, then visit http://localhost:3000. No API key, paid service or database is required.

## Deploy on free Render

1. Upload this folder's contents to a new GitHub repository, with `package.json` at the repository root.
2. In Render, select **New → Web Service**, then connect that repository.
3. Choose **Node**, build command `npm install --omit=dev`, start command `npm start`, and the **Free** instance plan.
4. Deploy. Render supplies the public `onrender.com` URL.

Alternatively, use Render's Blueprint flow with the included `render.yaml`. It declares the Free plan.

Render's free instances sleep after 15 minutes without incoming traffic and may take about a minute to wake. The first news request can then take up to 16 seconds. Free instance hours are shared with your other free services. This app fetches only on visits or the page's five-minute refresh; it does not use a keep-alive workaround.

Official instructions: https://render.com/docs/deploy-node-express-app
Free service limits: https://render.com/docs/free

## The 22 feeds

1. BBC World
2. The Guardian World
3. BBC Business
4. CNBC Top News
5. The Guardian Business
6. BBC Politics
7. The Guardian US Politics
8. RNZ Politics
9. TechCrunch Artificial Intelligence
10. The Verge Artificial Intelligence
11. Google News AI (selected established publishers)
12. Al Jazeera
13. The New York Times World
14. The New York Times Business
15. The New York Times Politics
16. NPR World
17. NPR Politics
18. Ars Technica
19. MIT Technology Review Artificial Intelligence
20. WIRED Artificial Intelligence

21. CoinDesk
22. Cointelegraph

These are 22 feeds from 15 feed providers, not 20 independent publishers. Some feeds include syndicated stories. Feed availability is shown honestly; failed feeds don't stop the others.

## Selection and photos

The server ranks recent headlines by consequence-related terms, recency and matching coverage from multiple sources. It groups similar headlines, filters common opinion and promotional content, and shows up to 25 stories per section, with no pagination. This is heuristic ranking, not LLM curation or verification, and it cannot guarantee that nothing important is missed. BBC, Guardian and the other providers remain responsible for their reporting.

Photos come from publisher feed metadata or article Open Graph metadata. They are linked to the original stories, with source attribution. Failed images are hidden. Article access may require a subscription. Photos and headlines remain the publishers' property; check their terms before operating a public or commercial service.

Five-minute caching happens in memory. No stories are written to disk. Multiple simultaneous visitors reuse the same refresh. If all feeds fail after a successful refresh, previous headlines are shown with a stale-data notice. Nothing runs unattended while the server is asleep.

Edit the feed list, impact weights and filters in `news.js`. Edit layout in `public/index.html` and `public/app.js`, styling in `public/style.css`. The `/health` endpoint is included for Render health checks.

## Reading improvements

Visited headlines change colour. New automatic editions wait behind a Show latest headlines button so stories do not move while you read. Manual refresh applies immediately. Footer navigation returns you to the top.
