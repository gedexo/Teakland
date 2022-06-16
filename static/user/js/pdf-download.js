$(function () {

    var specialElementHandlers = {
        '#editor': function (element,renderer) {
            return true;
        }
    };
 $('#btnDownload').click(function () {
        var doc = new jsPDF();
        doc.fromHTML($('#test456').html(), 15, 15, {
            'width': 170,'elementHandlers': specialElementHandlers
        });
        doc.save('sample-file.pdf');
    });  
});