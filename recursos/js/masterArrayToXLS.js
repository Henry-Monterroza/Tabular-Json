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

    $("#ArrayEjemplo").val(`[
        {
            "id": 1,
            "nombre": "Juan",
            "edad": 28,
            "ciudad": "Madrid",
            "ocupacion": "Ingeniero"
        },
        {
            "id": 2,
            "nombre": "María",
            "edad": 34,
            "ciudad": "Barcelona",
            "ocupacion": "Diseñadora"
        },
        {
            "id": 3,
            "nombre": "Carlos",
            "edad": 22,
            "ciudad": "Valencia",
            "ocupacion": "Estudiante"
        },
        {
            "id": 4,
            "nombre": "Ana",
            "edad": 45,
            "ciudad": "Sevilla",
            "ocupacion": "Médico"
        },
        {
            "id": 5,
            "nombre": "Luis",
            "edad": 30,
            "ciudad": "Zaragoza",
            "ocupacion": "Abogado"
        }
    ]`);


    $('#copyButton').click(function() {
    let textArea = $("#ArrayEjemplo");

    textArea.prop("disabled",false);
        textArea.focus();
        textArea.select();
        try {
            textArea.select();
            const success = document.execCommand('copy');
            console.log(`Text copy was ${success ? 'successful' : 'unsuccessful'}.`);
          } catch (err) {
            console.error(err.name, err.message);
          }

          textArea.prop("disabled",true);

    });


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
