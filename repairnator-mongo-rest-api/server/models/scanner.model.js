/* eslint-disable no-trailing-spaces */
import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import moment from 'moment';
import APIError from '../helpers/APIError';


/**
 * Scanner Schema
 */
const ScannerSchema = new mongoose.Schema({
  hostname: String,
  dateBegin: Date,
  dateLimit: Date,
  totalRepoNumber: Number,
  totalScannedBuilds: Number,
  totalJavaBuilds: Number,
  totalJavaPassingBuilds: Number,
  totalJavaFailingBuilds: Number,
  totalJavaFailingBuildsWithFailingTests: Number,
  totalPRBuilds: Number,
  dayLimit: String,
  duration: String,
  runId: String,
  dateBeginStr: String,
  dateLimitStr: String
}, { collection: 'scanner' });

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */
ScannerSchema.method({
});

/**
 * Statics
 */
ScannerSchema.statics = {
  /**
   * Get inspector
   * @param {ObjectId} id - The objectId of user.
   * @returns {Promise<User, APIError>}
   */
  get(id) {
    return this.findById(id)
      .exec()
      .then((inspector) => {
        if (inspector) {
          return inspector;
        }
        const err = new APIError('No such scanner data exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  /**
   * List users in descending order of 'createdAt' timestamp.
   * @param {number} skip - Number of users to be skipped.
   * @param {number} limit - Limit number of users to be returned.
   * @returns {Promise<User[]>}
   */
  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ dateBegin: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  },

  getLastMonthData() {
    const ltDateIso = moment().toISOString();
    const gtDateIso = moment().subtract(1, 'months').toISOString();

    return this.find({
      dateBegin: {
        $gte: gtDateIso,
        $lt: ltDateIso
      },
      totalRepoNumber: {
        $gt: 1
      }
    }).sort({ dateLimit: 1 }).exec();
  },

  getLastWeeksData(nbWeeks) {
    const ltDateIso = moment().toISOString();
    const gtDateIso = moment().subtract(nbWeeks, 'weeks').toISOString();

    return this.find({
      dateBegin: {
        $gte: gtDateIso,
        $lt: ltDateIso
      },
      totalRepoNumber: {
        $gt: 1
      }
    }).sort({ dateLimit: 1 }).exec();
  }
};

mongoose.set('debug', true);
/**
 * @typedef Scanner
 */
export default mongoose.model('Scanner', ScannerSchema);
