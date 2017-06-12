const EMPTY_QUEUE = Symbol('EMPTY_QUEUE')

const groupBy = (getValue) => {
  let ended
  let queue = []
  let queueValue = EMPTY_QUEUE

  return (read) => {
    return (end, cb) => {
      // this means that the upstream is sending an error.
      if (end) {
        ended = end
        read(end, cb)
        return
      }

      // this means that we read an end before.
      if (ended) {
        cb(ended)
        return
      }

      const next = (end, data) => {
        ended = ended || end
        if (ended) {
          if (!queue.length) {
            cb(ended)
            return
          }

          let _queue = queue
          queue = []
          cb(null, _queue)
          return
        }

        const dataValue = getValue(data)

        // handle first value
        if (queueValue === EMPTY_QUEUE) {
          queue.push(data)
          queueValue = dataValue
          read(null, next)
          return
        }

        if (queueValue === dataValue) {
          queue.push(data)
          read(null, next)
          return
        }

        // if (dataValue !== queueValue)
        let _queue = queue
        queue = [data]
        queueValue = dataValue
        cb(null, _queue)
      }

      read(null, next)
    }
  }
}

export default groupBy
