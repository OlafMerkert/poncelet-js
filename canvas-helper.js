// (c) Olaf Merkert 2015

// working with the canvas
function MyCanvas(id) {
    this.canvas = document.getElementById(id);
    this.context = this.canvas.getContext("2d");
    this.context.translate(0.5, 0.5);
    var $c = $(this.canvas);
    this.width = $c.width();
    this.height = $c.height();
    this.draw = function (obj) {
        return obj.drawCanvas(this.context);
    };
    this.drawMany = function (objs) {
        for(var i = 0; i < objs.length; i++) {
            this.draw(objs[i]);
        }
    };
    this.setColor = function (color) {
        this.context.fillStyle = color;
        this.context.strokeStyle = color;
    };
    this.saveColor = function () {
        this.fillColor = this.context.fillStyle;
        this.strokeColor = this.context.strokeStyle;
    };
    this.restoreColor = function () {
        if (this.fillColor && this.strokeColor) {
            this.context.fillStyle = this.fillColor;
            this.context.strokeStyle = this.strokeColor;
        } else {
            this.setColor("black");
        }
    };
    this.goRed = function () {
        this.saveColor();
        this.setColor("red");
    };
    this.goBlue = function () {
        this.saveColor();
        this.setColor("blue");
    };
    this.goBlack = function () {
        this.saveColor();
        this.setColor("black");
    };

    this.setColor("black");
    this.drawRed = function (obj) {
        this.saveColor();
        this.setColor("red");
        this.draw(obj);
        this.restoreColor();
    };
    this.drawBlue = function (obj) {
        this.saveColor();
        this.setColor("blue");
        this.draw(obj);
        this.restoreColor();
    };
    this.reset = function () {
        this.setColor("black");
        this.context.clearRect(0, 0, this.width, this.height);
    };
};

function getPonceletCanvas() {
    return new MyCanvas("poncelet-canvas");
};

var pc;

window.onload = function () {
    console.log("preparing canvas");
    pc = getPonceletCanvas();
}
