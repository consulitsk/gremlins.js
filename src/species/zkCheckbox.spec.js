import zkCheckbox from './zkCheckbox';

describe('zkCheckbox', () => {
    it('should find and click a ZK checkbox', (done) => {
        const checkboxInput = {
            dispatchEvent: jest.fn(),
        };

        const checkbox = {
            tagName: 'SPAN',
            classList: { contains: () => true },
            querySelector: jest.fn().mockReturnValue(checkboxInput),
            getBoundingClientRect: () => ({
                top: 10,
                left: 10,
                width: 10,
                height: 10,
            }),
        };

        const fakeWindow = {
            document: {
                querySelectorAll: jest.fn().mockReturnValue([checkbox]),
                createEvent: () => ({
                    initMouseEvent: jest.fn(),
                }),
                createElement: function() {
                    return {
                        style: {},
                    };
                },
                body: {
                    appendChild: function(element) {
                        return element;
                    },
                    removeChild: jest.fn(),
                },
            },
        };

        const randomizer = {
            pick: (arr) => arr[0],
        };

        const logger = {
            log: jest.fn(),
        };

        const zkCheckboxGremlin = zkCheckbox({ log: true })({
            logger,
            randomizer,
            window: fakeWindow,
        });

        zkCheckboxGremlin();

        setTimeout(() => {
            expect(fakeWindow.document.querySelectorAll).toHaveBeenCalledWith(
                '.z-checkbox'
            );
            expect(checkbox.querySelector).toHaveBeenCalledWith('input');
            expect(checkboxInput.dispatchEvent).toHaveBeenCalled();
            expect(logger.log).toHaveBeenCalledWith(
                'gremlin',
                'zkCheckbox',
                'click',
                'at',
                15,
                15
            );
            done();
        }, 100);
    });
});
