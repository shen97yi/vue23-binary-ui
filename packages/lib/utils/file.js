import { RESOURCE_SERVER_HOST, API_HOST, IS_SELF_UPLOAD,UPLOAD_SERVER_PROTOCOL } from '../config'
import cookies from '@/utils/cookie.js'
import { t } from '@/locale/index.js'
import IconTxt from '@/assets/icon-fujianleixingtxt.svg'
import IconPdf from '@/assets/icon-fujianleixingpdf.svg'
import IconWord from '@/assets/icon-fujianleixingword.svg'
import IconPpt from '@/assets/icon-fujianleixingppt.svg'
import IconExcel from '@/assets/icon-fujianleixingexcel.svg'
import IconImage from '@/assets/icon-fujianleixingtupian.svg'
import IconVideo from '@/assets/icon-fujianleixingshipin.svg'
import IconAudio from '@/assets/icon-fujianleixingyinpin.svg'
import IconZip from '@/assets/icon-fujianleixingyasuobao.svg'
import IconOther from '@/assets/icon-fujianleixingqita1.svg'
// 根据文件路径返回对应的图标组件
export function getFileSvg(path) {
  if (!path) return IconOther
  const ext = path.substring(path.lastIndexOf('.') + 1).toLowerCase()
  const type = formatFileType(ext)

  if (type === 'document') {
    switch (ext) {
      case 'txt':  return IconTxt
      case 'pdf':  return IconPdf
      case 'doc':
      case 'docx': return IconWord
      case 'ppt':
      case 'pptx': return IconPpt
      case 'xls':
      case 'xlsx': return IconExcel
      default:     return IconOther
    }
  }
  if (type === 'image') return IconImage
  if (type === 'video') return IconVideo
  if (type === 'audio') return IconAudio
  if (type === 'zip')   return IconZip
  return IconOther
}



// RESOURCE_SERVER_HOST重新赋值
const rescourceHost = () => {
  return (cookies.get("RESOURCE_SERVER_HOST") || RESOURCE_SERVER_HOST).replace(/\/$/g, '')
}

// 根据文件的扩展名或文件名 给出文件的类型
export function formatFileType(suffix) {
  if (!suffix) {
    return 'other'
  }
  if (suffix.split('?')[0]) {
    suffix = suffix.split('?')[0]
  }
  suffix = suffix.substring(suffix.lastIndexOf('.') + 1).toLowerCase()
  var fileTypes = {
    video: {
      format: 'mp4,avi,wmv,rm,rmvb,mpeg,mpg,mkv,mov,flv',
      type: 'video'
    },
    audio: {
      format: 'mp3,wav,wma,m4a',
      type: 'audio'
    },
    image: {
      format: 'png,jpg,gif,jpeg,bmp',
      type: 'image'
    },
    document: {
      format: 'doc,docx,xls,xlsx,ppt,pptx,pdf,txt',
      type: 'document'
    },
    zip: {
      format: 'zip,rar,7z',
      type: 'zip'
    },
    flash: {
      format: 'swf',
      type: 'flash'
    },
    srt: {
      format: 'srt',
      type: 'srt'
    }
  }
  let type = 'other'
  let fileType
  for (fileType in fileTypes) {
    var limit = fileTypes[fileType].format
    if (limit.indexOf(suffix) >= 0) {
      type = fileTypes[fileType].type
      return type
    }
  }
  return type
}
// 根据给定的大小B转换成MB等单位
export function formatSize(input) {
  if (input === undefined || input === '' || /\D/.test(input)) {
    return ''
  }
  if (input < 1024) {
    input = input + 'B'
  } else if (input < 1024 * 1024) {
    input = (input / 1024).toFixed(1) + 'KB'
  } else if (input < 1024 * 1024 * 1024) {
    input = (input / (1024 * 1024)).toFixed(1) + 'MB'
  } else {
    input = (input / (1024 * 1024 * 1024)).toFixed(1) + 'G'
  }
  return input
}
// 将MB等单位转成B
export function conversionFileSize(input) {
  if (input === undefined || input === '' || !input.replace(/\D/g, '')) {
    return ''
  }
  var size = Number(input.replace(/\D/g, ''))
  if (input.toUpperCase().indexOf("G") > -1) {
    size = size * 1024 * 1024 * 1024
  } else if (input.toUpperCase().indexOf("M") > -1) {
    size = size * 1024 * 1024
  } else if (input.toUpperCase().indexOf("K") > -1) {
    size = size * 1024
  }
  return size
}
// 补全域名地址
export function getFullPath(path, basePath, type) {
  if (!path) {
    return ''
  }
  const httpReg = /^(http|https)/
  const fileReg = /^(file|data:image|blob:)/
  if (path.indexOf('file:///') === 0) {
    path = path.replace('file:///', 'cdvfile://umooc_cordova/')
  } else if (!httpReg.test(path) && !fileReg.test(path)) {
    path = `${rescourceHost()}/${path}`
  }
  if (httpReg.test(path)) {
    if (type === 'image') {
      path = path.indexOf('?') === -1 ? path + '?imageslim|imageView2/0/w/1000/h/1000' : path
    }
    // uobs自研音频转码后缀为format.mp3
    if (IS_SELF_UPLOAD && type === 'audio') {
      if (path.split("?")[0]) {
        path = path.split("?")[0]
      }
      if (path.substring(path.lastIndexOf('.') + 1, path.length) !== 'mp3') {
        path = path.substring(0, path.lastIndexOf('.')) + 'format.mp3'
      }
    }
    if (basePath) {
      path = `${basePath.replace(/\/$/g, '')}/${path.replace(/^(http|https):\/\/[^\/]+\//g,"")}`
    }
  }
  return path
}
// 上传附件类型限制
export function formatTypeLimit(array) {
  const mime_types = [{
    title: 'document',
    extensions: '.doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.txt'
  },
  {
    title: 'image',
    extensions: '.png,.jpg,.gif,.jpeg,.bmp'
  },
  {
    title: 'video',
    extensions: '.mp4,.avi,.wmv,.rm,.rmvb,.mpeg,.mpg,.mkv,.mov,.flv'
  },
  {
    title: 'audio',
    extensions: '.mp3,.wav,.wma'
  },
  {
    title: 'rar',
    extensions: '.rar,.zip'
  }]
  const types = []
  if (array && array.length > 0) {
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < mime_types.length; j++) {
        if (mime_types[j].title === array[i]) {
          types.push(mime_types[j].extensions)
          break
        }
      }
    }
  } else {
    for (let i = 0; i < mime_types.length; i++) {
      types.push(mime_types[i].extensions)
    }
  }
  return types.join(',')
}
// 上传大小限制
export function formatSizeLimit(suffix, size, maxSize) {
  const type_sizes = [{
    type: 'document',
    desc: '500MB'
  },
  {
    type: 'image',
    desc: '5MB'
  },
  {
    type: 'video',
    desc: '1G'
  },
  {
    type: 'audio',
    desc: '1G'
  },
  {
    type: 'rar',
    desc: '1G'
  },
  {
    type: 'other',
    desc: '1G'
  }]
  let message = ''
  const type = formatFileType(suffix)
  for (let i = 0; i < type_sizes.length; i++) {
    if (type_sizes[i].type === type) {
      if (maxSize && conversionFileSize(maxSize) < size) {
        message = t("fileSizeLimitType", { maxSize: maxSize })
      } else if (conversionFileSize(type_sizes[i].desc) < size) {
        message = t("fileSizeLimitType", { maxSize: type_sizes[i].desc })
      }
      break
    }
  }
  return message
}
// 文件icon判断
export function fileIcon(path) {
  let icon = "icon-fujianleixingqita1";
  if (!path) {
    return icon
  }
  let ext = path.substring(path.lastIndexOf('.') + 1).toLowerCase()
  var type = 'other'
  type = formatFileType(ext)
  switch (type) {
    case 'document':
      switch (ext) {
        case "txt":
          icon = "icon-fujianleixingtxt";
          break;
        case "pdf":
          icon = "icon-fujianleixingpdf";
          break;
        case "doc":
          icon = "icon-fujianleixingword";
          break;
        case "docx":
          icon = "icon-fujianleixingword";
          break;
        case "ppt":
          icon = "icon-fujianleixingppt";
          break;
        case "pptx":
          icon = "icon-fujianleixingppt";
          break;
        case "xls":
          icon = "icon-fujianleixingexcel";
          break;
        case "xlsx":
          icon = "icon-fujianleixingexcel";
          break;
        default:
          icon = "icon-fujianleixingqita1";
      }
      break;
    case 'image':
      icon = "icon-fujianleixingtupian";
      break;
    case 'video':
      icon = "icon-fujianleixingshipin";
      break;
    case 'audio':
      icon = "icon-fujianleixingyinpin";
      break;
    case 'zip':
      icon = "icon-fujianleixingyasuobao";
      break;
    case 'other':
      icon = "icon-fujianleixingqita1";
      break;
    default:
  }
  return icon;
}

// 50001 文件类型不支持 50002 文件大小不符合 50070 七牛云token获取失败 50071七牛上传时失败
// 50080 华为token获取失败 50081华为上传是失败 50082 文件编码格式无法解析
export function handlerErrCode(code) {
  let message = t('uploadFail');
  switch (code) {
    case 50001: message = t('uploadFileError3'); break;
    case 50002: message = t('uploadFileError4'); break;
    case 50082: message = t('uploadFileError5'); break;
    default: message = t('uploadFail'); break;
  }
  return message
}

export function setUploadConfig(options) {
  if (IS_SELF_UPLOAD) {
    options.obsHost = rescourceHost()
    options.uptokenHost = API_HOST
    options.config = {
      uphost: cookies.get("UPLOAD_SERVER_URL"),
      upprotocol: UPLOAD_SERVER_PROTOCOL,
      auto_start: true
    }
  }
  return options
}