import dl from 'dl-vampire'
import filenamify from 'filenamify'
import _ from 'lodash'
import symbols from 'log-symbols'
import { Song } from './define'

// import debugFactory from 'debug'
// const debug = debugFactory('yun:index')

/**
 * page type
 */

import AlbumAdapter from './adapter/album'
import BaseAdapter from './adapter/base'
import DjradioAdapter, { ProgramSong } from './adapter/djradio'
import PlaylistAdapter from './adapter/playlist'

interface Type {
  type: string
  typeText: string
  adapter: typeof BaseAdapter
}

export const types: Type[] = [
  {
    type: 'playlist',
    typeText: '列表',
    adapter: PlaylistAdapter,
  },
  {
    type: 'album',
    typeText: '专辑',
    adapter: AlbumAdapter,
  },
  {
    type: 'djradio',
    typeText: '电台',
    adapter: DjradioAdapter,
  },
]

/**
 * 下载一首歌曲
 */

interface DownloadSongOptions {
  url: string
  file: string
  song: Song
  totalLength: number
  retryTimeout: number
  retryTimes: number
  skipExists: boolean
}

export async function downloadSong(options: DownloadSongOptions & { progress?: boolean }) {
  const { progress } = options

  let hasProgressBar = false
  try {
    require('@magicdawn/ascii-progress')
    hasProgressBar = true
  } catch (e) {
    // noop
  }

  if (progress && hasProgressBar) {
    return downloadSongWithProgress(options)
  } else {
    return downloadSongPlain(options)
  }
}

export async function downloadSongWithProgress(options: DownloadSongOptions) {
  const ProgressBar = require('@magicdawn/ascii-progress')
  const { url, file, song, totalLength, retryTimeout, retryTimes, skipExists } = options

  let bar: any
  const initBar = () => {
    bar = new ProgressBar({
      schema: `:symbol ${song.index}/${totalLength} [:bar] :postText`,
      total: 100,
      current: 0,
      width: 10,
      filled: '=',
      blank: ' ',
    })
  }

  // 成功
  const success = () => {
    bar.update(1, {
      symbol: symbols.success,
      postText: `${skip ? '下载跳过' : '下载成功'} ${file}`,
    })
  }

  // 失败
  const fail = () => {
    bar.update(0, { symbol: symbols.error, postText: `下载失败 ${file}` })
    bar.terminate()
  }

  // 下载中
  const downloading = (percent: number) =>
    bar.update(percent, { symbol: symbols.info, postText: `  下载中 ${file}` })

  // 重试
  const retry = (i: number) => {
    bar.tick(0, { symbol: symbols.warning, postText: ` ${i + 1}次失败 ${file}` })
  }

  // init state
  initBar()
  downloading(0)

  let skip = false
  try {
    ;({ skip } = await dl({
      url,
      file,
      skipExists,
      onprogress(p) {
        const { percent } = p
        if (percent === 1) {
          success()
        } else {
          downloading(percent)
        }
      },
      retry: {
        timeout: retryTimeout,
        times: retryTimes,
        onerror: function (e, i) {
          retry(i)
        },
      },
    }))
  } catch (e) {
    fail()
    return
  }

  success()
}

export async function downloadSongPlain(options: DownloadSongOptions) {
  const { url, file, song, totalLength, retryTimeout, retryTimes, skipExists } = options

  let skip = false

  try {
    ;({ skip } = await dl({
      url,
      file,
      skipExists,
      retry: {
        timeout: retryTimeout,
        times: retryTimes,
        onerror: function (e, i) {
          console.log(`${symbols.warning} ${song.index}/${totalLength}  ${i + 1}次失败 ${file}`)
        },
      },
    }))
  } catch (e) {
    console.log(`${symbols.error} ${song.index}/${totalLength} 下载失败 ${file}`)
    console.error(e.stack || e)
    return
  }

  console.log(
    `${symbols.success} ${song.index}/${totalLength} ${skip ? '下载跳过' : '下载成功'} ${file}`
  )
}

/**
 * check page type
 */

export function getType(url: string): Type {
  const item = _.find(types, (item) => url.indexOf(item.type) > -1)
  if (item) return item

  // #/radio & #/djradio 是一样的
  if (/#\/radio/.exec(url)) {
    return _.find(types, (item) => item.type === 'djradio')!
  }

  const msg = 'unsupported type'
  throw new Error(msg)
}

/**
 * get a adapter via `url`
 *
 * an adapter should have {
 *   getTitle($) => string
 *   getDetail($, url, quality) => [song, ...]
 * }
 */

export function getAdapter($: cheerio.Root, url: string) {
  const { adapter } = getType(url)
  return new adapter({ $, url })
}

/**
 * 获取歌曲文件表示
 */
export function getFileName({
  format,
  song,
  url,
  // 专辑 or playlist 名称
  name,
}: {
  format: string
  song: Song
  url: string
  name: string
}) {
  const typesItem = getType(url)

  // 从 type 中取值, 先替换 `长的`
  ;['typeText', 'type'].forEach((t) => {
    const val = filenamify(String(typesItem[t]))
    format = format.replace(new RegExp(':' + t, 'ig'), val)
  })

  // 从 `song` 中取值
  ;['songName', 'singer', 'rawIndex', 'index', 'ext'].forEach((token) => {
    // rawIndex 为 number, sanitize(number) error
    const val = filenamify(String(song[token]))
    format = format.replace(new RegExp(':' + token, 'ig'), val)
  })

  // name
  format = format.replace(new RegExp(':name', 'ig'), filenamify(name))

  // djradio only
  if (typesItem.type === 'djradio') {
    const { programDate, programOrder } = song as ProgramSong
    if (programDate) {
      format = format.replace(new RegExp(':programDate'), filenamify(programDate))
    }
    if (programOrder) {
      format = format.replace(new RegExp(':programOrder'), filenamify(programOrder.toString()))
    }
  }

  return format
}
