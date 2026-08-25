export const site = {
  name: "Vaishnavi Industries",
  tagline: "Hardware, perfected.",
  whatsapp: "918401284245",
  email: "vaishnaviind17@gmail.com",
  // First entry is the primary line - used wherever a single number is shown.
  phones: [
    { display: "+91 8401284245", tel: "+918401284245" },
    { display: "+91 6355439606", tel: "+916355439606" },
  ],
  address: {
    line1: "4, Patel Nagar, Sadbhavna Society",
    line2: "Street No. 1, Close Street, 80 Feet Road",
    city: "Rajkot",
    region: "Gujarat",
    country: "India",
    zip: "360002",
  },
  mapsEmbedSrc:
    "https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3691.9446908792283!2d70.81204267529193!3d22.280084879701167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMjLCsDE2JzQ4LjMiTiA3MMKwNDgnNTIuNiJF!5e0!3m2!1sen!2sin!4v1786890430807!5m2!1sen!2sin",
  socials: {
    instagram: "https://www.instagram.com/vishu_hardware/",
  },
  // `bio` is optional - the card omits the paragraph when it is empty.
  founders: [
    {
      name: "Dilip Hapaliya",
      role: "Founder & Managing Director",
      photo: "/founders/dilip-hapaliya.jpg",
      bio: "",
    },
    {
      name: "Umang Hapaliya",
      role: "Founder",
      photo: "/founders/umang-hapaliya.jpg",
      bio: "",
    },
  ],
  stats: [
    { value: 15, suffix: "+", label: "Years of experience" },
    { value: 250, suffix: "+", label: "Product models" },
    { value: 6, suffix: "+", label: "Countries shipped" },
    { value: 5, suffix: " Lakh+", label: "Units produced every year" },
  ],
} as const;
