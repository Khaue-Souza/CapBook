using MangaNovelsAPI.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SafeMangaRead.Controllers;
using UsuarioAPI.Models;

namespace SafeMangaReadTest
{
    public class UsuarioControllerTest
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
        public async Task PostUsuarioTest()
        {
            using var dbContext = CreateDbContextInMemory();
            var controller = new UsuarioController(dbContext);
            var newUser = new Usuario
            {
                UsuarioName = "teste",
                UsuarioNascimento = DateTime.Parse("2023-11-26T18:53:15.040Z"),
                UsuarioEmail = "testeParaTest",
                UsuarioSenha = "Teste@123"
            };

            var result = await controller.PostUsuario(newUser);

            var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var returnValue = Assert.IsType<Usuario>(createdResult.Value);
            Assert.Equal(newUser.UsuarioEmail, returnValue.UsuarioEmail);
        }

        [Fact]
        public async Task PutUsuarioTest()
        {
            using var dbContext = CreateDbContextInMemory();
            var existingUser = new Usuario
            {
                UsuarioId = 7,
                UsuarioName = "testePut",
                UsuarioNascimento = DateTime.Parse("2023-11-26T18:53:15.040Z"),
                UsuarioEmail = "testePut",
                UsuarioSenha = "testePut@123"
            };
            dbContext.usuarios.Add(existingUser);
            await dbContext.SaveChangesAsync();

            var controller = new UsuarioController(dbContext);

            existingUser.UsuarioName = "novoNomePUT";
            existingUser.UsuarioEmail = "novoNomePUT";
            existingUser.UsuarioSenha = "novoNomePUT@123";

            var result = await controller.PutUsuario(7, existingUser);

            Assert.IsType<NoContentResult>(result);
            var user = await dbContext.usuarios.FindAsync(7);
            Assert.Equal("novoNomePUT", user.UsuarioName);
            Assert.Equal("novoNomePUT", user.UsuarioEmail);
        }

        [Fact]
        public async Task GetUsuarioTest()
        {
            using var dbContext = CreateDbContextInMemory();
            var user = new Usuario { UsuarioId = 17, UsuarioEmail = "novoNome", UsuarioSenha = "Senha123" };
            dbContext.usuarios.Add(user);
            dbContext.SaveChanges();

            var controller = new UsuarioController(dbContext);

            var result = await controller.GetUsuario(17);

            var actionResult = Assert.IsType<ActionResult<Usuario>>(result);
            var returnedUser = Assert.IsType<Usuario>(actionResult.Value);
            Assert.Equal("novoNome", returnedUser.UsuarioEmail);
        }

        [Fact]
        public async Task DeleteUsuarioTest()
        {
            using var dbContext = CreateDbContextInMemory();
            var usuario = new Usuario { UsuarioId = 4 };
            dbContext.usuarios.Add(usuario);
            await dbContext.SaveChangesAsync();

            var controller = new UsuarioController(dbContext);

            var result = await controller.DeleteUsuario(1);

            Assert.IsType<NoContentResult>(result);
            var userDeleted = await dbContext.usuarios.FindAsync(1);
            Assert.Null(userDeleted);
        }

        [Fact]
        public async Task PostUsuarioCTest_SuccessfulLogin()
        {
            using var dbContext = CreateDbContextInMemory();
            var hashedPassword = BCrypt.Net.BCrypt.HashPassword("Senha@123");
            var usuario = new Usuario {UsuarioEmail = "testSuccessful@example.com", UsuarioSenha = hashedPassword };
            dbContext.usuarios.Add(usuario);
            await dbContext.SaveChangesAsync();

            var controller = new UsuarioController(dbContext);
            var loginUsuario = new Usuario { UsuarioEmail = "testSuccessful@example.com", UsuarioSenha = "Senha@123" };

            var result = await controller.PostUsuarioC(loginUsuario);

            var okResult = result as OkObjectResult;

            if (okResult != null)
            {
                var statusCode = okResult.StatusCode;
                Assert.Equal(200, statusCode);
            }

        }

        [Fact]
        public async Task PostUsuarioCTest_UnsuccessfulLogin()
        {
            using var dbContext = CreateDbContextInMemory();

            var usuario = new Usuario
            {
                UsuarioId = 6,
                UsuarioEmail = "testUnsuccessful@example.com",
                UsuarioSenha = BCrypt.Net.BCrypt.HashPassword("senhaReal@1")
            };
            dbContext.usuarios.Add(usuario);
            await dbContext.SaveChangesAsync();

            var controller = new UsuarioController(dbContext);

            var loginUsuario = new Usuario { UsuarioEmail = "testUnsuccessful@example.com", UsuarioSenha = "senhaErrada@1" };

            var result = await controller.PostUsuarioC(loginUsuario);

            var okResult = result as OkObjectResult;

            if (okResult != null)
            {
                var statusCode = okResult.StatusCode;
                Assert.Equal(401, statusCode);
            }
        }


    }
}
