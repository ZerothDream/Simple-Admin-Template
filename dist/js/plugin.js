/**
 * Created by DreamBoy on 2016/12/24.
 */

/** ============== 提供常见的功能插件实现（在网站中可能不需要用到，所以这里插件的形式提供） ============== **/
// 用法：实现对应需要的html内容块+css样式（如果有的话）+调用js
(function($) {

    /**
     * 默认选择器：
     * 样式：（无）
     * 条件：
     * 功能：显示右侧菜单
     * @param opts
     */
    $.fn.showRightSidebar = function(opts) {
        var defaults = {
            sidebarSelector: '.sidebar-right'
        };
        var options = $.extend(defaults, opts);

        // 具体逻辑定义
        var $self = $(this);
        var $sidebar = $(options.sidebarSelector);

        $self.on('click', function() {
            $sidebar.addClass('actived');
        });

        $sidebar.find('.mask').on('click', function() {
            $(this).parents(options.sidebarSelector).removeClass('actived');
        });
    };

})(jQuery);

(function($) {

    /**
     * 默认选择器：
     * 样式：
     * 条件：选择需要固定的div，调用该方法执行
     * 功能：当滚动条向下滚动到某个位置时，就让当前对象fixed住。不让其继续向上滑动。
     * @param opts
     */
    $.fn.fixedScroll = function(opts) {
        var defaults = {
            obj: $(window), // 监听滚动的对象，默认window
            getScrollTopLimit: function($self) { // $self 参数为当前jQuery形式的对象
                return 0;
            }, // 获取滚动条向下滚动的最大值，当超过该值 当前对象 就会被fixed住。
            getWidth: function($self) { // $self 参数为当前jQuery形式的对象
                return 'auto';
            } // 获取 当前对象被fixed住后的宽度
        };
        var options = $.extend(defaults, opts);

        // 具体逻辑定义
        var $self = $(this);
        var $body = $('.wrapper');
        console.log($body);
        $body.on('scroll', function() {
            if(options.getScrollTopLimit) {
                console.log(options.getScrollTopLimit($self));
            }
        });
        
        
    };
    
    
    /**
     * 默认选择器：
     * 样式：
     * 条件：选择滚动的对象，调用该方法
     * 功能：当滚动条向下滚动到某个位置时，就让指定对象fixed住。不让其继续向上滑动。并且返回一个handle句柄，用于删除监听事件
     * @param opts
     */
    $.fn.fixBox = function(opts) {
        var defaults = {
            selector: null, // 将要被fixed住的对象的选择器
            getTop: function($box) { // 指定对象被fixed住后的top值
                return 0;
            },
            getScrollTopLimit: function($box) { // $box 参数为selector参数的jQuery对象形式
                return 0;
            }, // 获取滚动条向下滚动的最大值，当超过该值 selector所指对象 就会被fixed住。
            getWidth: function($box) { // $box 参数为selector参数的jQuery对象形式
                return 'auto';
            }, // 获取selector所指对象被fixed住后的宽度
            cancel: function(callback) { // 取消监听
                
            }
        };
        var options = $.extend(defaults, opts);
        
        if(!options.selector) {
            console.warn('Warn For Plugin FixBox: 没有指定 selector 参数。');
            return;
        }
        
        var $obj = $(options.selector);
        if($obj.length == 0) {
            console.warn('Warn For Plugin FixBox: 所传入的selector参数对应的jQuery对象不存在！');
            return;
        }
        
        // 具体逻辑定义
        var $self = $(this);
        
        var limit = options.getScrollTopLimit($obj);
        var top = options.getTop($obj);
        
        var isFixed = false; // 是否已经被固定
        
        var $next = $obj.next();
        var initMarginTopOfNext = parseInt($next.css('margin-top')) || 0;
        var cloneHeight = initMarginTopOfNext + parseInt($obj.css('margin-top')) + $obj.outerHeight() + parseInt($obj.css('margin-bottom'));
        
        var fnFix = function() {
            if(!isFixed) {
                isFixed = true;
                $next.css({
                    'margin-top': cloneHeight
                });

                $obj.css({
                    'position': 'fixed',
                    'top': top,
                    'z-index': 100,
                    'width': options.getWidth($obj)
                });
            }
        };
        
        var fnCancelFix = function() {
            if(isFixed) {
                isFixed = false;
                $next.css({
                    'margin-top': initMarginTopOfNext
                });

                $obj.css({
                    'position': 'static',
                    'z-index': 0,
                    'width': 'auto'
                });
            }
        };
        
        var fnListenScroll = function() {
            var $this = $(this);
            if($this.scrollTop() >= limit) {
                fnFix();
            } else {   
                fnCancelFix();
            }
        };
        
        $self.on('scroll', fnListenScroll);
        
        var fnResize = function() {
            if(isFixed) {
                $obj.css('width', options.getWidth($obj));
            }
        };
        var $win = $(window);
        $win.on('resize', fnResize);
        
        if(options.cancel) {
            options.cancel(function() {
                fnCancelFix();
                $self.unbind('scroll', fnListenScroll);
                $win.unbind('resize', fnResize);
            });
        }
    };

})(jQuery);
/** ============== 提供常见的功能插件实现 ============== **/