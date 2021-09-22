    function checkFileExtension(file) {
        var flag = true;
        var extension = file.substr((file.lastIndexOf('.') + 1));

        switch (extension) {
            case 'jpg':
            case 'jpeg':
            case 'png':
            case 'gif':
            case 'zip':
            case 'rar':
            case 'pdf':
            case 'doc':
            case 'docx':
            case 'txt':

            case 'JPG':
            case 'JPEG':
            case 'PNG':
            case 'GIF':
            case 'ZIP':
            case 'RAR':
            case 'PDF':
            case 'DOC':
            case 'DOCX':
            case 'TXT':
                flag = true;
                break;
            default:
                flag = false;
        }

        return flag;
    }

    //get file path from client system
    function getNameFromPath(strFilepath) {
        var objRE = new RegExp(/([^\/\\]+)$/);
        var strName = objRE.exec(strFilepath);

        if (strName == null) {
            return null;
        }
        else {
            return strName[0];
        }

    }
    // Asynchronous file upload process
    function ajaxFileUpload() {
        var FileFolder = '12345';
        var fileToUpload = getNameFromPath($('#fileToUpload').val());
        var filename = fileToUpload.substr(0, (fileToUpload.lastIndexOf('.')));
        if (checkFileExtension(fileToUpload)) {

            var flag = true;
            if (filename != "" && filename != null && FileFolder != "0") {
                if (flag == true) {
                    $("#loading").ajaxStart(function () {
                        $(this).show();
                    }).ajaxComplete(function () {
                        $(this).hide();
                        return false;
                    });
                    $.ajaxFileUpload({
                        url: 'Fileuploader.ashx?id=' + FileFolder,
                        secureuri: false,
                        fileElementId: 'fileToUpload',
                        dataType: 'json',
                        success: function (data, status) {

                            if (typeof (data.error) != 'undefined') {
                                if (data.error != '') {
                                    alert(data.error);
                                } else {
                                    $('#fileToUpload').val("");
                                }
                            }
                        },
                        error: function (data, status, e) {
                            alert(e);
                        }
                    });
                }
                else {
                    alert('file ' + filename + ' already exist')
                    return false;
                }
            }
        }
        else {
            alert('You can upload only jpg,jpeg,pdf,doc,docx,txt,zip,rar extensions files.');
        }
        return false;

    }
