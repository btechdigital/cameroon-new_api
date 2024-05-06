const PORT = 8000;
const express = require("express");
const cheerio = require("cheerio");
const axios = require("axios");

const app = express();

const newspapers = [
  {
    source: "237Actu",
    address: "https://237actu.com/articles",
  },
  {
    source: "cameroononline.org",
    address: "https://www.cameroononline.org/category/general-news/",
  },

  {
    source: "CANAL",
    address: "https://cameroonnewsagency.com/category/press-release/",
  },

  {
    source: "Cameroon Tribune",
    address: "https://www.cameroon-tribune.cm/category2.html/2/en.html/economy",
    base: "https://www.cameroon-tribune.cm/",
  },

  {
    source: "237 Online",
    address: "https://www.237online.com/actualite/",
  },

  {
    source: "Younde Info",
    address: "https://yaoundeinfo.com/category/actualite/",
  },

  {
    source: "Lebled Parle",
    address: "https://www.lebledparle.com/actualite/societe/",
  },

  {
    source: "Mimi Mefo Info",
    address: "https://mimimefoinfos.com/cameroon/",
  },
];

const articles = [];

app.get("/", (req, res) => {
  res.json("welcome to my new Api");
});

newspapers.forEach((newspaper) => {
  axios.get(newspaper.address).then((response) => {
    const html = response.data;
    const $ = cheerio.load(html);

    if (newspaper.source === "237 Online") {
      $("article", html).each(function (index, element) {
        const title = $(element).find(".entry-title a").text();
        const imageUrl = $(element).find("img").attr("data-lazy-src");
        const postUrl = $(element).find("a").attr("href");

        articles.push({ title, imageUrl, postUrl, source: newspaper.source });
      });
    } else if (newspaper.source === "cameroononline.org") {
      $("article", html).each(function (index, element) {
        const title = $(element).find(".post-box-title a").text();
        // const imageUrl = $(element).find('img:contains("width")').attr("src");
        const postUrl = $(element).find(".post-box-title a").attr("href");
        const desc = $(element).find(".entry").text();

        articles.push({
          title,
          //   imageUrl,
          postUrl,
          desc,
          source: newspaper.source,
        });
      });
      console.log("cameroononline.org");
    } else if (newspaper.source === "Cameroon Tribune") {
      $(".news-list-item", html).each(function (index, element) {
        const title = $(element).find("h5 a").text();
        // const imageUrl = $(element)
        //   .find(".img-wrapper")
        //   .css("background-image");
        const postUrl = $(element).find("h5 a").attr("href");
        const desc = $(element).find(".p").text();

        articles.push({
          title,
          postUrl: newspaper.base + postUrl,
          desc,
          source: newspaper.source,
        });
      });
      console.log("Cameroon Tribune");

      //End Cameroon Tribune
    } else if (newspaper.source === "CANAL") {
      $(".post-item", html).each(function (index, element) {
        const title = $(element).find("a").text();
        const imageUrl = $(element).find(".post-thumb img").attr("src");
        const postUrl = $(element).find("a").attr("href");
        const desc = $(element).find(".post-excerpt").text();

        articles.push({
          title,
          postUrl,
          desc,
          imageUrl,
          source: newspaper.source,
        });
      });
      console.log("CANAL");
      //End CANAL
    } else if (newspaper.source === "237Actu") {
      $("article", html).each(function (index, element) {
        const title = $(element).find(".post-title a").text();
        const imageUrl = $(element).find(".post-thumb img").attr("src");
        const desc = $(element).find(".post-exerpt").text();
        const postUrl = $(element).find(".post-title a").attr("href");

        articles.push({
          title,
          imageUrl,
          postUrl,
          desc,
          source: newspaper.source,
        });
      });
      console.log("237 Online");

      //End 237Actu
    } else if (newspaper.source === "Mimi Mefo Info") {
      $("article", html).each(function (index, element) {
        const title = $(element).find(".jeg_post_title a").text();
        // const imageUrl = $(element)
        //   .find(".thumbnail-container img")
        //   .attr("src");
        const desc = $(element).find(".jeg_post_excerpt").text();
        const postUrl = $(element).find("a").attr("href");

        articles.push({
          title,
          //   imageUrl,
          postUrl,
          desc,
          source: newspaper.source,
        });
      });
      console.log("Mimi Mefo Info");
    } else if (newspaper.source === "Lebled Parle") {
      $("article", html).each(function (index, element) {
        const title = $(element).find(".g1-gamma a").text();
        const imageUrl = $(element)
          .find(".g1-frame-inner img")
          .attr("data-src");
        //    const desc = $(element).find(".jeg_post_excerpt").text();
        const postUrl = $(element).find(".g1-gamma a").attr("href");

        articles.push({
          title,
          imageUrl,
          postUrl,
          //  desc,
          source: newspaper.source,
        });
      });
      console.log("Lebled Parle");
    } else if (newspaper.source === "Younde Info") {
      $("article", html).each(function (index, element) {
        const title = $(element).find(".g1-gamma a").text();
        const imageUrl = $(element).find(".g1-frame-inner img").attr("src");
        const desc = $(element).find(".entry-summary").text();
        const postUrl = $(element).find(".g1-gamma a").attr("href");

        articles.push({
          title,
          imageUrl,
          postUrl,
          desc,
          source: newspaper.source,
        });
      });
      console.log("Younde Info");
    }
  });
});

app.get("/news", (req, res) => {
  res.json(articles);
});

app.get("/news/:newspaperId", async (req, res) => {
  const newspaperId = req.params.newspaperId;
  const newpaperAddress = newspapers.filter(
    (newspaper) => newspaper.source == newspaperId
  )[0].address;
  const base = newspapers.filter(
    (newspaper) => newspaper.source == newspaperId
  )[0].base;
  const source = newspapers.filter(
    (newspaper) => newspaper.source == newspaperId
  )[0].source;
  axios
    .get(newpaperAddress)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const specificArticle = [];

      if (source === "237 Online") {
        $("article", html).each(function (index, element) {
          const title = $(element).find(".entry-title a").text();
          const imageUrl = $(element).find("img").attr("data-lazy-src");
          const postUrl = $(element).find("a").attr("href");

          specificArticle.push({ title, imageUrl, postUrl, source: source });
        });
      } else if (source === "cameroononline.org") {
        $("article", html).each(function (index, element) {
          const title = $(element).find(".post-box-title a").text();
          // const imageUrl = $(element).find('img:contains("width")').attr("src");
          const postUrl = $(element).find(".post-box-title a").attr("href");
          const desc = $(element).find(".entry").text();

          specificArticle.push({
            title,
            //   imageUrl,
            postUrl,
            desc,
            source: source,
          });
        });
        console.log("cameroononline.org");
      } else if (source === "Cameroon Tribune") {
        $(".news-list-item", html).each(function (index, element) {
          const title = $(element).find("h5 a").text();
          // const imageUrl = $(element)
          //   .find(".img-wrapper")
          //   .css("background-image");
          const postUrl = $(element).find("h5 a").attr("href");
          const desc = $(element).find(".p").text();

          specificArticle.push({
            title,
            postUrl: base + postUrl,
            desc,
            source: source,
          });
        });
        console.log("Cameroon Tribune");

        //End Cameroon Tribune
      } else if (source === "CANAL") {
        $(".post-item", html).each(function (index, element) {
          const title = $(element).find("a").text();
          const imageUrl = $(element).find(".post-thumb img").attr("src");
          const postUrl = $(element).find("a").attr("href");
          const desc = $(element).find(".post-excerpt").text();

          specificArticle.push({
            title,
            postUrl,
            desc,
            imageUrl,
            source: source,
          });
        });
        console.log("CANAL");
        //End CANAL
      } else if (source === "237Actu") {
        $("article", html).each(function (index, element) {
          const title = $(element).find(".post-title a").text();
          const imageUrl = $(element).find(".post-thumb img").attr("src");
          const desc = $(element).find(".post-exerpt").text();
          const postUrl = $(element).find(".post-title a").attr("href");

          specificArticle.push({
            title,
            imageUrl,
            postUrl,
            desc,
            source: source,
          });
        });
        console.log("237 Online");

        //End 237Actu
      } else if (source === "Mimi Mefo Info") {
        $("article", html).each(function (index, element) {
          const title = $(element).find(".jeg_post_title a").text();
          //   const imageUrl = $(element)
          //     .find(".thumbnail-container img")
          //     .attr("src");
          const desc = $(element).find(".jeg_post_excerpt").text();
          const postUrl = $(element).find("a").attr("href");

          specificArticle.push({
            title,
            // imageUrl,
            postUrl,
            desc,
            source: source,
          });
        });
        console.log("Mimi Mefo Info");
      } else if (source === "Lebled Parle") {
        $("article", html).each(function (index, element) {
          const title = $(element).find(".g1-gamma a").text();
          const imageUrl = $(element)
            .find(".g1-frame-inner img")
            .attr("data-src");
          //    const desc = $(element).find(".jeg_post_excerpt").text();
          const postUrl = $(element).find(".g1-gamma a").attr("href");

          specificArticle.push({
            title,
            imageUrl,
            postUrl,
            //  desc,
            source: source,
          });
        });
        console.log("Lebled Parle");
      } else if (source === "Younde Info") {
        $("article", html).each(function (index, element) {
          const title = $(element).find(".g1-gamma a").text();
          const imageUrl = $(element).find(".g1-frame-inner img").attr("src");
          const desc = $(element).find(".entry-summary").text();
          const postUrl = $(element).find(".g1-gamma a").attr("href");

          specificArticle.push({
            title,
            imageUrl,
            postUrl,
            desc,
            source: source,
          });
        });
        console.log("Younde Info");
      }

      res.json(specificArticle);
    })
    .catch((error) => console.log(error));
});

app.listen(PORT, () => console.log(`runni on on port ${PORT}`));
