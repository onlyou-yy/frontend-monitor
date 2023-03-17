import getLastEvent from "../utils/getLastEvent"
import getSelector from "../utils/getSelector";
import tracker from "../utils/tracker";

export function injectJsError(){
  // 监听全局未捕获的错误
  window.addEventListener('error',function(event){
    let lastEvent = getLastEvent();
    // 资源加载错误
    let log = {};
    const selector = lastEvent ? getSelector(lastEvent) : ''
    if(event.target && (event.target.src || event.target.href)){
      // js代码错误
      log = {
        kind:'stability',
        type:'error',
        errorType:'resourceError',
        filename:event.target.src || event.target.herf,
        selector,
        tagName:event.target.tagName
      }
    }else{
      // js代码错误
      log = {
        kind:'stability',//监控指标的大类
        type:'error',//小类型，一个错误
        errorType:'jsError',//错误类型
        message:event.message,//报错信息
        filename:event.filename,//报错文件
        position:`${event.lineno}:${event.colno}`,//报错位置
        stack:getLines(event.error.stack),//报错栈信息
        selector,//选择器，最后一次操作的元素
      }
    }
    tracker.send(log);
  },true)

  // promise 未捕获的错误
  window.addEventListener('unhandledrejection',function(event){
    let lastEvent = getLastEvent();
    let colno = 0,
        lineno = 0,
        message = '',
        filename = '',
        stack = '',
        reason = event.reason;
    if(typeof reason === 'string'){
      message = reason;
    }else if(typeof reason === 'object'){
      message = reason.message;
      if(reason.stack){
        let matchResult = reason.stack.match(/at\s+(.+):(\d+):(\d+)/);
        filename = matchResult[1];
        lineno = matchResult[2];
        colno = matchResult[3];
      }
      stack = getLines(reason.stack);
    }
    
    const log = {
      kind:'stability',//监控指标的大类
      type:'error',//小类型，一个错误
      errorType:'promiseError',//错误类型
      message:message,//报错信息
      filename:filename,//报错文件
      position:`${lineno}:${colno}`,//报错位置
      stack:stack,//报错栈信息
      selector:lastEvent ? getSelector(lastEvent) : '',//选择器，最后一次操作的元素
    }
    tracker.send(log);
  },true)

  // 解析报错栈信息，进行格式化（其实不用进行格式化也可以）
  function getLines(stack){
    return stack.split('\n').slice(1).map(item=>item.replace(/^\s+at\s+/g,'')).join('^')
  }
}