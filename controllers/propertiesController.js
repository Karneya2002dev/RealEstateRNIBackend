export const getAllProperties = async (req, res) => {
  try {
    const response = await fetch(
      `${process.env.BLINDERSOE_BASE_URL}/projects`,
      {
        method: "GET",
        headers: {
          "X-Publishable-Key": process.env.BLINDERSOE_PUBLISHABLE_KEY,
          "X-Secret-Key": process.env.BLINDERSOE_SECRET_KEY,
          "Accept": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch properties");
    }

    const data = await response.json();

    const properties = (data.data || data)
      .map((p) => {
        const lat = Number(p.latitude);
        const lng = Number(p.longitude);

        // Skip invalid coordinates
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

        return {
          id: p.id,
          propertyType: p.name || p.property_type || "Property",
          owner: p.owner || "",
          developer: p.developer || "",
          city: p.city || "",
          state: p.state || "",
          locality: p.locality || "",
          lat,
          lng,
          image: p.cover_image || p.image || "",
          type: p.type || "buy",
          price: p.price || null,
        };
      })
      .filter(Boolean); // remove null entries

    res.json(properties);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to load properties" });
  }
};
