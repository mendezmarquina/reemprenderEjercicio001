$(document).ready(function() {
  /* ((---- VARIABLES GLOBALES ----)) */
  /* !!-- Seleccionando Elementos --!! */
  var nombre = document.getElementById('nombres');
  var apellidoPaterno = document.getElementById('apellido_paterno');
  var apellidoMaterno = document.getElementById('apellido_materno');
  var direccion = document.getElementById('direccion');
  var select = document.getElementById('region');
  var provincia = document.getElementById("provincia");
  var comuna = document.getElementById("comuna");
  var errorDiv = document.getElementById('error');
  var boton = document.getElementById('boton');

  /* == variables == */
  var listRegiones = [];
  var listComunas = [];
  var url = "../js/region.json";
  var urlComuna = "../js/comuna.json";

  /* !!-- desactivar select iniciales --!! */
  provincia.disabled = true;
  comuna.disabled = true;

  /* !!-- Escuchando Eventos --!! */
  nombre.addEventListener('blur', validarCampos);
  apellidoPaterno.addEventListener('blur', validarCampos);
  apellidoMaterno.addEventListener('blur', validarCampos);
  direccion.addEventListener('blur', validarCampos);
  comuna.addEventListener('blur', validarCampos);
  select.addEventListener('change', agregarComuna);
  provincia.addEventListener('change', agregarComuna);
  boton.addEventListener("click", agregar);

  /* ((---- OBTENER JSON ----)) */
  function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
      if (rawFile.readyState === 4 && rawFile.status == "200") {
        callback(rawFile.responseText);
      }
    }
    rawFile.send(null);
  } // readTextFile -- endfn //

  /* ((---- LLENAR SELECCION REGIONES ----)) */
  function listarRegiones() {
    readTextFile(url, function(text) {
      var options = JSON.parse(text);

      for (region of options) {
        // creamos un elemento de tipo option
        var opt = document.createElement("option");
        // le damos un valor
        opt.value = region.id;
        // le ponemos un texto
        opt.textContent = region.nombre;
        // lo agregamos al select
        select.options.add(opt);
      }

      // creamos un elemento de tipo option
      var opt = document.createElement("option");
      // le damos un valor
      opt.value = "";
      // le ponemos un texto
      opt.textContent = ":: Seleccione una opcion ::";
      // agregando atributos  
      opt.setAttribute("selected", "selected");
      opt.setAttribute("disabled", "disabled");
      // lo agregamos al select
      select.options.add(opt);
    });
  } // listarRegiones -- endfn //

  /* !!-- llamar llenar regiones --!! */
  listarRegiones();

  /* ((---- LLENAR PROVINCIAS ----)) */
  select.addEventListener('change',
    function() {
      provincia.disabled = false;
      console.log(provincia);
      if (provincia.value === "") {
        comuna.disabled = true;
      }
      var selectedOption = select.options[select.selectedIndex];
      readTextFile(urlComuna, function(text) {
        var options = JSON.parse(text);
        // limpiamos el select de regiones
        for (let i = provincia.length; i >= 0; i--) {
          provincia.remove(i);
        }
        // limpiamos el select de comunas
        for (let i = comuna.length; i >= 0; i--) {
          provincia.remove(i);
        }
        // Limpiamos el listado de regiones
        listRegiones = [];
        console.groupEnd(provincia.disabled);
        // agregamos los valores al select provincia
        for (let i = 0; i < options.length; i++) {
          if (options[i].region_id == selectedOption.value) {
            // filtramos para no agregar valores duplicados
            if (listRegiones.indexOf(options[i].provincia) == -1) {
              listRegiones.push(options[i].provincia);
              // creamos un elemento de tipo option
              var opt = document.createElement("option");
              // le damos un valor
              opt.value = options[i].provincia;
              // le ponemos un texto
              opt.textContent = options[i].provincia;
              // lo agregamos al select
              provincia.options.add(opt);
            }
          }
        };
        // creamos un elemento de tipo option
        var opt = document.createElement("option");
        // le damos un valor
        opt.value = "";
        // le ponemos un texto
        opt.textContent = ":: Seleccione una opcion ::";
        // agregando atributos  
        opt.setAttribute("selected", "selected");
        opt.setAttribute("disabled", "disabled");
        provincia.options.add(opt);
      });
    });


  /* ((---- AGREGAR COMUNAS ----)) */
  function agregarComuna() {
    if (provincia.value != "") {
      comuna.disabled = false;
    }
    var selectedOption = provincia.options[provincia.selectedIndex];
    readTextFile(urlComuna, function(text) {
      var options = JSON.parse(text);
      // limpiamos el select de comunas
      for (let i = comuna.length; i >= 0; i--) {
        comuna.remove(i);
      }
      // agregamos los valores al select comunas
      for (let i = 0; i < options.length; i++) {
        if (options[i].provincia == selectedOption.value) {
          listComunas.push(options[i].nombre);
          // creamos un elemento de tipo option
          var opt = document.createElement("option");
          // le damos un valor
          opt.value = options[i].id;
          // le ponemos un texto
          opt.textContent = options[i].nombre;
          // lo agregamos al select
          comuna.options.add(opt);
        }
      };
      // creamos un elemento de tipo option
      var opt = document.createElement("option");
      // le damos un valor
      opt.value = "";
      // le ponemos un texto
      opt.textContent = ":: Seleccione una opcion ::";
      // agregando atributos  
      opt.setAttribute("selected", "selected");
      opt.setAttribute("disabled", "disabled");
      comuna.options.add(opt);
    });
  }

  /* !!-- funcion para validar los campos --!! */
  function validarCampos() {
    if (this.value === '') {
      errorDiv.style.display = 'block';
      this.style.border = '.2rem solid red';
      errorDiv.style.border = '.1rem solid red'
      errorDiv.style.backgroundColor = '#f9adad';
      errorDiv.innerHTML = "Este campo es obligatorio";
    } else {
      errorDiv.style.display = 'none';
      this.style.border = ".2rem solid #ffffff";
    }
  } // validarCampos-endfn

  function agregar(event) {
    event.preventDefault();
    /* == variables == */
    var bodyTable = document.getElementById('table-content');
    var rowElement = document.createElement("TR");

    var ok = true;
    var msg = "Debes ingresar los datos indicados para continuar:\n";
    if (nombre.value == "") {
      msg += "- Nombres\n";
      ok = false;
    }
    if (apellidoPaterno.value == "") {
      msg += "- Apellido Paterno\n";
      ok = false;
    }
    if (apellidoMaterno.value == "") {
      msg += "- Apellido Materno\n";
      ok = false;
    }
    if (direccion.value == "") {
      msg += "- Dirección\n";
      ok = false;
    }
    if (comuna.value == "") {
      msg += "- Comuna\n";
      ok = false;
    }

    if (ok == false) {
      alert(msg);
    } else {

      /* == creando los nodos == */
      var nuevoTexto = [];
      nuevoTexto.push(document.createTextNode(nombre.value));
      nuevoTexto.push(document.createTextNode(apellidoPaterno.value));
      nuevoTexto.push(document.createTextNode(apellidoMaterno.value));
      nuevoTexto.push(document.createTextNode(direccion.value));
      nuevoTexto.push(document.createTextNode(comuna.options[comuna.selectedIndex].text))
      console.log(nuevoTexto);

      /* == insertando valores en la tabla== */
      for (var i = 0; i < nuevoTexto.length; i++) {
        var colElement = document.createElement("TD");
        // nuevoTexto = document.createTextNode(nuevoTexto[i].textContent);
        colElement.appendChild(nuevoTexto[i]);
        rowElement.appendChild(colElement);
        bodyTable.appendChild(rowElement);
      }

      /* !!-- limpiar el contenido de los campos --!! */
      nombre.value = '';
      apellidoPaterno.value = '';
      apellidoMaterno.value = '';
      direccion.value = '';
      select.value = '';
      provincia.value = '';
      provincia.disabled = true;
      comuna.value = '';
      comuna.disabled = true;
    }

    return ok;
  } // Agregar-endfn

});