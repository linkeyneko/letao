/**
 * Created by Administrator on 2018/4/6.
 */
//所有ajax请求开始启用进度条
$(document).ajaxStart(function(){
  NProgress.start();
})
//所有ajax结束延迟500结束进度条
$(document).ajaxStop(function(){
  setTimeout(function(){
    NProgress.done();
  },500)
})
//禁用小圆环loading
NProgress.configure({ showSpinner: false });

//登录验证
if(location.href.indexOf("login.html")===-1){
  $.ajax({
    url:'/employee/checkRootLogin',
    type:'get',
    success:function(info){
      if(info.error==400){
        location.href="login.html";
      }
    }
  })
}

;$(function(){
  //影藏显示侧边栏
  $(".icon-hide").click(function(){
    $(".lt_aside").toggleClass("hideaside");
    $(".lt-main").toggleClass("hideaside");
    $(".lt-main .top-nav").toggleClass("hideaside");
  })
//  显示模态框
  $(".icon-outmodal").click(function(){
    $(".logoutmodal").modal('show');
  })
  //点击退出执行退出ajax
  $("#logout").click(function(){
    $.ajax({
      url:'/employee/employeeLogout',
      type:'get',
      dataType:'json',
      success:function(info){
        if(info.success){
          location.href="/back/login.html";
        }
      }
    })
  })
});