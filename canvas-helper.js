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
    this.relative = function (point) {
        return new Point(point.x - this.x, point.y - this.y);
    };
    this.midpoint = function (point) {
        return new Point((point.x + this.x)/2, (point.y + this.y)/2);
    };
    this.distance = function (point) {
        return Math.sqrt(Math.pow(point.x - this.x, 2) +
                         Math.pow(point.y - this.y, 2));
    };
    this.rotate90 = function () {
        return new Point(-y, x);
    };
    this.mittelsenkrechte = function (point) {
        return new Line(this.midpoint(point), this.relative(point).rotate90());
    };
    this.collinearQ = function (point) {
        return (this.x * point.y - this.y * point.x) == 0;
    };
};

function Line(point, direction) {
    this.point = point;
    this.direction = direction;
    this.containsQ = function (point) {
        return this.direction.collinearQ(this.point.relative(point));
    };
    this.param = function (t) {
        return new Point(this.point.x + t * this.direction.x,
                         this.point.y + t * this.direction.y);
    };
    this.intersect = function (line) {
        if (this.direction.collinearQ(line.direction)) {
            return this.containsQ(line.point);
        } else {
            var matrix = [[this.direction.x, line.direction.x],
                          [this.direction.y, line.direction.y]];
            var vector = [this.point.x - line.point.x,
                          this.point.y - line.point.y];
            var solution = numeric.solve(matrix, vector);
            return line.param(solution[1]);
        }
    };
    this.draw = function (ctx) {
        ctx.beginPath();
        var start = this.param(-2);
        var end = this.param(2);
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.stroke();
    };
}

function Circle(center, radius) {
    this.center = center;
    this.radius = radius;
    this.draw = function (ctx) {
        ctx.beginPath();
        ctx.arc(this.center.x, this.center.y, this.radius, 0, 2*Math.PI);
        ctx.stroke();
    };
}

function CollinearPointsException(line) {
    this.line = line;
    this.message = "Given points are collinear, cannot produce a circle through all of them.";
}

function circleFromPoints(p1, p2, p3) {
    var line = new Line(p1, p2);
    // test if the points are on a line
    if (line.containsQ(p3)) {
        throw new CollinearPointsException(line);
    }
    console.log("non collinear");
    var ms2 = p1.mittelsenkrechte(p2);
    var ms3 = p1.mittelsenkrechte(p3);
    var center = ms2.intersect(ms3);
    return new Circle(center, center.distance(p1));
}

window.onload = function () {
    console.log("preparing canvas");
    var pc = getPonceletCanvas();
    var points = [new Point(150, 10), new Point(150, 100), new Point(200, 50)];
    var circle = circleFromPoints(points[0], points[1], points[2]);
    pc.drawMany(points);
    pc.draw(circle);
}
