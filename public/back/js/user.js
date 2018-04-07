/**
 * Created by Administrator on 2018/4/7.
 */
$(function(){
  var currentPage=1;
  var pageSize=5;
  function render(){
    $.ajax({
      url:'/user/queryUser',
      type:'get',
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      success:function(info){
        console.log(info);
        $(".lt-main tbody").html(template("tmp",info));
        $(".paginator").bootstrapPaginator({
          bootstrapMajorVersion:3,
          currentPage:info.page,
          totalPages:Math.ceil(info.total/info.size),
          onPageClicked:function(a,b,c,page){
            currentPage=page;
            render();
          }
        })
      }
    })
  }
  render();
  $(".lt-main tbody").on("click",".chengebtn",function(){
    $(".usermodal").modal("show");
    var id=$(this).data("id");
    var isDelete=$(this).hasClass("btn-danger")?0:1;
    console.log(isDelete);
    $("#confirmbtn").off().on("click",function(){
      $.ajax({
        url:'/user/updateUser',
        type:'post',
        data: {
          id: id,
          isDelete: isDelete
        },
        success:function(info){
          if(info.success){
            $(".usermodal").modal("hide");
            render();
          }
        }
      })
    })
  })

})