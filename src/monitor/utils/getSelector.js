function getSelector(path){
  return path.reverse().filter(ele => {
    return ele != document && ele != window
  }).map(ele => {
    if(ele.id){
      return `${ele.nodeName.toLowerCase()}#${ele.id}`;
    }else if(ele.className){
      return `${ele.nodeName.toLowerCase()}#${ele.className}`;
    }else{
      return ele.nodeName.toLowerCase();
    }
  }).join(" ")
}

export default function(event){
  let path = event.path;
  if(!path && event.composedPath){
    path = event.composedPath()
  }
  if(Array.isArray(path) && path.length > 0){
    return getSelector(path)
  }else{
    let target = event.target;
    let line = [];
    while(target){
      line.push(target);
      target = target.parentNode;
    }
    return getSelector(line);
  }
}