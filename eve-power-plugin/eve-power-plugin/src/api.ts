/*
 * @Description:
 * @Version: 0.1
 * @Author: EveChee
 * @Date: 2020-07-27 16:37:40
 * @LastEditTime: 2020-07-29 10:47:54
 */
import HttpService, { AxiosOptions } from '@stl/request'
import md5 from 'blueimp-md5'
export function login(http: HttpService, data: LoginParams, opts?: AxiosOptions) {
    const sures = ['B600100']
    const err = ['B600101']
    return http.post(
        '/sso/cas/login',
        Object.assign({}, data, { pwd: md5(`${data?.username}-${data?.pwd}`) }),
        Object.assign({}, opts, { codes: { sures, err } }),
    )
}
export function logout(http: HttpService, data: LogoutParams, opts?: AxiosOptions) {
    const sures = ['B600200']
    const err = ['B600201']
    return http.post(
        '/sso/cas/logout',
        data,
        Object.assign({}, opts, {
            codes: { sures, err },
            headers: {
                token: data.token,
            },
        }),
    )
}
export function getPower(http: HttpService, token: string, params: GetParams) {
    const sures = ['B600500']
    const err = ['00009']
    return http.get('/sso/user/getPermissionList', {
        params,
        headers: {
            token,
        },
        codes: { sures, err },
    })
}
export function getAdminInfo(http: HttpService, token: string, params: GetParams) {
    const sures = ['B600400']
    const err = ['B600401','B600402']
    return http.get('/sso/user/getCurrentUser', {
        params,
        headers: {
            token,
        },
        codes: { sures, err },
    })
}

export type LoginParams = {
    pwd: string
    username: string
}
type LogoutParams = {
    token: string
}
interface GetParams{
    projectId: number
}
