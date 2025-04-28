import { http, HttpResponse } from 'msw'
import { channelsFetchURL, programsComposeTableFetchURL, programsFetchURL } from '~/shared'
import { channelsMock } from './res/channels'
import { createEpgMock } from './res/epg'
import { programsMock } from './res/programs'
import { programsComposeTableMock } from './res/programsComposeTable'

function removeURLParams(urlString: string): string {
  const url = new URL(urlString)
  url.search = ''
  return url.href
}

export const handlers = [
  http.get(removeURLParams(channelsFetchURL), () => {
    return HttpResponse.json(channelsMock)
  }),
  http.get(removeURLParams(programsFetchURL), () => {
    return HttpResponse.json(programsMock)
  }),
  http.get(removeURLParams(programsComposeTableFetchURL), () => {
    return HttpResponse.json(programsComposeTableMock)
  }),
  http.get('https://fe.smotreshka.tv/epg/v2/schedules/:todaySchedule/spread', ({ request: _, params }) => {
    // const url = new URL(request.url)
    // console.log(url.searchParams.get('centralPageId'))

    return HttpResponse.json(createEpgMock(String(params.todaySchedule) || 'no todaySchedule, testing lol'))
  }),
]
