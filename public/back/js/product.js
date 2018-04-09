/**
 * Created by Administrator on 2018/4/9.
 */
$(function(){
  var currentPage=1;
  var pageSize=5;
  function render(){
    $.ajax({
      url:'/product/queryProductDetailList',
      data:{
        page:currentPage,
        pageSize:pageSize
      },
      type:'get',
      success:function(info){
        console.log(info);
        $(".lt-main tbody").html(template("tmp", info));
        $(".paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3,
          currentPage:info.page,
          totalPages:Math.ceil(info.total/info.size),
          onPageClicked:function(a,b,c,page){
            currentPage=page;
            render();
          },
          itemTexts:function( type, page, current){
            switch (type){
              case 'next':
                return '下一页';
              case 'last':
                return '尾页';
              case 'page':
                return page;
              case 'first':
                return '首页';
              case 'prev':
                return '上一页';
            }
          }
        })
      }
    })
  }
  render();
  $(".addpro").click(function(){
    $(".addpromodal").modal("show");
    $.ajax({
      url:'/category/querySecondCategoryPaging',
      type:'get',
      data:{
        page:1,
        pageSize:100
      },
      success:function(info){
        $(".dropdown-menu").html(template("bands",info));
      }
    })
  })
  $(".dropdown-menu").on("click","a",function(){
    var id=$(this).data("id");
    var txt=$(this).text();
    $("#second span:first-child").text(txt);
    $("#brandId").val(id);
    $("#form").data("bootstrapValidator").updateStatus("brandId","VALID");
  })
  var arr=[];
  $("#pic1").fileupload({
    dataType:"json",
    //e：事件对象
    //data：图片上传后的对象，通过e.result.picAddr可以获取上传后的图片地址
    done:function (e, data) {
      var addr=data.result.picAddr;
      arr.unshift(data.result);
      if(arr.length>3){
        arr.pop(1);
        $("#showpic img:last-child").remove();
      }
      $("#showpic").prepend(template("picimg",{list:addr}));
      $("#picflag").val(arr.length);
      if(arr.length==3){
        $("#form").data("bootstrapValidator").updateStatus("picflag","VALID");
      }
    }
  });
  $("#form").bootstrapValidator({
    excluded:[],
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields:{
      proName:{validators: {notEmpty:{message:"请输入商品名称"}}},
      oldPrice:{validators: {notEmpty:{message:"请输入商品原价"}}},
      price:{validators: {notEmpty:{message:"请输入商品价格"}}},
      proDesc:{validators: {notEmpty:{message:"请输入商品描述"}}},
      size:{validators: {
        notEmpty:{message:"请输入商品尺寸"},
        regexp: {
          regexp: /^\d{2}-\d{2}$/,
          message: '商品尺寸格式为36-40'
        }
      }},
      num:{validators: {
        notEmpty:{message:"请输入商品库存"},
        regexp: {
          regexp: /^[1-9]\d*$/,
          message: '请输入有效库存'
        }
      }},
      brandId:{validators: {notEmpty:{message:"请选择二级类别"}}},
      picflag:{validators: {
        notEmpty:{message:"请上传三张图片"},
        regexp: {
          regexp: /^3$/,
          message: '请上传三张图片'
        }
      }}
    }
  })
  $("#form").on("success.form.bv",function(){
    var dataform=$("#form").serialize();
    dataform+="&&picName1="+arr[0]['picName']+"&&picpicAddr1="+arr[0]['picAddr'];
    dataform+="&&picName2="+arr[1]['picName']+"&&picpicAddr2="+arr[1]['picAddr'];
    dataform+="&&picName3="+arr[2]['picName']+"&&picpicAddr3="+arr[2]['picAddr'];
    console.log(dataform);
    $.ajax({
      url:'/product/addProduct',
      data:dataform,
      type:'post',
      success:function(info){
        if(info.success){
          currentPage=1;
          render();
          $(".addpromodal").modal("hide");
          $("#form").data("bootstrapValidator").resetForm(true);
          $("#second span:first-child").text("请选择二级分类");
          arr=[];
          $("#showpic").empty();
          $("#picflag").val("");
        }
      }
    })
  })

})