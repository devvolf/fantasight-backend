import serverConfig from "../configs/server.config.js";

export default {
  getImageUrlById: async (id) => {
    return `${serverConfig.url}/storage/images/${id}`;
  },
};
