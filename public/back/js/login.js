/**
 * Created by Administrator on 2018/4/6.
 */
$(function(){
  $("#form").bootstrapValidator({
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      username: {
        validators: {
          notEmpty: {message: "用户名不能为空"},
          callback:{message:"用户名错误"}
        }
      },
      password: {
        validators: {
          notEmpty: {message: "密码不能为空"},
          stringLength: {
            min: 6,
            max: 12,
            message: "密码长度必须是6-12位"
          },
          callback:{message:"密码错误"}
        }
      }
    }
  })
  $("#form").on("success.form.bv",function(e){
    e.preventDefault();
    var formdata=$(this).serialize();
    $.ajax({
      type:'post',
      url:'/employee/employeeLogin',
      dataType:'json',
      data:formdata,
      success:function(info){
        if(info.error==1000){
          $("#form").data("bootstrapValidator").updateStatus("username","INVALID","callback");
        }else if(info.error==1001){
          $("#form").data("bootstrapValidator").updateStatus("password","INVALID","callback");
        }else if(info.success){
          location.href="/back/index.html";
        }
      }
    })
  })
  $("[type='reset']").click(function(){
    $("#form").data("bootstrapValidator").resetForm();
  })

})