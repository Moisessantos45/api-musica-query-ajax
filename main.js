$(document).ready(function () {
  $.ajax({
    url: "https://66da2e18f47a05d55be436e2.mockapi.io/appweb/musica",
    method: "GET",
    dataType: "json",
    success: function (albums) {
      const likedAlbums = albums.filter((album) => album.megusta);
      likedAlbums.forEach((album) => {
        $("#albums-list").append(`
                    <div class="col-md-2 album-card">
                        <div class="card bg-dark text-white">
                            <img src="${album.imagen}" class="card-img-top" alt="${album.name}">
                            <div class="card-body">
                                <h5 class="card-title">${album.name}</h5>
                                <p class="card-text">${album.autor}</p>
                            </div>
                        </div>
                    </div>
                `);
      });
    },
    error: function (error) {
      console.error("Error al obtener los álbumes:", error);
    },
  });
});
