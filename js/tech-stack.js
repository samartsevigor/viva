(function initTechStack() {
  "use strict";

  var technologies = [
    { name: "React", slug: "react", color: "61DAFB" },
    { name: "Next.js", slug: "nextdotjs", color: "FFFFFF" },
    { name: "TypeScript", slug: "typescript", color: "3178C6" },
    { name: "Tailwind CSS", slug: "tailwindcss", color: "06B6D4" },
    { name: "Node.js", slug: "nodedotjs", color: "339933" },
    { name: "NestJS", slug: "nestjs", color: "E0234E" },
    { name: "Python", slug: "python", color: "3776AB" },
    { name: "Prisma", slug: "prisma", color: "FFFFFF" },
    { name: "PostgreSQL", slug: "postgresql", color: "4169E1" },
    { name: "Redis", slug: "redis", color: "FF4438" },
    { name: "Supabase", slug: "supabase", color: "3FCF8E" },
    { name: "Expo", slug: "expo", color: "000020" },
    { name: "Stripe", slug: "stripe", color: "635BFF" },
    { name: "Shopify", slug: "shopify", color: "7AB55C" },
    { name: "Twilio", src: "assets/tech/twilio.svg" },
    { name: "Agora", slug: "agora", color: "099DFD" },
    { name: "Docker", slug: "docker", color: "2496ED" },
    { name: "AWS", src: "assets/tech/aws.svg" },
    { name: "OpenAI", src: "assets/tech/openai.svg" },
    { name: "LangChain", slug: "langchain", color: "FFFFFF" },
    { name: "Figma", slug: "figma", color: "F24E1E" },
  ];

  var root = document.getElementById("tech-stack");
  if (!root) return;

  function createLogoItem(tech) {
    var item = document.createElement("li");
    item.className = "tech-stack__item";

    var logo = document.createElement("img");
    logo.className = "tech-stack__logo";
    logo.src = tech.src
      ? tech.src
      : "https://cdn.simpleicons.org/" + tech.slug + "/" + tech.color;
    logo.alt = tech.name;
    logo.width = 32;
    logo.height = 32;
    logo.loading = "lazy";
    logo.decoding = "async";

    var label = document.createElement("span");
    label.className = "tech-stack__name";
    label.textContent = tech.name;

    item.appendChild(logo);
    item.appendChild(label);
    return item;
  }

  function fillTrack(trackEl, items, duplicate) {
    var groups = duplicate ? 2 : 1;

    for (var g = 0; g < groups; g++) {
      var group = document.createElement("ul");
      group.className = "tech-stack__group";
      if (g === 1) group.setAttribute("aria-hidden", "true");

      items.forEach(function (tech) {
        group.appendChild(createLogoItem(tech));
      });

      trackEl.appendChild(group);
    }
  }

  var forwardTrack = root.querySelector(".tech-stack__track--forward");
  var reverseTrack = root.querySelector(".tech-stack__track--reverse");

  if (forwardTrack) fillTrack(forwardTrack, technologies, true);
  if (reverseTrack) {
    var reversed = technologies.slice().reverse();
    fillTrack(reverseTrack, reversed, true);
  }
})();
