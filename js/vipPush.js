/**
 * Created by Administrator on 2018/8/21.
 */
layui.define(['layer','carousel'], function (exp) {
    var $ = layui.$
    , layer = layui.layer
    , carousel = layui.carousel
    , cfg = {}

    // 外部接口
    , push = {
        config: {
            title: 'vipPush'
            ,version: '1.0.0'
            ,area: ['350px','393px']
            ,offset: 'rb'
            ,anim: 2
            ,shade: false
            ,stylesheet: './../vipPush.css'
            ,maxmin: true
            ,btn: false
            ,resize: false

            ,colXsWidth: 6
            ,colSmWidth: 3
            ,colMdWidth: 2

            ,minXsWidth: 500
            ,minMdWidth: 1170

            ,culOpts:{
                elem: '.push-carousel'
                ,width: '100%'
                ,height: 310
                ,indicator: 'none'
                ,arrow: 'always'
            }
        }
        ,culRender: function(dom){
            //重置轮播
            culIns.reload($.extend(cfg.culOpts,{height:dom.height()-83}));
        }
        ,set: function (opts) {
            return $.extend({}, push.config, opts);
        }
        ,render: function (opts) {
            cfg = push.set(opts);
            //console.log(cfg);
            layui.link(cfg.stylesheet);

            $.get(cfg.url,cfg.where||{},function(res){
                if(res.code == 0){
                    var html = '<div class="vip-push"><ul class="vip-push-body">', htmlFooter='';
                    $.each(res.data,function(kk,vv){
                        htmlFooter += '<span class="'+ (kk?'':'active') +'">'+ vv.title +'</span>';
                        html += '<li class="layui-row layui-col-space5 '+ (kk?'layui-hide':'') +'">';

                        if(vv.type == 3){

                            html += '<div>' +
                                '<div class="layui-carousel push-carousel">' +
                                '<div carousel-item>';

                            $.each(vv.data,function(k,v){
                                html += '<div><a class="" href="'+ (v.coupon||v.href||'javascript:;') +'" target="_blank"><img src="'+ v.src +'" alt="'+ (v.alt||'') +'" title="'+ v.title +'" /></a></div>';
                            });

                            html += '</div></div></div>';

                        }
                        else{
                            $.each(vv.data,function(k,v){
                                html += '<a class="layui-col-xs'+ cfg.colXsWidth +' vip-push-type'+ (vv.type||'') +'" href="'+ (v.coupon||v.href||'javascript:;') +'" target="_blank">' +
                                '<div class="vip-push-list">' +
                                '<span class="vip-push-list-price">'+ v.price +'</span>' +
                                '<img src="'+ v.src +'" alt="'+ (v.alt||'') +'" title="'+ v.title +'" />' +
                                //'<div class="vip-push-list-body" title="'+ v.title +'">'+ v.title +'</div>' +
                                '</div>' +
                                '</a>';
                            });
                        }

                        html += '</li>';
                    });

                    html += '</ul>' +
                        '<div class="vip-push-footer">'+ htmlFooter +'</div>' +
                        '</div>';
                    // push 弹框
                    layer.open($.extend(cfg, {
                        type: 1
                        ,skin:'vip-push-container'
                        ,title: (cfg.title+'-'+cfg.version), content: html
                        ,full: function(dom){
                            var width = dom.width();
                            if(width>cfg.minMdWidth){
                                dom.find('.vip-push-body>li>a').removeClass('layui-col-xs'+cfg.colXsWidth).addClass('layui-col-xs'+cfg.colMdWidth);
                            }else if(width <cfg.minXsWidth){
                                dom.find('.vip-push-body>li>a').removeClass('layui-col-xs'+cfg.colXsWidth).addClass('layui-col-xs'+cfg.colXsWidth);
                            }
                            push.culRender(dom);
                        }
                        ,restore: function(dom){
                            dom.find('.vip-push-body>li>a').removeClass('layui-col-xs'+cfg.colMdWidth).addClass('layui-col-xs'+cfg.colXsWidth);
                            push.culRender(dom);
                        }
                        ,min: function(){

                        }
                    },opts));

                    // 轮播实例
                    culIns = carousel.render(cfg.culOpts);

                }else{
                    layer.msg(res.msg||'出错了');
                }

            });

        }
    };

    // 监听类型切换
    $(document).on('mouseenter','.vip-push-footer>span',function(){
        var idx = $(this).index();
        $(this).addClass('active').siblings().removeClass('active');
        $('.vip-push-body>li').addClass('layui-hide').eq(idx).removeClass('layui-hide');
    });

    // 输出
    exp('vipPush', push);

});