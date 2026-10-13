import { describe, expect, it } from 'vitest'
import { toIsoStringWithUtcOffset } from '../../app/utils/to-iso-string-with-utc-offset'

describe('toIsoStringWithUtcOffset', () => {
  it('formats a date with an explicit UTC offset', () => {
    const date = new Date('2026-10-13T14:30:00.000Z')

    expect(toIsoStringWithUtcOffset(date)).toBe('2026-10-13T14:30:00.000+00:00')
  })

  it('throws for an invalid date', () => {
    expect(() => toIsoStringWithUtcOffset(new Date('invalid'))).toThrow(RangeError)
  })
})
