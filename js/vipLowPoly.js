/**
 @ Name：vip-admin.lowPoly
 @ Author：随丶
 @ version：1.0.0
 */
layui.define(['layer'], function (exp) {

    var $ = layui.$,

    // 外部接口
    poly = {
        config:{
            startColor: '43DDE6'
            ,endColor: '000000'
            ,speed: 60
        }
    };

    var lowPoly = function (el,obj) {
        var cfg = $.extend({},poly.config,obj);
        this.canvas = document.getElementById(el);
        this.range = 100;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.standard = {x: Math.floor(this.canvas.width / 2), y: Math.floor(this.canvas.height / 2)};
        this.start = parseInt(cfg.startColor, 16)||parseInt(poly.config.startColor, 16);
        this.end = parseInt(cfg.endColor, 16)||parseInt(poly.config.endColor, 16);
        //console.log(this.start);
        //console.log(this.end);
        this.colorRange = this.start - this.end;
        var colums = Math.floor(this.width / this.range) + 1;
        var rows = Math.floor(this.height / this.range) + 1;
        this.dotArr = [];
        for (var i = 0; i < rows; i++) {
            this.dotArr[i] = [];
            for (var j = 0; j < colums; j++) {
                var speedX, speedY;
                if (j == 0) {
                    var x = 0;
                    speedX = 0;
                } else if (j == colums - 1) {
                    var x = this.width;
                    speedX = 0;
                } else {
                    var x = Math.random() * this.range - this.range / 2 + j * this.range;
                    speedX = (Math.random() >= 0.5) ? 1 : -1;
                }
                if (i == 0) {
                    var y = 0;
                    speedY = 0;
                } else if (i == rows - 1) {
                    var y = this.height;
                    speedY = 0;
                } else {
                    var y = Math.random() * this.range - this.range / 2 + i * this.range;
                    speedY = (Math.random() >= 0.5) ? 1 : -1;
                }
                //var x = Math.random()*this.range - this.range/2 + (j-1)*this.range;
                //var y = Math.random()*this.range - this.range/2 + (i-1)*this.range;
                //var speedX = (Math.random() >=0.5)?1:-1;
                //var speedY = (Math.random() >=0.5)?1:-1;
                this.dotArr[i][j] = {x: x, y: y, speedX: speedX, speedY: speedY};
            }
        }
        this.render();
        this.mouse();
        var _this = this;
        setInterval(function () {
            _this.render()
        }, cfg.speed);
    };

    lowPoly.prototype.mouse = function () {
        var _this = this;
        this.canvas.onmousemove = function (e) {
            var bbox = _this.canvas.getBoundingClientRect();
            var x = e.clientX - bbox.left * (_this.canvas.width / bbox.width);
            var y = e.clientY - bbox.top * (_this.canvas.height / bbox.height);
            _this.standard = {x: x, y: y};
        }
    };

    lowPoly.prototype.getColor = function (data) {
        var center = {};
        center.x = (data[0].x + data[1].x + data[2].x) / 3;
        center.y = (data[0].y + data[1].y + data[2].y) / 3;
        var a = 1 + Math.pow(16, 2) + Math.pow(16, 4);
        var s = Math.floor(Math.sqrt(Math.pow(Math.abs(center.x - this.standard.x), 2) + Math.pow(Math.abs(center.y - this.standard.y), 2)));//计算三角形中点到指定位置的距离
        s = Math.floor(s / 4) * a;
        if (s > this.colorRange) {
            s = this.colorRange;
        }
        var color = this.start - s;
        return "#" + ("000000" + color.toString(16)).slice(-6);
    };

    lowPoly.prototype.paint = function (data) {
        var c = this.canvas;
        var cxt = c.getContext("2d");
        cxt.beginPath();
        cxt.moveTo(data[0].x, data[0].y);
        cxt.lineTo(data[1].x, data[1].y);
        cxt.lineTo(data[2].x, data[2].y);
        cxt.closePath();
        cxt.fillStyle = this.getColor(data);
        cxt.strokeStyle = this.getColor(data);
        cxt.stroke();
        cxt.fill();
    };

    lowPoly.prototype.draw = function () {
        for (var i = 0; i < this.dotArr.length - 1; i++) {
            for (var j = 0; j < this.dotArr[i].length - 1; j++) {
                var data = [this.dotArr[i][j], this.dotArr[i + 1][j], this.dotArr[i + 1][j + 1]];
                this.paint(data);
                if (j != this.dotArr[i].length - 1) {
                    var data = [this.dotArr[i][j], this.dotArr[i + 1][j + 1], this.dotArr[i][j + 1]];
                    this.paint(data);
                }
            }
        }
    };

    lowPoly.prototype.change = function () {
        for (var i = 0; i < this.dotArr.length; i++) {
            for (var j = 0; j < this.dotArr[i].length; j++) {
                var data = this.dotArr[i][j];
                if (data.speedX != 0) {
                    data.x = data.x + data.speedX;
                }
                if (data.speedY != 0) {
                    data.y = data.y + data.speedY;
                }
                var maxX = this.range / 2 + j * this.range,
                    minX = 0 - this.range / 2 + j * this.range,
                    maxY = this.range / 2 + i * this.range,
                    minY = 0 - this.range / 2 + i * this.range;
                if (data.x > maxX || data.x < minX) {
                    data.speedX = 0 - data.speedX;
                }
                if (data.y > maxY || data.y < minY) {
                    data.speedY = 0 - data.speedY;
                }
            }
        }
    };

    // 渲染
    lowPoly.prototype.render = function () {
        this.change();
        this.draw();
    };

    //核心入口
    poly.start = function (el,obj) {
        return new lowPoly(el,obj);
    };

    // 输出
    exp('vipLowPoly', poly);
});