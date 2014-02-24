/**
 * Created with JetBrains WebStorm.
 * User: sheyz
 * Date: 13-12-16
 * Time: 下午4:54
 * To change this template use File | Settings | File Templates.
 * param>>>
 * dataDiv ：数据ul的外部div，可控制高度
 * dataCurrent ：当前选中数据li的样式
 * dataPointer ：数据指向
 * dataSynchronous ：同步数据的id到另一dom元素中
 * ajaxUrl ：'ajax地址 key='
 * divHeight:'div的高度 li的倍数，默认8'
 */

(function($){
    $.fn.linkAge = function(options){
        var opts = $.extend({},$.fn.linkAge.defaults,options);
        return this.each(function(){
            if($(this).is('input')){
                myLinkAge($(this),opts);
            }
        });
    };
    $.fn.linkAge.defaults = {
        dataDiv:'data_container',
        dataCurrent:'cur',
        dataPointer:'pointer',
        dataSynchronous:'',
        ajaxUrl:'http://dict.hisu.cc/tag/company?key=',
        divHeight:'8'
    };
    function myLinkAge(emt,opts){
        var
            self = emt,
            wrap = self.parent(),
            div = opts.dataDiv,
            dh = opts.divHeight,
            cur = opts.dataCurrent,
            pointer = opts.dataPointer,
            syn = opts.dataSynchronous,
            url = opts.ajaxUrl;

        var liLen,curIdx;
        wrap.css({position:'relative'});
        self.on('keyup',function(e){
            var code = e.keyCode;
            if(!(code == 38 || code ==40)){
                var value = curValue($(this).val());
                if(value!=''){
                    $.ajax({
                        type:'get',
                        dataType:'jsonp',
                        url:url+value,
                        success:function(data){
                            removeCon(pointer,div);
                            var data_list ='<div id="'+pointer+'"></div><div id="'+div+'"><ul>';
                            data_list += '<li>'+value+'</li>';
                            $.each(data.data,function(index,msg){
                                data_list += '<li id='+msg.id+'>'+msg.tag+'</li>';
                            });
                            data_list +='</ul></div>';
                            wrap.append(data_list);
                            liLen = data.data.length;
                            curIdx=0;
                            selectValue(curIdx);
                        }
                    });
                }else{
                    removeCon(pointer,div);
                }
            }else{
                switch(code){
                    case 38:
                        if(curIdx <= 0){
                            curIdx = 0;
                            selectValue(curIdx);
                            break;
                        }else{
                            curIdx--;
                            selectValue(curIdx);
                            break;
                        }
                    case 40:
                        if(curIdx >= liLen){
                            curIdx = liLen;
                            selectValue(curIdx);
                            break;
                        }else{
                            curIdx++;
                            selectValue(curIdx);
                            break;
                        }
                }
            }
        });
        self.on('click',function(){
            removeCon(pointer,div);
        });
        $(document).on('click',function(){
            removeCon(pointer,div);
        });
        wrap.on('click','li',function(event){
            self.focus();
            curIdx = $(this).index();
            selectValue(curIdx);
            event.stopPropagation();
        });
        function selectValue(idx){
            var $div = $('#'+div);
            var curLi = $div.find('li').eq(idx);
            var hei = $div.find('li').height();
            if(hei*liLen>hei*dh){
                $('#'+div).css({height:hei*dh,overflowY:'scroll'});
            }else{
                $('#'+div).css({height:'auto'});
            }
            curLi.addClass(cur).siblings().removeClass(cur);
            $div.scrollTop(curLi.height()*idx);
            self.val(setSyn(self.val(),curLi.text()));
            var liId = curLi.attr('id');
            $('#'+syn).is('input')?$('#'+syn).val(liId):$('#'+syn).html(liId);
        }
    }
    function curValue(v){
        var txtSplit = v.split(',');
        var txtLen = txtSplit.length;
        var txtLast = txtSplit[txtLen-1];
        return txtLast;
    }
    function setSyn(v,n){
        var txtSplit = v.split(',');
        var txtLen = txtSplit.length;
        txtSplit[txtLen-1] = n;
        return txtSplit;
    }
    function removeCon(p,d){
        if(p!=''){
            $('div').remove('#'+p);
        }
        $('div').remove('#'+d);
    }
})(jQuery);