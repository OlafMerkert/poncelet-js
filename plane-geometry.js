// (c) Olaf Merkert 2015

// plane geometry: points, lines and circles

var EPS = Math.pow(10, -8);

function almost0(number) {
    return Math.abs(number) < EPS;
}

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
        return almost0(point.x - this.x) && almost0(point.y - this.y);
    };
    // a vector from this point
    this.relative = function (point) {
        return new Point(point.x - this.x, point.y - this.y);
    };
    this.relative_normed = function (point) {
        return this.relative(point).normed();
    };
    this.midpoint = function (point) {
        return new Point((point.x + this.x)/2, (point.y + this.y)/2);
    };
    this.distance = function (point) {
        return Math.sqrt(Math.pow(point.x - this.x, 2) +
                         Math.pow(point.y - this.y, 2));
    };
    this.inner = function (point) {
        return this.x * point.x + this.y * point.y;
    };
    this.norm2 = function () {
        return Math.pow(this.x, 2) + Math.pow(this.y, 2);
    };
    this.norm = function () {
        return Math.sqrt(this.norm2());
    };
    this.scaled = function (scaleFactor) {
        return new Point(scaleFactor * this.x, scaleFactor * this.y);
    };
    this.normed = function () {
        return this.scaled(1/this.norm());
    };
    this.rotate90 = function () {
        return new Point(-y, x);
    };
    this.rotate = function (alpha) {
        var c, s;
        c = Math.cos(alpha);
        s = Math.sin(alpha);
        return new Point(this.x * c - this.y * s,
                         this.x * s + this.y * c);
    };
    this.rotateCos = function (c, positive) {
        var s = Math.sqrt(1 - Math.pow(c, 2));
        if (!positive) {
            s = -s;
        }
        return new Point(this.x * c - this.y * s,
                         this.x * s + this.y * c);
    };
    this.mittelsenkrechte = function (point) {
        return new Line(this.midpoint(point), this.relative(point).rotate90());
    };
    this.collinearQ = function (point) {
        return almost0(this.x * point.y - this.y * point.x);
    };
    this.add = function (point) {
        return new Point(this.x + point.x, this.y + point.y);
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
    this.equal = function (line) {
        return (this.direction.collinearQ(line.direction)
                && this.containsQ(line.point));
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
    this.drawRaphael = function (paper, color) {
        var line = paper.path(polygonString(this.boundaryPoints(pc.width, pc.height)));
        stroke(line, color);
    };
}

function SingularPoint() {
    this.message = "Illegal point for this operation.";
}

function Circle(center, radius) {
    this.center = center;
    this.radius = radius;
    this.drawCanvas = function (ctx) {
        ctx.beginPath();
        ctx.arc(this.center.x, this.center.y, this.radius, 0, 2*Math.PI);
        ctx.stroke();
    };
    this.drawRaphael = function (paper, color) {
        var circle = paper.circle(this.center.x, this.center.y, this.radius);
        stroke(circle, color);
    };
    this.param = function (t) {
        return new Point(this.center.x + this.radius * Math.cos(t),
                         this.center.y + this.radius * Math.sin(t));
    };
    this.param_tangent = function (t) {
        var c = Math.cos(t);
        var s = Math.sin(t);
        return new Line(new Point(this.center.x + this.radius * c,
                                  this.center.x + this.radius * s),
                        new Point(s, -c));
    };
    // project any point different from center onto the circle
    this.project = function (point) {
        if (! this.center.equal(point)) {
            var delta = this.center.relative(point);
            var line = new Line(this.center, delta);
            return line.param(this.radius / delta.norm());
        } else {
            throw new SingularPoint();
        }
    };
    this.intersectLine = function (line) {
        // need to solve this equation in t:
        // line.point -this.center + t * line.direction == this.radius
        var poCe = this.center.relative(line.point);
        var a = line.direction.norm2();
        var b = 2 * poCe.inner(line.direction);
        var c = poCe.norm2() - Math.pow(this.radius, 2);
        var t = solveQuadratic(a, b, c);
        if (t.length == 0) {
            return [];
        } else if (t.length == 1) {
            return [line.param(t[0])];
        } else {
            return [line.param(t[0]), line.param(t[1])];
        }
    };
}

function solveQuadratic(a, b, c) {
    // console.log("a=" + a + " b=" + b + " c=" + c);
    // solve equation a * X^2 + b * X + c == 0
    var D = (Math.pow(b, 2) - 4 * a * c);
    if (D > 0) {
        var sqrtD = Math.sqrt(D);
        return [(-b + sqrtD)/(2*a), (-b - sqrtD)/(2*a)];
    } else if (almost0(D))  {
        return [-b/(2*a)];
    } else {
        return [];
    }
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

function findTangents(point, circle) {
    // there are (at most) two lines through `point' tangent to `circle' 
    var r, R, d;
    r = circle.radius;
    d = circle.center.relative(point);
    R = d.norm();
    if (R > r) {
        var p0 = d.scaled(r/R);
        var p1 = p0.rotateCos(r/R, true);
        var p2 = p0.rotateCos(r/R, false);
        return [new Line(circle.center.add(p1), p1.rotate90()),
                new Line(circle.center.add(p2), p2.rotate90())];
    } else if (almost0(R-r)) {
        return [new Line(point, d.rotate90())];
    } else {
       return [];
    }
}
