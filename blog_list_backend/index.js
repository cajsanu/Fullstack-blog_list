const application = require('./app');
const config = require('./utils/config');
const logger = require('./utils/logger');

application.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
