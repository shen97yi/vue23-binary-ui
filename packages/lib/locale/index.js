// 使用相对路径导入，避免别名路径在开发环境中的解析问题
import cookies from '../utils/cookie'
import { DEFAULT_LANG } from '../config'
import { getUrlParam,getURLHash} from '../utils/index.js'

console.log('window.location',window.location)
console.log('getURLHash',getURLHash('lang'))

// 获取当前语言 - 支持多持久化源
let lang = getURLHash('lang') || getUrlParam('lang') ||
  // 优先从 cookie 获取
  cookies.get('lang') ||
  cookies.get('language') ||
  // 从 localStorage 获取
  (typeof localStorage !== 'undefined' ? localStorage.getItem('lang') : null) ||
  // 最后从浏览器设置获取
  navigator.language ||
  navigator.browserLanguage

//移动端语言添加
if (navigator.userAgent.indexOf("umoocApp") !== -1) {
  var ua =
    window.navigator.userAgent.indexOf("-language-") != -1 ?
    window.navigator.userAgent :
    "";
  var start = ua.indexOf("-language-") + "-language-".length;
  var end = ua.indexOf(" ", start);
  end = end == -1 ? ua.length : end;

  try {
    lang =
      ua.substring(start, end) ||
      navigator.language ||
      navigator.browserLanguage;
  } catch (e) {
    lang = navigator.language || navigator.browserLanguage;
  }
}

lang = lang.toLowerCase()
const langMap = {
  tw: ['tw', 'hk'],
  en: ['en'],
  th: ['th'],
  es: ['es'],
  ar: ['ar'],
  id: ['id'],
  zh: ['zh'],
  fr: ['fr'],
  pt: ['pt'],
  ru: ['ru'],
  am: ['am'],
  it: ['it'],
  uz: ['uz'],
  sw: ['sw'],
}
let langKey = DEFAULT_LANG
for (let key in langMap) {
  const arr = langMap[key].filter(it => lang.indexOf(it) !== -1)
  if (arr.length > 0) {
    langKey = key
    break
  }
}
lang = langKey

const vueI18nMap = {
  zh: 'zh-CN',
  tw: 'zh_TW'
}
document.documentElement.setAttribute('lang', vueI18nMap[lang] || lang)
if (lang === 'ar') {
  document.documentElement.setAttribute('dir', 'rtl')
}

// 静态导入所有语言文件，避免构建后动态require路径解析问题
import zhLang from './lang/zh.json'
import enLang from './lang/en.json'
import twLang from './lang/tw.json'
import thLang from './lang/th.json'
import esLang from './lang/es.json'
import arLang from './lang/ar.json'
import idLang from './lang/id.json'
import frLang from './lang/fr.json'
import ptLang from './lang/pt.json'
import ruLang from './lang/ru.json'
import amLang from './lang/am.json'
import itLang from './lang/it.json'
import uzLang from './lang/uz.json'
import swLang from './lang/sw.json'

// 语言文件映射
const langFiles = {
  zh: zhLang,
  en: enLang,
  tw: twLang,
  th: thLang,
  es: esLang,
  ar: arLang,
  id: idLang,
  fr: frLang,
  pt: ptLang,
  ru: ruLang,
  am: amLang,
  it: itLang,
  uz: uzLang,
  sw: swLang
}

/**
 * 从本地语言文件中获取翻译文本
 * @param {string} key - 翻译键，支持嵌套键如'common.ok'
 * @param {object} params - 参数对象，用于替换翻译文本中的占位符
 * @returns {string} 翻译后的文本
 */
function getTranslationFromLocal(key, params = {}) {
  try {
    // 尝试从当前语言文件中查找翻译
    const langFile = langFiles[lang] || {};
    // 支持嵌套键访问，例如 'common.ok'
    const keys = key.split('.');
    let value = langFile;

    for (const k of keys) {
      if (value[k] === undefined) {
        return key; // 如果键不存在，回退到返回key
      }
      value = value[k];
    }

    // 处理参数替换，例如 {n}, {name} 等
    if (typeof value === 'string' && params) {
      return Object.keys(params).reduce((result, paramKey) => {
        const regex = new RegExp(`\\{${paramKey}\\}`, 'g');
        return result.replace(regex, params[paramKey]);
      }, value);
    }

    return value;
  } catch (error) {
    console.warn(`Error in translation for key '${key}':`, error);
    return key;
  }
}

/**
 * 获取翻译函数 - 用于Vue组件中
 * @returns {Function} 翻译函数
 */
export function useT() {
  return getTranslationFromLocal;
}

/**
 * 获取翻译函数 - 直接调用版本
 * @returns {Function} 翻译函数
 */
export function getT() {
  return getTranslationFromLocal;
}

/**
 * 翻译函数 - 全局导出版本
 */
export const t = getTranslationFromLocal;

/**
 * 更新当前语言
 * @param {string} newLang - 新的语言代码
 */
export function setLang(newLang) {
  lang = newLang.toLowerCase();

  // 更新langKey
  let newLangKey = DEFAULT_LANG;
  for (let key in langMap) {
    const arr = langMap[key].filter(it => lang.indexOf(it) !== -1);
    if (arr.length > 0) {
      newLangKey = key;
      break;
    }
  }
  lang = newLangKey;

  // 更新HTML属性
  document.documentElement.setAttribute('lang', vueI18nMap[lang] || lang);
  if (lang === 'ar') {
    document.documentElement.setAttribute('dir', 'rtl');
  } else {
    document.documentElement.removeAttribute('dir');
  }

  // 持久化到 cookie，设置1年过期时间
  try {
    cookies.set('lang', lang, {
      expires: 365, // 过期时间：365天
      path: '/',    // 全站有效
      domain: null  // 默认为当前域名
    });
  } catch (error) {
    console.warn('Failed to save language to cookie:', error);
  }

  // 同时保存到 localStorage 作为备选
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('lang', lang);
    }
  } catch (error) {
    console.warn('Failed to save language to localStorage:', error);
  }
}

// 导出当前语言和语言文件映射
export { lang, langFiles }
