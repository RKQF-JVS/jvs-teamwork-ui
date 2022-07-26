// 配置编译环境和线上环境之间的切换

const env = process.env
let baseUrl = ''
// 图表库为jvs和pig2套地址
let iconfontVersion = ['567566_qo5lxgtishg', '667895_v7uduh4zui', '2052824_mnq40bpm1w', '2514494_kvtmaqepi8f','2941921_10yefw4ghqf']
// '2052824_mnq40bpm1w' 老的图标选择
// '2514494_kvtmaqepi8f' 基础框架图标库
let iconfontUrl = `//at.alicdn.com/t/font_$key.css`
let codeUrl = `${window.location.origin}/code`
let actUrl = `${window.location.origin}/act/modeler.html?modelId=`
if (env.NODE_ENV == 'development') {

} else if (env.NODE_ENV == 'production') {

} else if (env.NODE_ENV == 'test') {

}
export {
  baseUrl,
  actUrl,
  iconfontUrl,
  iconfontVersion,
  codeUrl,
  env
}
