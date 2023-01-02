import serverConfig from "../configs/server.config.js";

export default {
  getVideoUrlById: async (id) => {
    return `${serverConfig.url}/storage/videos/${id}`;
  },
};
