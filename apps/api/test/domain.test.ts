import {describe,it,expect} from 'vitest';
import {convert,quotaByWeek,assertQuota,csvCell,operatingHours} from '../src/domain.js';
describe('quantity and scheduling invariants',()=>{
 it('converts exact decimal compatible quantities',()=>{expect(convert('0.1','L','mL').toString()).toBe('100');expect(convert('0.123456','g','mg').toString()).toBe('123.456');});
 it('rejects mass-volume guesses and negative amounts',()=>{expect(()=>convert('1','g','mL')).toThrow();expect(()=>convert('-1','g','mg')).toThrow();});
 it('counts Bangkok unique dates across different machines only once',()=>{const b={startsAt:new Date('2026-10-26T02:00Z'),endsAt:new Date('2026-10-26T03:00Z')};expect([...quotaByWeek([b,b]).values()][0].size).toBe(1);});
 it('excludes midnight end date and splits weeks',()=>{const q=quotaByWeek([{startsAt:new Date('2026-11-01T15:00Z'),endsAt:new Date('2026-11-02T18:00Z')}]);expect([...q.values()].map(x=>x.size)).toEqual([1,2]);expect([...quotaByWeek([{startsAt:new Date('2026-10-26T16:00Z'),endsAt:new Date('2026-10-26T17:00Z')}]).values()][0].size).toBe(1);});
 it('rejects a fourth distinct day',()=>{expect(()=>assertQuota([{startsAt:new Date('2026-10-26T02:00Z'),endsAt:new Date('2026-10-29T03:00Z')}],3)).toThrow(expect.objectContaining({code:'QUOTA'}));});
 it('neutralizes CSV formulas and escapes quotes',()=>{expect(csvCell('=1+1')).toBe('"\'=1+1"');expect(csvCell('a"b')).toBe('"a""b"');});
 it('enforces configured Bangkok opening hours and closed weekends',()=>{expect(()=>operatingHours(new Date('2026-10-26T01:00Z'),new Date('2026-10-26T02:00Z'),{openHour:9,closeHour:17})).toThrow();expect(()=>operatingHours(new Date('2026-10-26T02:00Z'),new Date('2026-10-26T10:00Z'),{openHour:9,closeHour:17})).not.toThrow();expect(()=>operatingHours(new Date('2026-10-25T02:00Z'),new Date('2026-10-25T03:00Z'),{openDays:'WEEKDAYS'})).toThrow();});
});
