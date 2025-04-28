import { http, HttpResponse } from 'msw'
import { channelsFetchURL, programsComposeTableFetchURL, programsFetchURL } from '~/shared'
import { channelsMock } from './res/channels'
import { programsMock } from './res/programs'
import { programsComposeTableMock } from './res/programsComposeTable'

function sanitizeURL(urlString: string): string {
  const url = new URL(urlString)
  url.search = ''
  return url.href
}

export const handlers = [
  http.get(sanitizeURL(channelsFetchURL), () => {
    return HttpResponse.json(channelsMock)
  }),
  http.get(sanitizeURL(programsFetchURL), () => {
    return HttpResponse.json(programsMock)
  }),
  http.get(sanitizeURL(programsComposeTableFetchURL), () => {
    return HttpResponse.json(programsComposeTableMock)
  }),
]
