import { getNowPlaying } from './spotify';

const handler: ExportedHandler = {
	async fetch(request, env: any, ctx) {
		const allowOrigins = env.ALLOW_ORIGINS.split(',');

		const response = await getNowPlaying(env);

		if (response.status === 204 || response.status > 400) {
			return new Response(JSON.stringify({ isPlaying: false }), {
				status: 200,
			});
		}

		const nowPlaying: any = await response.json();

		// Check if the request's origin is in the list of allowed origins
    const requestOrigin = request.headers.get('Origin') || '*';

		if (allowOrigins.includes(requestOrigin)) {
      const corsHeaders = new Headers({
				'Access-Control-Allow-Origin': requestOrigin,
				'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
			});

      if (nowPlaying.currently_playing_type === 'track') {
        const isPlaying = nowPlaying.is_playing;
				const title = nowPlaying.item.name;
				const artist = nowPlaying.item.artists.map((_artist: any) => _artist.name).join(', ');
				const songUrl = nowPlaying.item.external_urls.spotify;

        return new Response(JSON.stringify({
					artist,
					isPlaying,
					songUrl,
					title,
				}), {
          status: 200,
          headers: corsHeaders,
        });
      } else if (nowPlaying.currently_playing_type === 'episode') {
        // ... your podcast response logic ...
        return new Response(JSON.stringify({
					isPlaying: nowPlaying.is_playing,
					songUrl: 'https://open.spotify.com',
					title: 'Podcast',
				}), {
          status: 200,
          headers: corsHeaders,
        });
      }
    }

		return new Response(JSON.stringify({ isPlaying: false }), {
			status: 200,
		});
	},
};

export default handler;
