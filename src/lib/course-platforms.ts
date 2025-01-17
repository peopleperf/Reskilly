interface CourseInfo {
  baseUrl: string;
  defaultDuration?: string;
  defaultCost?: string;
}

export const coursePlatforms: Record<string, CourseInfo> = {
  "Coursera": {
    baseUrl: "https://www.coursera.org/courses",
    defaultDuration: "4-6 weeks",
    defaultCost: "$49/month"
  },
  "edX": {
    baseUrl: "https://www.edx.org/search",
    defaultDuration: "8-12 weeks",
    defaultCost: "$99-199"
  },
  "Udacity": {
    baseUrl: "https://www.udacity.com/courses/all",
    defaultDuration: "3-4 months",
    defaultCost: "$399/month"
  },
  "Udemy": {
    baseUrl: "https://www.udemy.com/courses",
    defaultDuration: "10-20 hours",
    defaultCost: "$11.99-129.99"
  },
  "LinkedIn Learning": {
    baseUrl: "https://www.linkedin.com/learning",
    defaultDuration: "2-3 hours",
    defaultCost: "$39.99/month"
  },
  "Scrum.org": {
    baseUrl: "https://www.scrum.org/courses",
    defaultDuration: "2 days",
    defaultCost: "$1,000-1,500"
  }
};

export function getCourseInfo(resourceName: string): {
  url: string;
  duration: string;
  cost: string;
  type: string;
} {
  // Default values
  let url = "";
  let duration = "";
  let cost = "";
  let type = "Course";

  // Extract platform name from the beginning of the resource name
  const platformName = Object.keys(coursePlatforms).find(platform => 
    resourceName.toLowerCase().startsWith(platform.toLowerCase())
  );

  if (platformName && coursePlatforms[platformName]) {
    const platform = coursePlatforms[platformName];
    url = platform.baseUrl;
    duration = platform.defaultDuration || "";
    cost = platform.defaultCost || "";
  }

  // Determine resource type
  if (resourceName.toLowerCase().includes("whitepaper")) {
    type = "Whitepaper";
  } else if (resourceName.toLowerCase().includes("workshop")) {
    type = "Workshop";
  } else if (resourceName.toLowerCase().includes("certification")) {
    type = "Certification";
  }

  return { url, duration, cost, type };
}
