/**
 * Created by Administrator on 2018/4/7.
 */
$(function() {
  var currentPage = 1;
  var pageSize = 5;

  function render() {
    $.ajax({
      url: '/category/queryTopCategoryPaging',
      type: 'get',
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      success: function (info) {
        console.log(info);
        $(".lt-main tbody").html(template("tmp", info));
        $(".paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage: info.page,
          totalPages: Math.ceil(info.total / info.size),
          onPageClicked: function (a, b, c, page) {
            currentPage = page;
            render();
          }
        })
      }
    })
  }
  render();
  $(".addcate").click(function(){
    $(".addcatemodal").modal("show");
  });
  $("#form").bootstrapValidator({
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields:{
      categoryName:{
        validators: {notEmpty:{message:"请输入一级分类名"}}
      }
    }
  });
  $("#form").on("success.form.bv",function(){
    var formdata=$("#form").serialize();
    $.ajax({
      url:'/category/addTopCategory',
      type:'post',
      data:formdata,
      success:function(info){
        if(info.success){
          $(".addcatemodal").modal("hide");
          currentPage=1;
          render();
          $("#form").data("bootstrapValidator").resetForm(true);
        }
      }
    })
  })
})