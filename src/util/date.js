import moment from "moment";
moment.locale('zh-cn')
export const calcDate = (date1, date2) => {
  var date3 = date2 - date1

  var days = Math.floor(date3 / (24 * 3600 * 1000))

  var leave1 = date3 % (24 * 3600 * 1000) // 计算天数后剩余的毫秒数
  var hours = Math.floor(leave1 / (3600 * 1000))

  var leave2 = leave1 % (3600 * 1000) // 计算小时数后剩余的毫秒数
  var minutes = Math.floor(leave2 / (60 * 1000))

  var leave3 = leave2 % (60 * 1000) // 计算分钟数后剩余的毫秒数
  var seconds = Math.round(date3 / 1000)
  return {
    leave1,
    leave2,
    leave3,
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds
  }
}

/**
 * 日期格式化
 */
export function dateFormat(date) {
  let format = 'yyyy-MM-dd hh:mm:ss';
  if (date != 'Invalid Date') {
    var o = {
      "M+": date.getMonth() + 1, //month
      "d+": date.getDate(), //day
      "h+": date.getHours(), //hour
      "m+": date.getMinutes(), //minute
      "s+": date.getSeconds(), //second
      "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
      "S": date.getMilliseconds() //millisecond
    }
    if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
      (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
      if (new RegExp("(" + k + ")").test(format))
        format = format.replace(RegExp.$1,
          RegExp.$1.length == 1 ? o[k] :
            ("00" + o[k]).substr(("" + o[k]).length));
    return format;
  }
  return '';

}

export function showHelloTime(time){
  let time_format = '';
  if (time == undefined) {
      time = new Date();
  }
  let hr = time.getHours();
  if ((hr >= 0) && (hr <= 4))
      time_format = "深夜了，注意身体，";
  if ((hr >= 4) && (hr < 7))
      time_format = "清晨好， ";
  if ((hr >= 7) && (hr < 12))
      time_format = "早安，";
  if ((hr >= 12) && (hr <= 13))
      time_format = "午饭时间到了，";
  if ((hr >= 13) && (hr <= 17))
      time_format = "下午好，";
  if ((hr >= 17) && (hr <= 18))
      time_format = "进入傍晚了，";
  if ((hr >= 18) && (hr <= 20))
      time_format = "吃过晚饭了吗，";
  if ((hr >= 20) && (hr <= 24))
      time_format = "在加班吗？辛苦了，";
  return time_format
}

/**
 * 格式化相对时间
 * @returns {string}
 * @param value
 * @param now
 */
 export const relativelyTime = (value, now) => {
  if (!now) {
      now = moment();
  }
  const diff = moment(now).diff(moment(value), 'hours');
  if (diff <= 1) {
      return moment(value).fromNow();
  }
  const today = moment(now).get('date');
  const current = moment(value).get('date');
  if (current < today - 1) {
      // return moment(value).format('M月D日 H:mm');
  }
  let detailTime = moment(value).format('H:mm');
  const currentDate = moment(value).format('YYYY-MM-DD');
  const currentMonday = moment().weekday(0).format('YYYY-MM-DD');
  const currentSunday = moment().weekday(6).format('YYYY-MM-DD');
  let weekDate = '';
  if (currentDate < currentMonday) {
      weekDate = '[上周]dd ' + detailTime;
  }else if (currentDate > currentSunday) {
      weekDate = '[下周]dd ' + detailTime;
  }else{
      weekDate = '[周]dd ' + detailTime;
  }
  return moment(value).calendar(null, {
      sameDay: '[今天 ]' + moment(value).format('H:mm'),
      nextDay: '[明天 ]' + detailTime,
      nextWeek: weekDate,
      lastDay: '[昨天 ]' + detailTime,
      lastWeek: weekDate,
      sameElse: 'M月D日 H:mm'
  });
};
/**
 *
 * @param value 日期
 * @param showDetailTime 是否显示具体时间
 * @returns {string}
 */
 export const relativelyTaskTime = (value, showDetailTime = false) => {
  let detailTime = moment(value).format('H:mm');
  if (!showDetailTime) {
    detailTime = '';
  }
  const currentDate = moment(value).format('YYYY-MM-DD');
  const currentMonday = moment().weekday(0).format('YYYY-MM-DD');
  const currentSunday = moment().weekday(6).format('YYYY-MM-DD');
  let weekDate = '';
  if (currentDate < currentMonday) {
      weekDate = '[上周]dd ' + detailTime;
  }else if (currentDate > currentSunday) {
      weekDate = '[下周]dd ' + detailTime;
  }else{
      weekDate = '[周]dd ' + detailTime;
  }
  return moment(value).calendar(null, {
      sameDay: '[今天 ]' + moment(value).format('H:mm'),
      nextDay: '[明天 ]' + detailTime,
      nextWeek: weekDate,
      lastDay: '[昨天 ]' + detailTime,
      lastWeek: weekDate,
      sameElse: 'M月D日 H:mm'
  });
};
export const formatTaskTime = (begin, end) => {
  //如果不是今天则不显示具体时间
  if (!end && begin) {
      return relativelyTaskTime(begin) + ' 开始';
  }
  if (!begin) {
      return relativelyTaskTime(end) + ' 截止';
  }
  return relativelyTaskTime(begin) + ' - ' + relativelyTaskTime(end);
};
