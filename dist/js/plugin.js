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
/** ============== 提供常见的功能插件实现 ============== **/