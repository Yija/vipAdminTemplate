/**
 @ Name：vip-admin.tree
 @ Author：随丶
 */
layui.define(['layer'], function (exp) {
    var $ = layui.$
    ,layer = layui.layer

    //外部接口
    ,tree = {};

    // 树
    var Tree = function (element, options) {
        this.element = element;
        //json数组
        this.JSONArr = options.arr;
        //单个文件图标
        this.simIcon = options.simIcon || "&#xe67a;";
        //多个文件打开图标
        this.mouIconOpen = options.mouIconOpen || "&#xe683;";
        //多个文件关闭图标
        this.mouIconClose = options.mouIconClose || "&#xe67c;";
        //回调函数
        this.callback = options.callback || function () {};
        //初始化
        this.init();
    };

    // 初始化事件
    Tree.prototype.init = function () {
        //事件
        this.JSONTreeArr = this.proJSON(this.JSONArr, 0);
        this.treeHTML = this.proHTML(this.JSONTreeArr);
        this.element.append(this.treeHTML);
        this.bindEvent();
    };

    // 生成树形JSON数据
    Tree.prototype.proJSON = function (oldArr, pid) {
        var newArr = [];
        var self = this;
        oldArr.map(function (item) {
            if (item.pid == pid) {
                var obj = {
                    id: item.id,
                    name: item.name
                };
                var child = self.proJSON(oldArr, item.id);
                if (child.length > 0) {
                    obj.child = child
                }
                newArr.push(obj)
            }

        });
        return newArr;

    };

    // 生成树形HTML
    Tree.prototype.proHTML = function (arr) {
        var ulHtml = "<ul class='vip-tree-ul-box'>";
        var self = this;
        arr.map(function (item) {
            var lihtml = "<li>";
            if (item.child && item.child.length > 0) {
                lihtml += "<i ischek='true' class='vip-icon'>" + self.mouIconOpen + "</i>" +
                    "<span id='" + item.id + "'>" + item.name + "</span>";
                var _ul = self.proHTML(item.child);
                lihtml += _ul + "</li>";
            } else {
                lihtml += "<i class='vip-icon'>" + self.simIcon + "</i>" +
                    "<span id='" + item.id + "'>" + item.name + "</span>";
            }
            ulHtml += lihtml;
        });
        ulHtml += "</ul>";
        return ulHtml;
    };

    // 绑定事件
    Tree.prototype.bindEvent = function () {
        var self = this;
        this.element.find(".vip-tree-ul-box li i").click(function () {
            var ischek = $(this).attr("ischek");
            if (ischek == 'true') {
                $(this).closest("li").children(".vip-tree-ul-box").hide();
                $(this).removeClass(self.mouIconOpen).html(self.mouIconClose);
                $(this).attr("ischek", 'false');
            } else if (ischek == 'false') {
                $(this).closest("li").children(".vip-tree-ul-box").show();
                $(this).removeClass(self.mouIconClose).html(self.mouIconOpen);
                $(this).attr("ischek", 'true')
            }
        });

        this.element.find(".vip-tree-ul-box li span").click(function () {
            var id = $(this).attr("id");
            var name = $(this).text();
            self.callback(id, name)
        })
    };

    //核心入口
    tree.render = function (elem,opt) {
        return new Tree(elem, opt)
    };

    // 输出
    exp('vipTree', tree);
});
