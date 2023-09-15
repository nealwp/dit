import { backdate } from '../src/lib/dit'

describe('dit', () => {
    describe('backdate', () => {

        it('should error if no date is supplied', () => {
            expect(() => {
                const result = backdate("", "entry text")
            }).toThrowError()
        });

        it('should error if no entry text is supplied', () => {
            expect(() => {
                const result = backdate("1/1/1970", "")
            }).toThrowError()
        });

        it('should create a entry for given date',() => {
            
        });
    })
    it('should work', () => {
        expect(true).toBe(true)
    })
})
