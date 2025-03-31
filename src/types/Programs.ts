import type { ChannelID } from './Channel'

type Time = string
export type ScheduleID = string

export interface TimeInterval {
  begin: Time
  end: Time
}

export interface ProgramEvent {
  id: string
  title: string
  logoUrl: string
  scheduledFor: TimeInterval
}

export interface Program {
  scheduleId: ScheduleID
  events: ProgramEvent[]
}

export interface APIPrograms {
  schedules: Program[]
  relevantInterval: TimeInterval
  updateDuringInterval: TimeInterval
}

// ProgramCompose

export interface ProgramComposeItem {
  id: string
  channelId: ChannelID
  scheduleId: ScheduleID
  isLocked: boolean
  liveOnly: boolean
  hasNoDvr: boolean
  dvrDepthLimitHours: number
}

export interface APIProgramsComposeTable {
  medias: ProgramComposeItem[]
}

// ...

export interface ChannelPrograms {
  channelId: ChannelID
  scheduleId: ScheduleID
  programs: ProgramEvent[]
}

export type ChannelsPrograms = ChannelPrograms[]
