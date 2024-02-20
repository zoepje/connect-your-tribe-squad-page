const images = ["/assets/Type_Fire.webp", "/assets/Type_Water.webp", "/assets/Type_Grass.webp"];

const outElem = document.querySelector('.images');

images.forEach(function (path) {
  const img = document.createElement("img");
  img.src = path;
  outElem.appendChild(img);
});