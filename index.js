import { Header, Nav, Main, Footer } from "./components";
import * as state from "./store";
import axios from "axios";
import Navigo from "navigo";
import { capitalize } from "lodash";

const router = new Navigo(window.location.origin);

function render(st = state.Home) {

  console.log(st);
  document.querySelector("#root").innerHTML = `
  ${Header(st)}
  ${Nav(state.Links)}
  ${Main(st)}
  ${Footer()}
`;

  router.updatePageLinks();

  addEventListeners(st);
}

function addEventListeners(st) {
  // add event listeners to Nav items for navigation
  document.querySelectorAll("nav a").forEach(navLink =>
    navLink.addEventListener("click", event => {
      event.preventDefault();
      render(state[event.target.title]);
    })
  );

  // add menu toggle to bars icon in nav bar
  document
    .querySelector(".fa-bars")
    .addEventListener("click", () =>
      document.querySelector("nav > ul").classList.toggle("hidden--mobile")
    );

  // event listener for the the photo form
  if (st.view === "Form") {
    document.querySelector("form").addEventListener("submit", event => {
      event.preventDefault();
      // convert HTML elements to Array
      let inputList = Array.from(event.target.elements);
      // remove submit button from list
      inputList.pop();
      // construct new picture object
      let newPic = inputList.reduce((pictureObject, input) => {
        pictureObject[input.name] = input.value;
        return pictureObject;
      }, {});
      // add new picture to state.Gallery.pictures
      state.Gallery.pictures.push(newPic);
      render(state.Gallery);
    });
  }
}

router.hooks({
  before: (done, params) => {
    const page = params && params.hasOwnProperty("page") ? capitalize(params.page) : "Home";
    console.log('matsinet-page:', page);
    if (page === "Pizzas") {
      state.Pizzas.pizzas = [];
      console.log('matsinet-state.Pizzas.pizzas:', state.Pizzas.pizzas);
      axios.get(`${process.env.PIZZAS_API_URL}/pizzas`).then(response => {
        state.Pizzas.pizzas = response.data;
        done();
      });
    }
    if (page === "Blog") {
      state.Blog.posts = [];
      axios.get("https://jsonplaceholder.typicode.com/posts").then(response => {
        response.data.forEach(post => {
          state.Blog.posts.push(post);
        });
        done();
      });
    }

    if (page === "Home") {
    //   axios
    //     .get(
    //       `https://api.openweathermap.org/data/2.5/weather?appid=${process.env.WEATHER_API_KEY}&q=st.%20louis`
    //     )
    //     .then(response => {
    //       state.Home.weather = {};
    //       state.Home.weather.city = response.data.name;
    //       state.Home.weather.temp = response.data.main.temp;
    //       state.Home.weather.feelsLike = response.data.main.feels_like;
    //       state.Home.weather.description = response.data.weather[0].main;
          done();
    //     })
    //     .catch(err => console.log(err));
   }
  }
});


router
  .on({
    "/": () => render(state.Home),
    ":page": params => render(state[capitalize(params.page)])
  })
  .resolve();
