const images = ["/public/assets/Type_Fire.webp", "/public/assets/Type_Water.webp", "/public/assets/Type_Grass.webp"];

const outElem = document.querySelector('.images');

images.forEach(function (path) {
  const img = document.createElement("img");
  img.src = path;
  outElem.appendChild(img);
});