function sr_fromFileChanged(checkbox, div, centered) {
    if ($('#'+checkbox)[0].checked) {
        if (centered) $('#'+div)[0].setAttribute("style", "margin:0 auto; float:none;");
        else $('#'+div)[0].removeAttribute("style");
    } else {
        $('#'+div)[0].setAttribute("style", "display:none;");
    }
}

function bargeInChanged() {
    if ($('#barge-in')[0].checked) {
        $('#playAudioSREngine')[0].removeAttribute("style");
    } else {
        $('#playAudioSREngine')[0].setAttribute("style", "display:none;");
        $('#playAudioUseNTE')[0].setAttribute("style", "display:none;")
    }
}

function speechrecEngineChanged(source, target, centered) {
    var engine = document.getElementById(source).value;
    if (engine === "NTE") {
        if (centered) {
            $("#"+target)[0].setAttribute("style", "margin:0 auto; float:none;");
        }
        else {
            $("#"+target)[0].removeAttribute("style");
        }
    } else {
        $("#"+target)[0].setAttribute("style", "display:none;");
    }
}


function uploadDVnameChanged() {
    var name = document.getElementById("upload_dv_name").value;
    if (name === "other") {
        $("#otherDVname")[0].removeAttribute("style");
    } else {
        $("#otherDVname")[0].setAttribute("style", "display:none;");
    }
}

function setOnlyActive(navbar_id) {
    var lis;
    if (navbar_id === "navbar_commands") {
        lis = document.getElementById("navbar_settings").getElementsByTagName("li");
    }
    else if (navbar_id === "navbar_settings") {
        lis = document.getElementById("navbar_commands").getElementsByTagName("li");
    }
    else {
        return;
    }
    // remove the 'active' keyword of the class of all <li>
    var len = lis.length;
    for (var i=0; i<len; i++) {
        var value = $(lis[i]).attr("class").replace("active", "");
        $(lis[i]).attr("class", value);
    }
}

function textChangedList(inputIds, buttonId){
    for(var i = 0; i < inputIds.length; i++){
        if ($(inputIds[i]).val().trim() === "") {
            return $(buttonId).addClass("disabled");
        }
    }
    return $(buttonId).removeClass("disabled");
}

function textChanged(inputId, buttonId) {
    inputIds = ['#'+inputId];
    buttonId = "#"+buttonId;
    textChangedList(inputIds, buttonId);
}

function kQUploadInputChanged(){
    var inputIds = ['#kq_upload_project_name','#kq_upload_version_number','#kq_choose_file'];
    var buttonId = "#kq_upload_txtbutton";
    textChangedList(inputIds, buttonId);
}

function kQCallInputChanged(){
    var inputIds = ['#kq_project_name','#kq_version_number','#kq_function_name','#kq_body_text'];
    var buttonId = "#kq_body_txtbutton";
    textChangedList(inputIds, buttonId);
}

function fixLineBreaks(string) {
    var replaceWith = '\r\n';

    if (string.indexOf('\r\n') > -1) {  	// Windows encodes returns as \r\n
        // Good nothing to do
    } else if (string.indexOf('\n') > -1) { 	// Unix encodes returns as \n
        string = replaceAll(string, '\n', replaceWith);
    } else if (string.indexOf('\r') > -1) { 	// Macintosh encodes returns as \r
        string = replaceAll(string, '\r', replaceWith);
    }
    return string;
}

function replaceAll(string, find, replace) {
    return string.replace(new RegExp(find, 'g'), replace);
}