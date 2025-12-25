/* NAV ACTIVE LINK ON SCROLL */
const navLinks = document.querySelectorAll('nav a');
const sections = document.querySelectorAll('section, header');

function activateNavLink() {
  const scrollPos = window.scrollY + window.innerHeight * 0.9;
  let activeSection = null;

  if (window.scrollY + window.innerHeight >= document.body.scrollHeight - 50) {
    activeSection = document.getElementById('contact');
  } else {
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        activeSection = section;
      }
    });
  }

  navLinks.forEach(link => link.classList.remove('active'));
  if (activeSection) {
    const id = activeSection.getAttribute('id');
    const activeLink = [...navLinks].find(link => link.getAttribute('href') === '#' + id);
    if (activeLink) activeLink.classList.add('active');
  }
}

window.addEventListener('scroll', activateNavLink);
activateNavLink();

/* HAMBURGER MENU TOGGLE */
const navToggle = document.getElementById('nav-toggle');
const navLinksContainer = document.getElementById('nav-links');

navToggle.addEventListener('click', () => {
  const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
  navToggle.setAttribute('aria-expanded', !isExpanded);
  navLinksContainer.classList.toggle('active');
});

/* SCROLL FADE-UP ANIMATIONS */
const fadeElems = document.querySelectorAll('.fade-up');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      if (entry.target.id === 'about') {
        const tags = entry.target.querySelectorAll('.about-text li');
        tags.forEach((tag, index) => {
          setTimeout(() => tag.classList.add('visible'), index * 100);
        });
      }
      if (entry.target.id === 'projects') {
        const cards = entry.target.querySelectorAll('.project-card');
        cards.forEach((card, index) => {
          setTimeout(() => card.classList.add('visible'), index * 150);
        });
      }
      if (entry.target.id === 'experience') {
        const items = entry.target.querySelectorAll('.experience-item');
        items.forEach((item, index) => {
          setTimeout(() => item.classList.add('visible'), index * 200);
        });
      }
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

fadeElems.forEach(el => observer.observe(el));

/* TYPED ROLE ANIMATION */
const typedText = document.getElementById('typed-role');
const roles = [
  'Python & Django Web Developer',
  'Graphics Designer',
  'UI/UX Designer',
  'Core Frontend Developer',
  'Creative Problem Solver',
  'AI & ML Enthusiast',
  'Visual Designer'
];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
  const current = roles[roleIndex];
  if (isDeleting) {
    charIndex--;
    typedText.textContent = current.substring(0, charIndex);
    if (charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      setTimeout(type, 400);
    } else {
      setTimeout(type, 60);
    }
  } else {
    charIndex++;
    typedText.textContent = current.substring(0, charIndex);
    if (charIndex === current.length) {
      isDeleting = true;
      setTimeout(type, 1500);
    } else {
      setTimeout(type, 90);
    }
  }
}
type();



/* EXPERIENCE SHOW MORE TOGGLE */
const showMoreButtons = document.querySelectorAll('.show-more');

showMoreButtons.forEach(button => {
  button.addEventListener('click', () => {
    const targetId = button.getAttribute('data-target');
    const extraDetails = document.getElementById(targetId);
    const isExpanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', !isExpanded);
    extraDetails.classList.toggle('expanded');
    button.textContent = isExpanded ? 'Show More' : 'Show Less';
  });

  button.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      button.click();
    }
  });
});

/* THREE.JS PARTICLE SYSTEM SETUP (Header Background) */
const threeCanvas = document.getElementById('three-bg');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

const renderer = new THREE.WebGLRenderer({ canvas: threeCanvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const particleCount = window.innerWidth < 768 ? 30 : 60;
const particles = new THREE.Group();
scene.add(particles);

const geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
const material = new THREE.MeshBasicMaterial({ color: 0x00bcd4, transparent: true, opacity: 0.7 });

for (let i = 0; i < particleCount; i++) {
  const particle = new THREE.Mesh(geometry, material.clone());
  particle.position.set(
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 20,
    (Math.random() - 0.5) * 10
  );
  particle.userData = {
    velocity: new THREE.Vector3(
      (Math.random() - 0.5) * 0.015,
      (Math.random() - 0.5) * 0.015,
      (Math.random() - 0.5) * 0.01
    ),
    rotationSpeed: (Math.random() - 0.5) * 0.03
  };
  particles.add(particle);
}

const ambientLight = new THREE.AmbientLight(0x007f99, 0.8);
const pointLight = new THREE.PointLight(0x00e5ff, 1, 100);
pointLight.position.set(2, 3, 4);
scene.add(ambientLight, pointLight);

let moveParticles = true;
let pulsePhase = 0;

function animate() {
  requestAnimationFrame(animate);
  pulsePhase += 0.02;

  particles.children.forEach(particle => {
    if (moveParticles) {
      particle.position.add(particle.userData.velocity);
      particle.rotation.x += particle.userData.rotationSpeed;
      particle.rotation.y += particle.userData.rotationSpeed;

      if (particle.position.x > 10) particle.position.x -= 20;
      if (particle.position.x < -10) particle.position.x += 20;
      if (particle.position.y > 10) particle.position.y -= 20;
      if (particle.position.y < -10) particle.position.y += 20;
      if (particle.position.z > 5) particle.position.z -= 10;
      if (particle.position.z < -5) particle.position.z += 10;
    }

    particle.material.opacity = 0.7 + 0.2 * Math.sin(pulsePhase + particle.position.x);
    particle.material.color.setHSL(
      0.5 + 0.1 * Math.sin(pulsePhase * 0.5 + particle.position.y),
      1,
      0.5
    );
  });

  renderer.render(scene, camera);
}
animate();

threeCanvas.addEventListener('mouseenter', () => {
  moveParticles = false;
  particles.children.forEach(particle => {
    particle.material.opacity = 0.5;
  });
});

threeCanvas.addEventListener('mouseleave', () => {
  moveParticles = true;
  particles.children.forEach(particle => {
    particle.material.opacity = 0.7 + 0.2 * Math.sin(pulsePhase + particle.position.x);
  });
});

/* THREE.JS FOR PROJECT CARDS */
const projectCardsArray = document.querySelectorAll('.project-card');
projectCardsArray.forEach(card => {
  const canvas = card.querySelector('.project-canvas');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.1, 1000);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
  renderer.setSize(canvas.width, canvas.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const particleCount = window.innerWidth < 768 ? 15 : 20;
  const particles = new THREE.Group();
  scene.add(particles);

  const particleGeometry = new THREE.SphereGeometry(0.05, 16, 16);
  const particleMaterial = new THREE.MeshBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: 0.6 });

  for (let i = 0; i < particleCount; i++) {
    const particle = new THREE.Mesh(particleGeometry, particleMaterial.clone());
    particle.position.set(
      (Math.random() - 0.5) * 4,
      (Math.random() - 0.5) * 3,
      (Math.random() - 0.5) * 2
    );
    particle.userData = {
      velocity: new THREE.Vector3(
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.02,
        (Math.random() - 0.5) * 0.01
      )
    };
    particles.add(particle);
  }

  const ambientLight = new THREE.AmbientLight(0x007f99, 0.6);
  scene.add(ambientLight);

  let mouseX = 0, mouseY = 0;
  let isHovering = false;

  function animateCard() {
    requestAnimationFrame(animateCard);
    particles.children.forEach(particle => {
      particle.position.add(particle.userData.velocity);
      if (particle.position.x > 2) particle.position.x -= 4;
      if (particle.position.x < -2) particle.position.x += 4;
      if (particle.position.y > 1.5) particle.position.y -= 3;
      if (particle.position.y < -1.5) particle.position.y += 3;
      if (particle.position.z > 1) particle.position.z -= 2;
      if (particle.position.z < -1) particle.position.z += 2;

      particle.material.opacity = isHovering ? 0.8 : 0.6;
    });

    if (isHovering) {
      const maxTilt = 0.2;
      const tiltX = (mouseY / canvas.height - 0.5) * maxTilt;
      const tiltY = (mouseX / canvas.width - 0.5) * -maxTilt;
      card.style.transform = `perspective(1000px) translateY(-15px) scale(1.05) rotateX(${tiltX * 180 / Math.PI}deg) rotateY(${tiltY * 180 / Math.PI}deg)`;
    }

    renderer.render(scene, camera);
  }
  animateCard();

  card.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    isHovering = true;
  });

  card.addEventListener('mouseleave', () => {
    isHovering = false;
    card.style.transform = `perspective(1000px) translateY(0) rotateX(0deg) rotateY(0deg)`;
    particles.children.forEach(particle => {
      particle.material.opacity = 0.6;
    });
  });

  window.addEventListener('resize', () => {
    renderer.setSize(canvas.width, canvas.height);
    camera.aspect = canvas.width / canvas.height;
    camera.updateProjectionMatrix();
  });
});

