import tracker from "../utils/tracker";

export function injectXHR(){
  let XHR = window.XMLHttpRequest;
  
  let oldOpen = XHR.prototype.open;
  XHR.prototype.open = function(method,url,sync){
    // 过滤掉 调试socket 和 日志请求，这些不触发 日志发送
    if(!url.match(/logstores/) && !url.match(/sockjs/)){
      this.logData = {method,url,sync}
    }
    return oldOpen.apply(this,arguments);
  }
  
  let oldSend = XHR.prototype.send;
  XHR.prototype.send = function(body){
    if(this.logData){
      let startTime = Date.now();
      let handler = (type)=> (event) => {
        let duration = Date.now() - startTime;
        let status = this.status;
        let statusText = this.statusText;
        
        tracker.send({
          kind:"stability",
          type:"xhr",
          eventType:type,
          pathname:this.logData.url,
          status:status + "-" + statusText,
          duration,
          response:this.response ? JSON.stringify(this.response) : '',
          params:body || ''
        })
      }

      this.addEventListener("load",handler('load'),false)
      this.addEventListener("error",handler('error'),false)
      this.addEventListener("abort",handler('abort'),false)
    }

    return oldSend.apply(this,arguments);
  }
}