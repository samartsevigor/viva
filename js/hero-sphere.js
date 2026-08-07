(function initHeroSphere() {
  "use strict";

  var canvas = document.getElementById("hero-canvas");
  if (!canvas || typeof THREE === "undefined") return;

  var container = canvas.parentElement;
  var heroSection = document.querySelector(".hero");
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var isMobile = window.innerWidth < 768;

  var scene = new THREE.Scene();
  var camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0, 4.8);

  var renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: !isMobile,
    powerPreference: "high-performance",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  var group = new THREE.Group();
  group.scale.setScalar(1.45);
  group.position.x = 0.2;
  scene.add(group);

  function fitCamera() {
    var box = new THREE.Box3().setFromObject(group);
    var boundSphere = box.getBoundingSphere(new THREE.Sphere());
    var fovRad = camera.fov * (Math.PI / 180);
    var padding = 1.02;
    var distance = (boundSphere.radius * padding) / Math.tan(fovRad / 2);
    camera.position.z = distance;
  }

  var sphereGeometry = new THREE.SphereGeometry(1, isMobile ? 48 : 64, isMobile ? 48 : 64);
  var sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0x4c1d95,
    emissive: 0x7c3aed,
    emissiveIntensity: 0.55,
    metalness: 0.35,
    roughness: 0.45,
  });
  var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  group.add(sphere);

  var glowGeometry = new THREE.SphereGeometry(1.12, 32, 32);
  var glowMaterial = new THREE.MeshBasicMaterial({
    color: 0xa855f7,
    transparent: true,
    opacity: 0.1,
    side: THREE.BackSide,
  });
  var glow = new THREE.Mesh(glowGeometry, glowMaterial);
  group.add(glow);

  var wireGeometry = new THREE.IcosahedronGeometry(1.18, isMobile ? 1 : 2);
  var wireMaterial = new THREE.MeshBasicMaterial({
    color: 0xa855f7,
    wireframe: true,
    transparent: true,
    opacity: 0.18,
  });
  var wireframe = new THREE.Mesh(wireGeometry, wireMaterial);
  group.add(wireframe);

  function createRing(radius, tiltX, tiltY) {
    var geometry = new THREE.TorusGeometry(radius, 0.012, 8, 128);
    var material = new THREE.MeshBasicMaterial({
      color: 0x7c3aed,
      transparent: true,
      opacity: 0.35,
    });
    var ring = new THREE.Mesh(geometry, material);
    ring.rotation.x = tiltX;
    ring.rotation.y = tiltY;
    return ring;
  }

  var ring1 = createRing(1.5, Math.PI / 2.8, 0);
  var ring2 = createRing(1.65, Math.PI / 3.5, Math.PI / 4);
  var ring3 = createRing(1.8, Math.PI / 5, -Math.PI / 6);
  group.add(ring1, ring2, ring3);

  var particleCount = isMobile ? 350 : 700;
  var positions = new Float32Array(particleCount * 3);
  var sizes = new Float32Array(particleCount);

  for (var i = 0; i < particleCount; i++) {
    var theta = Math.random() * Math.PI * 2;
    var phi = Math.acos(2 * Math.random() - 1);
    var radius = 1.5 + Math.random() * 0.75;

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
    sizes[i] = Math.random() * 2 + 0.5;
  }

  var particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

  var particleMaterial = new THREE.PointsMaterial({
    color: 0xc084fc,
    size: isMobile ? 0.025 : 0.018,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  });

  var particles = new THREE.Points(particleGeometry, particleMaterial);
  group.add(particles);

  fitCamera();

  scene.add(new THREE.AmbientLight(0x1a0a3e, 0.6));

  var mainLight = new THREE.PointLight(0xa855f7, 2.5, 12);
  mainLight.position.set(2.5, 2, 3);
  scene.add(mainLight);

  var fillLight = new THREE.PointLight(0x7c3aed, 1.8, 12);
  fillLight.position.set(-2.5, -1.5, 2);
  scene.add(fillLight);

  var rimLight = new THREE.DirectionalLight(0x6d28d9, 0.8);
  rimLight.position.set(0, 0, -3);
  scene.add(rimLight);

  var targetRotX = 0;
  var targetRotY = 0;
  var currentRotX = 0;
  var currentRotY = 0;

  var parallaxTarget = heroSection || container;

  parallaxTarget.addEventListener("mousemove", function (e) {
    var rect = parallaxTarget.getBoundingClientRect();
    var x = (e.clientX - rect.left) / rect.width - 0.5;
    var y = (e.clientY - rect.top) / rect.height - 0.5;
    targetRotY = x * 0.5;
    targetRotX = y * 0.35;
  });

  parallaxTarget.addEventListener("mouseleave", function () {
    targetRotX = 0;
    targetRotY = 0;
  });

  function resize() {
    var width = container.clientWidth;
    var height = container.clientHeight;
    if (width === 0 || height === 0) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    fitCamera();
    renderer.setSize(width, height, false);
  }

  resize();
  window.addEventListener("resize", resize);

  var isVisible = true;
  var observer = new IntersectionObserver(
    function (entries) {
      isVisible = entries[0].isIntersecting;
    },
    { threshold: 0.05 }
  );
  observer.observe(container);

  var clock = new THREE.Clock();
  var autoRotation = 0;

  function animate() {
    requestAnimationFrame(animate);
    if (!isVisible) return;

    var elapsed = clock.getElapsedTime();

    if (!reducedMotion) {
      autoRotation = elapsed * 0.12;

      currentRotX += (targetRotX - currentRotX) * 0.04;
      currentRotY += (targetRotY - currentRotY) * 0.04;

      group.rotation.y = autoRotation + currentRotY;
      group.rotation.x = currentRotX;

      wireframe.rotation.x = elapsed * 0.08;
      wireframe.rotation.z = elapsed * 0.05;

      sphereMaterial.emissiveIntensity = 0.5 + Math.sin(elapsed * 1.4) * 0.12;
      glowMaterial.opacity = 0.08 + Math.sin(elapsed * 1.4) * 0.04;

      particles.rotation.y = -elapsed * 0.04;
      particles.rotation.x = elapsed * 0.02;

      ring1.rotation.z = elapsed * 0.25;
      ring2.rotation.x = Math.PI / 3.5 + elapsed * 0.18;
      ring3.rotation.y = -Math.PI / 6 + elapsed * 0.14;
    }

    renderer.render(scene, camera);
  }

  animate();
})();
