/**
 * Created by Administrator on 2018/4/7.
 */
$(function() {
  var currentPage = 1;
  var pageSize = 5;

  function render() {
    $.ajax({
      url: '/category/querySecondCategoryPaging',
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
    $.ajax({
      url:'/category/queryTopCategoryPaging',
      data:{
        page:1,
        pageSize:100
      },
      type:'get',
      success:function(info){
        console.log(info);
        $(".dropdown-menu").html(template("firsttmp",info));
        $(".dropdown-menu").on("click","a",function(){
          var id=$(this).data("id");
          $("#categoryId").val(id);
          $("#dropdownMenu1 span:first-child").text($(this).text());
          $("#form").data("bootstrapValidator").updateStatus("categoryId","VALID");
        });
        $("#uploadpic").fileupload({
          dataType:"json",
          //e：事件对象
          //data：图片上传后的对象，通过e.result.picAddr可以获取上传后的图片地址
          done:function (e, data) {
            var picname=data['result']['picAddr'];
            $(".showpic").attr("src",picname);
            $("#brandLogo").val(picname);
            $("#form").data("bootstrapValidator").updateStatus("brandLogo","VALID");
          }
        });
      }
    })
  });
  $("#form").bootstrapValidator({
    excluded:[],
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields:{
      brandName:{validators: {notEmpty:{message:"请输入二级分类名"}}},
      categoryId:{validators: {notEmpty:{message:"请选择一级分类"}}},
      brandLogo:{validators: {notEmpty:{message:"请上传图片"}}},
    }
  })
  $("#form").on("success.form.bv",function(){
    $.ajax({
      url:'/category/addSecondCategory',
      data:$("#form").serialize(),
      type:'post',
      success:function(info){
        if(info.success){
          currentPage=1;
          render();
          $(".addcatemodal").modal("hide");
          $("#form").data("bootstrapValidator").resetForm(true);
          $(".showpic").attr("src",'images/none.png');
          $("#dropdownMenu1 span:first-child").text("请选择一级分类");
        }
      }
    })
  })
})