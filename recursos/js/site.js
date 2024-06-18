// Please see documentation at https://learn.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
var btnDown =
`<a type="button" class="btn btn-outline-primary mt-3" href="default.asp" target="_blank" id="download" >
    <svg  width="16" height="16" fill="currentColor" class="bi bi-download" viewBox="0 0 16 16">
    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5">
    </path>
    <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"></path>
    </svg>
    </a>`

function AlertDiv(msj) {
var alertDiv = `<div class="alert alert-warning alert-dismissible fade show mt-3" role="alert">
        ${msj}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`
return alertDiv;
}



$(document).ready(function () {


// Evento change del input file para habilitar/deshabilitar el botón de exportar
$("#formFileMultiple").change(function () {
    let files = $(this).prop("files");
    if (files.length == 0) {
        $("#exportBtn").prop("disabled", true);
    } else {
        $("#exportBtn").prop("disabled", false);
    }
});

// Evento click del botón exportar
$("#exportBtn").click(async function () {
    // Deshabilitar el botón mientras se procesa
    $("#exportBtn").prop('disabled', true);

    // Limpiar mensajes de alerta previos
    $("#msjAlert").empty();

    // Obtener archivos seleccionados
    let files = $("#formFileMultiple").prop("files");

    // Validar que se haya seleccionado al menos un archivo
    if (files.length == 0) {
        let alerty = AlertDiv("Debe Seleccionar Al menos un Archivo JSON");
        $("#msjAlert").append(alerty);
        $("#formFileMultiple").focus();
        $("#exportBtn").prop('disabled', false);
        return;
    }

    // Validar que se haya ingresado un nombre para el archivo
    let filename = $("#filename").val();
    if (isNullOrEmpty(filename)) {
        let alerty = AlertDiv("Ingrese un nombre para el archivo");
        $("#msjAlert").append(alerty);
        $("#exportBtn").prop('disabled', false);
        $("#filename").focus();
        return;
    }

    // Array para almacenar los datos de los archivos JSON
    var ElectronicArray = [];
    try {
        // Leer cada archivo JSON seleccionado y parsearlo
        for (var i = 0; i < files.length; i++) {
            var file = files[i];
            let jsonstring = await readFileAsText(file);
            let objjson = JSON.parse(jsonstring);
            ElectronicArray.push(objjson);
        }
    } catch (ex) {
        // Mostrar mensaje de error si ocurre un problema al procesar los archivos JSON
        let alerty = AlertDiv("Los archivos JSON no tienen la estructura esperada. " + ex);
        $("#msjAlert").append(alerty);
        $("#exportBtn").prop('disabled', false);
        return;
    }

    // Array para almacenar los datos que se convertirán en el archivo Excel
    var excelarray = [];
    for (var i = 0; i < ElectronicArray.length; i++) {
        try {
            var objson = ElectronicArray[i];
            let obj = {
                "Correlativo": `${i + 1}`,
                "FechaEmision": objson.identificacion.fecEmi,
                "NumeroUnicoComprobante": objson.identificacion.codigoGeneracion,
                "NumeroComprobante": objson.identificacion.numeroControl,
                "NumeroRegistro": objson.emisor.nrc,
                "NumeroSerie": objson.selloRecibido || objson.respuestaHacienda.selloRecibido,
                "NIT": objson.emisor.nit,
                "NombreProveedor": objson.emisor.nombre,
                "ComprasExentaInterna": objson.resumen.totalExenta,
                "ComprasExentaExterna": 0.0,
                "ComprasGrabadasInterna": objson.resumen.totalGravada,
                "ComprasGrabadasExterna": 0.0,
                "CreditoFiscal": 0.0,
                "Percepcion": 0.0,
                "TotalCompras": objson.resumen.montoTotalOperacion,
                "ComprasSujetosExcluidos": objson.resumen.descuNoSuj
            };
            excelarray.push(obj);
        } catch (ex) {
            // Mostrar mensaje de error si hay un problema con la estructura del JSON
            let alerty = AlertDiv("Los archivos JSON no tienen la estructura esperada. " + ex);
            $("#msjAlert").append(alerty);
            $("#exportBtn").prop('disabled', false);
            return;
        }
    }

    // Mostrar en consola el JSON que se convertirá a tabla de Excel
    console.log("JSON Tabla de excel");
    console.log(JSON.stringify(excelarray));


     TabularJson(excelarray);
    $("#divTable").empty();



    // Habilitar el botón de exportar y limpiar los campos
    $("#exportBtn").prop('disabled', false);
    $("#formFileMultiple").val(null);
    $("#filename").val(null);

});

// Inicializar los campos y botones al cargar la página
$("#exportBtn").prop('disabled', false);
$("#formFileMultiple").val(null);
$("#filename").val(null);
});

// Función para convertir una cadena base64 en bytes
function base64ToBytes(base64String) {
let binaryString = atob(base64String);
let len = binaryString.length;
let bytes = new Uint8Array(len);

for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
}

return bytes;
}

// Función para leer un archivo como texto
function readFileAsText(file) {
return new Promise((resolve, reject) => {
    if (!file.type.match('text.*') && !file.type.match('application/json')) {
        reject('El archivo debe ser de tipo texto o JSON.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (event) {
        const contents = event.target.result;
        resolve(contents);
    };
    reader.onerror = function (error) {
        reject('Error al leer el archivo: ' + error);
    };
    reader.readAsText(file);
});
}


// Función para verificar si una cadena es nula o vacía
function isNullOrEmpty(str) {
return !str || str.trim() === '';
}



function jsonToTable(jsonArray) {
    if (!Array.isArray(jsonArray) || jsonArray.length === 0) {
        return '<p>No data available</p>';
    }

    // Get the headers
    const headers = Object.keys(jsonArray[0]);

    // Start building the HTML table

    
    let tableHtml = '<table id="example" class="table table-striped text-white dataTable" style="width: 100%;" aria-describedby="example_info"><thead><tr>';

    // Add table headers
    headers.forEach(header => {
        tableHtml += `<th>${header}</th>`;
    });
    tableHtml += '</tr></thead><tbody>';

    // Add table rows
    jsonArray.forEach(item => {
        tableHtml += '<tr>';
        headers.forEach(header => {
            tableHtml += `<td>${item[header]}</td>`;
        });
        tableHtml += '</tr>';
    });

    tableHtml += '</tbody></table>';

    return tableHtml;
}

    // Función para convertir un JSON en una hoja de cálculo y descargarla
    function TabularJson(json) {
        // Convertir JSON a una hoja de cálculo
        const worksheet = XLSX.utils.json_to_sheet(json);

        // Crear un nuevo libro de trabajo
        const workbook = XLSX.utils.book_new();

        // Añadir la hoja de cálculo al libro de trabajo
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        // Generar un archivo Excel y descargarlo
        let filenombre = $("#filename").val();
        XLSX.writeFile(workbook, `${filenombre}.xlsx`);
    }

