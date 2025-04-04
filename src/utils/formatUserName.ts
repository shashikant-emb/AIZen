export const formatUserName = (name: string | null | undefined): string => {
    if (!name) return ""; // Handle empty name
  
    const nameParts = name.trim().split(" ");
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase(); // Show first letter if only first name
    } else {
      return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() // Show First + Last Name
    }
  };

// export const formatUserInitials = (name: string | null | undefined): string => {
//     if (!name) return ""; // Handle empty name
  
//     return name
//     .split(" ")
//     .map((n) => n[0])
//     .join("")
//     .substring(0, 2)
//     .toUpperCase() // Show First + Last Name
//   };
  
  
  