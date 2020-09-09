export type Permissions = {
  id: number
  username: string
  realName: string
  avatar: string
  phone: string
  email: string
  userStatus: number
  menuList: Menu[]
}

export type Menu = {
  id: number
  parentId: number
  menuIdx: number
  menuName: string
  menuIcon: string
  permission: string
  type: number
  routePath: string
  componentName: string
  componentPath: string
  remark: any
  outside: number
  show: number
  cached: number
  createTime: string
  children: Menu[]
  authorized: boolean
}
