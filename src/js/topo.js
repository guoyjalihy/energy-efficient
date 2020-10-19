import "../js/jtopo-0.4.8-min"

let scene
let stage
function init(canvas) {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight * 0.79
    stage = new JTopo.Stage(canvas)
    stage.eagleEye.visible = true
    scene = new JTopo.Scene()
    stage.add(scene)
}
function buildContainer(name,textPosition,fillColor,x,y,width,height){
    let container = new JTopo.Container(name)
    container.textPosition = textPosition
    container.fillColor = fillColor
    container.setBound(x, y, width, height)
    container.borderWidth = 2; // 边框的宽度
    container.borderColor = '0,0,255'; //边框颜色
    // container.font = '18pt 微软雅黑';
    container.borderColor = '255,0,0';
    scene.add(container)
    return container
}
function buildNode(name,fillColor,borderWidth,borderColor){
    let node = new JTopo.Node(name);
    node.textPosition = "Middle_Center";
    if(fillColor != null){
        node.fillColor = fillColor
    }
    if(borderColor != null){
        node.borderColor = borderColor
    }
    if(borderWidth != null){
        node.borderWidth = borderWidth
    }
    scene.add(node);
    return node
}
function buildLine(source,target){
    scene.add(new JTopo.Link(source, target));
}
function clear(){
    stage.clear()
}

export {init,buildContainer,buildNode,buildLine,clear}
