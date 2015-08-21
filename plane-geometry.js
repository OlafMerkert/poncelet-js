// (c) Olaf Merkert 2015

// plane geometry: points, lines and circles

function CollinearPointsException(line) {
    this.line = line;
    this.message = "Given points are collinear, cannot produce a circle through all of them.";
}

var dot_radius = 3;

function Point(x, y) {
    this.x = x;
    this.y = y;
    this.drawCanvas = function (ctx) {
        // fill circle
        ctx.beginPath();
        ctx.arc(this.x, this.y, dot_radius, 0, 2*Math.PI);
        ctx.fill();
    };
    this.drawRaphael = function (paper, color) {
        var circle = paper.circle(this.x, this.y, dot_radius);
        fill(circle, color);
    };
    this.equal = function (point) {
        return (point.x - this.x == 0) && (point.y - this.y == 0);
    };
    // a vector from this point
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
    this.norm = function () {
        return Math.sqrt(Math.pow(this.x, 2) +
                         Math.pow(this.y, 2));
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
}

function DirectionLessLineError() {
    this.message = "Line has zero direction vector.";
}

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
    this.boundaryPoints = function (max_x, max_y) {
        var t1, t2;
        var min_t, max_t;
        if (this.direction.x != 0) {
            min_t = - this.point.x / this.direction.x;
            max_t = (max_x - this.point.x) / this.direction.x;
            if (max_t < min_t) {
                t1 = max_t;
                max_t = min_t;
                min_t = t1;
            }
            if (this.direction.y != 0) {
                t1 = - this.point.y / this.direction.y;
                t2 = (max_y - this.point.y) / this.direction.y;
                if (t2 < t1) {
                    min_t = Math.max(min_t, t2);
                    max_t = Math.min(max_t, t1);
                } else {
                    min_t = Math.max(min_t, t1);
                    max_t = Math.min(max_t, t2);
                }
            }
        }
        else if (this.direction.y != 0) {
            min_t = - this.point.y / this.direction.y;
            max_t = (max_y - this.point.y) / this.direction.y;
            if (max_t < min_t) {
                t1 = max_t;
                max_t = min_t;
                min_t = t1;
            }
        } else {
            throw new DirectionLessLineError();
        }
        return [this.param(min_t), this.param(max_t)];
    };
    this.drawCanvas = function (ctx) {
        ctx.beginPath();
        var points = this.boundaryPoints(800, 600);
        ctx.moveTo(points[0].x, points[0].y);
        ctx.lineTo(points[1].x, points[1].y);
        ctx.stroke();
    };
}

function Circle(center, radius) {
    this.center = center;
    this.radius = radius;
    this.drawCanvas = function (ctx) {
        ctx.beginPath();
        ctx.arc(this.center.x, this.center.y, this.radius, 0, 2*Math.PI);
        ctx.stroke();
    };
    // project any point different from center onto the circle
    this.project = function (point) {
        if (! this.center.equal(point)) {
            var delta = this.center.relative(point);
            var line = new Line(this.center, delta);
            return line.param(this.radius / delta.norm());
        }
    };
}

function circleFromPoints(p1, p2, p3) {
    var line = new Line(p1, p2);
    // test if the points are on a line
    if (line.containsQ(p3)) {
        throw new CollinearPointsException(line);
    }
    var ms2 = p1.mittelsenkrechte(p2);
    var ms3 = p1.mittelsenkrechte(p3);
    var center = ms2.intersect(ms3);
    return new Circle(center, center.distance(p1));
}
