export enum SPECIAL_GENRES {
  LOCAL_FAVORITE = 'LOCAL_FAVORITE',
}

export type GenreID = SPECIAL_GENRES | string
export type ChannelID = string

export interface ChannelGenre {
  genreId: GenreID
}

export interface Channel {
  id: ChannelID
  title: string
  keyNumber: number
  logoUrl: string
  relevantGenres: ChannelGenre[]
  description: string
  dvrDepthLimitHours: number
}

export interface APIChannelsListGenres {
  id: GenreID
  title: string
}

export interface APIChannels {
  channels: Channel[]
  genres: APIChannelsListGenres[]
}
