using System;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace SafeMangaRead.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnilistController : ControllerBase
    {

        private string urlAniList = "https://graphql.anilist.co";

        [HttpGet("search/{title}")]
        public async Task<IActionResult> SearchByTitle(string title)
        {

            var httpClient = new HttpClient();

            var query = @"
                query ($search: String) {
                  Page {
                    media(search: $search, type: MANGA) {
                      id
                      title {
                        romaji
                        english
                      }
                      coverImage {
                        extraLarge
                        large
                        medium
                        color
                      }
                      genres
                    }
                  }
                }";

            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Post,
                RequestUri = new Uri(urlAniList),
                Content = new StringContent(
                    JsonConvert.SerializeObject(new
                    {
                        query = query,
                        variables = new { search = title }
                    }),
                    Encoding.UTF8, "application/json")
            };

            var response = await httpClient.SendAsync(request);
            var responseBody = await response.Content.ReadAsStringAsync();
            var jsonResponse = JObject.Parse(responseBody);

            // Filtrando os resultados com base no título
            var filteredMedia = jsonResponse["data"]["Page"]["media"]
                .Where(manga =>
                    (manga["title"]["romaji"]?.ToString().IndexOf(title, StringComparison.OrdinalIgnoreCase) >= 0) ||
                    (manga["title"]["english"]?.ToString().IndexOf(title, StringComparison.OrdinalIgnoreCase) >= 0)
                )
                .ToList();

            // Atualizando a resposta JSON com os resultados filtrados
            jsonResponse["data"]["Page"]["media"] = new JArray(filteredMedia);

            return Ok(responseBody);
        }

        [HttpGet("details/{id}")]
        public async Task<IActionResult> GetDetails(int id)
        {
            var httpClient = new HttpClient();

            var query = @"
                query ($id: Int) {
                    Media(id: $id, type: MANGA) {
                        title {
                            romaji
                            english
                            native
                        }
                        description
                        coverImage {
                            large
                        }
                        bannerImage
                        format
                        chapters
                        volumes
                        status
                        startDate {
                            year
                            month
                            day
                        }
                        endDate {
                            year
                            month
                            day
                        }
                        averageScore
                        meanScore
                        popularity
                        favourites
                        genres
                        synonyms
                        countryOfOrigin
                        source
                        
                    }
                }";



            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Post,
                RequestUri = new Uri(urlAniList),
                Content = new StringContent(
                    JsonConvert.SerializeObject(new
                    {
                        query = query,
                        variables = new { id = id }
                    }),
                    Encoding.UTF8, "application/json")
            };

            var response = await httpClient.SendAsync(request);
            var responseBody = await response.Content.ReadAsStringAsync();

            return Ok(responseBody);
        }
        [HttpGet("popular")]
        public async Task<IActionResult> GetPopularMangas()
        {
            var httpClient = new HttpClient();

            var query = @"
        query ($page: Int, $perPage: Int) {
          Page (page: $page, perPage: $perPage) {
            media (type: MANGA, sort: POPULARITY_DESC) {
              id
              title {
                romaji
                english
                native
              }
              coverImage {
                extraLarge
                large
                medium
                color
              }
              startDate {
                year
                month
                day
              }
              endDate {
                year
                month
                day
              }
              status
              genres
              averageScore
              popularity
              chapters
              volumes
            }
          }
        }";

            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Post,
                RequestUri = new Uri(urlAniList),
                Content = new StringContent(
                    JsonConvert.SerializeObject(new
                    {
                        query = query,
                        variables = new { page = 1, perPage = 40 }
                    }),
                    Encoding.UTF8, "application/json")
            };

            var response = await httpClient.SendAsync(request);
            var responseBody = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                return BadRequest("Could not fetch popular mangas from AniList.");
            }

            return Ok(responseBody);
        }

    }
}
