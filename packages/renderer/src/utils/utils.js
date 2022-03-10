export function runningTime() {
  const ua = window.navigator.userAgent.toLowerCase();
  if (ua.indexOf('wechat') > -1) {
    return 'WECHAT';
  }
  if (/micromessenger/i.test(ua)) {
    return 'WECHAT';
  }

  if (ua.indexOf('mqqbrowser') > -1) {
    return 'QQ';
  }
  return 'WECHAT_PC';
}
// 是否是iOs
export function isIOS() {
  let u = navigator.userAgent;
  let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
  return isiOS;
}
export function isIPad() {
  const pad = /Macintosh/i.test(navigator.userAgent) && window.screen.availWidth < 1366;
  return navigator.userAgent.indexOf('iPad') > -1 || pad;
}
export default {
  // 获取文件名
  getFileName(filePath) {
    return filePath.replace(/\.\w+$/, '');
  },
  // 获取文件后缀名（不包含点）
  getFileSuffix(fileName) {
    const lastIndex = fileName.lastIndexOf('.');
    return fileName.slice(lastIndex + 1);
  },
  // 去除文件名中的特殊字符，不包括(.|_)
  encodeFileName(fileName) {
    const reg = /[^\w\.^\u4e00-\u9fa5]/gi;
    const fileSuffix = this.getFileSuffix(fileName);
    if (reg.test(fileName)) {
      return `hy-${new Date().getTime()}.${fileSuffix}`;
    }
    return fileName;
  },
  // 是否为图片
  isImage(fileType) {
    return fileType.indexOf('image') > -1;
  },
  goodsEnum(type) {
    if (type === 1) {
      return '下载连接';
    }
    return '卡密';
  },
  formatPrice(num) {
    if (!num) return 0;
    return (+num).toFixed(2);
  },
  downloadLocalFile(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const dataURL = e.target.result;
      const a = document.createElement('a');
      a.download = this.getFileName(file.name);
      a.href = dataURL;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    };
  },
  downloadFile(content, fileName) {
    const aLink = document.createElement('a');
    aLink.download = fileName;
    aLink.href = content;
    aLink.click();
    if (document.body.contains(aLink)) {
      document.body.removeChild(aLink);
    }
  },
  mainBodyType(type) {
    const main = {
      0: '个人',
      1: '媒体',
      2: '企业',
      3: '组织',
    };
    return main[type];
  },
};
