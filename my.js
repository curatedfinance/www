function postGForm(formId, formConfig) {
    var validated = $("#" + formId).data('bootstrapValidator').isValid();
    if (validated) {
        if (null != formConfig) {
            var myData = {
                "draftResponse":[],
                "pageHistory":0,
                "fbzx": new Date().getTime(),
            };
            var myUrl = formConfig.url;
            var isValid = true;

            for (var i = 0; i < formConfig.fields.length; ++i) {
                var field = formConfig.fields[i];
                if (null != field.preset) {
                    myData[field.gid] = $.trim(field.preset).substring(0, 1000);;
                    continue;
                }
                if ("radio" == field.special) {
                    var value = $("input[name=" + formId + "-" + field.fid + "]:checked").val();
                    value = $.trim(value).substring(0, 1000);
                    if (isValid) {
                        myData[field.gid] = value;
                        continue;
                    }
                }
                if ($("#" + formId + "-" + field.fid).length == 1) {
                    var value = $("#" + formId + "-" + field.fid).val();
                    value = $.trim(value).substring(0, 1000);
                    if (isValid) {
                        myData[field.gid] = value;
                        continue;
                    }
                }
                isValid = false;
                break;
            }

            if (isValid) {
                $("#" + formId).hide();
                $("#" + formId + "-sending").show();
                $.ajax({
                  url: myUrl,
                  data: myData,
                  type: "POST",
                  complete: function(data, textStatus, XMLHttpRequest) {
                    $("#" + formId + "-sending").hide();
                    $("#" + formId + "-complete").show();
                    //Success message
                  },
                });
                if (typeof ga != 'undefined') {
                    ga('send', {
                          'hitType': 'event',
                          'eventCategory': 'form',
                          'eventAction': 'success',
                          'eventLabel': formId,
                          'nonInteraction': true,
                        });
                }
                return true;
            }
        }
    }
    // don't hide, so that return false can show the bootstrap validate error message
    //$("#" + formId).hide();
    //$("#" + formId + "-error").show();
    if (typeof ga != 'undefined') {
        ga('send', {
              'hitType': 'event',
              'eventCategory': 'form',
              'eventAction': 'fail',
              'eventLabel': formId,
            });
    }
    return false;
}
