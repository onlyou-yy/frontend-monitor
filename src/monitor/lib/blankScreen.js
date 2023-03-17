import onload from "../utils/onload";
import tracker from "../utils/tracker";

/**是否白屏
 * 函数返还在特定坐标点下的 HTML 元素数组。
 * 根据 elementsFromPoint api，获取屏幕水平中线和竖直中线所在的元素
 * 然后判断这些元素是否属于空白元素/容器元素，达到一定数量的时候就可以认为是白屏
 */
export function blankScreen(){
  const wrapperElements = ['html','body','#app','#container','.container']
  let emptyPoint = 0;

  function getSelector(element){
    if(!element) return "";
    if(element.id){
      return `#${element.id}`;
    }else if(element.className){
      return "." + element.className.split(" ").filter(f => !!f).join(".")
    }else{
      return element.nodeName.toLowerCase();
    }
  }

  function isWrapper(element){
    if(!element){
      emptyPoint++;
      return;
    }
    const selector = getSelector(element)
    if(wrapperElements.includes(selector)){
      emptyPoint++;
    }
  }

  onload(()=>{
    for(let i = 1;i <= 9; i++){
      let xElement = document.elementFromPoint(
        window.innerWidth / 10 * i,window.innerHeight / 2);
      let yElement = document.elementFromPoint(
        window.innerWidth / 2, window.innerHeight / 10 * i);
      
      isWrapper(xElement)
      isWrapper(yElement)
    }

    if(emptyPoint >= 6){
      const centerElement = document.elementFromPoint(
        window.innerWidth / 2,
        window.innerHeight / 2
      );
      tracker.send({
        kind: "stability",
        type: "blank",
        emptyPoints: emptyPoint + "",
        screen: window.screen.width + "X" + window.screen.height,
        viewPoint: window.innerWidth + "X" + window.innerHeight,
        selector: getSelector(centerElement),
      });
    }
  })
}