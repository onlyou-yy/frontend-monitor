/**
 * 阿里云日志服务文档：https://help.aliyun.com/document_detail/54604.html
 * web tracking 上传日志：https://help.aliyun.com/document_detail/31752.html
 */

const userAgent = require('user-agent');

const HOST = '';//日志服务器主机域名
const PROJECT = '';//日志服务项目名
const LOGSTORENAME = '';//日志仓库名
const URL = `http://${PROJECT}.${HOST}/logstores/${LOGSTORENAME}/track`;//上报路径

function getExtraData() {
  return {
    title: document.title,
    url: location.href,
    timestamp: Date.now(),
    userAgent: userAgent.parse(navigator.userAgent).name,
  };
}

class SendTracker{
  constructor(){
    this.url = URL;
    this.xhr = new XMLHttpRequest;
  }
  send(data = {}) {
    let extraData = getExtraData();
    let log = { ...data, ...extraData };
    // 阿里云要求值不能为数字
    for (const key in log) {
      if (typeof log[key] === "number") {
        log[key] = `${log[key]}`;
      }
    }
    // 接入日志系统，此处以阿里云为例
    let body = JSON.stringify({
      __logs__: [log],
    });
    this.xhr.open("POST", this.url, true);
    this.xhr.setRequestHeader("Content-Type", "application/json");
    this.xhr.setRequestHeader("x-log-apiversion", "1.0.0");
    this.xhr.setRequestHeader("x-log-bodyrawsize", body.length);
    this.xhr.onload = function () {
      // console.log(this.xhr.response);
    };
    this.xhr.onerror = function (error) {
      // console.log(error);
    };
    this.xhr.send(body);
  }
}

const tracker = new SendTracker();

export default tracker;