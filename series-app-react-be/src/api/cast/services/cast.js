'use strict';

/**
 * cast service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::cast.cast');
