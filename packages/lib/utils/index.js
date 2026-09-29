import { STATIC_SERVER_HOST } from "@/config/index.js"
// 获取search的参数
export function getSearchParam(name) {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  let r = window.location.search.substr(1).match(reg);
  if (r != null) return decodeURI(r[2]);
  return null;
}

//获取hash的值
export function getURLHash(name) {
  try {
    const hash = window.location.hash;
    if (!hash || !hash.includes('?')) {
      return null;
    }
    const hashQuery = hash.split('?')[1];
    const hashParams = new URLSearchParams(hashQuery);
    return hashParams.get(name);
  } catch (error) {
    console.error('Error parsing token from URL:', error);
    return null;
  }
}

//深拷贝
export function deepCopy(list) {
  return JSON.parse(JSON.stringify(list))
}

//保留n位小数
export function handleNum(num, precision = 1, method = "round") {
  const powers = Math.pow(10, precision)
  return /\./g.test(num) ? Math[method](num * powers) / powers : num
}

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        time = parseInt(time)
      } else {
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

function fillTimeZero(num) {
  return num >= 10 ? num : "0" + num;
}

export function parseDuration(seconds, showHour) {
  if (typeof seconds !== 'number') {
    return ""
  }
  let hour = parseInt(seconds / 3600);
  seconds = Math.max(seconds - 3600 * hour, 0);
  let minutes = parseInt(seconds / 60);
  seconds = Math.max(parseInt(seconds - 60 * minutes), 0);
  return `${hour > 0 ? fillTimeZero(hour) + ':' : showHour ? '00:' : ''}${fillTimeZero(minutes)}:${fillTimeZero(seconds)}`
}

export function initMedia() {
  if (navigator.mediaDevices === undefined) {
    navigator.mediaDevices = {};
  }
  if (navigator.mediaDevices.getUserMedia === undefined) {
    navigator.mediaDevices.getUserMedia = function (constraints) {
      var getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia;
      if (!getUserMedia) {
        return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
      }
      return new Promise(function (resolve, reject) {
        getUserMedia.call(navigator, constraints, resolve, reject);
      });
    }
  }
}

function checkMedia(options, successCb, failCb) {
  navigator.mediaDevices.getUserMedia(options)
    .then(function (stream) {
      successCb && successCb(stream);
    })
    .catch(function (err) {
      failCb && failCb(err)
    });
}
export function checkCamera(successCb, failCb, isLockScreen, checkType) {
  if (isLockScreen && /Mac/.test(navigator.userAgent)) {
    macApi.requestAccessCamera(checkType)
    return false
  }
  // checkMedia({ audio: true, video: true }, successCb, failCb)
  checkMedia({ audio: false, video: true }, successCb, failCb)
}
export function checkMicrophone(successCb, failCb) {
  checkMedia({ audio: true, video: false }, successCb, failCb)
}

export function loadScript (path, callBack) {
  const url = STATIC_SERVER_HOST + '/' + path
  const script = document.createElement('script')
  script.src = url
  script.onload = script.onreadystatechange = function() {
    if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
      callBack && callBack();
      this.onload = this.onreadystatechange = null;
    }
  }
  document.head.appendChild(script)
  return script
}

export function getUniqueValue() {
  return new Date().getTime()*Math.random()
}

export function handleTextareaContent(str) {
  if (!str) {
    return ""
  }
  return str.replace(/\r\n|\n|\t/g, '<br>').replace(/\s/g, ' ');
}

export function changeInputWidth(el, value) {
  if (value) {
    const tempDom = document.createElement("div")
    tempDom.innerText = value
    tempDom.style.display = "inline-block"
    tempDom.style.height = "0"
    document.body.append(tempDom)
    el.style.width = Math.max(Math.min(tempDom.clientWidth, 300), 84) + 'px'
    tempDom.remove()
  } else {
    el.style.width ='84px'
  }
}

export function rafThrottle(fn) {
  let locked = false;
  return function(...args) {
    if (locked) return;
    locked = true;
    window.requestAnimationFrame(_ => {
      fn.apply(this, args);
      locked = false;
    });
  };
}

export function textCount(content) {
  if (!content) {
    return 0
  }
  let str = content.trim().replace(/\r\n|\n|\t/g, ' ')
  const cnRegx = /[\u4E00-\u9FA5\uF900-\uFA2D。，、；：？！…—·ˉ¨‘’“”～々‖∶＂＇｀｜〃〔〕〈〉《》「」『』．〖〗【】（）［］｛｝]/g
  const cnwords = str.match(cnRegx) || []
  const enwordsStr = str.replace(cnRegx, '').trim()
  const enwords = enwordsStr.length > 0 ? enwordsStr.split(/\s+/g) : [];
  console.log(cnwords, enwords)
  return enwords.length + cnwords.length
}

export function ToCDB(str) { 
  let tmp = ''
  for (let i = 0; str && i < str.length; i++) {
    if (str.charCodeAt(i) === 12288) {
      tmp += String.fromCharCode(str.charCodeAt(i) - 12256)
      continue
    }
    if (str.charCodeAt(i) > 65280 && str.charCodeAt(i) < 65375) {
      tmp += String.fromCharCode(str.charCodeAt(i) - 65248)
    } else {
      tmp += String.fromCharCode(str.charCodeAt(i))
    }
  }
  return tmp 
}

export function showExitBtnOfMac(isShow) {
  if (/Mac/.test(navigator.userAgent)) {
    macApi.showExitBtn(isShow)
  }
}

// 将作弊的弹窗dom给隐藏掉
export function hideCheatingDialog() {
  // 插件的淘宝二维码图片
  var imgs = document.getElementsByTagName('img');
  for (var i = 0; i < imgs.length; i++) {
    var img = imgs[i];
    if (img.src.indexOf('https://z4a.net') > -1) {
        img.parentNode.style.display = 'none';
    }
  }
  // 拿到id和类名包含layui的dom remove掉
  var idDoms = document.querySelectorAll('[id*="layui-"]');
  idDoms.forEach(item => {
    item.remove();
  })
  var classDoms = document.querySelectorAll('[class*="layui-"]');
  classDoms.forEach(item => {
    item.remove();
  })
  var parentIdList = ['key_answer', 'answer_key', 'get_answer', 'hide_show']
  // 将id为key_answer的父元给remove
  parentIdList.forEach(item => {
    var dom = document.getElementById(item);
    if (dom) {
      dom.parentNode.remove();
    }
  });
}
export function getUrlParam(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
  var r = window.location.search.substring(1).match(reg)
  if (r != null) return decodeURI(r[2])
  return null
}

// 判断平台
export function getPlatform () {
  let u = navigator.userAgent
  let versions = {
    /* IE内核 */
    trident: u.indexOf('Trident') > -1,
    /* opera内核 */
    presto: u.indexOf('Presto') > -1,
    // 苹果、谷歌内核
    webKit: u.indexOf('AppleWebKit') > -1,
    // 火狐内核
    gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1,
    // 是否为移动终端
    mobile: !!u.match(/AppleWebKit.*Mobile.*/),
    // ios终端
    ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
    // android终端或者uc浏览器
    android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
    // 是否为iPhone或者QQHD浏览器
    iPhone: u.indexOf('iPhone') > -1,
    // 是否iPad
    iPad: u.indexOf('iPad') > -1,
    // 是否web应该程序，没有头部与底部
    webApp: u.indexOf('Safari') === -1,
    isInApp: u.indexOf('umoocApp') > -1,
    wechatApplets: window.location.href.indexOf("wechatApplets=true") > -1,
    isWelink: (u.toLowerCase().indexOf('huawei') > -1 && u.indexOf('cloudlink') > -1) || u.indexOf('WeCodeIDE') > -1
  }
  let heightList = [ 780, 812, 844, 896, 926 ]
  let isIphonex = versions.ios && heightList.includes(document.documentElement.clientHeight)
  return {
    // language: (navigator.browserLanguage || navigator.language).toLowerCase(),
    terminal: versions,
    wechatApplets:versions.wechatApplets,
    isWelink:versions.isWelink,
    isInApp:versions.isInApp,
    isMobile: (versions.mobile || versions.isInApp) && !versions.iPad,
    isH5: versions.mobile && !versions.isInApp,
    isIOS: versions.ios,
    isAndroid: versions.android,
    isIphoneX: isIphonex,
    platform: (versions.mobile || versions.isInApp) ? versions.ios ? 'ios' : 'android' : 'web'
  }
}