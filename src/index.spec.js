import test from 'ava'
import pull from 'pull-stream'

import groupBy from './index'

test('group by value', async (t) => {
  const input = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4]
  const expectedOutput = [[1], [2, 2], [3, 3, 3], [4, 4, 4, 4]]

  const actualOutput = await new Promise((resolve, reject) => {
    pull(
      pull.values(input),
      groupBy((x) => x),
      pull.collect((err, values) => {
        if (err != null) {
          reject(err)
        } else {
          resolve(values)
        }
      })
    )
  })

  t.deepEqual(actualOutput, expectedOutput)
})
