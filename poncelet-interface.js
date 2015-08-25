// (c) Olaf Merkert 2015

// setting up Poncelet problem
var blueCircle, redCircle;
var blueStartingPoint;
var redStartingTangent;

var currentPoncelet;

function drawPoncelet() {
    // var pc = getPonceletCanvas();
    pc.setColor("blue");
    if (blueCircle) {
        pc.draw(blueCircle);
    }
    pc.setColor("black");
    if (blueStartingPoint) {
        pc.draw(blueStartingPoint);
    }
    pc.setColor("gray");
    if (redStartingTangent) {
        pc.draw(redStartingTangent);
    }
    pc.setColor("red");
    if (redCircle) {
        pc.draw(redCircle);
    }
    pc.setColor("black");
}

function redrawPoncelet() {
    pc.reset();
    drawPoncelet();
}

function resetPoncelet() {
    pc.reset();
    currentPoncelet = undefined;
    redCircle = undefined;
    blueCircle = undefined;
    blueStartingPoint = undefined;
    redStartingTangent = undefined;
}

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
                // clean up events
                $(this.pc.canvas).off("click");
                // then do action, so the handler gets cleaned up even
                // if there is some error in the `action'
                this.action(this.points);
            }
        } else {
            console.log("Stale event handler.");
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

function selectRedCircle() {
    currentPoncelet = undefined;
    // var pc = getPonceletCanvas();
    pc.setColor("red");
    CircleSelector(pc, function (circle) {
        redCircle = circle;
        if (blueStartingPoint) {
            computeRedTangent();
        } else {
            redStartingTangent = undefined;
        }
        redrawPoncelet();
    });
}

function selectBlueCircle() {
    currentPoncelet = undefined;
    // var pc = getPonceletCanvas();
    pc.setColor("blue");
    CircleSelector(pc, function (circle) {
        blueCircle = circle;
        blueStartingPoint = undefined;
        redStartingTangent = undefined;
        redrawPoncelet();
    });
}

function selectStartingPoint() {
    currentPoncelet = undefined;
    // var pc = getPonceletCanvas();
    if (blueCircle) {
        var ps = new PointSelector(
            1,
            function (points) {
                blueStartingPoint = blueCircle.project(points[0]);
                if (redCircle) {
                    computeRedTangent();
                }
                redrawPoncelet();
            });
        ps.askNextPoint(pc);
    } else {
        messageInfo("Please select the <span class='blue'>blue circle</span> first");
    }
}

function computeRedTangent() {
    if (redCircle && blueStartingPoint) {
        var tangents = findTangents(blueStartingPoint, redCircle);
        if (tangents.length > 0) {
            redStartingTangent = tangents[0];
        } else {
            messageWarning("Choose a different starting point, the current one does not lie on any tangent of the <span class='red'>red circle</span>.");
            throw new GeometricMisconfiguration("compute-tangent");
        }
    }
}

function GeometricMisconfiguration(operation) {
    this.message = "The configuration of the circles and points makes it impossible to perform the required geometric constructions.";
    this.operation = operation;
}

function ponceletChangePoint(point, tangent) {
    // select the other point on tangent
    var points = blueCircle.intersectLine(tangent);
    if (points.length == 0) {
        throw new GeometricMisconfiguration("change-point");
    } else if (points.length > 1) {
        if (points[0].equal(point)) {
            return points[1];
        } else {
            return points[0];
        }
    } else {
        // if the intersection is a single point, no change
        return point;
    }
}

function ponceletChangeTangent(point, tangent) {
    // select the other tangent
    var tangents = findTangents(point, redCircle);
    if (tangents.length == 0) {
        throw new GeometricMisconfiguration("change-tangent");
    } else if (tangents.length > 1) {
        if (tangents[0].equal(tangent)) {
            return tangents[1];
        } else {
            return tangents[0];
        }
    } else {
        return tangent;
    }
}

function ponceletNextStep(args) {
    var nextPoint, nextTangent;
    nextPoint = ponceletChangePoint(args.point, args.tangent);
    pc.setColor("black");
    pc.draw(nextPoint);
    nextTangent = ponceletChangeTangent(nextPoint, args.tangent);
    pc.setColor("lightgray");
    pc.draw(nextTangent);
    return {"point": nextPoint, "tangent": nextTangent};
}

function drawStep(args) {
    pc.setColor("black");
    pc.draw(args.point);
    pc.setColor("gray");
    pc.draw(args.tangent);
}

function ponceletStep(n) {
    if (!n) {
        n = 1;
    }
    if (blueCircle && redCircle && blueStartingPoint) {
        if (!redStartingTangent) {
            computeRedTangent();
            redrawPoncelet();
        }
        if (!currentPoncelet) {
            currentPoncelet = {"point": blueStartingPoint,
                               "tangent": redStartingTangent};
            redrawPoncelet();
        }
        try {
            for (var i = 0; i < n; i++) {
                currentPoncelet = ponceletNextStep(currentPoncelet);
                // drawStep(currentPoncelet);
            }
        } catch(e) {
            console.log("Exception: " + e.message + " in " + e.operation);
        }
    } else {
        if (!blueCircle) {
            messageInfo("You need to choose a <span class='blue'>blue circle</span> before you can play.");
        } else if (!blueStartingPoint) {
            messageInfo("You need to choose a starting point on the the <span class='blue'>blue circle</span> before you can play.");
        }
        if (!redCircle) {
            messageInfo("You need to choose a <span class='red'>red circle</span> before you can play.");
        }
    }
}
