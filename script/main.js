// colorpicker
function ColorPicker(myCanvas, width, height) {
    this.myCanvas = myCanvas;
    this.width = width;
    this.height = height;
    this.myCanvas.width = width;
    this.myCanvas.height = height;
    this.ctx = this.myCanvas.getContext("2d");
    this.myPickerCircle = {x: 3, y: 297, width: 6, height: 6};

    //EventListeners
    let isMouseDown = false;
    const onMouseDown = (e) => {
        var rect = this.myCanvas.getBoundingClientRect();
        var posX = e.clientX - rect.left;
        var posY = e.clientY - rect.top;
        isMouseDown = true;
        if(posX >= 3 && posX <= this.width-3 && posY >= 0 && posY <= this.height) {
            this.myPickerCircle.x = posX;
            this.myPickerCircle.y = posY;
        }
    }
  
    const onMouseMove = (e) => {
        if(isMouseDown) {
            var rect = this.myCanvas.getBoundingClientRect();
            var posX = e.clientX - rect.left;
            var posY = e.clientY - rect.top;
            if(posX >= 3 && posX <= this.width-3 && posY >= 0 && posY <= this.height) {
                this.myPickerCircle.x = posX;
                this.myPickerCircle.y = posY;
                console.log(posX + " " + posY);
            }
        }
    }
  
    const onMouseUp = () => {
        isMouseDown = false;
    }

    this.myCanvas.addEventListener("mousedown", onMouseDown);
    this.myCanvas.addEventListener("mousemove", onMouseMove);
    this.myCanvas.addEventListener("mousedown", () => this.onChangeCallback(this.getPickedColor()));
    this.myCanvas.addEventListener("mousemove", () => this.onChangeCallback(this.getPickedColor()));
    document.addEventListener("mouseup", onMouseUp);
    
    this.draw = function() {
        this.build();
    }
    
    this.build = function() {
        let gradient = this.ctx.createLinearGradient(0, 0, this.width, 0);
  
        //Color Stops
        gradient.addColorStop(0, "rgb(255, 0, 0)");
        gradient.addColorStop(0.15, "rgb(255, 0, 255)");
        gradient.addColorStop(0.33, "rgb(0, 0, 255)");
        gradient.addColorStop(0.49, "rgb(0, 255, 255)");
        gradient.addColorStop(0.67, "rgb(0, 255, 0)");
        gradient.addColorStop(0.84, "rgb(255, 255, 0)");
        gradient.addColorStop(1, "rgb(255, 0, 0)");
        //Fill it
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
      
        //Apply black and white 
        gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
        gradient.addColorStop(0.5, "rgba(255, 255, 255, 0)");
        gradient.addColorStop(0.5, "rgba(0, 0, 0, 0)");
        gradient.addColorStop(1, "rgba(0, 0, 0, 1)");
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
      
        //Circle 
        this.ctx.beginPath();
        this.ctx.arc(this.myPickerCircle.x, this.myPickerCircle.y, this.myPickerCircle.width, 0, Math.PI * 2);
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
        this.ctx.closePath();
    }
    
    this.getPickedColor = function() {
        let imageData = this.ctx.getImageData(this.myPickerCircle.x, this.myPickerCircle.y, 1, 1);
        return { r: imageData.data[0], g: imageData.data[1], b: imageData.data[2] };
    }
    
    this.onChange = function(callback) {
      this.onChangeCallback = callback;
    }
}

var myColorPicker = new ColorPicker(document.getElementById("color-picker"), 300, 300);
  
//Draw 
setInterval(() => myColorPicker.draw(), 1);

var canvas = document.getElementById("layer2");
var background = document.getElementById("layer1");
var ctx = canvas.getContext("2d");
var background_ctx = background.getContext("2d");

canvas.width = window.innerWidth*2/3;
canvas.height = window.innerHeight;
background.width = window.innerWidth*2/3;
background.height = window.innerHeight;
const initial_height = canvas.height;
const initial_width = canvas.width;

canvas.style.position = "absolute";
canvas.style.top = "9px";
canvas.style.left = "9px";

//initialize background
background_ctx.clearRect(0, 0, initial_width, initial_height);
background_ctx.fillStyle = "white";
background_ctx.fillRect(0, 0, initial_width, initial_height);
canvas.setAttribute("id", "pencilIcon");
background.setAttribute("id", "pencilIcon");

//Variables
let painting = false;
let upload_input = document.getElementById("file-input"); 
var slider = document.getElementById("myRange");
var currentTool = 'Pencil';
var fill = true;
var fFamily = document.getElementById("fontFamily");
var fSize = document.getElementById("fontSize");
fSize.value = "24";
var myFontFamily = fFamily.value;
var myFontSize = fSize.value;
var mousecursor = "pencilIcon";
var myColor = "black";
var myWidth = "25";
var pathInverted = false;

myColorPicker.onChange((color) => {
    myColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
});

slider.oninput = function() {
    myWidth = parseInt(this.value, 10);
}

//EventListeners
upload_input.addEventListener("change", Upload);
fFamily.addEventListener('change', function(e) {
    myFontFamily = fFamily.options[fFamily.selectedIndex].value;
})
fSize.addEventListener('change', function(e) {
    myFontSize = fSize.options[fSize.selectedIndex].value;
})
canvas.addEventListener("mousedown", start);
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseout", outofbox);
document.getElementsByTagName("HTML")[0].addEventListener("mouseup", finish);
canvas.addEventListener("mouseover", focusText);

var myHistory = {
    redo_list: [],
    undo_list: [],
    saveState: function(canvas, list, keep_redo) {
      keep_redo = keep_redo || false;
      if(!keep_redo) {
        this.redo_list = [];
      }
      
      (list || this.undo_list).push(canvas.toDataURL());   
    },
    undo: function(canvas, ctx) {
      this.restoreState(canvas, ctx, this.undo_list, this.redo_list);
    },
    redo: function(canvas, ctx) {
      this.restoreState(canvas, ctx, this.redo_list, this.undo_list);
    },
    restoreState: function(canvas, ctx, pop, push) {
      if(pop.length) {
        this.saveState(canvas, push, true);
        var restore_state = pop.pop();
        var img = document.createElement('img');
        img.src = restore_state;
        img.onload = function() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);  
        }
      }
    }
}

function Undo() {
    background_ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    myHistory.undo(background, background_ctx);
}

function Redo() {
    background_ctx.globalCompositeOperation = 'source-over';
    myHistory.redo(background, background_ctx);
}

function canvasClear() {
    canvas.width = initial_width;
    canvas.height = initial_height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function backgroundClear() {
    background.width = initial_width;
    background.height = initial_height;
    background_ctx.clearRect(0, 0, background.width, background.height);
    background_ctx.fillStyle = "white";
    background_ctx.fillRect(0, 0, background.width, background.height);
}

function ClearAll() {
    setTimeout(() => {
        backgroundClear();
        canvasClear();
        myHistory.undo_list = [];
        myHistory.redo_list = [];
    }, 1);
}

function Download() {
    var a = document.createElement("a");

    document.body.appendChild(a);
    a.href = background.toDataURL();
    a.download = "canvas-image.png";
    a.click();
    document.body.removeChild(a);
}

function Upload(e) {
    backgroundClear();
    canvasClear();
    myHistory.undo_list = [];
    myHistory.redo_list = [];
    
    var URL = window.webkitURL || window.URL;
    var url = URL.createObjectURL(e.target.files[0]);
    var img = new Image();
    img.onload = function() {
        canvas.width = img.width;
        canvas.height = img.height;

        background.width = img.width;
        background.height = img.height;
        background_ctx.drawImage(img, 0, 0);
    }
    img.src = url;
}

//Tool
var myPencil = (function Pencil() {
    return {
        start: function(e) {
            painting =  true;
            draw(e);
        },

        draw: function(e) {
            if(!painting) return;

            background_ctx.lineCap = "round";
            background_ctx.lineWidth = myWidth;
            background_ctx.strokeStyle = myColor;
        
            var rect = canvas.getBoundingClientRect();
            background_ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
            background_ctx.stroke();
            background_ctx.beginPath();
            background_ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
        },

        finish: function(e) {
            painting = false;
            background_ctx.beginPath();
        },

        outofbox: function(e) {
            background_ctx.beginPath();
        }
    };
})();

var myRainbow = (function Rainbow() {
    var hue = 0;
    return {
        start: function(e) {
            painting =  true;
            draw(e);
        },

        draw: function(e) {
            if(!painting) return;

            background_ctx.lineCap = "round";
            background_ctx.lineWidth = myWidth;
            background_ctx.strokeStyle = `hsl(${hue}, 100%, 50%)`
        
            var rect = canvas.getBoundingClientRect();
            background_ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
            background_ctx.stroke();
            background_ctx.beginPath();
            background_ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);

            hue++
            if (hue >= 360) {
                hue = 0
            }
        },

        finish: function(e) {
            painting = false;
            background_ctx.beginPath();
        },

        outofbox: function(e) {
            background_ctx.beginPath();
        }
    };
})();

var myEraser = (function Eraser() {
    return {
        start: function(e) {
            painting =  true;
            draw(e);
        },

        draw: function(e) {
            if(!painting) return;

            background_ctx.lineCap = "round";
            background_ctx.lineWidth = myWidth;
            background_ctx.strokeStyle = myColor;
        
            var rect = background.getBoundingClientRect();
            background_ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
            background_ctx.stroke();
            background_ctx.beginPath();
            background_ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
        },

        finish: function(e) {
            painting = false;
            background_ctx.beginPath();
        },

        outofbox: function(e) {
            background_ctx.beginPath();
        }
    };
})();

var circle;
function Circle(startX, startY) {
    this.startX = startX;
    this.startY = startY;
    this.color = myColor;
    this.width = myWidth;
    this.rx=0;this.ry=0;
    this.endX=0;this.endY=0;
    this.draw = function() {
        ctx.beginPath();
        ctx.lineCap = "butt";
        this.rx = Math.abs(this.startX - this.endX)/2;
        this.ry = Math.abs(this.startY - this.endY)/2;

        var dx = (this.endX - this.startX)/2;
        var dy = (this.endY - this.startY)/2;

        ctx.ellipse(this.startX+dx, this.startY+dy, this.rx, this.ry, 0, 0, 2 * Math.PI);
        if(fill) {
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        else {
            ctx.lineWidth = this.width;
            ctx.strokeStyle = this.color;
            ctx.stroke();
        }
    }
}

var myCircle = (function() {
    return {
        start: function(e) {
            var rect = canvas.getBoundingClientRect();
            var startX = parseInt(e.clientX - rect.left);
            var startY = parseInt(e.clientY - rect.top);
            painting = true;
            circle = new Circle(startX, startY);
        },

        draw: function(e) {
            if (!painting) {
                return;
            }
            var rect = canvas.getBoundingClientRect();
            circle.endX = parseInt(e.clientX - rect.left);
            circle.endY = parseInt(e.clientY - rect.top);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            circle.draw();
        },

        finish: function(e) {
            painting = false;
            circle = null;
            ctx.beginPath();
        },

        outofbox: function(e) {
            ctx.beginPath();
        }
    }
})();

var triangle;
function Triangle(startX, startY) {
    this.startX = startX;
    this.startY = startY;
    this.color = myColor;
    this.width = myWidth;
    this.endX=0;this.endY=0;
    this.draw = function() {
        ctx.beginPath();
        ctx.lineCap = "butt";
        var dx = parseInt(this.endX - this.startX);
        var dy = parseInt(this.endY - this.startY);

        var x1 = this.startX;       var y1 = this.startY+dy;
        var x2 = this.startX+dx/2;  var y2 = this.startY;
        var x3 = this.startX+dx;    var y3 = this.startY+dy;

        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.closePath();
        
        if(fill) {
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        else {
            ctx.lineWidth = this.width;
            ctx.strokeStyle = this.color;
            ctx.stroke();
        }
    }
}

var myTriangle = (function() {
    return {
        start: function(e) {
            var rect = canvas.getBoundingClientRect();
            var startX = parseInt(e.clientX - rect.left);
            var startY = parseInt(e.clientY - rect.top);
            painting = true;
            triangle = new Triangle(startX, startY);
        },

        draw: function(e) {
            if (!painting) {
                return;
            }
            var rect = canvas.getBoundingClientRect();
            triangle.endX = parseInt(e.clientX - rect.left);
            triangle.endY = parseInt(e.clientY - rect.top);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            triangle.draw();
        },

        finish: function(e) {
            painting = false;
            triangle = null;
            ctx.beginPath();
        },

        outofbox: function(e) {
            ctx.beginPath();
        }
    }
})();

var rectangle;
function Rectangle(startX, startY) {
    this.startX = startX;
    this.startY = startY;
    this.color = myColor;
    this.width = myWidth;
    this.endX=0;this.endY=0;
    this.draw = function() {
        ctx.beginPath();
        ctx.lineCap = "butt";
        var dx = parseInt(this.endX - this.startX);
        var dy = parseInt(this.endY - this.startY);

        var x1 = this.startX;       var y1 = this.startY;
        var x2 = this.startX+dx;  var y2 = this.startY;
        var x3 = this.startX;    var y3 = this.startY+dy;
        var x4 = this.startX+dx;    var y4 = this.startY+dy;

        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x4, y4);
        ctx.lineTo(x3, y3);
        ctx.closePath();
        
        if(fill) {
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        else {
            ctx.lineWidth = this.width;
            ctx.strokeStyle = this.color;
            ctx.stroke();
        }
    }
}

var myRectangle = (function() {
    return {
        start: function(e) {
            var rect = canvas.getBoundingClientRect();
            var startX = parseInt(e.clientX - rect.left);
            var startY = parseInt(e.clientY - rect.top);
            painting = true;
            rectangle = new Rectangle(startX, startY);
        },

        draw: function(e) {
            if (!painting) {
                return;
            }
            var rect = canvas.getBoundingClientRect();
            rectangle.endX = parseInt(e.clientX - rect.left);
            rectangle.endY = parseInt(e.clientY - rect.top);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            rectangle.draw();
        },

        finish: function(e) {
            painting = false;
            rectangle = null;
            ctx.beginPath();
        },

        outofbox: function(e) {
            ctx.beginPath();
        }
    }
})();

var line;
function Line(startX, startY) {
    this.startX = startX;
    this.startY = startY;
    this.color = myColor;
    this.width = myWidth;
    this.endX=0;this.endY=0;
    this.draw = function() {
        ctx.beginPath();
        ctx.lineCap = "butt";
        ctx.lineWidth = this.width;
        ctx.strokeStyle = this.color;
        ctx.moveTo(this.startX, this.startY);
        ctx.lineTo(this.endX, this.endY);
        ctx.stroke();
    }
}

var myLine = (function() {
    return {
        start: function(e) {
            var rect = canvas.getBoundingClientRect();
            var startX = parseInt(e.clientX - rect.left);
            var startY = parseInt(e.clientY - rect.top);
            painting = true;
            line = new Line(startX, startY);
        },

        draw: function(e) {
            if (!painting) {
                return;
            }
            var rect = canvas.getBoundingClientRect();
            line.endX = parseInt(e.clientX - rect.left);
            line.endY = parseInt(e.clientY - rect.top);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            line.draw();
        },

        finish: function(e) {
            painting = false;
            line = null;
            ctx.beginPath();
        },

        outofbox: function(e) {
            ctx.beginPath();
        }
    }
})();

function focusText(e) {
    window.requestAnimationFrame(focusText);
    if(text) {
        text.textInput.focus();
    }
}

var text;
function Text(startX, startY) {
    this.textInput = document.createElement("input");
    this.textInput.setAttribute("type", "text");
    this.textInput.setAttribute("name", "myInput");
    document.body.appendChild(this.textInput);

    var myWord = "";
    var myStartX = startX;
    var myStartY = startY;

    this.printWord = function (e) {
        myWord = document.getElementsByName("myInput")[0].value;
        background_ctx.fillStyle = myColor;
        background_ctx.font = myFontSize + "px" + " " + myFontFamily;
        background_ctx.fillText(myWord, myStartX, myStartY);
        var element = document.getElementsByName("myInput")[0];
        element.parentNode.removeChild(element);
        text = null;
    }

    this.word = function(e) {
        myWord = document.getElementsByName("myInput")[0].value;
        if(event.key === "Enter" || event.key === "Escape") {
            background_ctx.fillStyle = myColor;
            background_ctx.font = myFontSize + "px" + " " + myFontFamily;
            background_ctx.fillText(myWord, myStartX, myStartY);
            var element = document.getElementsByName("myInput")[0];
            element.parentNode.removeChild(element);
            text = null;
        }
    }
}

var myText = (function() {
    return {
        start: function(e) {
            var rect = canvas.getBoundingClientRect();
            var startX = parseInt(e.clientX - rect.left);
            var startY = parseInt(e.clientY - rect.top);
            text = new Text(startX, startY);
            painting = true;
            text.textInput.style.position = "absolute";
            text.textInput.style.top = startY + "px";
            text.textInput.style.left = startX + "px";
            text.textInput.placeholder = "Type here";
            text.textInput.addEventListener("keydown", text.word);
        },

        draw: function(e) {
            if (!painting) {
                return;
            }
        },

        finish: function(e) {
            painting = false;
        },

        outofbox: function(e) {
            // remove text box
            if(text) {
                text.printWord();
            }
        }
    }
})();


function Choose(icon) {
    canvas.removeAttribute(mousecursor);
    background.removeAttribute(mousecursor);
    if(icon=='Circle') {
        currentTool = 'Circle';
        if(fill) mousecursor = "fillCircleIcon";
        else mousecursor = "circleIcon";
    }
    else if(icon=='Triangle') {
        currentTool = 'Triangle';
        if(fill) mousecursor = "fillTriangleIcon";
        else mousecursor = "triangleIcon";
    }
    else if(icon=='Rectangle') {
        currentTool = 'Rectangle';
        if(fill) mousecursor = "fillRectangleIcon";
        else mousecursor = "rectangleIcon";
    }
    else if(icon=='Line') {
        currentTool = 'Line';
        mousecursor = "lineIcon";
    }
    else if(icon=='Text') {
        currentTool = 'Text';
        mousecursor = "textIcon";

    }
    else if(icon=='Pencil') {
        currentTool = 'Pencil';
        mousecursor = "pencilIcon";
    }
    else if(icon=='Eraser') {
        currentTool = 'Eraser';
        mousecursor = "eraserIcon";
    }
    else if(icon=='Rainbow') {
        currentTool = 'Rainbow';
        mousecursor = 'rainbowIcon';
    }

    if(currentTool=='Eraser') {
        pathInverted = true;
    }
    else {
        pathInverted = false;
    }

    canvas.setAttribute("id", mousecursor);
    background.setAttribute("id", mousecursor);
}

function start(e) {
    if(currentTool=='Pencil' || currentTool=='Eraser' || currentTool=='Rainbow' || currentTool=='Text') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    if(text) {
        text.printWord();
    }

    if(pathInverted) {
        background_ctx.globalCompositeOperation = 'destination-out';
    }
    else {
        background_ctx.globalCompositeOperation = 'source-over';
    }
    myHistory.saveState(background);
    if(currentTool=='Pencil') {
        myPencil.start(e);
    }
    else if(currentTool=='Eraser') {
        myEraser.start(e);
    }
    else if(currentTool=='Text') {
        myText.start(e);
    }
    else if(currentTool=='Line') {
        myLine.start(e);
    }
    else if(currentTool=='Circle') {
        myCircle.start(e);
    }
    else if(currentTool=='Triangle') {
        myTriangle.start(e);
    }
    else if(currentTool=='Rectangle') {
        myRectangle.start(e);
    }
    else if(currentTool=='Rainbow') {
        myRainbow.start(e);
    }
}

function finish(e) {
    if(currentTool=='Pencil') {
        myPencil.finish(e);
    }
    else if(currentTool=='Eraser') {
        myEraser.finish(e);
    }
    else if(currentTool=='Text') {
        myText.finish(e);
    }
    else if(currentTool=='Line') {
        myLine.finish(e);
    }
    else if(currentTool=='Circle') {
        myCircle.finish(e);
    }
    else if(currentTool=='Triangle') {
        myTriangle.finish(e);
    }
    else if(currentTool=='Rectangle') {
        myRectangle.finish(e);
    }
    else if(currentTool=='Rainbow') {
        myRainbow.finish(e);
    }
    var img = new Image();
    img.onload = function() {
        background_ctx.drawImage(img, 0, 0);
    }
    img.src = canvas.toDataURL();
}

function draw(e) {
    if(currentTool=='Pencil') {
        myPencil.draw(e);
    }
    else if(currentTool=='Eraser') {
        myEraser.draw(e);
    }
    else if(currentTool=='Text') {
        myText.draw(e);
    }
    else if(currentTool=='Line') {
        myLine.draw(e);
    }
    else if(currentTool=='Circle') {
        myCircle.draw(e);
    }
    else if(currentTool=='Triangle') {
        myTriangle.draw(e);
    }
    else if(currentTool=='Rectangle') {
        myRectangle.draw(e);
    }
    else if(currentTool=='Rainbow') {
        myRainbow.draw(e);
    }
}

function outofbox(e) {
    if(currentTool=='Pencil') {
        myPencil.outofbox(e);
    }
    else if(currentTool=='Eraser') {
        myEraser.outofbox(e);
    }
    else if(currentTool=='Text') {
        myText.outofbox(e);
    }
    else if(currentTool=='Line') {
        myLine.outofbox(e);
    }
    else if(currentTool=='Circle') {
        myCircle.outofbox(e);
    }
    else if(currentTool=='Triangle') {
        myTriangle.outofbox(e);
    }
    else if(currentTool=='Rectangle') {
        myRectangle.outofbox(e);
    }
    else if(currentTool=='Rainbow') {
        myRainbow.outofbox(e);
    }
}

function changeFill() {
    canvas.removeAttribute(mousecursor);
    background.removeAttribute(mousecursor);
    if(fill) {
        document.getElementById("Circle").style.backgroundImage = "url('icon/dry-clean.png')";
        document.getElementById("Triangle").style.backgroundImage = "url('icon/bleach.png')";
        document.getElementById("Rectangle").style.backgroundImage = "url('icon/square.png')";
        document.getElementById("Fill").style.backgroundImage = "url('icon/circle.png')";
        if(currentTool == 'Circle') {
            mousecursor = "circleIcon";
        }
        else if(currentTool == 'Triangle') {
            mousecursor = "triangleIcon";
        }
        else if(currentTool == 'Rectangle') {
            mousecursor = "rectangleIcon";
        }
    }
    else {
        document.getElementById("Circle").style.backgroundImage = "url('icon/circle.png')";
        document.getElementById("Triangle").style.backgroundImage = "url('icon/triangle.png')";
        document.getElementById("Rectangle").style.backgroundImage = "url('icon/rectangle.png')";
        document.getElementById("Fill").style.backgroundImage = "url('icon/dry-clean.png')";
        if(currentTool == 'Circle') {
            mousecursor = "fillCircleIcon";
        }
        else if(currentTool == 'Triangle') {
            mousecursor = "fillTriangleIcon";
        }
        else if(currentTool == 'Rectangle') {
            mousecursor = "fillRectangleIcon";
        }
    }
    fill = !fill;

    canvas.setAttribute("id", mousecursor);
    background.setAttribute("id", mousecursor);
}