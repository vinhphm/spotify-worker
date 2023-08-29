const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`
const TOP_TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/top/tracks`
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`

const getAccessToken: any = async (env: any) => {
  const client_id = env.SPOTIFY_CLIENT_ID
  const client_secret = env.SPOTIFY_CLIENT_SECRET
  const refresh_token = env.SPOTIFY_REFRESH_TOKEN
  const basic = btoa(`${client_id}:${client_secret}`)
  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token,
    }),
  })

  return response.json()
}

export const getNowPlaying = async (env: any) => {
  const { access_token } = await getAccessToken(env)

  return fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })
}

export const getTopTracks = async (env: any) => {
  const { access_token } = await getAccessToken(env)

  return fetch(TOP_TRACKS_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  })
}
