// Array de objetos
const ejemploArray = [
    {
        "nombre": "Juan",
        "edad": 30,
        "ciudad": "Madrid"
    },
    {
        "nombre": "María",
        "edad": 25,
        "ciudad": "Barcelona"
    },
    {
        "nombre": "Pedro",
        "edad": 35,
        "ciudad": "Valencia"
    }
];

$(document).ready(function () {
    // Convertir el array a una cadena JSON
    const jsonString = JSON.stringify(ejemploArray, null, 4); // Formateado con indentación

    // Asignar la cadena JSON al placeholder del campo de texto
    $("#textarray").attr("placeholder", jsonString);

    // Evento click del botón exportar
    $("#exportBtn").click(async function () {
        let stringarray = $("#textarray").val();
        let filename = $("#filename").val();

        // Validar campos
        if (isNullOrEmpty(filename)) {
            mostrarAlerta("Ingrese un nombre para el archivo", "#filename");
            return;
        }

        if (isNullOrEmpty(stringarray)) {
            mostrarAlerta("Ingrese un array en formato JSON", "#textarray");
            return;
        }

        $("#exportBtn").prop('disabled', true);

        if (esJsonArray(stringarray)) {
            let data = JSON.parse(stringarray);
            TabularJson(data);
        } else {
            mostrarAlerta("El texto ingresado no es un array JSON válido", "#textarray");
        }

        // Inicializar los campos y botones al cargar la página
        $("#exportBtn").prop('disabled', false);
        $("#filename").val(null);
    });

    function mostrarAlerta(mensaje, selector) {
        
        let alerty = AlertDiv(mensaje);
        $("#msjAlert").html(alerty);
        $("#exportBtn").prop('disabled', false);
        $(selector).focus();
    }

    function isNullOrEmpty(value) {
        return !value || value.trim() === "";
    }

    function esJsonArray(str) {
        try {
            let data = JSON.parse(str);
            return Array.isArray(data);
        } catch (e) {
            return false;
        }
    }
});
