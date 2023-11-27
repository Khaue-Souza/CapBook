using Microsoft.AspNetCore.Mvc;
using SafeMangaRead.Controllers;
using System.Net.Http;
using System.Threading.Tasks;
using Xunit;

namespace SafeMangaReadTest
{
    public class AnilistControllerTest
    {
        private readonly AnilistController _controller;

        public AnilistControllerTest()
        {
            _controller = new AnilistController();
        }

        [Fact]
        public async Task SearchByTitle_ReturnsOkResult()
        {
            // Arrange
            var title = "One Piece"; // O título que você deseja pesquisar

            // Act
            var result = await _controller.SearchByTitle(title);

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task GetDetails_ReturnsOkResult()
        {
            // Arrange
            var id = 21; // O ID do manga que você deseja obter detalhes

            // Act
            var result = await _controller.GetDetails(id);

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }

        [Fact]
        public async Task GetPopularMangas_ReturnsOkResult()
        {
            // Act
            var result = await _controller.GetPopularMangas();

            // Assert
            Assert.IsType<OkObjectResult>(result);
        }
    }
}
