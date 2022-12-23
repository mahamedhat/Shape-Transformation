function writeMessage(message) {
text.text(message);
}
var width = window.innerWidth;
var height = window.innerHeight;

var stage = new Konva.Stage({
container: 'container',
width: width,
height: height,
});

var layer = new Konva.Layer();

var text = new Konva.Text({
x: 10,
y: 10,
fontFamily: 'Calibri',
fontSize: 24,
text: '',
fill: 'black',
});

let rect = new Konva.Rect({
x: 520,
y: 400,
offset: [50, 25],
width: 400,
height: 300,
fill: ('rgb(223, 211, 195)'),
draggable: true,
name: 'rect',
});

rect.on('mousemove', function () {
var mousePos = stage.getPointerPosition();
var x = mousePos.x ;
var y = mousePos.y;
writeMessage('coordinates of a point on the rectangle: '+' x: ' + x + ', y: ' + y);
});
var triangle = new Konva.RegularPolygon({
x: 720,
y: 285,
sides: 3,
radius: 225,
fill: ('rgb(142, 50, 0)'),
stroke: 'black',
strokeWidth: 4,
draggable: true,
name: 'triangle',
});
triangle.on('mousemove', function () {
var mousePos = stage.getPointerPosition();
var x = mousePos.x ;
var y = mousePos.y;
writeMessage('coordinates of a point on the triangle:'+' x: ' + x + ', y: ' + y);
});

let circle1 = new Konva.Circle({
x: 620,
y: 500,
radius: 50,
fill: ('rgb(191, 234, 245)'),
stroke: 'black',
strokeWidth: 4,
draggable: true,
name: 'circle',

});

circle1.on('mousemove', function () {
    var mousePos = stage.getPointerPosition();
    var x = mousePos.x ;
    var y = mousePos.y;
    writeMessage('coordinates of a point on the left circle:'+' x: ' + x + ', y: ' + y);
    });

let circle2 = new Konva.Circle({
x: 820,
y: 500,
radius: 50,
fill: ('rgb(191, 234, 245)'),
stroke: 'black',
strokeWidth: 4,
draggable: true,
name: 'circle',

});
circle2.on('mousemove', function () {
    var mousePos = stage.getPointerPosition();
    var x = mousePos.x ;
    var y = mousePos.y;
    writeMessage('coordinates of a point on the right circle:'+' x: ' + x + ', y: ' + y);
    });

let ellipse = new Konva.Ellipse({
x: 720,
y: 600,
radiusX: 50,
radiusY: 70,
fill: 'black',
draggable: true,
name: 'ellipse',

});
ellipse.on('mousemove', function () {
    var mousePos = stage.getPointerPosition();
    var x = mousePos.x ;
    var y = mousePos.y;
    writeMessage('coordinates of a point on the ellipse:'+' x: ' + x + ', y: ' + y);
    });

layer.add(text);
layer.add(rect);
layer.add(triangle);
layer.add(circle1);
layer.add(circle2);
layer.add(ellipse);


//TRANSFORMATION

var tr = new Konva.Transformer();
layer.add(tr);

// by default select all shapes
tr.nodes([rect, triangle,circle1,circle2,ellipse]);

// add a new feature, lets add ability to draw selection rectangle
var selectionRectangle = new Konva.Rect({
  fill: 'rgba(0,0,255,0.5)',
  visible: false,
});
layer.add(selectionRectangle);

var x1, y1, x2, y2;
stage.on('mousedown touchstart', (e) => {
  // do nothing if we mousedown on any shape
  if (e.target !== stage) {
    return;
  }
  e.evt.preventDefault();
  x1 = stage.getPointerPosition().x;
  y1 = stage.getPointerPosition().y;
  x2 = stage.getPointerPosition().x;
  y2 = stage.getPointerPosition().y;

  selectionRectangle.visible(true);
  selectionRectangle.width(0);
  selectionRectangle.height(0);
});

stage.on('mousemove touchmove', (e) => {
  // do nothing if we didn't start selection
  if (!selectionRectangle.visible()) {
    return;
  }
  e.evt.preventDefault();
  x2 = stage.getPointerPosition().x;
  y2 = stage.getPointerPosition().y;

  selectionRectangle.setAttrs({
    x: Math.min(x1, x2),
    y: Math.min(y1, y2),
    width: Math.abs(x2 - x1),
    height: Math.abs(y2 - y1),
  });
});

stage.on('mouseup touchend', (e) => {
  // do nothing if we didn't start selection
  if (!selectionRectangle.visible()) {
    return;
  }
  e.evt.preventDefault();
  // update visibility in timeout, so we can check it in click event
  setTimeout(() => {
    selectionRectangle.visible(false);
  });
// select all
  var shapes = [rect, triangle,circle1,circle2,ellipse];
  var box = selectionRectangle.getClientRect();
  var selected = shapes.filter((shape) =>
    Konva.Util.haveIntersection(box, shape.getClientRect())
  );
  tr.nodes(selected);
});

// clicks should select/deselect shapes
stage.on('click tap', function (e) {
  // if we are selecting with rect, do nothing
  if (selectionRectangle.visible()) {
    return;
  }

  // if click on empty area - remove all selections
  if (e.target === stage) {
    tr.nodes([]);
    return;
  }

  // do nothing if clicked NOT on our rectangles
  if (!e.target.hasName('rect') && !e.target.hasName('circle') && !e.target.hasName('ellipse') && !e.target.hasName('triangle')) {
    return;
  }

  // do we pressed shift or ctrl?
  const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
  const isSelected = tr.nodes().indexOf(e.target) >= 0;

  if (!metaPressed && !isSelected) {
    // if no key pressed and the node is not selected
    // select just one
    tr.nodes([e.target]);
  } else if (metaPressed && isSelected) {
    // if we pressed keys and node was selected
    // we need to remove it from selection:
    const nodes = tr.nodes().slice(); // use slice to have new copy of array
    // remove node from array
    nodes.splice(nodes.indexOf(e.target), 1);
    tr.nodes(nodes);
  } else if (metaPressed && !isSelected) {
    // add the node into selection
    const nodes = tr.nodes().concat([e.target]);
    tr.nodes(nodes);
  }
});


// add the layer to the stage
stage.add(layer);