import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import utc from 'dayjs/plugin/utc'

dayjs.extend(duration)
dayjs.extend(utc)

// TODO: remove this fucking shit and made NORMAL TIME
const todayDate = dayjs()
  .utc()
  .hour(0)
  .second(0)
  .minute(0)

const today = todayDate
  .format(`YYYY-MM-DD`) // 2025-04-28

const tomorrowDate = todayDate
  .add(1, `day`)
  .add(2, `second`) // hmmhmmh

const tomorrow = tomorrowDate
  .format(`YYYY-MM-DD`) // 2025-04-29
// const nowInFuckedFormat = dayjs().utc().format(`YYYY-MM-DD[t]12[d]12[h]`)

function createEvents(todaySchedule: string, hourPadding: number) {
  const length = 12
  return Array.from({ length }, (_, i) => i).map((_, i) => {
    const begin = `${today}T${String(1 * (hourPadding + i)).padStart(2, '0')}:00:00Z`
    const eventDuration = dayjs.duration((12 / length), 'hour')
    const end = `${dayjs(begin).add(eventDuration).utc().format()}`
    return {
      id: `${todaySchedule}__${(hourPadding + i)}__id`,
      title: `${todaySchedule} ${(hourPadding + i)} id title`,
      logoUrl: `https://smotreshka.server-img.lfstrm.tv/image/aHR0cHM6Ly9jbXMuc21vdHJlc2hrYS50di9hcmNoaXZlLWltZy9zdGF0aWMvbWVkaWEvN2EvNTkvN2E1OTYyNTJkYmIzZWI4ZGUyMWI4OTczNjE2NzcyNzk=`,
      scheduledFor: {
        begin,
        end,
      },
      dvrDisabled: false,
      actuallyStartedAt: begin,
      eventDescriptionMedium: `${todaySchedule} ${(hourPadding + i)} id description`,
    }
  })
}

function createPagesWithEvents(todaySchedule: string) {
  const length = 3
  return Array.from({ length }, (_, i) => i).map((_, i) => {
    return {
      pageId: todayDate.add(12 * i, 'hour').format().replaceAll(/T\d{2}:\d{2}:\d{2}Z/g, `T${todayDate.hour}`), // TODO: realise how this time notation fuckin works!
      coveredInterval: {
        begin: todayDate.add(12 * i, 'hour').format(),
        end: todayDate.add(12 * i + 1, 'hour').format(),
      },
      events: [
        ...createEvents(todaySchedule, 12 * i),
      ],
    }
  })
}

export function createEpgMock(todaySchedule: string) {
  return {
    regularUpdate: {
      intervalSec: 1800,
      etag: `64366d42f0827ca9b7eeb113741da50c`,
    },
    pagesWithEvents: createPagesWithEvents(todaySchedule),
    prevSpreadCentralPageId: `${today}t00d12h`,
    nextSpreadCentralPageId: `${tomorrow}t00d12h`,
  }
}
