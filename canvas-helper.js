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
};

function getPonceletCanvas() {
    return new MyCanvas("poncelet-canvas");
};

function PointSelector(numberOfPoints, action) {
    this.numberOfPoints = numberOfPoints;
    this.points = [];
    this.action = action;
    this.addPoint = function (event) {
        if (this.points.length < this.numberOfPoints) {
            var point = new Point(event.pageX - this.offsetX,
                                  event.pageY - this.offsetY);
            this.points.push(point);
            this.pc.draw(point);
            if (this.points.length >= this.numberOfPoints) {
                this.action(this.points);
            }
        } else {
            // clean up events
            $(this.pc.canvas).off("click");
        }
    };
    this.askNextPoint = function (pc) {
        this.pc = pc;
        if (this.points.length < this.numberOfPoints) {
            var $canvas = $(pc.canvas);
            this.offsetX = $canvas.offset().left;
            this.offsetY = $canvas.offset().top;
            var ps = this;
            $canvas.click(function (event) {
                ps.addPoint(event);
            });
        }
    };
}

function CircleSelector(pc, action) {
    var ps = new PointSelector(
        3,
        function (points) {
            var circle = circleFromPoints(points[0], points[1], points[2]);
            pc.draw(circle);
            action(circle);
        });
    ps.askNextPoint(pc);
}

var pc;

window.onload = function () {
    console.log("preparing canvas");
    pc = getPonceletCanvas();
}
