const dev = process.env.NODE_ENV !== "production"
//                                 "development domain"      "production domain"
export const currentDomain = dev ? "http://localhost:3000" : "http://localhost:3000"