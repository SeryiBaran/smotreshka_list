import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

function randint(min: number, max: number): number {
  return min + (Math.random() * (max - min))
}

const programsMockTemplate = {
  relevantInterval: {
    begin: dayjs().subtract(57, 'minute').utc().format(),
    end: dayjs().add(63, 'minute').utc().format(),
  },
  updateDuringInterval: {
    begin: '2025-04-28T09:14:13Z',
    end: '2025-04-28T09:24:13Z',
  },
  schedules: [
    {
      scheduleId: '000000089',
      events: [
        {
          id: '680cc355a6797893cc13af53',
          title: 'Изгой. 2-я серия',
          logoUrl:
            'https://smotreshka.server-img.lfstrm.tv/image/aHR0cHM6Ly9jbXMuc21vdHJlc2hrYS50di9hcmNoaXZlLWltZy9zdGF0aWMvbWVkaWEvNmIvMTgvNmIxODhlZDFiZTFkNmIzMDc4MmQwOGY3NjNmYTBhNWU=',
          scheduledFor: { begin: 'AAABBB_BEGIN_000', end: 'AAABBB_END_000' },
        },
        {
          id: '680cc355a6797893cc13b0e2',
          title: 'Изгой. 3-я серия',
          logoUrl:
            'https://smotreshka.server-img.lfstrm.tv/image/aHR0cHM6Ly9jbXMuc21vdHJlc2hrYS50di9hcmNoaXZlLWltZy9zdGF0aWMvbWVkaWEvNmIvMTgvNmIxODhlZDFiZTFkNmIzMDc4MmQwOGY3NjNmYTBhNWU=',
          scheduledFor: { begin: 'AAABBB_BEGIN_001', end: 'AAABBB_END_001' },
        },
        {
          id: '680cc355a6797893cc13b251',
          title: 'Изгой. 4-я серия',
          logoUrl:
            'https://smotreshka.server-img.lfstrm.tv/image/aHR0cHM6Ly9jbXMuc21vdHJlc2hrYS50di9hcmNoaXZlLWltZy9zdGF0aWMvbWVkaWEvNmIvMTgvNmIxODhlZDFiZTFkNmIzMDc4MmQwOGY3NjNmYTBhNWU=',
          scheduledFor: { begin: 'AAABBB_BEGIN_002', end: 'AAABBB_END_002' },
        },
        {
          id: '680cc355a6797893cc13b338',
          title: 'Известия',
          logoUrl:
            'https://smotreshka.server-img.lfstrm.tv/image/aHR0cHM6Ly9jbXMuc21vdHJlc2hrYS50di9hcmNoaXZlLWltZy9zdGF0aWMvbWVkaWEvMzMvOGYvMzM4ZmE5MGI4ZWExMDViOTgyNWVjMWVkZmQ4NTJlNzA=',
          scheduledFor: { begin: 'AAABBB_BEGIN_003', end: 'AAABBB_END_003' },
        },
      ],
    },
    {
      scheduleId: '000000537',
      events: [
        {
          id: '680cc386a6797893cc33873e',
          title: 'О самом главном',
          logoUrl:
            'https://smotreshka.server-img.lfstrm.tv/image/aHR0cHM6Ly9jbXMuc21vdHJlc2hrYS50di9hcmNoaXZlLWltZy9zdGF0aWMvbWVkaWEvODYvMDEvODYwMWM1ODEyYzA1Mzg1NjE5OTBiNGE1MTAwNDc2N2M=',
          scheduledFor: { begin: 'AAABBB_BEGIN_000', end: 'AAABBB_END_000' },
        },
        {
          id: '680cc386a6797893cc33887c',
          title: 'Вести',
          logoUrl:
            'https://smotreshka.server-img.lfstrm.tv/image/aHR0cHM6Ly9jbXMuc21vdHJlc2hrYS50di9hcmNoaXZlLWltZy9zdGF0aWMvbWVkaWEvYmIvYmYvYmJiZjAzNDJhNzcwZTg0ZmUxMDgwZTJmOTgxNGJiMzY=',
          scheduledFor: { begin: 'AAABBB_BEGIN_001', end: 'AAABBB_END_001' },
        },
        {
          id: '680cc386a6797893cc33898b',
          title: 'Вести. Местное время',
          logoUrl:
            'https://smotreshka.server-img.lfstrm.tv/image/aHR0cHM6Ly9jbXMuc21vdHJlc2hrYS50di9hcmNoaXZlLWltZy9zdGF0aWMvbWVkaWEvNzkvNWYvNzk1ZmFkMGI2NzVkMTNiMjhlYmU0ZDBjMTZmM2IyY2Y=',
          scheduledFor: { begin: 'AAABBB_BEGIN_002', end: 'AAABBB_END_002' },
        },
        {
          id: '680cc386a6797893cc338a9e',
          title: '60 минут',
          logoUrl:
            'https://smotreshka.server-img.lfstrm.tv/image/aHR0cHM6Ly9jbXMuc21vdHJlc2hrYS50di9hcmNoaXZlLWltZy9zdGF0aWMvbWVkaWEvNjIvYzUvNjJjNThmYTFjYWQwYjUzNTgwZDkxYTEyMzY3YzgxYjM=',
          scheduledFor: { begin: 'AAABBB_BEGIN_003', end: 'AAABBB_END_003' },
        },
      ],
    },
    {
      scheduleId: '000000185',
      events: [
        {
          id: '680cc345a6797893cc097b86',
          title: 'Автомобили',
          logoUrl:
            'https://smotreshka.server-img.lfstrm.tv/image/aHR0cHM6Ly9jbXMuc21vdHJlc2hrYS50di9hcmNoaXZlLWltZy9zdGF0aWMvbWVkaWEvYTUvM2IvYTUzYjVjMDFiOTBhOTExOTg4ODY1ODc0YThlZWYwOTg=',
          scheduledFor: { begin: 'AAABBB_BEGIN_000', end: 'AAABBB_END_000' },
        },
        {
          id: '680cc345a6797893cc097c3c',
          title: 'Мотор-шоу. Женевский автосалон',
          logoUrl:
            'https://smotreshka.server-img.lfstrm.tv/image/aHR0cHM6Ly9jbXMuc21vdHJlc2hrYS50di9hcmNoaXZlLWltZy9zdGF0aWMvbWVkaWEvYzUvYjIvYzViMmExMzY4ZjYwMzIxYjNmMWNlYWU3MDNmZjk5ZTE=',
          scheduledFor: { begin: 'AAABBB_BEGIN_001', end: 'AAABBB_END_001' },
        },
        {
          id: '680cc345a6797893cc097cf1',
          title: 'Автомобили',
          logoUrl:
            'https://smotreshka.server-img.lfstrm.tv/image/aHR0cHM6Ly9jbXMuc21vdHJlc2hrYS50di9hcmNoaXZlLWltZy9zdGF0aWMvbWVkaWEvYTUvM2IvYTUzYjVjMDFiOTBhOTExOTg4ODY1ODc0YThlZWYwOTg=',
          scheduledFor: { begin: 'AAABBB_BEGIN_002', end: 'AAABBB_END_002' },
        },
        {
          id: '680cc345a6797893cc097db6',
          title: 'Привет, Тачка. Огромное поле иномарок из СССР',
          logoUrl:
            'https://smotreshka.server-img.lfstrm.tv/image/aHR0cHM6Ly9jbXMuc21vdHJlc2hrYS50di9hcmNoaXZlLWltZy9zdGF0aWMvbWVkaWEvZGQvZmQvZGRmZDM5YjFjMTJkMTk1YzU1MTBiMWIxNmYxOWQ4ZDc=',
          scheduledFor: { begin: 'AAABBB_BEGIN_003', end: 'AAABBB_END_003' },
        },
      ],
    },
    {
      scheduleId: '000000125',
      events: [
        {
          id: '680cc3c4a6797893cc5bcbbb',
          title: 'Всегда говори "всегда". 5-я серия',
          logoUrl:
            'https://smotreshka.server-img.lfstrm.tv/image/aHR0cHM6Ly9jbXMuc21vdHJlc2hrYS50di9hcmNoaXZlLWltZy9zdGF0aWMvbWVkaWEvMDQvODQvMDQ4NDc1ZWI1MjZiN2RiNDgwMmMwNDFlMGI4YzIxOTA=',
          scheduledFor: { begin: 'AAABBB_BEGIN_000', end: 'AAABBB_END_000' },
        },
        {
          id: '680cc3c4a6797893cc5bcd1d',
          title: 'Всегда говори "всегда". 6-я серия',
          logoUrl:
            'https://smotreshka.server-img.lfstrm.tv/image/aHR0cHM6Ly9jbXMuc21vdHJlc2hrYS50di9hcmNoaXZlLWltZy9zdGF0aWMvbWVkaWEvMDQvODQvMDQ4NDc1ZWI1MjZiN2RiNDgwMmMwNDFlMGI4YzIxOTA=',
          scheduledFor: { begin: 'AAABBB_BEGIN_001', end: 'AAABBB_END_001' },
        },
        {
          id: '680cc3c4a6797893cc5bce69',
          title: 'Тени старого шкафа. 1-я серия',
          logoUrl:
            'https://smotreshka.server-img.lfstrm.tv/image/aHR0cHM6Ly9jbXMuc21vdHJlc2hrYS50di9hcmNoaXZlLWltZy9zdGF0aWMvbWVkaWEvYmUvZGMvYmVkYzM3Yzk3NWE5YTA0ZTc5YThmOTgzNDdhMDUzODg=',
          scheduledFor: { begin: 'AAABBB_BEGIN_002', end: 'AAABBB_END_002' },
        },
        {
          id: '680cc3c4a6797893cc5bcfb3',
          title: 'Под Большой медведицей. 6-я серия',
          logoUrl:
            'https://smotreshka.server-img.lfstrm.tv/image/aHR0cHM6Ly9jbXMuc21vdHJlc2hrYS50di9hcmNoaXZlLWltZy9zdGF0aWMvbWVkaWEvYTcvNDkvYTc0OTI5NDk0ZDMwMjE4OTM0NTUzZmVhNDc3YjllMTk=',
          scheduledFor: { begin: 'AAABBB_BEGIN_003', end: 'AAABBB_END_003' },
        },
      ],
    },
    {
      scheduleId: '000000200',
      events: [
        {
          id: '680cc3caa6797893cc5f8a17',
          title: 'Core-тренировка',
          logoUrl:
            'https://smotreshka.server-img.lfstrm.tv/image/aHR0cHM6Ly9jbXMuc21vdHJlc2hrYS50di9hcmNoaXZlLWltZy9zdGF0aWMvbWVkaWEvYWQvMDgvYWQwOGFiNmQzODJmZjZhOTU4ZGMxZGY5NjJlNzBhZWM=',
          scheduledFor: { begin: 'AAABBB_BEGIN_000', end: 'AAABBB_END_000' },
        },
        {
          id: '680cc3caa6797893cc5f8ad9',
          title: 'Функциональный тренинг с элементами капоэйры',
          logoUrl:
            'https://smotreshka.server-img.lfstrm.tv/image/aHR0cHM6Ly9jbXMuc21vdHJlc2hrYS50di9hcmNoaXZlLWltZy9zdGF0aWMvbWVkaWEvMzkvOGUvMzk4ZWIyNDhmMTI0ZjFlMDQ5ODY3NjhlZjA5YjVjOGQ=',
          scheduledFor: { begin: 'AAABBB_BEGIN_001', end: 'AAABBB_END_001' },
        },
        {
          id: '680cc3caa6797893cc5f8be6',
          title: 'Дыши и худей с Мариной Корпан',
          logoUrl:
            'https://smotreshka.server-img.lfstrm.tv/image/aHR0cHM6Ly9jbXMuc21vdHJlc2hrYS50di9hcmNoaXZlLWltZy9zdGF0aWMvbWVkaWEvYjYvNGMvYjY0Y2ZiNDVjZGE3MzNkM2YwYjg0MjA0OWUzY2NiN2E=',
          scheduledFor: { begin: 'AAABBB_BEGIN_002', end: 'AAABBB_END_002' },
        },
        {
          id: '680cc3caa6797893cc5f8ccc',
          title: 'Фитнес с резинками',
          logoUrl:
            'https://smotreshka.server-img.lfstrm.tv/image/aHR0cHM6Ly9jbXMuc21vdHJlc2hrYS50di9hcmNoaXZlLWltZy9zdGF0aWMvbWVkaWEvYWUvZGYvYWVkZjg3MDE3Y2Q4NzVjNjNhNGM4MWEzYWQxZGE2MTk=',
          scheduledFor: { begin: 'AAABBB_BEGIN_003', end: 'AAABBB_END_003' },
        },
      ],
    },
    {
      scheduleId: '000000091',
      events: [
        {
          id: '680cc3bca6797893cc5673ca',
          title: 'Главные новости',
          logoUrl:
            'https://smotreshka.server-img.lfstrm.tv/image/aHR0cHM6Ly9jbXMuc21vdHJlc2hrYS50di9hcmNoaXZlLWltZy9zdGF0aWMvbWVkaWEvYWEvMjEvYWEyMWY5ZjZmYTAzZjI1NWI4ODAyMDBkODcyMWUyYTY=',
          scheduledFor: { begin: 'AAABBB_BEGIN_000', end: 'AAABBB_END_000' },
        },
        {
          id: '680cc3bca6797893cc5674b0',
          title: 'День. Главные темы',
          logoUrl:
            'https://smotreshka.server-img.lfstrm.tv/image/aHR0cHM6Ly9jbXMuc21vdHJlc2hrYS50di9hcmNoaXZlLWltZy9zdGF0aWMvbWVkaWEvZGIvOGEvZGI4YTg2OTFkZTk2NDQ4N2JhMWZhMzMxNjU5YTM4MmM=',
          scheduledFor: { begin: 'AAABBB_BEGIN_001', end: 'AAABBB_END_001' },
        },
        {
          id: '680cc3bca6797893cc567584',
          title: 'Главные новости',
          logoUrl:
            'https://smotreshka.server-img.lfstrm.tv/image/aHR0cHM6Ly9jbXMuc21vdHJlc2hrYS50di9hcmNoaXZlLWltZy9zdGF0aWMvbWVkaWEvYWEvMjEvYWEyMWY5ZjZmYTAzZjI1NWI4ODAyMDBkODcyMWUyYTY=',
          scheduledFor: { begin: 'AAABBB_BEGIN_002', end: 'AAABBB_END_002' },
        },
        {
          id: '680cc3bca6797893cc5675f8',
          title: 'Рынки. Сейчас',
          logoUrl:
            'https://smotreshka.server-img.lfstrm.tv/image/aHR0cHM6Ly9jbXMuc21vdHJlc2hrYS50di9hcmNoaXZlLWltZy9zdGF0aWMvbWVkaWEvZTQvZTQvZTRlNDlkMzA4MTc4ZmZmNmUzNWM4MmE2MWY5YmI4Mjk=',
          scheduledFor: { begin: 'AAABBB_BEGIN_003', end: 'AAABBB_END_003' },
        },
      ],
    },
  ],
}

const schedulesWithTime = programsMockTemplate.schedules.map((sc) => {
  let previousEndTime: string | null = null

  const eventsWithTime = sc.events.map((ev, evIndex) => {
    const beginTimeNormal = previousEndTime
      || dayjs()
        .subtract(randint(10, 30), 'minute') // begin at
        .add(evIndex, 'hour')
        .utc()
        .format()

    const endTimeNormal = dayjs(beginTimeNormal)
      .add(randint(20, 120), 'minute') // how long
      .utc()
      .format()

    previousEndTime = endTimeNormal
    return { ...ev, scheduledFor: {
      begin: beginTimeNormal,
      end: endTimeNormal,
    } }
  })

  return { ...sc, events: eventsWithTime }
})

export const programsMock = { ...programsMockTemplate, schedules: schedulesWithTime }

// import { channelsMock } from './channels'
// import { programsComposeTableMock } from './programsComposeTable'

// console.log(JSON.stringify({ ...programsMock, schedules: programsMock.schedules.filter((sc) => {
//   const composeItem = programsComposeTableMock.medias.find(m => m.scheduleId === sc.scheduleId)
//   return composeItem && channelsMock.channels.findIndex(ch => ch.id === composeItem.channelId) >= 0
// }) }))
