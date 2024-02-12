import "/tailwind.css";
import gsap from "gsap";
import * as THREE from "three";
import countries from "./countries.json";
import vertexShader from "./shaders/vertex.glsl";
import fragmentShader from "./shaders/fragment.glsl";
import atmosphereVertexShader from "./shaders/atmosphereVertex.glsl";
import atmosphereFragmentShader from "./shaders/atmosphereFragment.glsl";

// console.log(vertexShader);
// console.log(fragmentShader);
const canvasContainer = document.querySelector("#canvasContainer");
// console.log(canvasContainer);
// console.log(countries);

const scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(
  75,
  canvasContainer.offsetWidth / canvasContainer.offsetHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  canvas: document.querySelector("canvas"),
});

renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// create a sphere
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(5, 50, 50),
  new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      globeTexture: {
        value: new THREE.TextureLoader().load("./img/globe.jpeg"),
      },
    },
  })
);
// console.log(sphere);

//create atmosphere
const atmosphere = new THREE.Mesh(
  new THREE.SphereGeometry(5, 50, 50),
  new THREE.ShaderMaterial({
    vertexShader: atmosphereVertexShader,
    fragmentShader: atmosphereFragmentShader,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
  })
);

atmosphere.scale.set(1.1, 1.1, 1.1);

scene.add(atmosphere);

const group = new THREE.Group();
group.add(sphere);
scene.add(group);

const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
});

const starVertices = [];
for (let i = 0; i < 10000; i++) {
  const x = (Math.random() - 0.5) * 2000;
  const y = (Math.random() - 0.5) * 2000;
  const z = -Math.random() * 5500;
  starVertices.push(x, y, z);
}
// console.log(starVertices);
starGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(starVertices, 3)
);

const stars = new THREE.Points(starGeometry, starMaterial);
// console.log(stars);
scene.add(stars);

camera.position.z = 15;

// function createBox({ lat, lng, country, population }) {
//   const box = new THREE.Mesh(
//     new THREE.BoxGeometry(0.2, 0.2, 0.8),
//     new THREE.MeshBasicMaterial({
//       color: "#3BF7FF",
//       opacity: 0.4,
//       transparent: true,
//     })
//   );

//   // 23.634501° N -102.552784° W = Mexico
//   const latitude = (lat / 180) * Math.PI;
//   const longitude = (lng / 180) * Math.PI;
//   const radius = 5;
//   // console.log({ latitude, longitude });

//   const x = radius * Math.cos(latitude) * Math.sin(longitude);
//   const y = radius * Math.sin(latitude);
//   const z = radius * Math.cos(latitude) * Math.cos(longitude);

//   // console.log({ x, y, z });

//   box.position.x = x;
//   box.position.y = y;
//   box.position.z = z;

//   box.lookAt(0, 0, 0);
//   box.geometry.applyMatrix4(new THREE.Matrix4().makeTranslation(0, 0, -0.4));

//   group.add(box);

//   gsap.to(box.scale, {
//     z: 1.4,
//     duration: 5,
//     yoyo: true,
//     repeat: -1,
//     ease: "linear",
//     delay: Math.random(),
//   });

//   box.country = country;
//   box.population = population;
// }

function createBoxes(countries) {
  countries.forEach((country) => {
    // console.log(country);
    const scale = country.population / 1000000000;
    // console.log(scale);
    const lat = country.latlng[0];
    const lng = country.latlng[1];
    const zScale = 0.8 * scale;

    const box = new THREE.Mesh(
      new THREE.BoxGeometry(
        Math.max(0.1, 0.2 * scale),
        Math.max(0.1, 0.2 * scale),
        Math.max(zScale, 0.4 * Math.random())
      ),
      new THREE.MeshBasicMaterial({
        color: "#3BF7FF",
        opacity: 0.4,
        transparent: true,
      })
    );

    // 23.634501° N -102.552784° W = Mexico
    const latitude = (lat / 180) * Math.PI;
    const longitude = (lng / 180) * Math.PI;
    const radius = 5;
    // console.log({ latitude, longitude });

    const x = radius * Math.cos(latitude) * Math.sin(longitude);
    const y = radius * Math.sin(latitude);
    const z = radius * Math.cos(latitude) * Math.cos(longitude);

    // console.log({ x, y, z });

    box.position.x = x;
    box.position.y = y;
    box.position.z = z;

    box.lookAt(0, 0, 0);
    box.geometry.applyMatrix4(
      new THREE.Matrix4().makeTranslation(0, 0, -zScale / 2)
    );

    group.add(box);

    gsap.to(box.scale, {
      z: 1.4,
      duration: 5,
      yoyo: true,
      repeat: -1,
      ease: "linear",
      delay: Math.random(),
    });

    box.country = country.name.common;
    box.population = new Intl.NumberFormat().format(country.population);
  });
}

createBoxes(countries);

// createBox({
//   lat: 23.634501,
//   lng: -102.552784,
//   country: "Mexico",
//   population: "126,7 millions",
// });
// createBox({
//   lat: -14.235,
//   lng: -51.9253,
//   country: "Brazil",
//   population: "214,3 millions",
// });
// createBox({
//   lat: 20.5937,
//   lng: 78.9629,
//   country: "India",
//   population: "1,408 billion",
// });
// createBox({
//   lat: 35.8617,
//   lng: 104.1954,
//   country: "China",
//   population: "1,412 billion",
// });
// createBox({
//   lat: 37.0902,
//   lng: -95.7129,
//   country: "Usa",
//   population: "331,9 millions",
// });

sphere.rotation.y = -Math.PI / 2;

group.rotation.offset = {
  x: 0,
  y: 0,
};

const mouse = {
  x: undefined,
  y: undefined,
  down: false,
  xPrev: undefined,
  yPrev: undefined,
};
// console.log(group.children);

const raycaster = new THREE.Raycaster();
// console.log(raycaster);
// console.log(group.children);
// console.log(
//   group.children.filter((mesh) => {
//     return mesh.geometry.type === "BoxGeometry";
//   })
// );
const popUpEl = document.querySelector("#popUpEl");
// console.log(popUpEl);
const populationEl = document.querySelector("#populationEl");
// console.log(populationEl);
const populationValueEl = document.querySelector("#populationValueEl");
// console.log(populationValueEl);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  // group.rotation.y += 0.001;

  // if (mouse.x) {
  //   gsap.to(group.rotation, {
  //     x: -mouse.y * 1.8,
  //     y: mouse.x * 1.8,
  //     duration: 2,
  //   });
  // }

  // update the picking ray with the camera and pointer position
  raycaster.setFromCamera(mouse, camera);

  // calculate objects intersecting the picking ray
  const intersects = raycaster.intersectObjects(
    group.children.filter((mesh) => {
      return mesh.geometry.type === "BoxGeometry";
    })
  );

  group.children.forEach((mesh) => {
    mesh.material.opacity = 0.4;
  });

  gsap.set(popUpEl, {
    display: "none",
  });

  for (let i = 0; i < intersects.length; i++) {
    // console.log("go");
    const box = intersects[i].object;
    box.material.opacity = 1;
    gsap.set(popUpEl, {
      display: "block",
    });
    // console.log(box);
    populationEl.innerHTML = box.country;
    populationValueEl.innerHTML = box.population;
  }

  renderer.render(scene, camera);
}

// Initiate the first call to the animate function
animate();

canvasContainer.addEventListener("mousedown", ({ clientX, clientY }) => {
  mouse.down = true;
  // console.log(mouse.down);
  mouse.xPrev = clientX;
  mouse.yPrev = clientY;
});

addEventListener("mousemove", (event) => {
  // console.log(event.clientX - innerWidth / 2);
  if (innerWidth >= 1280) {
    mouse.x = ((event.clientX - innerWidth / 2) / (innerWidth / 2)) * 2 - 1;
    mouse.y = -(event.clientY / innerHeight) * 2 + 1;
    // console.log(mouse);
  } else {
    const offset = canvasContainer.getBoundingClientRect().top;
    // console.log(offset);
    mouse.x = (event.clientX / innerWidth) * 2 - 1;
    mouse.y = -((event.clientY - offset) / innerHeight) * 2 + 1;
    // console.log(mouse.x);
    // console.log(mouse.y);
  }
  gsap.set(popUpEl, {
    x: event.clientX,
    y: event.clientY,
  });
  if (mouse.down) {
    event.preventDefault();
    // console.log("turn the earth");
    const deltaX = event.clientX - mouse.xPrev;
    const deltaY = event.clientY - mouse.yPrev;
    // console.log(deltaX);

    (group.rotation.offset.x += deltaY * 0.005),
      (group.rotation.offset.y += deltaX * 0.005),
      gsap.to(group.rotation, {
        y: group.rotation.offset.y,
        x: group.rotation.offset.x,
        duration: 2,
      });

    mouse.xPrev = event.clientX;
    mouse.yPrev = event.clientY;
    // console.log(deltaX);
  }
});

addEventListener("mouseup", () => {
  mouse.down = false;
  // console.log(mouse.down);
});

addEventListener("resize", () => {
  // console.log("resize");
  renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
  camera = new THREE.PerspectiveCamera(
    75,
    canvasContainer.offsetWidth / canvasContainer.offsetHeight,
    0.1,
    1000
  );
  camera.position.z = 15;
});

addEventListener(
  "touchmove",
  (event) => {
    // console.log(event);
    event.clientX = event.touches[0].clientX;
    event.clientY = event.touches[0].clientY;

    const doesIntersect = raycaster.intersectObject(sphere);
    // console.log(doesIntersect);

    if (doesIntersect.length > 0) mouse.down = true;

    if (mouse.down) {
      const offset = canvasContainer.getBoundingClientRect().top;
      // console.log(offset);
      mouse.x = (event.clientX / innerWidth) * 2 - 1;
      mouse.y = -((event.clientY - offset) / innerHeight) * 2 + 1;
      // console.log(mouse.x);
      // console.log(mouse.y);

      gsap.set(popUpEl, {
        x: event.clientX,
        y: event.clientY,
      });

      event.preventDefault();
      // console.log("turn the earth");
      const deltaX = event.clientX - mouse.xPrev;
      const deltaY = event.clientY - mouse.yPrev;
      // console.log(deltaX);

      (group.rotation.offset.x += deltaY * 0.005),
        (group.rotation.offset.y += deltaX * 0.005),
        gsap.to(group.rotation, {
          y: group.rotation.offset.y,
          x: group.rotation.offset.x,
          duration: 2,
        });

      mouse.xPrev = event.clientX;
      mouse.yPrev = event.clientY;
      // console.log(deltaX);
    }
  },
  { passive: false }
);

addEventListener("touchend", () => {
  mouse.down = false;
  // console.log(mouse.down);
});
