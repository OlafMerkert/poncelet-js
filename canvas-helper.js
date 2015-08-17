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
        return obj.draw(this.context);
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
};

function getPonceletCanvas() {
    return new MyCanvas("poncelet-canvas");
};

function Point(x, y) {
    this.x = x;
    this.y = y;
    this.draw = function (ctx) {
        var dot_radius = 3;
        // fill circle
        ctx.beginPath();
        ctx.arc(this.x, this.y, dot_radius, 0, 2*Math.PI);
        ctx.fill();
    };
};

window.onload = function () {
    console.log("preparing canvas");
    var pc = getPonceletCanvas();
    // pc.context.mozImageSmoothingEnabled = false;
    var p1 = new Point(20, 20);
    var p2 = new Point(40, 20);
    pc.drawBlue(p1);
    pc.drawRed(p2);
}
