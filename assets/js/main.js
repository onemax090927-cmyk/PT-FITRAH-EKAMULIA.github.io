/* ==========================================================================
   JAVASCRIPT LOGIC - PT FITRAH EKA MULIA
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  // --- DOM Elements ---
  const header = document.querySelector(".header");
  const mobileToggle = document.getElementById("mobile-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");
  const dropdownToggle = document.getElementById("produk-dropdown-btn");
  const dropdownParent = document.querySelector(".dropdown");
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  const formProductSelect = document.getElementById("form-product");
  const productOrderBtns = document.querySelectorAll(".btn-order");
  const modal = document.getElementById("productModal");
  // ==========================================
  // STICKY HEADER SCROLL EFFECT
  // ==========================================
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
  // ==========================================
  // MOBILE NAVIGATION TOGGLE (HAMBURGER)
  // ==========================================
  mobileToggle.addEventListener("click", () => {
    mobileToggle.classList.toggle("active");
    navMenu.classList.toggle("open");
  });
  // Close mobile menu when clicking nav links
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      // If it's the dropdown toggle on mobile, don't close yet
      if (
        e.currentTarget.id === "produk-dropdown-btn" &&
        window.innerWidth <= 768
      ) {
        return;
      }
      mobileToggle.classList.remove("active");
      navMenu.classList.remove("open");

      // Highlight active tab manually on click
      navLinks.forEach((item) => item.classList.remove("active"));
      link.classList.add("active");
    });
  });

  // ==========================================
  // MOBILE DROPDOWN TOGGLE ON CLICK
  // ==========================================
  dropdownToggle.addEventListener("click", (e) => {
    if (window.innerWidth <= 768) {
      e.preventDefault(); // Stop default scroll/jump
      dropdownParent.classList.toggle("active");
    }
  });
  // Close mobile dropdown when a dropdown item is clicked
  const dropdownItems = document.querySelectorAll(".dropdown-item");
  dropdownItems.forEach((item) => {
    item.addEventListener("click", () => {
      mobileToggle.classList.remove("active");
      navMenu.classList.remove("open");
      dropdownParent.classList.remove("active");

      // Mark 'Produk' nav link as active
      navLinks.forEach((nav) => nav.classList.remove("active"));
      dropdownToggle.classList.add("active");
    });
  });
  // ==========================================
  // ACTIVE NAVIGATION LINK HIGHLIGHTING ON SCROLL
  // ==========================================
  const sections = document.querySelectorAll("section");
  window.addEventListener("scroll", () => {
    let currentSectionId = "";

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;

      // Check if user is scrolled into this section
      if (window.scrollY >= sectionTop - 120) {
        currentSectionId = section.getAttribute("id");
      }
    });
    if (currentSectionId) {
      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${currentSectionId}`) {
          link.classList.add("active");
        }
      });

      // Special check: if we are in 'produk' section sub-areas, highlight the main Produk link
      if (currentSectionId === "produk") {
        dropdownToggle.classList.add("active");
      }
    }
  });
  // ==========================================
  // AUTO SELECT PRODUCT IN CONTACT FORM ON ORDER CLICK
  // ==========================================
  productOrderBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const productName = e.currentTarget.getAttribute("data-product-name");
      if (productName && formProductSelect) {
        formProductSelect.value = productName;
      }
    });
  });
  // ==========================================
  // PRODUCT MODAL DETAILS SYSTEM
  // ==========================================
  window.openProductModal = function (productId) {
    const product = productData[productId];
    if (!product) return;
    // Populate modal data
    document.getElementById("modalImg").src = product.img;
    document.getElementById("modalImg").alt = product.title;
    document.getElementById("modalTitle").textContent = product.title;
    document.getElementById("modalPrice").textContent = product.price;
    document.getElementById("modalBadge").textContent = product.badge;
    document.getElementById("modalUsage").textContent = product.usage;
    // Populate benefits list
    const benefitsList = document.getElementById("modalBenefits");
    benefitsList.innerHTML = ""; // clear old items
    product.benefits.forEach((benefit) => {
      const li = document.createElement("li");
      li.textContent = benefit;
      benefitsList.appendChild(li);
    });
    // Set Order button to pre-fill form
    const orderBtn = document.getElementById("modalOrderBtn");
    orderBtn.setAttribute("href", "#kontak");
    // Add click listener to modal order btn
    orderBtn.onclick = () => {
      formProductSelect.value = product.title;
      closeProductModal();
    };
    // Open Modal
    modal.classList.add("open");
    document.body.style.overflow = "hidden"; // Lock background scroll
  };
  window.closeProductModal = function () {
    modal.classList.remove("open");
    document.body.style.overflow = "auto"; // Unlock background scroll
  };
  // Close modal if clicking outside the content area
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeProductModal();
      }
    });
  }
  // Close modal on escape key
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("open")) {
      closeProductModal();
    }
  });
  // ==========================================
  // CONTACT FORM INTERACTIVE SUBMISSION HANDLER
  // ==========================================
  window.handleContactSubmit = function (e) {
    e.preventDefault();

    const name = document.getElementById("form-name").value;
    const email = document.getElementById("form-email").value;
    const product = document.getElementById("form-product").value;
    const message = document.getElementById("form-message").value;
    // Beautiful transition loading
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Mengirimkan Pesan...";
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;

      // Show custom success banner
      formStatus.className = "form-status success";
      formStatus.innerHTML = `<strong>Terima kasih, ${name}!</strong> Pesan Anda berhasil dikirim. Tim kami akan menghubungi Anda melalui email <strong>${email}</strong> segera.`;

      // Scroll to the status element
      formStatus.scrollIntoView({ behavior: "smooth", block: "nearest" });

      // Clear Form
      contactForm.reset();

      // Clear status after 10 seconds
      setTimeout(() => {
        formStatus.style.display = "none";
      }, 10000);
    }, 1200); // Simulated delay for professional feel
  };
});
/* ==========================================================================
   SCROLL ANIMATION SYSTEM - PT FITRAH EKA MULIA
   Menggunakan Intersection Observer API (tanpa library tambahan)
   ========================================================================== */
(function initScrollAnimations() {
  /* ------------------------------------------------------------------
       1. MAPPING: elemen → arah animasi
          Selector CSS → nilai data-animate
    ------------------------------------------------------------------ */
  const animationMap = [
    /* Hero */
    { selector: ".hero-content", dir: "up" },

    /* Section headers (semua section) */
    { selector: ".section-header", dir: "up" },

    /* About section */
    { selector: ".about-image-side", dir: "left" },
    { selector: ".about-text-side", dir: "right" },
    { selector: ".about-image-card", dir: "zoom" },

    /* Value items di about */
    { selector: ".value-item", dir: "up", stagger: true },

    /* Product cards */
    { selector: ".product-card", dir: "zoom", stagger: true },

    /* Contact section */
    { selector: ".contact-info-card", dir: "left" },
    { selector: ".contact-form-card", dir: "right" },
    { selector: ".contact-map-card", dir: "up" },

    /* Contact method items */
    { selector: ".contact-method-item", dir: "left", stagger: true },

    /* Footer */
    { selector: ".footer-brand-side", dir: "left" },
    { selector: ".footer-links-side", dir: "right" },
    { selector: ".footer-bottom", dir: "up" },
  ];

  /* ------------------------------------------------------------------
       2. TERAPKAN atribut data-animate ke elemen di DOM
    ------------------------------------------------------------------ */
  animationMap.forEach(({ selector, dir, stagger }) => {
    const elements = document.querySelectorAll(selector);
    elements.forEach((el, index) => {
      /* Hindari menimpa elemen yang sudah punya atribut */
      if (!el.hasAttribute("data-animate")) {
        el.setAttribute("data-animate", dir);
      }
      /* Tambahkan delay bertahap untuk staggered group */
      if (stagger && index < 5) {
        el.setAttribute("data-delay", index + 1);
      }
    });
  });

  /* ------------------------------------------------------------------
       3. INTERSECTION OBSERVER — pantau elemen masuk viewport
    ------------------------------------------------------------------ */
  const observerOptions = {
    root: null /* viewport sebagai referensi */,
    threshold: 0.12 /* 12% elemen terlihat → trigger */,
    rootMargin: "0px 0px -48px 0px" /* sedikit buffer bawah */,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        /* Berhenti mengamati setelah animasi diputar sekali */
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  /* Mulai mengamati semua elemen bertanda data-animate */
  document.querySelectorAll("[data-animate]").forEach((el) => {
    observer.observe(el);
  });

  /* ------------------------------------------------------------------
       4. FALLBACK — langsung tampilkan jika browser tidak support
    ------------------------------------------------------------------ */
  if (!("IntersectionObserver" in window)) {
    document.querySelectorAll("[data-animate]").forEach((el) => {
      el.classList.add("is-visible");
    });
  }
})();
/* ==========================================================================
   PRODUCT OVERVIEW OVERLAY — PT FITRAH EKA MULIA
   ========================================================================== */
(function () {
  /* ------------------------------------------------------------------
       Data produk untuk overlay (Lihat Sekilas)
    ------------------------------------------------------------------ */
  const overlayData = {
    surgical: {
      title: "Surgical Instrument",
      tag: "Produk Unggulan",
      category: "Bedah & Operasi",
      img: "assets/images/brand/Surgical.jpeg",
      link: "products/surgical-instruments.html",
      desc: "Kumpulan alat bedah presisi tinggi yang digunakan tenaga medis dalam berbagai prosedur operasi — mulai dari memotong, menjepit, memegang jaringan, diseksi, penjahitan, hingga manipulasi area operasi.",
      features: [
        "Bahan stainless steel medis grade premium",
        "Tersedia dalam set lengkap maupun satuan",
        "Mencakup gunting bedah, forceps, needle holder & klem",
        "Desain ergonomis untuk presisi dan kenyamanan operator",
        "Brand DUFNER & HADIDI bersertifikat internasional",
      ],
    },
    cranio: {
      title: "Cranio Maxillo Facial",
      tag: "Implan Medis",
      category: "Bedah Kraniofasial",
      img: "assets/images/brand/Cranio.jpeg",
      link: "products/cranio-maxillo-facial.html",
      desc: "Sistem implan medis untuk bedah kraniofasial — fiksasi, stabilisasi, dan rekonstruksi tulang tengkorak, rahang, dan wajah pasca cedera, kelainan bentuk, atau tindakan operasi.",
      features: [
        "Material titanium medis ringan & biokompatibel",
        "Tersedia plate, screw, mesh & instrumen pendukung",
        "Presisi tinggi mengikuti anatomi wajah manusia",
        "Sistem modular untuk berbagai ukuran dan kebutuhan",
        "Memenuhi standar CE & ISO perangkat medis implan",
      ],
    },
    implant: {
      title: "Implant Orthopedic",
      tag: "Implan Medis",
      category: "Sistem Implan Ortopedi",
      img: "assets/images/brand/implant.jpeg",
      link: "products/implant-ortopedic.html",
      desc: "Implant Orthopedic adalah solusi implan ortopedi berkualitas tinggi yang dirancang untuk mendukung perawatan trauma tulang, penyembuhan patah tulang, dan stabilisasi sendi. Produk ini menawarkan kekuatan struktural, kompatibilitas biokompatibel, dan akurasi yang dibutuhkan dalam operasi ortopedi modern.",
      features: [
        "Bahan titanium dan stainless steel medis yang tahan lama",
        "Tersedia berbagai ukuran pelat, sekrup, dan sistem fiksasi",
        "Desain khusus untuk stabilitas dan penyembuhan tulang optimal",
        "Kompatibel dengan prosedur ortopedi rekonstruktif dan trauma",
        "Meningkatkan outcome pasien dengan pemulihan fungsi yang lebih baik",
      ],
    },
    digital: {
      title: "Digital Tourniquet System",
      tag: "Perangkat Digital",
      category: "Sistem Tourniquet",
      img: "assets/images/brand/digital.jpeg",
      link: "products/digital-tourniquet-system.html",
      desc: "Sistem Tourniquet Digital adalah perangkat canggih yang dirancang untuk mengontrol aliran darah secara presisi selama prosedur bedah dan ortopedi. Perangkat ini menggabungkan pengaturan tekanan digital, pemantauan waktu nyata, dan fitur keselamatan otomatis untuk mengurangi risiko komplikasi dan meningkatkan efisiensi tim medis.",
      features: [
        "Pengaturan tekanan digital presisi dengan rentang yang dapat disesuaikan",
        "Pemantauan waktu nyata dan timer terintegrasi",
        "Fitur keselamatan otomatis (batas tekanan, alarm, dan auto-release)",
        "Desain ergonomis untuk pemasangan cepat dan nyaman",
        "Meningkatkan efisiensi operasional dan kenyamanan pasien",
      ],
    },
    endoscopy: {
      title: "Endoscopy Imaging Units",
      tag: "Perangkat Endoskopi",
      category: "Sistem Endoskopi",
      img: "assets/images/brand/Endoscopy.jpeg",
      link: "products/cranio-maxillo-facial.html",
      desc: "Endoscopy Imaging Units adalah sistem pencitraan medis untuk prosedur endoskopi yang memberikan visualisasi internal real-time dan mendukung diagnosis serta tindakan bedah minimal invasif.",
      features: [
        "Kamera endoskopi resolusi tinggi untuk visualisasi optimal",
        "Monitor medis dengan tampilan real-time dan kontras tajam",
        "Sumber cahaya dan konektivitas yang kompatibel",
        "Desain ergonomis untuk ruang operasi dan prosedur endoskopi",
        "Mendukung alur kerja tim medis dengan kontrol intuitif",
      ],
    },
    endoscopy: {
      title: "Endoscopy Imaging Units",
      tag: "Perangkat Endoskopi",
      category: "Sistem Endoskopi",
      img: "assets/images/brand/Endoscopy.jpeg",
      link: "products/cranio-maxillo-facial.html",
      desc: "Endoscopy Imaging Units adalah sistem pencitraan medis untuk prosedur endoskopi yang menyediakan visualisasi real-time berkualitas tinggi, mendukung diagnosis dan terapi minimal invasif.",
      features: [
        "Kamera endoskopi resolusi tinggi untuk visualisasi internal",
        "Monitor medis dengan tampilan real-time dan kontras tajam",
        "Sumber cahaya dan konektivitas yang cocok untuk berbagai prosedur",
        "Desain ergonomis untuk penggunaan di ruang operasi dan endoskopi",
        "Kompatibel dengan alat endoskopis standar dan kontrol intuitif",
      ],
    },
  };

  /* ------------------------------------------------------------------
       Fungsi buka overlay
    ------------------------------------------------------------------ */
  window.openProductOverlay = function (productKey) {
    const data = overlayData[productKey];
    if (!data) return;

    /* Isi konten */
    document.getElementById("overlayImg").src = data.img;
    document.getElementById("overlayImg").alt = data.title;
    document.getElementById("overlayTitle").textContent = data.title;
    document.getElementById("overlayTag").textContent = data.tag;
    document.getElementById("overlayCategory").textContent = data.category;
    document.getElementById("overlayDesc").textContent = data.desc;
    document.getElementById("overlayDetailLink").href = data.link;

    /* Isi daftar fitur */
    const featuresList = document.getElementById("overlayFeatures");
    featuresList.innerHTML = "";
    data.features.forEach((f) => {
      const li = document.createElement("li");
      li.textContent = f;
      featuresList.appendChild(li);
    });

    /* Tampilkan overlay */
    const overlay = document.getElementById("prodOverlay");
    overlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
  };

  /* ------------------------------------------------------------------
       Fungsi tutup overlay
    ------------------------------------------------------------------ */
  window.closeProductOverlay = function () {
    document.getElementById("prodOverlay").classList.remove("is-open");
    document.body.style.overflow = "auto";
  };

  /* Tutup dengan tombol Escape */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeProductOverlay();
  });
})();
/* ==========================================================================
   LANGUAGE SWITCHER / i18n SYSTEM — PT FITRAH EKA MULIA
   ========================================================================== */
(function initLanguageSwitcher() {
  /* ------------------------------------------------------------------
       Translation Dictionary
    ------------------------------------------------------------------ */
  const translations = {
    id: {
      /* Nav */
      nav_home: "Home",
      nav_produk: "Produk",
      nav_tentang: "Tentang Kami",
      nav_kontak: "Hubungi Kami",

      /* Hero */
      hero_desc:
        "Kami adalah distributor peralatan medis profesional di Indonesia <strong>sejak 1995</strong>. Menyediakan instrumen bedah dan peralatan medis berkualitas tinggi untuk mendukung tenaga kesehatan dengan presisi, keandalan, dan layanan terpercaya.",
      hero_btn_produk: "Jelajahi Produk",
      hero_btn_tentang: "Tentang Kami",

      /* About */
      about_subtitle: "TENTANG KAMI",
      about_title: "Dedikasi Untuk Kesehatan dan Kesejahteraan Anda",
      about_heading:
        "Menjaga Kemurnian dan Kebaikan Alam untuk Keluarga Indonesia",
      about_p1:
        "<strong>PT FITRAH EKAMULIA</strong> PT Fitrah Ekamulia didirikan pada tahun 1991. Sejak saat itu, PT Fitrah Ekamulia telah berkembang secara progresif menjadi salah satu distributor peralatan medis terkemuka di Indonesia.",
      about_visi:
        "<strong>VISI :</strong> Untuk menjadi salah satu perusahaan terkemuka di industri kesehatan di Indonesia dan dengan menyediakan peralatan kelas dunia serta melalui layanan yang efektif, efisien, dan unggul, yang meningkatkan kualitas hidup manusia, kami memberikan kepuasan yang berkualitas kepada pelanggan, pemasok, dan mitra kami.",
      about_misi:
        "<strong>MISI :</strong> Pengembangan yang konsisten dan menjaga integritas dalam rutinitas sehari-hari, sambil terus memberikan produk dan layanan terbaik.",
      about_recent: "Postingan Terbaru",

      /* About - value items */
      value_hadidi_title: "HADIDI Hypospadias Set",
      value_hadidi_desc:
        "Set instrumen khusus untuk Hipospadia, Kriptorkisme, koreksi hernia atau untuk digunakan dalam bedah kosmetik ekstra halus, bibir sumbing, telinga, mata (blefaroplastik), tangan dan kaki.",
      value_dufner_title: "DUFNER Surgical Instrument",
      value_dufner_desc:
        "HADIDI Hypospadias Set — set instrumen khusus untuk hipospadia, kriptorkisme, koreksi hernia, atau bedah kosmetik ekstra halus.",

      /* Products Section */
      produk_subtitle: "PRODUK UNGGULAN",
      produk_title: "Solusi Kesehatan Alami Terbaik",
      produk_desc:
        "Pilihan produk kesehatan premium yang diformulasikan khusus untuk memenuhi berbagai kebutuhan vitalitas dan kebugaran tubuh Anda.",

      /* Product descriptions */
      prod_surgical_desc:
        "Surgical Instrument adalah kumpulan alat bedah yang digunakan tenaga medis untuk melakukan berbagai prosedur operasi, mulai dari memotong, menjepit, memegang jaringan, melakukan diseksi, hingga penjahitan dan manipulasi area operasi. Produk ini mencakup berbagai jenis instrumen seperti gunting bedah, forceps, needle holder, retraktor, dan klem yang dirancang sesuai kebutuhan tindakan medis tertentu.",
      prod_cranio_desc:
        "Cranio Maxillo Facial (CMF) adalah sistem implan medis yang digunakan dalam bedah kraniofasial (tulang tengkorak, rahang, dan wajah) untuk membantu fiksasi, stabilisasi, serta rekonstruksi tulang setelah cedera, kelainan bentuk, atau tindakan operasi. Produk ini umumnya terdiri dari plate (pelat), screw (sekrup), mesh titanium, dan instrumen pendukung yang dirancang agar presisi mengikuti anatomi wajah.",
      prod_implant_desc:
        "Implant Ortopedi adalah perangkat medis steril berbahan biokompatibel (seperti titanium, stainless steel, atau keramik) yang dipasang melalui tindakan operasi untuk menggantikan sendi yang rusak, menyambung tulang yang patah, atau mendukung struktur tulang yang lemah agar pasien dapat kembali bergerak dengan normal.",
      btn_detail: "Detail Produk",
      btn_lihat: "Lihat Sekilas",

      /* Contact */
      kontak_subtitle: "HUBUNGI KAMI",
      kontak_title: "Mulai Perjalanan Sehat Anda",
      kontak_desc:
        "Punya pertanyaan seputar produk kami atau ingin konsultasi kesehatan? Tim customer care kami siap membantu Anda dengan sepenuh hati.",
      kontak_card_title: "Hubungi PT FITRAH EKA MULIA",
      kontak_card_intro:
        "Kunjungi kantor kami atau hubungi kami melalui media komunikasi berikut:",
      kontak_alamat: "Alamat Kantor",
      kontak_telepon: "Telepon / WhatsApp",
      kontak_email: "Alamat Email",
      kontak_maps: "Buka di Google Maps",
      kontak_lokasi: "Lokasi Kami",

      /* Footer */
      footer_about:
        "Berdedikasi dalam menyediakan solusi kesehatan alami berkualitas tinggi demi mendukung gaya hidup sehat berlandaskan khasiat fitrah alamiah yang murni.",
      footer_menu: "Menu Utama",
      footer_produk_kami: "Produk Kami",
      footer_copyright: "Hak Cipta © 2026 PT FITRAH EKAMULIA.",
      footer_designed: "Designed with ❤ for Healthy Living",

      /* Overlay */
      overlay_tag_surgical: "Produk Unggulan",
      overlay_tag_cranio: "Implan Medis",
      overlay_tag_tourniquet: "Perangkat Digital",
      overlay_tag_digital: "Perangkat Digital",
      overlay_tag_implant: "Implan Medis",
      overlay_tag_endoscopy: "Perangkat Endoskopi",
      overlay_cat_surgical: "Bedah & Operasi",
      overlay_cat_cranio: "Bedah Kraniofasial",
      overlay_cat_endoscopy: "Sistem Endoskopi",
      overlay_cat_tourniquet: "Sistem Tourniquet",
      overlay_cat_digital: "Sistem Tourniquet",
      overlay_cat_implant: "Sistem Implan Ortopedi",
      overlay_keunggulan: "Keunggulan Produk",
      overlay_stok: "Hubungi kami untuk informasi stok",
      overlay_btn_halaman: "Halaman Lengkap",
      overlay_btn_hubungi: "Hubungi Kami",
    },
    en: {
      /* Nav */
      nav_home: "Home",
      nav_produk: "Products",
      nav_tentang: "About Us",
      nav_kontak: "Contact Us",

      /* Hero */
      hero_desc:
        "We are a professional medical equipment distributor in Indonesia <strong>since 1995</strong>. Providing high-quality surgical instruments and medical equipment to support healthcare professionals with precision, reliability, and trusted service.",
      hero_btn_produk: "Explore Products",
      hero_btn_tentang: "About Us",

      /* About */
      about_subtitle: "ABOUT US",
      about_title: "Dedicated to Your Health and Well-being",
      about_heading:
        "Maintaining Purity and Natural Goodness for Indonesian Families",
      about_p1:
        "<strong>PT FITRAH EKAMULIA</strong> was established in 1991. Since then, PT Fitrah Ekamulia has progressively grown to become one of Indonesia's leading medical equipment distributors.",
      about_visi:
        "<strong>VISION:</strong> To become one of the leading companies in the healthcare industry in Indonesia by providing world-class equipment and through effective, efficient, and excellent services that improve the quality of human life, delivering quality satisfaction to our customers, suppliers, and partners.",
      about_misi:
        "<strong>MISSION:</strong> Consistent development and maintaining integrity in daily routines, while continuing to provide the best products and services.",
      about_recent: "Recent Posts",

      /* About - value items */
      value_hadidi_title: "HADIDI Hypospadias Set",
      value_hadidi_desc:
        "Special instrument set for Hypospadias, Cryptorchidism, hernia correction or for use in extra delicate cosmetic surgery, cleft lips, ears, eyes (blepharoplasty), hands and feet.",
      value_dufner_title: "DUFNER Surgical Instrument",
      value_dufner_desc:
        "HADIDI Hypospadias Set — special instrument set for hypospadias, cryptorchidism, hernia correction, or extra delicate cosmetic surgeries.",

      /* Products Section */
      produk_subtitle: "FEATURED PRODUCTS",
      produk_title: "Best Natural Health Solutions",
      produk_desc:
        "A selection of premium health products specially formulated to meet your various vitality and fitness needs.",

      /* Product descriptions */
      prod_surgical_desc:
        "Surgical Instruments are a collection of surgical tools used by medical professionals to perform various surgical procedures, from cutting, clamping, holding tissue, performing dissection, to suturing and manipulating the surgical area. These products include various types of instruments such as surgical scissors, forceps, needle holders, retractors, and clamps designed for specific medical procedures.",
      prod_cranio_desc:
        "Cranio Maxillo Facial (CMF) is a medical implant system used in craniofacial surgery (skull, jaw, and face) to assist with fixation, stabilization, and bone reconstruction after injury, deformity, or surgical procedures. Products typically consist of plates, screws, titanium mesh, and supporting instruments designed for precise anatomical conformity.",
      prod_implant_desc:
        "Orthopedic Implants are sterile medical devices made of biocompatible materials (such as titanium, stainless steel, or ceramics) installed through surgical procedures to replace damaged joints, connect fractured bones, or support weakened bone structures so patients can return to normal movement.",
      btn_detail: "Product Details",
      btn_lihat: "Quick View",

      /* Contact */
      kontak_subtitle: "CONTACT US",
      kontak_title: "Start Your Healthy Journey",
      kontak_desc:
        "Have questions about our products or want a health consultation? Our customer care team is ready to help you wholeheartedly.",
      kontak_card_title: "Contact PT FITRAH EKA MULIA",
      kontak_card_intro:
        "Visit our office or reach us through the following communication channels:",
      kontak_alamat: "Office Address",
      kontak_telepon: "Phone / WhatsApp",
      kontak_email: "Email Address",
      kontak_maps: "Open in Google Maps",
      kontak_lokasi: "Our Location",

      /* Footer */
      footer_about:
        "Dedicated to providing high-quality natural health solutions to support a healthy lifestyle based on the purity of natural goodness.",
      footer_menu: "Main Menu",
      footer_produk_kami: "Our Products",
      footer_copyright: "Copyright © 2026 PT FITRAH EKAMULIA.",
      footer_designed: "Designed with ❤ for Healthy Living",

      /* Overlay */
      overlay_tag_surgical: "Featured Product",
      overlay_tag_cranio: "Medical Implant",
      overlay_tag_tourniquet: "Digital Device",
      overlay_tag_digital: "Digital Device",
      overlay_tag_implant: "Medical Implant",
      overlay_tag_endoscopy: "Endoscopy Device",
      overlay_cat_surgical: "Surgery & Operations",
      overlay_cat_cranio: "Craniofacial Surgery",
      overlay_cat_endoscopy: "Endoscopy System",
      overlay_cat_tourniquet: "Tourniquet System",
      overlay_cat_digital: "Tourniquet System",
      overlay_cat_implant: "Orthopedic Implant System",
      overlay_keunggulan: "Product Advantages",
      overlay_stok: "Contact us for stock information",
      overlay_btn_halaman: "Full Page",
      overlay_btn_hubungi: "Contact Us",
    },
  };

  /* ------------------------------------------------------------------
       Overlay data translations
    ------------------------------------------------------------------ */
  const overlayTranslations = {
    id: {
      surgical: {
        desc: "Kumpulan alat bedah presisi tinggi yang digunakan tenaga medis dalam berbagai prosedur operasi — mulai dari memotong, menjepit, memegang jaringan, diseksi, penjahitan, hingga manipulasi area operasi.",
        features: [
          "Bahan stainless steel medis grade premium",
          "Tersedia dalam set lengkap maupun satuan",
          "Mencakup gunting bedah, forceps, needle holder & klem",
          "Desain ergonomis untuk presisi dan kenyamanan operator",
          "Brand DUFNER & HADIDI bersertifikat internasional",
        ],
      },
      endoscopy: {
        desc: "Endoscopy Imaging Units adalah sistem pencitraan medis untuk prosedur endoskopi yang memberikan visualisasi internal real-time dan mendukung diagnosis serta tindakan minimal invasif.",
        features: [
          "Kamera endoskopi resolusi tinggi untuk visualisasi internal",
          "Monitor medis dengan tampilan real-time dan kontras tajam",
          "Sumber cahaya yang terintegrasi untuk pencahayaan optimal",
          "Antarmuka pengguna yang intuitif untuk tim medis",
          "Kompatibel dengan berbagai perangkat endoskopi dan aksesori",
        ],
      },
      implant: {
        desc: "Implant Orthopedic adalah solusi implan ortopedi berkualitas tinggi yang dirancang untuk mendukung perawatan trauma tulang, penyembuhan patah tulang, dan stabilisasi sendi. Produk ini menawarkan kekuatan struktural, kompatibilitas biokompatibel, dan akurasi yang dibutuhkan dalam operasi ortopedi modern.",
        features: [
          "Bahan titanium dan stainless steel medis yang tahan lama",
          "Tersedia berbagai ukuran pelat, sekrup, dan sistem fiksasi",
          "Desain khusus untuk stabilitas dan penyembuhan tulang optimal",
          "Kompatibel dengan prosedur ortopedi rekonstruktif dan trauma",
          "Meningkatkan outcome pasien dengan pemulihan fungsi yang lebih baik",
        ],
      },
    },
    en: {
      surgical: {
        desc: "High-precision surgical tools used by medical professionals in various surgical procedures — from cutting, clamping, holding tissue, dissection, suturing, to manipulating the surgical area.",
        features: [
          "Premium grade medical stainless steel material",
          "Available in complete sets or individual units",
          "Includes surgical scissors, forceps, needle holders & clamps",
          "Ergonomic design for precision and operator comfort",
          "DUFNER & HADIDI brands with international certification",
        ],
      },
      endoscopy: {
        desc: "Endoscopy Imaging Units are medical imaging systems for endoscopic procedures that provide real-time internal visualization and support minimally invasive diagnosis and therapy.",
        features: [
          "High-resolution endoscopic camera for clear internal images",
          "Real-time medical monitor with sharp contrast",
          "Integrated lighting and connectivity for optimal procedure support",
          "Intuitive interface designed for surgical teams",
          "Compatible with standard endoscopy instruments and accessories",
        ],
      },
      implant: {
        desc: "Implant Orthopedic is a high-quality orthopedic implant solution designed to support bone trauma treatment, fracture healing, and joint stabilization. This product offers structural strength, biocompatible materials, and the precision required for modern orthopedic surgery.",
        features: [
          "Durable medical-grade titanium and stainless steel materials",
          "Available in multiple sizes of plates, screws, and fixation systems",
          "Engineered for optimal bone stability and healing",
          "Compatible with reconstructive and trauma orthopedic procedures",
          "Improves patient outcomes with better functional recovery",
        ],
      },
    },
  };

  /* ------------------------------------------------------------------
       DOM Element ↔ Translation Key Mapping
    ------------------------------------------------------------------ */
  const selectorMap = [
    /* Nav links */
    { sel: ".nav-list .nav-item:nth-child(1) .nav-link", key: "nav_home" },
    { sel: "#produk-dropdown-btn", key: "nav_produk", textOnly: true },
    { sel: ".nav-list .nav-item:nth-child(3) .nav-link", key: "nav_tentang" },
    { sel: ".nav-list .nav-item:nth-child(4) .nav-link", key: "nav_kontak" },

    /* Hero */
    { sel: ".hero-desc", key: "hero_desc", html: true },
    { sel: ".hero-actions .btn-primary", key: "hero_btn_produk" },
    { sel: ".hero-actions .btn-secondary", key: "hero_btn_tentang" },

    /* About Section */
    { sel: "#tentang-kami .section-subtitle", key: "about_subtitle" },
    { sel: "#tentang-kami .section-title", key: "about_title" },
    { sel: ".about-text-side h3", key: "about_heading" },
    { sel: ".about-text-side > p:nth-of-type(1)", key: "about_p1", html: true },
    {
      sel: ".about-text-side > p:nth-of-type(2)",
      key: "about_visi",
      html: true,
    },
    {
      sel: ".about-text-side > p:nth-of-type(3)",
      key: "about_misi",
      html: true,
    },
    { sel: ".about-text-side > h2", key: "about_recent" },

    /* Value items */
    {
      sel: ".value-item:nth-child(1) .value-content h4",
      key: "value_hadidi_title",
    },
    {
      sel: ".value-item:nth-child(1) .value-content p",
      key: "value_hadidi_desc",
    },
    {
      sel: ".value-item:nth-child(2) .value-content h4",
      key: "value_dufner_title",
    },
    {
      sel: ".value-item:nth-child(2) .value-content p",
      key: "value_dufner_desc",
    },

    /* Products Section */
    { sel: "#produk .section-subtitle", key: "produk_subtitle" },
    { sel: "#produk .section-title", key: "produk_title" },
    { sel: "#produk .section-desc", key: "produk_desc" },

    /* Product card descriptions */
    { sel: "#prod-suplemen .product-desc", key: "prod_surgical_desc" },
    { sel: "#prod-madu .product-desc", key: "prod_cranio_desc" },
    { sel: "#prod-teh .product-desc", key: "prod_implant_desc" },

    /* Detail buttons */
    { sel: ".btn-detail", key: "btn_detail", all: true },

    /* Quick view buttons */
    { sel: ".btn-overlay-peek", key: "btn_lihat", all: true, textOnly: true },

    /* Contact Section */
    { sel: "#kontak .section-subtitle", key: "kontak_subtitle" },
    { sel: "#kontak .section-title", key: "kontak_title" },
    { sel: "#kontak .section-desc", key: "kontak_desc" },
    { sel: ".contact-info-card > h3", key: "kontak_card_title" },
    { sel: ".contact-intro", key: "kontak_card_intro" },
    {
      sel: ".contact-method-item:nth-child(1) .method-text h4",
      key: "kontak_alamat",
    },
    {
      sel: ".contact-method-item:nth-child(2) .method-text h4",
      key: "kontak_telepon",
    },
    {
      sel: ".contact-method-item:nth-child(3) .method-text h4",
      key: "kontak_email",
    },
    { sel: ".btn-open-maps", key: "kontak_maps", textOnly: true },
    { sel: ".contact-map-inline h3", key: "kontak_lokasi" },

    /* Footer */
    { sel: ".footer-about-text", key: "footer_about" },
    { sel: ".footer-link-group:nth-child(1) h4", key: "footer_menu" },
    { sel: ".footer-link-group:nth-child(2) h4", key: "footer_produk_kami" },
    {
      sel: ".footer-link-group:nth-child(1) ul li:nth-child(1) a",
      key: "nav_home",
    },
    {
      sel: ".footer-link-group:nth-child(1) ul li:nth-child(2) a",
      key: "nav_tentang",
    },
    {
      sel: ".footer-link-group:nth-child(1) ul li:nth-child(3) a",
      key: "footer_produk_kami",
    },
    {
      sel: ".footer-link-group:nth-child(1) ul li:nth-child(4) a",
      key: "nav_kontak",
    },
    { sel: ".footer-bottom-container p:nth-child(1)", key: "footer_copyright" },
    { sel: ".footer-bottom-container p:nth-child(2)", key: "footer_designed" },

    /* Overlay static text */
    { sel: ".prod-overlay__features-title", key: "overlay_keunggulan" },
    { sel: ".prod-overlay__stock span:last-child", key: "overlay_stok" },
    {
      sel: ".prod-overlay__btn-main",
      key: "overlay_btn_halaman",
      textOnly: true,
    },
    {
      sel: ".prod-overlay__btn-contact",
      key: "overlay_btn_hubungi",
      textOnly: true,
    },
  ];

  /* ------------------------------------------------------------------
       State
    ------------------------------------------------------------------ */
  let currentLang = localStorage.getItem("pt_fitrah_lang") || "id";

  /* ------------------------------------------------------------------
       Apply translations to the page
    ------------------------------------------------------------------ */
  function applyTranslations(lang) {
    const dict = translations[lang];
    if (!dict) return;

    selectorMap.forEach(({ sel, key, html, all, textOnly }) => {
      const elements = all
        ? document.querySelectorAll(sel)
        : [document.querySelector(sel)];

      elements.forEach((el) => {
        if (!el) return;
        const text = dict[key];
        if (text === undefined) return;

        if (html) {
          el.innerHTML = text;
        } else if (textOnly) {
          /* Only update text nodes, preserve child elements (SVGs, icons) */
          const childNodes = Array.from(el.childNodes);
          let found = false;
          childNodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
              node.textContent = text;
              found = true;
            }
          });
          /* If no text node found, insert one */
          if (!found) {
            const tn = document.createTextNode(text);
            el.insertBefore(tn, el.firstChild);
          }
        } else {
          el.textContent = text;
        }
      });
    });

    /* Update HTML lang attribute */
    document.documentElement.lang = lang;

    /* Store the overlay translations for dynamic use */
    window.__overlayTranslations = overlayTranslations[lang];
  }

  /* ------------------------------------------------------------------
       Patch the overlay open function to use translated data
    ------------------------------------------------------------------ */
  const originalOpenOverlay = window.openProductOverlay;
  window.openProductOverlay = function (productKey) {
    originalOpenOverlay(productKey);

    /* Apply language-specific overlay content */
    const overlayLangData = overlayTranslations[currentLang];
    if (overlayLangData && overlayLangData[productKey]) {
      const data = overlayLangData[productKey];
      const descEl = document.getElementById("overlayDesc");
      const featuresEl = document.getElementById("overlayFeatures");
      const tagEl = document.getElementById("overlayTag");
      const catEl = document.getElementById("overlayCategory");

      if (descEl) descEl.textContent = data.desc;
      if (featuresEl) {
        featuresEl.innerHTML = "";
        data.features.forEach((f) => {
          const li = document.createElement("li");
          li.textContent = f;
          featuresEl.appendChild(li);
        });
      }

      /* Overlay tag & category */
      const tagKey = "overlay_tag_" + productKey;
      const catKey = "overlay_cat_" + productKey;
      const dict = translations[currentLang];
      if (tagEl && dict[tagKey]) tagEl.textContent = dict[tagKey];
      if (catEl && dict[catKey]) catEl.textContent = dict[catKey];

      /* Overlay buttons */
      const btnMain = document.querySelector(".prod-overlay__btn-main");
      const btnContact = document.querySelector(".prod-overlay__btn-contact");
      if (btnMain && dict.overlay_btn_halaman) {
        const tn = Array.from(btnMain.childNodes).find(
          (n) => n.nodeType === Node.TEXT_NODE,
        );
        if (tn) tn.textContent = " " + dict.overlay_btn_halaman;
      }
      if (btnContact && dict.overlay_btn_hubungi) {
        const tn = Array.from(btnContact.childNodes).find(
          (n) => n.nodeType === Node.TEXT_NODE,
        );
        if (tn) tn.textContent = " " + dict.overlay_btn_hubungi;
      }
    }
  };

  /* ------------------------------------------------------------------
       Switcher UI Logic
    ------------------------------------------------------------------ */
  const switcher = document.getElementById("lang-switcher");
  const langBtn = document.getElementById("lang-btn");
  const langLabel = document.getElementById("lang-label");
  const dropdown = document.getElementById("lang-dropdown");
  const options = dropdown.querySelectorAll(".lang-switcher__option");

  function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem("pt_fitrah_lang", lang);

    /* Update label */
    langLabel.textContent = lang.toUpperCase();

    /* Update active state */
    options.forEach((opt) => {
      opt.classList.toggle("active", opt.getAttribute("data-lang") === lang);
    });

    /* Apply translations */
    applyTranslations(lang);

    /* Close dropdown */
    switcher.classList.remove("open");
  }

  /* Toggle dropdown */
  langBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    switcher.classList.toggle("open");
  });

  /* Option click */
  options.forEach((opt) => {
    opt.addEventListener("click", (e) => {
      e.stopPropagation();
      const lang = opt.getAttribute("data-lang");
      setLanguage(lang);
    });
  });

  /* Close when clicking outside */
  document.addEventListener("click", (e) => {
    if (!switcher.contains(e.target)) {
      switcher.classList.remove("open");
    }
  });

  /* Close on Escape */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      switcher.classList.remove("open");
    }
  });

  /* ------------------------------------------------------------------
       Init: apply saved language on page load
    ------------------------------------------------------------------ */
  if (currentLang !== "id") {
    setLanguage(currentLang);
  }
})();
