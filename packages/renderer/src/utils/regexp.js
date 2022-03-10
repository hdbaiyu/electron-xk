export default {
  checkNameOrNumber: (rule, value, callback) => {
    if (!value) {
      return callback('请输入邮箱/手机号');
    }
    const email =
      /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    if (email.test(value)) {
      return callback();
    }
    const mobile = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (mobile.test(value)) {
      return callback();
    }
    return callback('邮箱/手机号输入有误');
  },
  checkEmail: (rule, value, callback) => {
    if (!value) {
      return callback('请输入邮箱');
    }
    const email =
      /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    if (email.test(value)) {
      return callback();
    }
    return callback('邮箱输入有误');
  },
  checkBack: (rule, value, cb) => {
    if (!value) {
      return cb('请输入卡号');
    }
    if (!/^([1-9]{1})(\d{14}|\d{18})$/.test(value)) {
      return cb('请输入正确的卡号');
    }
    cb();
  },
  checkPhone: (rule, value, callback) => {
    if (!value) {
      callback('请输入手机号码');
    } else {
      // const reg = /^1\d{10}$/
      // const reg =
      // /^(?:\+?86)?1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[0-35-9]\d{2}|4(?:0\d|1[0-2]|9\d))|9[0-35-9]\d{2}|6[2567]\d{2}|4(?:(?:10|4[01])\d{3}|[68]\d{4}|[579]\d{2}))\d{6}$/;
      const reg = /^1[3456789]\d{9}$/;
      if (reg.test(value)) {
        callback();
      } else {
        return callback('请输入正确手机号码');
      }
    }
  },
  checkName: (rule, value, callback) => {
    if (!value) {
      return callback(new Error('请输入内容'));
    }
    if (value.length > 12) {
      return callback(new Error('名字输入过长'));
    }
    const reg = /(^[\u4e00-\u9fffa-zA-Z]{1,12}$)|(^[a-zA-Z]*(\s[a-zA-Z]*)?$)/;
    if (reg.test(value)) {
      return callback();
    }
    return callback(new Error(`只支持中文或英文名！`));
  },
  nameValidator: (rule, value, cb) => {
    if (!value) {
      return cb('请输入账号名称');
    }
    if (value.length > 15) {
      return cb('输入过长！');
    }
    if (!/^[\u4e00-\u9fa5]{2,15}$/.test(value)) {
      return cb('请输入中文，不能有特殊符号、空格');
    }
    cb();
  },
  // 密码校验
  checkPassword: (rule, value, cb) => {
    if (!value) return cb('请输入密码');
    if (value.length < 6 || value.length > 16) {
      return cb('密码为6~16位字符');
    }
    if (!/[a-zA-Z]+/.test(value)) {
      return cb('请输入英文字母和数字');
    }
    if (!/[\d]+/.test(value)) {
      return cb('请输入英文字母和数字');
    }
    if (
      /[\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b\s]/.test(value)
    ) {
      return cb('不支持空格和中文字符');
    }
    return cb();
  },
  checkIsCard: (rule, value, cb) => {
    if (!value) {
      return cb('请输入身份号码');
    }
    if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(value)) {
      return cb('输入身份证号码有误，请重新输入');
    }
    return cb();
  },
};
