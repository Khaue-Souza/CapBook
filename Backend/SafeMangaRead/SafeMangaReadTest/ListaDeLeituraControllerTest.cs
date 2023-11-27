using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SafeMangaRead.Controllers;
using ListaDeLeituraApi.Models;
using MangaNovelsAPI.Models;
using UsuarioAPI.Models;

namespace SafeMangaReadTest
{
    public class ListaDeLeituraControllerTest
    {

        [Fact]
        private APIdbcontext CreateDbContextInMemory()
        {
            var options = new DbContextOptionsBuilder<APIdbcontext>()
                .UseInMemoryDatabase(databaseName: "TestDatabase")
                .Options;

            var dbContext = new APIdbcontext(options);

            
            Assert.NotNull(dbContext);

            return dbContext;
        }

        [Fact]
        public async Task PostListaDeLeituraTest()
        {
            using var dbContext = CreateDbContextInMemory();
            var usuarioTeste = new Usuario { UsuarioId = 10, UsuarioName = "Teste" }; 
            dbContext.usuarios.Add(usuarioTeste);
            await dbContext.SaveChangesAsync();

            var controller = new ListaDeLeituraController(dbContext);
            var newListaDeLeitura = new ListaDeLeitura
            {
                UsuarioId = 10,
                MangaId = 30011,
                AnoDePublicacao = 1999,
                Banner = "https://s4.anilist.co/file/anilistcdn/media/manga/banner/30011-pkX1O0EFqvV7.jpg",
                DataConclusao = null,
                DataInicio = DateTime.Parse("2023-11-26"),
                FormatoManga = "MANGA",
                Generos = "Action, Adventure, Supernatural",
                Images = "https://s4.anilist.co/file/anilistcdn/media/manga/cover/medium/nx30011-9yUF1dXWgDOx.jpg",
                NomeMangaEnglish = "Naruto",
                NomeMangaNative = "NARUTO -ナルト-",
                NomeMangaRomaji = "NARUTO",
                NomesAlternativos = "נארוטו, Наруто",
                Notas = "",
                PaisDeOrigem = "Japão",
                ProgressoCapitulo = 0,
                StatusManga = "Completo",

            };

            var result = await controller.AddMangaToList(newListaDeLeitura);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var returnValue = okResult.Value;

            var properties = returnValue.GetType().GetProperties();
            var statusProperty = properties.FirstOrDefault(p => p.Name == "status");
            var isSuccessProperty = properties.FirstOrDefault(p => p.Name == "isSuccess");
            var messageProperty = properties.FirstOrDefault(p => p.Name == "message");

            Assert.NotNull(statusProperty);
            Assert.NotNull(isSuccessProperty);
            Assert.NotNull(messageProperty);

            Assert.Equal(200, statusProperty.GetValue(returnValue));
            Assert.True((bool)isSuccessProperty.GetValue(returnValue));
            Assert.Equal("Mangá adicionado à lista de leitura!", messageProperty.GetValue(returnValue));
        }

        [Fact]
        public async Task PutListaDeLeituraTest()
        {

            using var dbContext = CreateDbContextInMemory();
            var existingListaDeLeitura = new ListaDeLeitura
            {
                ListaDeLeituraId = 20,
                UsuarioId = 20,
                MangaId = 30011,
                AnoDePublicacao = 1999,
                DataConclusao = null,
                DataInicio = DateTime.Parse("2023-11-20"),
                Notas = "teste",
                ProgressoCapitulo = 50,
                StatusManga = "lendo",
            };
            dbContext.listasDeLeitura.Add(existingListaDeLeitura);
            await dbContext.SaveChangesAsync();

            var updatedListaDeLeitura = new ListaDeLeitura
            {
                ListaDeLeituraId = existingListaDeLeitura.ListaDeLeituraId,
                UsuarioId = existingListaDeLeitura.UsuarioId,
                MangaId = existingListaDeLeitura.MangaId,
                ProgressoCapitulo = 2
            };

            var controller = new ListaDeLeituraController(dbContext);
            
            var result = await controller.PutListaDeLeitura(updatedListaDeLeitura);

            Assert.IsType<NoContentResult>(result);
            var listaDeLeitura = await dbContext.listasDeLeitura.FindAsync(existingListaDeLeitura.ListaDeLeituraId);
            Assert.Equal(2, listaDeLeitura.ProgressoCapitulo);
        }


        [Fact]
        public async Task GetListaDeLeituraTest()
        {

            using var dbContext = CreateDbContextInMemory();
            var listaDeLeitura = new ListaDeLeitura
            {
                ListaDeLeituraId = 14,

            };
            dbContext.listasDeLeitura.Add(listaDeLeitura);
            dbContext.SaveChanges();

            var controller = new ListaDeLeituraController(dbContext);

            var result = await controller.GetListaDeLeitura(14);

            var actionResult = Assert.IsType<ActionResult<ListaDeLeitura>>(result);
            var returnedListaDeLeitura = Assert.IsType<ListaDeLeitura>(actionResult.Value);
            Assert.Equal(14, returnedListaDeLeitura.ListaDeLeituraId);
        }
        [Fact]
        public async Task DeleteMangaFromUserListTest()
        {

            using var dbContext = CreateDbContextInMemory();
            var listaDeLeitura = new ListaDeLeitura { UsuarioId = 3, MangaId = 100 };
            dbContext.listasDeLeitura.Add(listaDeLeitura);
            await dbContext.SaveChangesAsync();

            var controller = new ListaDeLeituraController(dbContext);

            var result = await controller.DeleteMangaFromUserList(3, 100);

            Assert.IsType<NoContentResult>(result);
            var itemDeleted = await dbContext.listasDeLeitura
                                             .FirstOrDefaultAsync(l => l.UsuarioId == 3 && l.MangaId == 100);
            Assert.Null(itemDeleted);
        }

        [Fact]
        public async Task GetListasPorUsuarioTest()
        {
            using var dbContext = CreateDbContextInMemory();
            var listaDeLeitura1 = new ListaDeLeitura { UsuarioId = 4, MangaId = 100 };
            var listaDeLeitura2 = new ListaDeLeitura { UsuarioId = 4, MangaId = 101 };
            dbContext.listasDeLeitura.AddRange(listaDeLeitura1, listaDeLeitura2);
            await dbContext.SaveChangesAsync();

            var controller = new ListaDeLeituraController(dbContext);

            var result = await controller.GetListasPorUsuario(4);

            var actionResult = Assert.IsType<ActionResult<IEnumerable<ListaDeLeitura>>>(result);
            var listas = Assert.IsAssignableFrom<IEnumerable<ListaDeLeitura>>(actionResult.Value);
            Assert.Equal(2, listas.Count());
        }


        [Fact]
        public async Task MangaNaListaDeLeituraTest()
        {
            using var dbContext = CreateDbContextInMemory();
            var listaDeLeitura = new ListaDeLeitura { UsuarioId = 5, MangaId = 100 };
            dbContext.listasDeLeitura.Add(listaDeLeitura);
            await dbContext.SaveChangesAsync();

            var controller = new ListaDeLeituraController(dbContext);

            var result = await controller.MangaNaListaDeLeitura(5, 100);

            var okResult = Assert.IsType<OkObjectResult>(result);
            var mangaNaLista = Assert.IsType<ListaDeLeitura>(okResult.Value);
            Assert.NotNull(mangaNaLista);
            Assert.Equal(5, mangaNaLista.UsuarioId);
            Assert.Equal(100, mangaNaLista.MangaId);
        }

        [Fact]
        public async Task GetListaTest()
        {
            using var dbContext = CreateDbContextInMemory();
            var controller = new ListaDeLeituraController(dbContext);

            var newListaDeLeitura = new ListaDeLeitura
            {
                UsuarioId = 157,
                MangaId = 30011,
                AnoDePublicacao = 1999,
                Banner = "https://s4.anilist.co/file/anilistcdn/media/manga/banner/30011-pkX1O0EFqvV7.jpg",
                DataConclusao = null,
                DataInicio = DateTime.Parse("2023-11-26"),
                FormatoManga = "MANGA",
                Generos = "Action, Adventure, Supernatural",
                Images = "https://s4.anilist.co/file/anilistcdn/media/manga/cover/medium/nx30011-9yUF1dXWgDOx.jpg",
                NomeMangaEnglish = "Naruto",
                NomeMangaNative = "NARUTO -ナルト-",
                NomeMangaRomaji = "NARUTO",
                NomesAlternativos = "נארוטו, Наруто",
                Notas = "",
                PaisDeOrigem = "Japão",
                ProgressoCapitulo = 0,
                StatusManga = "Completo",

            };
            dbContext.listasDeLeitura.Add(newListaDeLeitura);
            await dbContext.SaveChangesAsync();

            var result = await controller.GetLista();

            Assert.NotNull(result.Value);
        }

    }
}
