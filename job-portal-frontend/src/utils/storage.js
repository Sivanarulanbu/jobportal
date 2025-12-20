export const saveToken = (tokenData) => {
  console.log("saveToken called with:", tokenData);
  
  if (tokenData.access) {
    localStorage.setItem("access", tokenData.access);
    console.log("✅ Access token saved");
  }
  
  if (tokenData.refresh) {
    localStorage.setItem("refresh", tokenData.refresh);
    console.log("✅ Refresh token saved");
  }
};

export const logoutUser = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  console.log("✅ Tokens cleared");
};

export const getAccessToken = () => {
  return localStorage.getItem("access");
};

export const getRefreshToken = () => {
  return localStorage.getItem("refresh");
};
