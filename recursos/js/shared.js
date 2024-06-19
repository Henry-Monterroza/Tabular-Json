$(document).ready(function(){
    // URL del header que quieres obtener
    const headerUrl = 'views/Shared/header.html';
    const footerUrl = 'views/Shared/footer.html';

    // Función para obtener el header y agregarlo al DOM
    $.get(headerUrl, function(data){
        $('#header-placeholder').html(data);
    }).fail(function() {
        console.error('Error al obtener el header.');
    });

   // Función para obtener el footer y agregarlo al DOM
    $.get(footerUrl, function(data){
            $('#footer-placeholder').html(data);
    }).fail(function() {
            console.error('Error al obtener el footer.');
    });
});