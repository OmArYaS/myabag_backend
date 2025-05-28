// Middleware to add base URL to image paths
export const addBaseUrlToImage = (req, data) => {
  const baseUrl =
    process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;

  if (!data) return null;

  if (Array.isArray(data)) {
    return data.map((item) => {
      if (!item) return null;
      const obj = item.toObject ? item.toObject() : item;
      return {
        ...obj,
        image: obj.image ? `${baseUrl}${obj.image}` : null,
      };
    });
  }

  const obj = data.toObject ? data.toObject() : data;
  return {
    ...obj,
    image: obj.image ? `${baseUrl}${obj.image}` : null,
  };
};

// Middleware to handle response transformation
export const transformResponse = (req, res, next) => {
  const originalJson = res.json;

  res.json = function (data) {
    if (data && (data.data || Array.isArray(data))) {
      // Handle paginated response or array
      const transformedData = {
        ...data,
        data: addBaseUrlToImage(req, data.data),
      };
      return originalJson.call(this, transformedData);
    }

    // Handle single object response
    const transformedData = addBaseUrlToImage(req, data);
    return originalJson.call(this, transformedData);
  };

  next();
};
