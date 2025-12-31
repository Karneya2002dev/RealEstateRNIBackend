import axios from "axios";

// Full payload like your Postman request
const payload = {
  query: {
    current: 1,
    filters: [
      { field: "addressCity.facet", values: ["Chennai"], type: "any" }
    ],
    resultsPerPage: 20,
    searchTerm: "",
    sortDirection: "",
    sortField: "",
    sortList: []
  },
  options: {
    search_fields: {
      name: { weight: 1 },
      addressCity: { weight: 10 },
      addressArea: { weight: 15 }
    },
    result_fields: {
      url: { raw: {} },
      slug: { raw: {} },
      name: { raw: {} },
      nameWithArea: { raw: {} },
      addressArea: { raw: {} },
      addressPincode: { raw: {} },
      addressCity: { raw: {} },
      addressState: { raw: {} },
      developerName: { raw: {} },
      developerSlug: { raw: {} },
      brokerageSlug: { raw: {} },
      featuredImage: { raw: {} },
      zone: { raw: {} },
      type: { raw: {} },
      avlblStatus: { raw: {} },
      totalArea: { raw: {} },
      totalNoUnits: { raw: {} },
      launchDate: { raw: {} },
      completionDate: { raw: {} },
      isFeatured: { raw: {} },
      about: { raw: {} },
      ratePerSqft: { raw: {} },
      amenities: { raw: {} },
      vicinities: { raw: {} },
      "unitTypes.bedrooms": { raw: {} },
      "unitTypes.bathrooms": { raw: {} },
      "unitTypes.balconies": { raw: {} },
      "unitTypes.unitBuiltupArea": { raw: {} },
      "unitTypes.unitCarpetArea": { raw: {} },
      "unitTypes.rateTotal": { raw: {} }
    }
  }
};

axios.defaults.maxBodyLength = Infinity;
axios.defaults.maxContentLength = Infinity;

async function search() {
  try {
    const res = await axios.post(
      "https://www.redbriq.com/api/search",
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        withCredentials: true
      }
    );

    console.log("✅ SEARCH RESULT:", JSON.stringify(res.data, null, 2));
  } catch (err) {
    console.error("❌ SEARCH ERROR:", JSON.stringify(err.response?.data || err.message, null, 2));
  }
}

search();
