// 把歌手封装成一个类
export default class Singer {
  constructor({id, name, avatar, aliaName}) {
    this.id = id
    this.name = name
    this.avatar = avatar
    this.aliaName = aliaName
  }
}
