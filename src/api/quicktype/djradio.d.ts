// Generated by https://quicktype.io

export interface DjradioProgram {
  mainSong: MainSong
  songs: null
  dj: Dj
  blurCoverUrl: string
  radio: Radio
  duration: number
  buyed: boolean
  programDesc: null
  h5Links: null
  canReward: boolean
  auditStatus: number
  videoInfo: null
  score: number
  liveInfo: null
  alg: null
  disPlayStatus: null
  description: string
  trackCount: number
  coverUrl: string
  serialNum: number
  createTime: number
  titbitImages: null
  isPublish: boolean
  bdAuditStatus: number
  programFeeType: number
  titbits: null
  mainTrackId: number
  listenerCount: number
  subscribedCount: number
  reward: boolean
  smallLanguageAuditStatus: number
  pubStatus: number
  feeScope: number
  commentThreadId: string
  channels: any[]
  name: string
  id: number
  shareCount: number
  subscribed: boolean
  likedCount: number
  commentCount: number
}

export interface Dj {
  defaultAvatar: boolean
  province: number
  authStatus: number
  followed: boolean
  avatarUrl: string
  accountStatus: number
  gender: number
  city: number
  birthday: number
  userId: number
  userType: number
  nickname: string
  signature: string
  description: string
  detailDescription: string
  avatarImgId: number
  backgroundImgId: number
  backgroundUrl: string
  authority: number
  mutual: boolean
  expertTags: null
  experts: null
  djStatus: number
  vipType: number
  remarkName: null
  avatarImgIdStr: string
  backgroundImgIdStr: string
  brand: string
}

export interface MainSong {
  name: string
  id: number
  position: number
  alias: any[]
  status: number
  fee: number
  copyrightId: number
  disc: string
  no: number
  artists: Artist[]
  album: Album
  starred: boolean
  popularity: number
  score: number
  starredNum: number
  duration: number
  playedNum: number
  dayPlays: number
  hearTime: number
  ringtone: null
  crbt: null
  audition: null
  copyFrom: string
  commentThreadId: string
  rtUrl: null
  ftype: number
  rtUrls: any[]
  copyright: number
  transName: null
  sign: null
  mark: number
  noCopyrightRcmd: null
  rtype: number
  rurl: null
  mvid: number
  bMusic: Music
  mp3Url: null
  hMusic: null
  mMusic: null
  lMusic: Music
}

export interface Album {
  name: string
  id: number
  type: null
  size: number
  picId: number
  blurPicUrl: string
  companyId: number
  pic: number
  picUrl: string
  publishTime: number
  description: string
  tags: string
  company: null
  briefDesc: string
  artist: Artist
  songs: any[]
  alias: any[]
  status: number
  copyrightId: number
  commentThreadId: string
  artists: Artist[]
  subType: null
  transName: null
  mark: number
  picId_str: string
}

export interface Artist {
  name: string
  id: number
  picId: number
  img1v1Id: number
  briefDesc: string
  picUrl: string
  img1v1Url: string
  albumSize: number
  alias: any[]
  trans: string
  musicSize: number
  topicPerson: number
}

export interface Music {
  name: string
  id: number
  size: number
  extension: string
  sr: number
  dfsId: number
  bitrate: number
  playTime: number
  volumeDelta: number
}

export interface Radio {
  dj: null
  category: string
  buyed: boolean
  price: number
  originalPrice: number
  discountPrice: null
  purchaseCount: number
  lastProgramName: null
  videos: null
  finished: boolean
  underShelf: boolean
  liveInfo: null
  playCount: number
  privacy: boolean
  icon: null
  subCount: number
  radioFeeType: number
  categoryId: number
  createTime: number
  lastProgramCreateTime: number
  lastProgramId: number
  desc: string
  programCount: number
  picId: number
  feeScope: number
  picUrl: string
  name: string
  id: number
}
