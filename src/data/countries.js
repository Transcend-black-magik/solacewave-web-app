export const countriesData = [
    {
      name: "Nigeria",
      code: "NG",
      flag: "🇳🇬",
      featured: true
    },
    {
      name: "Canada",
      code: "CA",
      flag: "🇨🇦",
      featured: true
    },
    {
      name: "United States",
      code: "US",
      flag: "🇺🇸",
      featured: true
    },
    {
      name: "United Kingdom",
      code: "GB",
      flag: "🇬🇧",
      featured: true
    },
    {
      name: "South Africa",
      code: "ZA",
      flag: "🇿🇦",
      featured: true
    },
    {
      name: "Ghana",
      code: "GH",
      flag: "🇬🇭",
      featured: true
    },
    {
      name: "Kenya",
      code: "KE",
      flag: "🇰🇪",
      featured: true
    },
    {
      name: "Australia",
      code: "AU",
      flag: "🇦🇺",
      featured: true
    },
    {
      name: "Afghanistan",
      code: "AF",
      flag: "🇦🇫"
    },
    {
      name: "Albania",
      code: "AL",
      flag: "🇦🇱"
    },
    {
      name: "Algeria",
      code: "DZ",
      flag: "🇩🇿"
    },
    {
      name: "Andorra",
      code: "AD",
      flag: "🇦🇩"
    },
    {
      name: "Angola",
      code: "AO",
      flag: "🇦🇴"
    },
    // Add more countries as needed
    {
      name: "Zimbabwe",
      code: "ZW",
      flag: "🇿🇼"
    }
  ];
  
  // Helper function to get featured countries first
  export const getFeaturedCountries = () => {
    return countriesData.filter(country => country.featured);
  };
  
  // Helper function to get all countries alphabetically
  export const getAllCountries = () => {
    return countriesData.sort((a, b) => a.name.localeCompare(b.name));
  };
  
  export default countriesData;