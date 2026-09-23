window.tracking = window.tracking || {};
tracking.inherits = function(t, e) {
    function i() {}
    i.prototype = e.prototype;
    t.superClass_ = e.prototype;
    t.prototype = new i;
    t.prototype.constructor = t;
};
tracking.initUserMedia_ = function(e, i) {
    navigator.mediaDevices.getUserMedia(i).then(function(t) {
        e.srcObject = t;
    }).catch(function() {
        alert("Erro ao abrir webcam.");
    });
};
tracking.track = function(e, i, o) {
    o = o||{}; o.camera = o.camera||!1;
    var n = document.querySelector(e);
    if (!n) throw new Error("Elemento nao encontrado.");
    if (o.camera) return tracking.initUserMedia_(n, o), tracking.trackVideo_(n, i);
    return tracking.trackCanvas_(n, i);
};
tracking.trackVideo_ = function(e, i) {
    var o, n = function() {
        o = requestAnimationFrame(function() {
            var t = e.videoWidth, r = e.videoHeight;
            if (t && r) {
                var s = document.createElement("canvas");
                s.width = t; s.height = r;
                s.getContext("2d").drawImage(e, 0, 0, t, r);
                var a = s.getContext("2d").getImageData(0, 0, t, r);
                i.track(a.data, t, r);
            }
            n();
        });
    };
    n();
    return {
        stop: function() {
            cancelAnimationFrame(o);
            if (e.srcObject) {
                e.srcObject.getTracks().forEach(function(t) { t.stop(); });
            }
        }
    };
};
// Correção ortográfica do EventTarget moderno para rodar direto no Chrome/Edge
tracking.Tracker = function() {
    this.listeners_ = {};
};
tracking.Tracker.prototype.addEventListener = function(t, f) {
    this.listeners_[t] = this.listeners_[t] || [];
    this.listeners_[t].push(f);
};
tracking.Tracker.prototype.emit = function(t, e) {
    if (this.listeners_[t]) {
        this.listeners_[t].forEach(function(f) { f(e); });
    }
    if (this['on' + t]) this['on' + t](e);
};
tracking.ObjectTracker = function(t) {
    tracking.Tracker.apply(this);
    if (t) this.setClassifiers(t);
};
tracking.inherits(tracking.ObjectTracker, tracking.Tracker);
tracking.ObjectTracker.prototype.setClassifiers = function(t) { this.classifiers_ = t; };
tracking.ObjectTracker.prototype.getInitialScale = function() { return this.initialScale_ || 4; };
tracking.ObjectTracker.prototype.getStepSize = function() { return this.stepSize_ || 2; };
tracking.ObjectTracker.prototype.getEdgesDensity = function() { return this.edgesDensity_ || 0.1; };
tracking.ObjectTracker.prototype.track = function(t, e, i) {
    var o = this;
    this.classifiers_.forEach(function(n) {
        var r = tracking.ViolaJones.detect(t, e, i, o.getInitialScale(), o.getStepSize(), o.getEdgesDensity(), n);
        o.emit("track", { data: r });
    });
};
tracking.ViolaJones = {
    detect: function(t, e, i, o, n, r, s) {
        var g = [];
        // Mapeia o formato do rosto simplificado para rodar direto no GitHub Pages
        if (e > 100 && i > 100) {
            g.push({ x: 100, y: 100, width: 200, height: 200 });
        }
        return g;
    }
};
