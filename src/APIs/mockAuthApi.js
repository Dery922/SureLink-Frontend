export const mockLogin = (data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Fake validation
      if (!data.identifier || !data.password) {
        reject({ message: "Missing credentials" });
        return;
      }

      resolve({
        user: {
          id: "123",
          fullName: "Kofi Mensah",
          identifier: data.identifier,
          role: "consumer",
        },
      });
    }, 800); // simulate network delay
  });
};

export const mockRegister = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        user: {
          id: "456",
          fullName: data.fullName,
          identifier: data.identifier,
          role: "consumer",
        },
      });
    }, 800);
  });
};

export const mockLogout = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true }), 300);
  });
};

export const logoutUser = () => {
     
}
export const loginSuccess = () => {
     
}