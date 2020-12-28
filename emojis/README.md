<!--
 * @Author: EveChee
 * @Date: 2020-12-24 13:53:55
 * @LastEditors: EveChee
 * @LastEditTime: 2020-12-28 16:13:11
 * @Description: file content
-->

# Emojis 表情处理插件
(兼容fx110老表情以及汇聊表情)
## 内置导出 Emojis 类

实例化参数(\*为必传) 两个参数

| 参数 |     类型      |   说明   |  默认值   |
| :--: | :-----------: | :------: | :-------: |
| opts | EmojisOptions | 基础路径 | undefined |

下面是 EmojisOptions 的说明 如果传了 options 则下方\*必传

|   参数   |  类型  |      说明      |            默认值             |
| :------: | :----: | :------------: | :---------------------------: |
| BASE_URL | string | 请求汇聊的域名 | http://testfxchatapi.wbp5.com |

```js
import Emojis from '@stl/emojis'
const emojis = new Emojis()
// 如果有基础路径也可以
const emojis = new Emojis({ BASE_URL: 'BASE_URL' })
```

@Public Method: init

```
初始化，并向接口获取表情映射
实例化后手动调用，若不调用则只有原始的fx110表情
```

@Public Method：replaceEmojisIntoImgs

```
参数说明:
@Param content:string 原文
@Return string
```
