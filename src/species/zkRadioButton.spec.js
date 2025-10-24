import zkRadioButton from './zkRadioButton';

describe('zkRadioButton', () => {
    it('should find and click a ZK radio button', (done) => {
        const radioInput = {
            dispatchEvent: jest.fn(),
        };

        const radio = {
            tagName: 'SPAN',
            classList: { contains: () => true },
            querySelector: jest.fn().mockReturnValue(radioInput),
            getBoundingClientRect: () => ({
                top: 10,
                left: 10,
                width: 10,
                height: 10,
            }),
        };

        const fakeWindow = {
            document: {
                querySelectorAll: jest.fn().mockReturnValue([radio]),
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

        const zkRadioButtonGremlin = zkRadioButton({ log: true })({
            logger,
            randomizer,
            window: fakeWindow,
        });

        zkRadioButtonGremlin();

        setTimeout(() => {
            expect(fakeWindow.document.querySelectorAll).toHaveBeenCalledWith(
                '.z-radio'
            );
            expect(radio.querySelector).toHaveBeenCalledWith('input');
            expect(radioInput.dispatchEvent).toHaveBeenCalled();
            expect(logger.log).toHaveBeenCalledWith(
                'gremlin',
                'zkRadioButton',
                'click',
                'at',
                15,
                15
            );
            done();
        }, 100);
    });
});
