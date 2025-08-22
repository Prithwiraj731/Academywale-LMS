/**
 * Comprehensive Logging and Debug System
 * Provides detailed logging for course lookup operations
 */

class CourseLogger {
  constructor() {
    this.logLevel = process.env.LOG_LEVEL || 'info';
    this.enableDebug = process.env.NODE_ENV === 'development' || process.env.ENABLE_DEBUG === 'true';
  }

  /**
   * Log course lookup attempt
   * @param {string} courseId - Course ID being searched
   * @param {string} strategy - Search strategy being used
   * @param {Object} details - Additional details
   */
  logLookupAttempt(courseId, strategy, details = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: 'LOOKUP_ATTEMPT',
      courseId,
      strategy,
      ...details
    };

    console.log(`🔍 [${strategy.toUpperCase()}] Searching for course: ${courseId}`, 
      this.enableDebug ? logEntry : '');
  }

  /**
   * Log successful course lookup
   * @param {string} courseId - Course ID that was found
   * @param {string} strategy - Successful strategy
   * @param {Object} course - Found course object
   * @param {number} duration - Search duration in ms
   */
  logLookupSuccess(courseId, strategy, course, duration) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: 'LOOKUP_SUCCESS',
      courseId,
      strategy,
      duration,
      foundCourse: {
        id: course._id,
        subject: course.subject,
        title: course.title,
        facultyName: course.facultyName
      }
    };

    console.log(`✅ [${strategy.toUpperCase()}] Found course: ${course.subject || course.title} (${duration}ms)`);
    
    if (this.enableDebug) {
      console.log('📋 Course details:', logEntry);
    }
  }

  /**
   * Log failed course lookup
   * @param {string} courseId - Course ID that was not found
   * @param {string} strategy - Failed strategy
   * @param {string} reason - Reason for failure
   * @param {number} duration - Search duration in ms
   */
  logLookupFailure(courseId, strategy, reason, duration) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: 'LOOKUP_FAILURE',
      courseId,
      strategy,
      reason,
      duration
    };

    console.log(`❌ [${strategy.toUpperCase()}] Failed: ${reason} (${duration}ms)`);
    
    if (this.enableDebug) {
      console.log('📋 Failure details:', logEntry);
    }
  }

  /**
   * Log database query performance
   * @param {string} queryType - Type of database query
   * @param {Object} queryParams - Query parameters
   * @param {number} duration - Query duration in ms
   * @param {number} resultCount - Number of results returned
   */
  logDatabaseQuery(queryType, queryParams, duration, resultCount) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: 'DATABASE_QUERY',
      queryType,
      queryParams,
      duration,
      resultCount
    };

    if (duration > 1000) { // Log slow queries
      console.warn(`🐌 [DB] Slow query detected: ${queryType} (${duration}ms, ${resultCount} results)`);
    } else if (this.enableDebug) {
      console.log(`🗄️ [DB] ${queryType}: ${duration}ms, ${resultCount} results`);
    }

    if (this.enableDebug) {
      console.log('📋 Query details:', logEntry);
    }
  }

  /**
   * Log course matching attempt
   * @param {Object} course - Course being matched
   * @param {Object} criteria - Matching criteria
   * @param {Object} result - Match result
   */
  logMatchAttempt(course, criteria, result) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: 'MATCH_ATTEMPT',
      course: {
        id: course._id,
        subject: course.subject,
        title: course.title,
        paperNumber: course.paperNumber,
        courseType: course.courseType
      },
      criteria,
      result: {
        matches: result.matches,
        score: result.score,
        reason: result.reason
      }
    };

    if (result.matches && result.score > 50) {
      console.log(`🎯 [MATCH] High score match: ${course.subject || course.title} (score: ${result.score})`);
    } else if (this.enableDebug && result.matches) {
      console.log(`🎯 [MATCH] Potential match: ${course.subject || course.title} (score: ${result.score})`);
    }

    if (this.enableDebug) {
      console.log('📋 Match details:', logEntry);
    }
  }

  /**
   * Log course ID parsing results
   * @param {string} courseId - Original course ID
   * @param {Object} parsedResult - Parsed ID components
   */
  logIdParsing(courseId, parsedResult) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: 'ID_PARSING',
      originalId: courseId,
      parsed: parsedResult
    };

    console.log(`🔧 [PARSE] Course ID parsed: ${courseId} → Paper: ${parsedResult.paperNumber || 'none'}, Type: ${parsedResult.courseType || 'none'}`);
    
    if (this.enableDebug) {
      console.log('📋 Parsing details:', logEntry);
    }
  }

  /**
   * Log overall lookup summary
   * @param {string} courseId - Course ID searched
   * @param {boolean} success - Whether lookup was successful
   * @param {Array} attempts - All search attempts
   * @param {number} totalDuration - Total search duration
   */
  logLookupSummary(courseId, success, attempts, totalDuration) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: 'LOOKUP_SUMMARY',
      courseId,
      success,
      totalDuration,
      strategiesAttempted: attempts.length,
      attempts: attempts.map(attempt => ({
        strategy: attempt.strategy,
        success: attempt.success,
        duration: attempt.duration,
        reason: attempt.reason
      }))
    };

    const status = success ? '✅ SUCCESS' : '❌ FAILED';
    const strategiesUsed = attempts.map(a => a.strategy).join(', ');
    
    console.log(`📊 [SUMMARY] ${status}: ${courseId} (${totalDuration}ms, strategies: ${strategiesUsed})`);
    
    if (this.enableDebug || !success) {
      console.log('📋 Summary details:', logEntry);
    }
  }

  /**
   * Log performance metrics
   * @param {Object} metrics - Performance metrics
   */
  logPerformanceMetrics(metrics) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: 'PERFORMANCE_METRICS',
      ...metrics
    };

    console.log(`📈 [PERF] Avg lookup time: ${metrics.avgLookupTime}ms, Success rate: ${metrics.successRate}%`);
    
    if (this.enableDebug) {
      console.log('📋 Performance details:', logEntry);
    }
  }

  /**
   * Log error with context
   * @param {Error} error - Error object
   * @param {Object} context - Additional context
   */
  logError(error, context = {}) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      type: 'ERROR',
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      context
    };

    console.error(`💥 [ERROR] ${error.message}`);
    
    if (this.enableDebug) {
      console.error('📋 Error details:', logEntry);
    }
  }

  /**
   * Create a performance timer
   * @param {string} operation - Operation name
   * @returns {Function} Timer function to call when operation completes
   */
  createTimer(operation) {
    const startTime = Date.now();
    
    return (success = true, details = {}) => {
      const duration = Date.now() - startTime;
      
      const logEntry = {
        timestamp: new Date().toISOString(),
        type: 'TIMER',
        operation,
        duration,
        success,
        ...details
      };

      if (duration > 5000) { // Log very slow operations
        console.warn(`⏰ [TIMER] Slow operation: ${operation} (${duration}ms)`);
      } else if (this.enableDebug) {
        console.log(`⏱️ [TIMER] ${operation}: ${duration}ms`);
      }

      if (this.enableDebug) {
        console.log('📋 Timer details:', logEntry);
      }

      return duration;
    };
  }

  /**
   * Log debug information
   * @param {string} message - Debug message
   * @param {Object} data - Additional data
   */
  debug(message, data = {}) {
    if (this.enableDebug) {
      console.log(`🐛 [DEBUG] ${message}`, data);
    }
  }

  /**
   * Log info message
   * @param {string} message - Info message
   * @param {Object} data - Additional data
   */
  info(message, data = {}) {
    console.log(`ℹ️ [INFO] ${message}`, data);
  }

  /**
   * Log warning message
   * @param {string} message - Warning message
   * @param {Object} data - Additional data
   */
  warn(message, data = {}) {
    console.warn(`⚠️ [WARN] ${message}`, data);
  }
}

// Create singleton instance
const courseLogger = new CourseLogger();

module.exports = courseLogger;