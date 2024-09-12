$(document).ready(function () {
  const rowsPerPage = 10;
  let currentPage = 1;
  let sortedData = [];
  let filteredData = [];
  let currentPlaying = null;

  function renderTable(data) {
    $("#music-table").empty();
    data.forEach((item, index) => {
      $("#music-table").append(`
        <tr>
          <td>
            <button class="play-btn" data-index="${index}">
              <i class="fa-solid fa-play"></i>
            </button>
          </td>
          <td><img src="${item.imagen}" alt="${item.name}" width="50"></td>
          <td>${item.name}</td>
          <td>${item.autor}</td>
          <td>${item.genero}</td>
          <td>${item.duracion}</td>
          <td>
            <button class="megusta-btn" data-id="${
              item.id
            }" data-index="${index}">
              ${item.megusta ? "Me gusta" : "No me gusta"}
            </button>
          </td>
          <td>
            <button class="btn btn-danger">Eliminar</button>
            <button class="btn btn-warning">Editar</button>
          </td>
        </tr>
      `);
    });

    $(".play-btn").on("click", function () {
      const index = $(this).data("index");
      const icon = $(this).find("i");

      if (currentPlaying !== null && currentPlaying !== index) {
        $(`.play-btn[data-index="${currentPlaying}"] i`)
          .removeClass("fa-pause")
          .addClass("fa-play");
        currentPlaying = null;
      }

      if (icon.hasClass("fa-play")) {
        icon.removeClass("fa-play").addClass("fa-pause");
        currentPlaying = index;
      } else {
        icon.removeClass("fa-pause").addClass("fa-play");
        currentPlaying = null;
      }
    });
  }

  function renderPagination(pages) {
    $("#pagination").empty();

    $("#pagination").append(`
      <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
        <a class="page-link" href="#" aria-label="Previous" data-page="${
          currentPage - 1
        }">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
    `);

    for (let i = 1; i <= pages; i++) {
      $("#pagination").append(`
        <li class="page-item ${i === currentPage ? "active" : ""}">
          <a class="page-link" href="#" data-page="${i}">${i}</a>
        </li>
      `);
    }

    $("#pagination").append(`
      <li class="page-item ${currentPage === pages ? "disabled" : ""}">
        <a class="page-link" href="#" aria-label="Next" data-page="${
          currentPage + 1
        }">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    `);
  }

  function updatePage(page) {
    if (page < 1 || page > Math.ceil(filteredData.length / rowsPerPage)) return;
    currentPage = page;
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = filteredData.slice(start, end);
    renderTable(paginatedData);
    renderPagination(Math.ceil(filteredData.length / rowsPerPage));
  }

  function filterData(query) {
    query = query.toLowerCase();
    filteredData = sortedData.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        item.autor.toLowerCase().includes(query)
    );
    updatePage(1);
  }

  $("#search-input").on("input", function () {
    const query = $(this).val();
    filterData(query);
  });

  $.ajax({
    url: "https://66da2e18f47a05d55be436e2.mockapi.io/appweb/musica",
    method: "GET",
    dataType: "json",
  })
    .done(function (data) {
      sortedData = data.sort((a, b) => a.posicion - b.posicion);
      filteredData = sortedData;
      const pages = Math.ceil(sortedData.length / rowsPerPage);
      renderPagination(pages);
      updatePage(currentPage);

      $("#pagination").on("click", ".page-link", function (e) {
        e.preventDefault();
        const page = $(this).data("page");
        if (page) {
          updatePage(page);
        }
      });
    })
    .fail(function () {
      alert("Error al cargar los datos.");
    });

  $(document).on("click", ".megusta-btn", function () {
    let index = $(this).data("index");
    let id = $(this).data("id");
    let newMegustaValue = !sortedData[index].megusta;
    sortedData[index].megusta = newMegustaValue;

    let megustaText = newMegustaValue ? "Me gusta" : "No me gusta";
    $(this).text(megustaText);

    // Actualizar en el servidor
    $.ajax({
      url: `https://66da2e18f47a05d55be436e2.mockapi.io/appweb/musica/${id}`,
      method: "PUT",
      data: JSON.stringify({ megusta: newMegustaValue }),
      contentType: "application/json",
      success: function (response) {
        console.log("Actualización exitosa:", response);
      },
      error: function (error) {
        console.error("Error al actualizar:", error);
      },
    });
  });

  // $(document).on("click", "#addSongBtn-add", function () {
  //   console.log("Botón de agregar canción clickeado");
  // });

  // $("#songForm").on("submit", function(e) {
  //   e.preventDefault();
  //   const songData = {
  //     name: $("#songName").val(),
  //     autor: $("#autor").val(),
  //     genero: $("#genero").val(),
  //     duracion: $("#duracion").val(),
  //     imagen: $("#imagen").val(),
  //     createdAt: new Date().toISOString(),
  //   };
  //   console.log("Datos de la canción:", songData);

  //   $.ajax({
  //     url: "https://66da2e18f47a05d55be436e2.mockapi.io/appweb/musica",
  //     type: "POST",
  //     data: JSON.stringify(songData),
  //     contentType: "application/json",
  //     success: function (response) {
  //       alert("Canción agregada exitosamente!");
  //       $("#Modal").modal("hide");
  //     },
  //     error: function (xhr, status, error) {
  //       alert("Error al agregar la canción: " + error);
  //     },
  //   });
  // });

  $("#songForm").on("submit", function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    formData.append('createdAt', new Date().toISOString());

    // Mostrar los datos que se van a enviar
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    $.ajax({
      url: "https://66da2e18f47a05d55be436e2.mockapi.io/appweb/musica",
      type: "POST",
      data: formData,
      processData: false,
      contentType: false,
      success: function(response) {
        alert("Canción agregada exitosamente!");
        $("#Modal").modal("hide");
        $("#songForm")[0].reset();
      },
      error: function(xhr, status, error) {
        alert("Error al agregar la canción: " + error);
      },
    });
  });
});
