module.exports = {
    '/server/api.php*': {
        // target: "http://190.210.216.153/assets/server/api.php",
        target: 'http://localhost:80/backend/server/api.php',
        // target: "http://localhost:80/assets/server/api.php",
        secure: false,
        logLevel: 'debug',
        changeOrigin: true,

    },
    '/server/upload/upload.php*': {
        // target: "http://190.210.216.153/assets/server/api.php",
        target: 'http://localhost:80/Shimano/src/assets/server/upload/upload.php',
        // target: "http://localhost:80/assets/server/api.php",
        secure: false,
        logLevel: 'debug',
        changeOrigin: true,

    }
};
