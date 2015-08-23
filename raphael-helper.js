// (c) Olaf Merkert 2015

// working with raphael paper
function MyPaper(id) {
    this.canvas = document.getElementById(id);
    var $c = $(this.canvas);
    this.width = $c.width();
    this.height = $c.height();
    this.paper = new Raphael(this.canvas, this.width, this.height);
    this.color = "black";
    this.draw = function (obj) {
        return obj.drawRaphael(this.paper, this.color);
    };
    this.setColor = function (color) {
        this.color = color;
    };
    this.reset = function () {
        this.paper.clear();
    };
    this.goBlue = function () {
        this.setColor("blue");
    };
    this.goRed = function () {
        this.setColor("red");
    };
    this.goBlack = function () {
        this.setColor("black");
    };
}

function fill(obj, color) {
    obj.attr({"fill": color,
              "stroke": null});
}

function stroke(obj, color) {
    obj.attr({"fill": null,
              "stroke": color,
              "stroke-width": 1});
}

function polygonString(points) {
    var result = "M" + points[0].x + "," + points[0].y;
    for (var i = 1; i < points.length; i++) {
        result += "L" + points[i].x + "," + points[i].y;
    }
    return result;
}

function getPonceletPaper() {
    return new MyPaper("poncelet-canvas");
};

var pc;

window.onload = function () {
    console.log("preparing paper");
    pc = getPonceletPaper();
}
