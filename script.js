(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = window.matchMedia("(pointer: coarse)").matches;

  // ---------- Loader ----------
  document.body.classList.add("is-loading");

  const loader = document.querySelector(".loader");
  const loaderNumber = document.querySelector(".loader__number");
  const loaderLine = document.querySelector(".loader__line span");

  let progress = 0;
  const progressTimer = setInterval(() => {
    progress = Math.min(progress + Math.floor(Math.random() * 13) + 4, 100);
    loaderNumber.textContent = String(progress).padStart(2, "0");
    loaderLine.style.width = progress + "%";
    if (progress >= 100) clearInterval(progressTimer);
  }, 55);

  window.addEventListener("load", () => {
    const finish = () => {
      loader?.remove();
      document.body.classList.remove("is-loading");
      init();
    };

    if (reduceMotion || !window.gsap) {
      finish();
      return;
    }

    gsap.to(loader, {
      opacity: 0,
      duration: .8,
      delay: .2,
      ease: "power3.inOut",
      onComplete: finish
    });
  });

  function init() {
    // ---------- GSAP ----------
    if (window.gsap) {
      gsap.registerPlugin(ScrollTrigger);

      if (!reduceMotion) {
        gsap.utils.toArray(".reveal").forEach((el) => {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              once: true
            }
          });
        });

        // Editorial hero typography
        gsap.from(".hero__title span", {
          yPercent: 115,
          opacity: 0,
          duration: 1.35,
          stagger: .12,
          ease: "power4.out",
          delay: .15
        });

        // Image scale + cinematic light
        gsap.utils.toArray(".portrait").forEach((section) => {
          const image = section.querySelector(".portrait__photo");
          const beam = section.querySelector(".portrait__beam");
          const ambient = section.querySelector(".portrait__ambient");

          gsap.fromTo(image,
            { yPercent: 8, scale: 1.04 },
            {
              yPercent: -8,
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: 1.4
              }
            }
          );

          gsap.to(beam, {
            rotate: 7,
            opacity: .35,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.6
            }
          });

          gsap.to(ambient, {
            scale: 1.35,
            opacity: .45,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 2
            }
          });

          const name = section.querySelector(".portrait__name");
          gsap.fromTo(name,
            { y: 55, opacity: 0 },
            {
              y: -55,
              opacity: 1,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top 80%",
                end: "bottom 20%",
                scrub: 1.2
              }
            }
          );

          gsap.fromTo(section.querySelectorAll(".traits span"),
            { opacity: 0, x: 20 },
            {
              opacity: 1, x: 0,
              stagger: .08,
              duration: .7,
              ease: "power2.out",
              scrollTrigger: {
                trigger: section,
                start: "top 65%",
                once: true
              }
            }
          );
        });

        // Trait tags float slightly with scroll
        gsap.utils.toArray(".traits").forEach((group, i) => {
          gsap.to(group, {
            y: i % 2 ? -30 : 30,
            ease: "none",
            scrollTrigger: {
              trigger: group.closest(".portrait"),
              start: "top bottom",
              end: "bottom top",
              scrub: 2
            }
          });
        });

        // Duo cards
        gsap.utils.toArray(".duo-card").forEach((card, i) => {
          gsap.fromTo(card,
            { y: i ? 80 : -80, scale: .96 },
            {
              y: i ? -50 : 50,
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: ".duo__grid",
                start: "top bottom",
                end: "bottom top",
                scrub: 1.5
              }
            }
          );
        });

        // Closing halo
        gsap.to(".closing__halo", {
          scale: 1.5,
          rotation: 20,
          ease: "none",
          scrollTrigger: {
            trigger: ".closing",
            start: "top bottom",
            end: "bottom top",
            scrub: 2
          }
        });

        // Moving horizontal outline text
        gsap.to(".duo__title .outline", {
          xPercent: -8,
          ease: "none",
          scrollTrigger: {
            trigger: ".duo",
            start: "top bottom",
            end: "bottom top",
            scrub: 1
          }
        });
      }
    }

    // ---------- Custom cursor ----------
    if (!isTouch && !reduceMotion) {
      const dot = document.querySelector(".cursor-dot");
      const ring = document.querySelector(".cursor-ring");
      let mx = innerWidth / 2, my = innerHeight / 2;
      let rx = mx, ry = my;

      window.addEventListener("pointermove", e => {
        mx = e.clientX;
        my = e.clientY;
        gsap?.to(dot, { x: mx, y: my, duration: .08, overwrite: true });
      });

      const tick = () => {
        rx += (mx - rx) * .12;
        ry += (my - ry) * .12;
        ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
        requestAnimationFrame(tick);
      };
      tick();

      document.querySelectorAll("a, .portrait__photo, .traits span, .duo-card").forEach(el => {
        el.addEventListener("mouseenter", () => document.body.classList.add("hovering"));
        el.addEventListener("mouseleave", () => document.body.classList.remove("hovering"));
      });
    }

    // ---------- Magnetic links ----------
    if (!isTouch && !reduceMotion && window.gsap) {
      document.querySelectorAll(".magnetic").forEach(el => {
        el.addEventListener("mousemove", e => {
          const r = el.getBoundingClientRect();
          const x = e.clientX - (r.left + r.width / 2);
          const y = e.clientY - (r.top + r.height / 2);
          gsap.to(el, { x: x * .18, y: y * .18, duration: .35, ease: "power3.out" });
        });
        el.addEventListener("mouseleave", () => {
          gsap.to(el, { x: 0, y: 0, duration: .7, ease: "elastic.out(1, .4)" });
        });
      });
    }

    // ---------- Portrait light sweep ----------
    if (!reduceMotion && window.gsap) {
      document.querySelectorAll(".portrait__photo").forEach(photo => {
        const after = photo.querySelector(":scope::after");
        // CSS pseudo-element cannot be selected; animate a custom property instead.
        photo.addEventListener("mouseenter", () => {
          photo.style.setProperty("--sweep", "1");
          gsap.to(photo, { y: -8, duration: .6, ease: "power3.out" });
        });
        photo.addEventListener("mouseleave", () => {
          gsap.to(photo, { y: 0, duration: .8, ease: "power3.out" });
        });
      });
    }

    // ---------- Three.js atmospheric particles ----------
    if (window.THREE && !reduceMotion) {
      const canvas = document.getElementById("scene");
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, .1, 100);
      camera.position.z = 18;

      const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true
      });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
      renderer.setSize(innerWidth, innerHeight);

      const count = Math.min(900, Math.floor(innerWidth * .65));
      const positions = new Float32Array(count * 3);

      for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - .5) * 24;
        positions[i * 3 + 1] = (Math.random() - .5) * 18;
        positions[i * 3 + 2] = (Math.random() - .5) * 14;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

      const material = new THREE.PointsMaterial({
        color: 0xcfc4ae,
        size: .035,
        transparent: true,
        opacity: .42,
        depthWrite: false
      });

      const particles = new THREE.Points(geometry, material);
      scene.add(particles);

      let targetX = 0, targetY = 0;
      window.addEventListener("pointermove", e => {
        targetX = (e.clientX / innerWidth - .5) * .5;
        targetY = (e.clientY / innerHeight - .5) * .5;
      });

      const animate = () => {
        particles.rotation.y += .00025;
        particles.rotation.x += .00008;
        particles.position.x += (targetX - particles.position.x) * .012;
        particles.position.y += (-targetY - particles.position.y) * .012;
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      };
      animate();

      window.addEventListener("resize", () => {
        camera.aspect = innerWidth / innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(innerWidth, innerHeight);
      });
    }
  }
})();
