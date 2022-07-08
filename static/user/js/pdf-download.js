var doc = new jsPDF();
var specialElementHandlers = {
    '#editor': function (element, renderer) {
        return true;
    }
};

$('#cmd').click(function () {
        const element = document.getElementById('printInvoice');
        html2pdf()
            .from(element)
            .save();

});
