// rebuild for frontend with ./node_modules/.bin/tsc lib/util.ts -m ESNext

import { MapMetaMap, ModeMetaMap } from "~/model/MetaEntry";
import { BrawlerMetaStatistics, ActiveEvent } from "~/model/Api";

export const camelToSnakeCase = (str: string) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
export const camelToKebab = (s: string) =>
  s.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
export const kebabToCamel = (s: string) =>
  s.replace(/([-_][a-z])/ig, ($1) => $1.toUpperCase()
      .replace('-', '')
      .replace('_', ''))
export const capitalize = (str: string) => str.replace(/(?:^|\s)\S/g, (a) => a.toUpperCase());
export const decapitalizeFirstLetter = (str: string) => str.charAt(0).toLowerCase() + str.slice(1)
export const capitalizeWords = (str: string) => str.replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase())
export const slugify = (str: string) => str.split(' ').join('-')
// special case: transform "Competition-Winner-2021-01-01" to "Competition Winner 2021-01-01"
export const deslugify = (str: string) => str.startsWith('Competition-Winner-') ? str.replace('Competition-Winner-', 'Competition Winner ') : str.split('-').join(' ')

export function scaleMinMax(values: number[]) {
  const min = Math.min.apply(Math, values)
  const max = Math.max.apply(Math, values)

  if (min === max) {
    return values.map(value => 0.5)
  }

  return values.map(value => (value - min) / (max - min))
}

export function zip<T>(arr1: T[], arr2: T[]) {
  return arr1.map((value, index) => [value, arr2[index]])
}

export function hoursSinceDate(date: string) {
  const then = Date.parse(date)
  const now = (new Date()).getTime()
  return Math.floor((now - then) / 1000 / 3600)
}

export function relativeTimeUntil(timestamp: string): string {
  const then = new Date(timestamp)
  const now = new Date()
  let time = (then.getTime() - now.getTime()) / 1000;
  let str = ''
  if (time > 60 * 60 * 24) {
    const days = Math.floor(time / (60 * 60 * 24))
    str += days + 'd '
    time -= days * 60 * 60 * 24
  }
  const hours = Math.floor(time / (60 * 60))
  str += hours + 'h '
  time -= hours * 60 * 60
  const minutes = Math.floor(time / 60)
  str += minutes + 'm '
  time -= minutes * 60
  return str
}

export const brawlerId = (entry: { name: string }) =>
  entry.name.replace(/\.| /g, '_').toLowerCase();

export const modeToBackgroundId = (modeCamelCase: string) => {
  const mode = camelToSnakeCase(modeCamelCase);
  if (mode == 'big_game') {
    return 'bossfight';
  }
  if (mode.endsWith('showdown')) {
    return 'showdown';
  }
  return mode.replace('_', '');
}

export function formatMode(mode: string) {
  return camelToSnakeCase(mode)
    .split('_')
    .map(w => capitalize(w))
    .join(' ')
}

export function unformatMode(mode: string) {
  const uncapitalize = (str: string) => str.replace(/(?:^|\s)\S/g, (a) => a.toLowerCase())
  return uncapitalize(mode.replace(/^Showdown$/, 'Solo Showdown').split(' ').join(''))
}

export const formatList = (l: string[], joiner = 'or') => l.slice(0, l.length - 1).join(', ') + ' ' + joiner + ' ' + l[l.length - 1]
export const clamp = (min: number, max: number, n: number) => Math.min(max, Math.max(min, n))
export const minMaxScale = (fromMin: number, fromMax: number, n: number) => (n - fromMin) / (fromMax - fromMin)
export const scaleInto = (fromMin: number, fromMax: number, toMax: number, n: number) => clamp(0, toMax, Math.floor(minMaxScale(fromMin, fromMax, n) * toMax))


export function xpToHours(xp: number) {
  return xp / 220; // 145h for 30300 XP as measured by @schneefux
}

/**
 * Suffix num with SI unit
 * @param num number
 * @param digits digits after comma
 */
export function formatSI(num: number, digits: number) {
  const si = [
    { value: 1, symbol: '' },
    { value: 1E3, symbol: 'k' },
    { value: 1E6, symbol: 'M' },
  ]
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
  let i
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break
    }
  }
  return Math.round(num / si[i].value)
    .toFixed(digits)
    .replace(rx, '$1') + si[i].symbol
}

export const metaStatMaps = {
  labels: {
    trophies: 'Trophies',
    spTrophies: 'with Star Power',
    trophyChange: 'this season',
    winRate: 'Win Rate',
    winRateDiff: 'Win Rate Diff.',
    winRateAdj: 'Adjusted Win Rate',
    winsZScore: 'Wins z-Score',
    rank1Rate: '#1 Rate',
    rank1RateDiff: '#1 Rate Diff.',
    level: 'Avg. Level',
    starRate: 'Star Player',
    starRateDiff: 'Star Player Diff.',
    picks: 'Picks recorded',
    pickRate: 'Pick Rate',
    pickRate_boss: 'Boss Pick Rate',
    useRate: 'Use Rate',
    duration: 'Duration',
    duration_boss: 'Boss Duration',
    rank: 'Avg. Rank',
    rank1: '#1 recorded',
    wins: 'Wins recorded',
    highestTrophies: 'Highest Trophies',
    powerPlayPoints: 'Power Play Points',
    highestPowerPlayPoints: 'Highest Power Play Points',
    expLevel: 'EXP Level',
    victories: '3v3 Wins',
    soloVictories: 'Solo Showdown Wins',
    duoVictories: 'Duo Showdown Wins',
    users: 'Players',
  },
  labelsShort: {
    trophies: 'Trophies',
    spTrophies: 'with Star Power',
    trophyChange: 'this season',
    winRate: 'Win',
    winRateDiff: 'WinD',
    winRateAdj: 'Win',
    winsZScore: 'Win-z',
    rank1Rate: 'SD Win',
    rank1RateDiff: 'SD WinD',
    level: 'Level',
    starRate: 'Star',
    starRateDiff: 'StarD',
    picks: 'Picks',
    pickRate: 'Picked',
    useRate: 'Used',
    duration: 'Duration',
    rank: 'Rank',
    rank1: 'Rank 1',
    wins: 'Wins',
  },
  descriptions: {
    pickRate: 'The Pick Rate tells you the % of battles this Brawler appears in.',
    useRate: 'The Use Rate measures the popularity of a Brawler, adjusted to how many players unlocked them. It is the main statistic Supercell uses to balance Brawlers.',
    rank: 'The Average Rank tells you what place the Brawler is ranked in Showdown on average.',
    rank1Rate: 'The #1 Rate tells you the % of Showdown battles a Brawler is #1.',
    rank1RateDiff: 'The #1 Rate Difference compares the #1 Rate of Brawlers with a Star Power / Gadget to those without.',
    wins: 'The number of Wins recorded ranks Brawlers high who are played a lot and win a lot.',
    winRate: 'The Win Rate tells you the % of battles a Brawler wins or ranks high.',
    winRateDiff: 'The Win Rate Difference compares the Win Rate of Brawlers with a Star Power / Gadget to those without.',
    winRateAdj: 'The Adjusted Win Rate tells you the % of battles a Brawler wins or ranks high. For Brawlers with few picks, this value is interpolated.',
    winsZScore: 'The Wins z-score uses a statistical test to compare the wins of Brawlers with a Star Power / Gadget to those without. Scores higher/lower than 2 are good/bad.',
    starRate: 'The Star Rate tells you the % of battles this Brawler becomes Star Player.',
    starRateDiff: 'The Star Rate Difference compares the Star Rate of Brawlers with a Star Power / Gadget to those without.',
    trophies: 'The amount of Trophies tells you how many trophies players have with this Brawler on average.',
    duration: 'The Duration tells you how long battles with this Brawler last on average in seconds.',
    users: 'The total number of players.',
  },
  icons: {
    trophies: 'trophy',
    spTrophies: 'starpower',
    trophyChange: 'trophy',
    winRate: '📈',
    winRateDiff: '📈',
    winRateAdj: '📈',
    winsZScore: '📈',
    rank1Rate: '📈',
    rank1RateDiff: '📈',
    level: '🏅',
    starRate: '⭐',
    starRateDiff: '⭐',
    picks: '👇',
    useRate: '🎯',
    pickRate: '👇',
    pickRate_boss: '👇',
    duration: '⏰',
    duration_boss: '⏰',
    rank: 'leaderboards',
    rank1: '🏅',
    wins: '🏅',
    players: '🧑',
  },
  formatters: {
    trophies: (n: number) => formatSI(n, 1),
    spTrophies: (n: number) => Math.round(n),
    trophyChange: (n: number) => n <= 0 ? Math.round(n) : `+${Math.round(n)}`,
    winRate: (n: number) => `${(100 * n).toFixed(1)}%`,
    winRateDiff: (n: number) => `${n > 0 ? '+' : ''}${(100 * n).toFixed(2)}%`,
    winRateAdj: (n: number) => `${(100 * n).toFixed(1)}%`,
    winsZScore: (n: number) => n.toFixed(2),
    rank1Rate: (n: number) => `${(100 * n).toFixed(2)}%`,
    rank1RateDiff: (n: number) => `${n > 0 ? '+' : ''}${(100 * n).toFixed(2)}%`,
    starRate: (n: number) => `${(100 * n).toFixed(1)}%`,
    starRateDiff: (n: number) => `${n > 0 ? '+' : ''}${(100 * n).toFixed(2)}%`,
    useRate: (n: number) => `${(100 * n).toFixed(2)}%`,
    pickRate: (n: number) => `${(100 * n).toFixed(2)}%`,
    pickRate_boss: (n: number) => `${Math.round(100 * n)}%`,
    duration: (n: number) => `${Math.floor(n / 60)}:${Math.floor(n % 60).toString().padStart(2, '0')}`,
    duration_boss: (n: number) => `${Math.floor(n / 60)}:${Math.floor(n % 60).toString().padStart(2, '0')}`,
    rank: (n: number) => n === null ? 'N/A' : n.toFixed(2),
    level: (n: number) => n.toFixed(2),
    rank1: (n: number) => formatSI(n, 1),
    wins: (n: number) => formatSI(n, 1),
    picks: (n: number) => formatSI(n, 1),
    users: (n: number) => formatSI(n, 1),
  },
  // TODO replace formatting functions above by d3-format
  d3formatters: {
    trophies: '',
    spTrophies: '',
    trophyChange: '+',
    winRate: '.1%',
    winRateDiff: '+.2%',
    winRateAdj: '.1%',
    winsZScore: '2f',
    rank1Rate: '.2%',
    rank1RateDiff: '+.2%',
    starRate: '.1%',
    starRateDiff: '+.2%',
    useRate: '.2%',
    pickRate: '.2%',
    pickRate_boss: '.2%',
    duration: '',
    duration_boss: '',
    rank: '2f',
    level: '2f',
    rank1: '.2s',
    wins: '.2s',
    picks: '.2s',
  },
  signs: {
    trophies: -1, // more is better -> sort rank desc
    spTrophies: -1,
    trophyChange: -1,
    winRate: -1,
    winRateDiff: -1,
    winRateAdj: -1,
    winsZScore: -1,
    rank1Rate: -1,
    rank1RateDiff: -1,
    starRate: -1,
    starRateDiff: -1,
    useRate: -1,
    pickRate: -1,
    pickRate_boss: -1,
    duration: +1, // asc
    duration_boss: +1,
    rank: +1,
    level: -1,
    rank1: -1,
    wins: -1,
  },
  propPriority: ['winRate', 'wins', 'rank1', 'duration', 'useRate', 'pickRate'],
}

/**
 * Get brawlers by event: {
 *  [eventId]: [
 *    brawler id,
 *    brawler name,
 *    brawler stats,
 *    sort prop
 *  ] }
 * sorted by the preferred prop according to propPriority
 */
export function getBest(meta: MapMetaMap|ModeMetaMap): { [key: string]: unknown[] } {
  return [...Object.entries(meta)]
    .reduce((top, [key, entry]) => ({
      ...top,
      [key]: [...Object.entries(entry.brawlers)]
        .map(([brawlerId, brawler]) => ({
          id: brawlerId,
          title: brawler.name,
          brawler: brawlerId,
          sampleSize: brawler.sampleSize,
          stats: brawler.stats,
          sortProp: <string>metaStatMaps.propPriority.find(prop => prop in brawler.stats),
        }))
        .sort((brawler1, brawler2) => brawler2.stats[brawler2.sortProp] - brawler1.stats[brawler1.sortProp])
    }), {})
}

export function getBestBrawlers(brawlers: BrawlerMetaStatistics[]): BrawlerMetaStatistics[] {
  const sampleSizeThreshold = 300
  brawlers = brawlers.filter(brawler => brawler.sampleSize >= sampleSizeThreshold)
  if (brawlers.length == 0) {
    return []
  }
  const sortProp = <string>metaStatMaps.propPriority.find(prop => prop in brawlers[0].stats)
  brawlers.sort((brawler1, brawler2) => brawler2.stats[sortProp] - brawler1.stats[sortProp])
  return brawlers
}

export interface MetaGridEntry {
  id: string
  title: string
  brawlers: string[] // ID
  link?: string
  icon?: string
  sampleSize: number
  stats: {
    [name: string]: string|number
  }
}

export interface MetaGridEntrySorted extends MetaGridEntry {
  sortProp: string
}

export interface MetaGridEntryTiered extends MetaGridEntry {
  tier: string
}

export function formatAsJsonLd(event: ActiveEvent) {
  const url = `/tier-list/mode/${slugify(event.mode)})}/${slugify(event.map)}`
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    'name': `${event.mode} - ${event.map}`,
    'startDate': event.start,
    'endDate': event.end,
    'eventAttendanceMode': 'https://schema.org/OnlineEventAttendanceMode',
    'eventStatus': 'https://schema.org/EventScheduled',
    'url': url,
    'image': [`${process.env.mediaUrl}/map/${event.id}.png`],
    'location': {
      '@type': 'VirtualLocation',
      'url': url,
    },
    'description': `${event.map} is a Brawl Stars ${event.mode} map.`,
  }
}

export function sloppyParseFloat(number: string) {
  return Math.floor(parseFloat(number) * 10000) / 10000
}

/**
 * Throw if a tag is invalid.
 * Make sure tag starts with a hash.
 */
export function validateTag(tag: string) {
  if (! /^#?[0289PYLQGRJCUV]{3,}$/.test(tag)) {
    throw new Error('Invalid tag ' + tag)
  }
  if (!tag.startsWith('#')) {
    return '#' + tag
  }
  return tag
}

// in clickhouse SQL (tag has to start with '#'):
/*
arraySum((c, i) -> (position('0289PYLQGRJCUV', c)-1)*pow(14, length(player_club_tag)-i-1-1), arraySlice(splitByString('', player_club_tag), 2), range(if(player_club_tag <> '', toUInt64(length(player_club_tag)-1), 0))) as player_club_id,
*/

/**
 * Encode tag string into 64bit unsigned integer string.
 */
export function tagToId(tag: string) {
  if (! /^#?[0289PYLQGRJCUV]{3,}$/.test(tag)) {
    throw new Error('Cannot encode tag ' + tag)
  }
  if (tag.startsWith('#')) {
    tag = tag.substring(1)
  }

  const result = tag.split('').reduce((sum, c) => sum*BigInt(14) + BigInt('0289PYLQGRJCUV'.indexOf(c)), BigInt(0))
  return result.toString()
}

/**
 * Decode 64bit unsigned integer string into tag string with hash.
 */
export function idToTag(idString: string) {
  let id = BigInt(idString)

  let tag = ''
  while (id != BigInt(0)) {
    const i = Number(id % BigInt(14))
    tag = '0289PYLQGRJCUV'[i] + tag
    id /= BigInt(14)
  }

  return '#' + tag
}

/*
  in SQL:
    date_add(from_days(ceil(to_days(date_sub(date_sub(timestamp, interval 8 hour), interval 1 day)) / 14) * 14 + 2), interval 8 hour)
  in clickhouse SQL:
    addHours(addDays(toStartOfInterval(subtractDays(subtractHours(timestamp, 8), 4), interval 336 hour, 'UTC'), 14+4), 8)
*/
/**
 * Round timestamp up to next trophy season interval.
 * @param timestamp
 */
export function getSeasonEnd(timestamp: Date) {
  const trophySeasonEnd = new Date(Date.parse('2020-07-13T08:00:00Z'))
  const diff = timestamp.getTime() - trophySeasonEnd.getTime()
  const seasonsSince = Math.ceil(diff/1000/60/60/24/7/2)
  trophySeasonEnd.setUTCDate(trophySeasonEnd.getUTCDate() + seasonsSince*7*2)
  return trophySeasonEnd
}

/*
 * Round timestamp down to start of day.
 * @param timestamp
 */
export function getCompetitionMapDayStart(timestamp: Date) {
  const dayStart = new Date(Date.parse('2020-07-13T09:30:00Z'))
  const diff = timestamp.getTime() - dayStart.getTime()
  const daysSince = Math.ceil(diff/1000/60/60/24)
  dayStart.setUTCDate(dayStart.getUTCDate() + daysSince - 1)
  return dayStart
}

export function getCurrentSeasonEnd() {
  return getSeasonEnd(new Date())
}

export function formatClickhouse(timestamp: Date) {
  return timestamp.toISOString()
    .slice(0, 19) // remove fractions and time zone
    .replace('T', ' ')
}

export function formatClickhouseDate(timestamp: Date) {
  return timestamp.toISOString()
    .slice(0, 10) // remove fractions, day and time zone
    .replace('T', ' ')
}

/** Parse API time format */
const parseTime = (time: string) => new Date(Date.parse(time))
export const parseApiTime = (time: string) => {
  return parseTime(`${time.slice(0, 4)}-${time.slice(4, 6)}-${time.slice(6, 8)}T${time.slice(9, 11)}:${time.slice(11, 13)}:${time.slice(13)}`)
}

export const measurementMap = {
  winRate: 'battle_victory',
  winRateDiff: 'battle_victory',
  winRateAdj: 'battle_victory_adj',
  wins: 'wins',
  useRate: 'picks_weighted',
  pickRate: 'picks',
  starRate: 'battle_starplayer',
  starRateDiff: 'battle_starplayer',
  rank1Rate: 'battle_rank1',
  rank1RateDiff: 'battle_rank1',
  duration: 'battle_duration',
  picks: 'picks',
  users: 'users',
}

export const measurementOfTotal = {
  winRate: false,
  winRateDiff: false,
  winRateAdj: false,
  wins: false,
  winsZScore: false,
  useRate: true,
  pickRate: true,
  starRate: false,
  starRateDiff: false,
  rank1Rate: false,
  rank1RateDiff: false,
  duration: false,
  picks: false,
  users: false,
}

export function compare(entry1: MetaGridEntry, entry2: MetaGridEntry, stat: keyof typeof metaStatMaps.signs): number {
  const sign = metaStatMaps.signs[stat]
  const e1stat = Number.parseFloat((entry1.stats[stat] || 0).toString())
  const e2stat = Number.parseFloat((entry2.stats[stat] || 0).toString())
  return sign * (e1stat - e2stat)
}

export function compare1(stat: keyof typeof metaStatMaps.signs) {
  return (entry1: MetaGridEntry, entry2: MetaGridEntry) => compare(entry1, entry2, stat)
}

interface DiffRow {
  brawler_id: string
  brawler_name: string
  picks: number
  battle_victory: number
  battle_starplayer: number
  battle_rank1: number
  brawler_starpower_name?: string
  brawler_starpower_id?: number
  brawler_gadget_name?: string
  brawler_gadget_id?: number
}

// calculate diff stats between brawlers with & without starpower/gadget
export function calculateDiffs(rows: DiffRow[], accessoryType: string, accessoryNameKey: 'brawler_starpower_name'|'brawler_gadget_name', accessoryIdKey: 'brawler_starpower_id'|'brawler_gadget_id', includeZScore: boolean) {
  return rows
    // map over gadgets/star powers
    .filter(s => s[accessoryNameKey] !== '')
    // in case of duplicate IDs, use the first (most picks)
    .filter((e1, index, all) => all.findIndex(e2 => e1[accessoryIdKey] == e2[accessoryIdKey]) == index)
    .map((accessory) => {
      const brawlerWithout = rows.find(b => b[accessoryNameKey] == '' && b.brawler_id == accessory.brawler_id)

      if (brawlerWithout == undefined) {
        return undefined
      }

      // calculate z-score, testing with star power wins against without star power wins
      const zX = accessory.battle_victory * accessory.picks
      const zN = accessory.picks
      const zP = brawlerWithout.battle_victory
      const zCondition = zN >= 50 && zN * zP > 5 && zN * (1 - zP) > 5
      if (includeZScore && !zCondition) {
        return undefined
      }

      const z = (zX - zN * zP) / Math.sqrt(zN * zP * (1 - zP))

      const sampleSize = Math.min(accessory.picks, brawlerWithout.picks)
      const stats = {
        ...(includeZScore ? { winsZScore: z } : {}),
        ...(accessory.battle_victory != undefined ? {
          winRateDiff: accessory.battle_victory - brawlerWithout.battle_victory,
        } : {}),
        ...(accessory.battle_starplayer != undefined ? {
          starRateDiff: accessory.battle_starplayer - brawlerWithout.battle_starplayer,
        } : {}),
        ...(accessory.battle_rank1 != undefined ? {
          rank1RateDiff: accessory.battle_rank1 - brawlerWithout.battle_rank1,
        } : {}),
      }

      return <MetaGridEntry>{
        id: `${accessory.brawler_id}-${accessory[accessoryNameKey]}`,
        title: capitalizeWords((accessory[accessoryNameKey] || '').toLowerCase()),
        brawlers: [accessory.brawler_name],
        sampleSize,
        stats,
        icon: `/${accessoryType}/${accessory[accessoryIdKey]}`,
        link: `/tier-list/brawler/${brawlerId({ name: accessory.brawler_name })}`,
      }
    })
    .filter(e => e != undefined) as MetaGridEntry[]
}

export function encodeQuery(data: { [key: string]: number|string }) {
   const ret = [] as string[]
   for (let d in data) {
     ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]))
   }
   return ret.join('&')
}

/*
 * @returns true if a mode is a weekend mode
 */
export function isSpecialEvent(mode: string) {
  return ['roboRumble', 'bigGame', 'superCity'].includes(mode)
}

/*
 * min-max scale stat into the 5 tiers and put nulls into '?' tier
 */
export function scaleEntriesIntoTiers(entries: MetaGridEntry[], stat: keyof typeof entries[0]['stats']): MetaGridEntryTiered[] {
  const getStat = (e: MetaGridEntry) => typeof e.stats[stat] != 'string' ? e.stats[stat] as number|undefined :  Number.parseFloat(e.stats[stat] as string)
  const sortedEntries = entries
    .slice()
    .sort(compare1(stat as any))

  const stats = sortedEntries
    .map(getStat)
    .reverse()
  const sign = metaStatMaps.signs[stat]
  const min = stats[sign == -1 ? 1 : stats.length - 2]! // skip highest (outlier)
  const max = stats[sign == -1 ? stats.length - 2 : 1]! // skip lowest
  const clamp = (v: number) => Math.max(min, Math.min(max, v))
  const minMax = (v: number) => (clamp(v) - min) / (max - min)
  const tiers = ['S', 'A', 'B', 'C', 'D']

  return sortedEntries.map(entry => {
    let tier = '?'
    if (getStat(entry) != undefined) {
      const index = (tiers.length - 1) - Math.floor(minMax(getStat(entry)!) * (tiers.length - 1))
      tier = tiers[sign == -1 ? index : tiers.length - index - 1]
    }

    return {
      ...entry,
      tier,
    }
  })
}
