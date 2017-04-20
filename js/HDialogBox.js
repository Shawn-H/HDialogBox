
!function($,window,document){
    function Plugin(element,option){
        this.element=element;
        this.mask=document.createElement("div");
        this.isCreated=false;
        this.defualt={
//            宽度
            "width":"38%",
//            高度
            "height":"20%",
//            标题
            "title":"标题",
//            内容
            "content":"内容",
//            是否可拖拽
            "drapable":true
        }
        this.options=$.extend({},this.defualt,option);
    }
    Plugin.prototype={
//      初始化触发事件
        inital:function(){
            var vObj=this;
            vObj.mask.setAttribute("id","DialogMask");
            this.element.on("click",function(){
                vObj.showDialog();
            })
        },
        
//      显示对话框
        showDialog:function(){
            var vObj=this;
            vObj.createDialogBox();
            if($("#DialogMask").length<1)
                document.body.appendChild(vObj.mask);
            vObj.DialogBox.css({"height":vObj.options.height,"width":vObj.options.width,"top":($("#DialogMask").innerHeight()-vObj.DialogBox.innerHeight())/2,"left":($("#DialogMask").innerWidth()-vObj.DialogBox.innerWidth())/2}).fadeIn(200);
            vObj.DialogBox.css({"top":($("#DialogMask").innerHeight()-vObj.DialogBox.innerHeight())/2,"left":($("#DialogMask").innerWidth()-vObj.DialogBox.innerWidth())/2});
            vObj.CloseBtn.on("click",function(e){
                vObj.closeDialog(e);
            });
            $("#DialogBox , .DialogBox-Content, .DialogBoxTitle, .DialogBoxTitle .DialogBox-CloseBtn").on("selectstart",vObj.forbidSelect());
            vObj.DialogTitle.on("mousedown touchstart",function(e){
                if(vObj.options.drapable)
                    if(e.target==$(this)[0])
                        vObj.drap(e);
            });
            vObj.DialogTitle.on("mouseup",function(e){
                vObj.DialogMouseUp(e);
            });
            $(window).on("resize",function(e){
                vObj.DialogMouseUp(e);
            })
        },
        
//      关闭对话框
        closeDialog:function(e){
            var vObj=this;
            $("#DialogMask").remove();
            vObj.DialogBox.fadeOut().remove();
        },
        
//      禁止选择
        forbidSelect:function(){
            return false;
        },
        
//      拖拽事件
        drap:function(e){
            var vObj=this;
            var startOffsetL=vObj.DialogBox[0].offsetLeft;
            var startOffsetT=vObj.DialogBox[0].offsetTop;
            e.stopPropagation();
            if(e.targetTouches){
                 var touch = e.targetTouches[0];
                 var startX=touch.clientX;
                 var startY=touch.clientY;
                 vObj.DialogTitle.on("touchmove",function(e){
                     var touch =e.targetTouches[0];
                     e.preventDefault();
                     vObj.getNewPosition((touch.clientX-startX)+startOffsetL,(touch.clientY-startY)+startOffsetT);
                 });
             }
             else{
                 var startX=e.clientX;
                 var startY=e.clientY;
                 document.onmousemove=function(e){
                     vObj.getNewPosition((e.clientX-startX)+startOffsetL,(e.clientY-startY)+startOffsetT);
                }
            }
        },

        // 拖拽后新位置
        getNewPosition:function(offsetL,offsetT){
            var limitWidth=$("#DialogMask").innerWidth();
            var limitHeight=$("#DialogMask").innerHeight();
            var vObj=this;
         //判断超出边界
             if(offsetL+vObj.DialogBox.innerWidth()>limitWidth){offsetL=limitWidth-vObj.DialogBox.innerWidth();}
             if(offsetT+vObj.DialogBox.innerHeight()>limitHeight){offsetT=limitHeight-vObj.DialogBox.innerHeight();}
             if(offsetL<=0){offsetL=0}
             if(offsetT<=0){offsetT=0}
             vObj.DialogBox.css("left",offsetL+"px");
             vObj.DialogBox.css("top",offsetT+"px");
        },
//      结束拖拽
        DialogMouseUp:function(e){
            document.onmousemove=null;
        },
        
//      创建对话框
        createDialogBox:function(){
            var vObj=this;
            if($("#DialogBox").length<1)
            {
                var box=document.createElement("div"),
                    titleDiv=document.createElement("div"),
                    titletext=document.createElement("span"),
                    closeBtn=document.createElement("span"),
                    textContent=document.createElement("div");
                box.setAttribute("id","DialogBox");
                titleDiv.className="DialogBoxTitle";
                textContent.className="DialogBox-Content";
                closeBtn.className="DialogBox-CloseBtn";
                titletext.innerHTML=vObj.options.title;
                closeBtn.innerHTML="X";
                textContent.innerHTML=vObj.options.content;
                box.appendChild(titleDiv);
                box.appendChild(textContent);
                titleDiv.appendChild(titletext);
                titleDiv.appendChild(closeBtn);
                document.body.appendChild(box);
            }
            vObj.DialogBox=$("#DialogBox");
            vObj.DialogTitle=$("#DialogBox .DialogBoxTitle");
            vObj.CloseBtn=$("#DialogBox .DialogBoxTitle .DialogBox-CloseBtn");
        }
    };
    
    
    $.fn.HDialogBox=function(option){
        var plugin=new Plugin(this,option);
        return plugin.inital();
    }
}($,window,document);
   