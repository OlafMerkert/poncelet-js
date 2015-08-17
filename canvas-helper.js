// (c) Olaf Merkert 2015

// working with the canvas
function MyCanvas(id) {
    this.canvas = document.getElementById(id);
    this.context = this.canvas.getContext("2d");
    this.context.fillStyle = "black";
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
    this.drawRed = function (obj) {
        this.setColor("red");
        this.draw(obj);
    };
    this.drawBlue = function (obj) {
        this.setColor("blue");
        this.draw(obj);
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
