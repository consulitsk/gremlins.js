import clickerByClass from './clickerByClass';

describe('clickerByClass', () => {
    it('should find and click an element with the specified class', (done) => {
        const targetElement = {
            getBoundingClientRect: () => ({
                top: 10,
                left: 10,
                width: 10,
                height: 10,
            }),
            dispatchEvent: jest.fn(),
        };

        const fakeWindow = {
            document: {
                querySelectorAll: jest.fn().mockReturnValue([targetElement]),
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

        const clickerByClassGremlin = clickerByClass({ log: true, className: 'test-class' })({
            logger,
            randomizer,
            window: fakeWindow,
        });

        clickerByClassGremlin();

        setTimeout(() => {
            expect(fakeWindow.document.querySelectorAll).toHaveBeenCalledWith(
                '.test-class'
            );
            expect(targetElement.dispatchEvent).toHaveBeenCalled();
            expect(logger.log).toHaveBeenCalledWith(
                'gremlin',
                'clickerByClass',
                'click',
                '.test-class',
                'at',
                15,
                15
            );
            done();
        }, 100);
    });

    it('should do nothing if className is not configured', () => {
        const logger = {
            log: jest.fn(),
        };

        const clickerByClassGremlin = clickerByClass({ log: true })({
            logger,
            randomizer: {},
            window: { document: { querySelectorAll: jest.fn() } },
        });

        clickerByClassGremlin();

        expect(logger.log).toHaveBeenCalledWith('gremlin', 'clickerByClass', 'skipped', 'className config not provided');
    });
});
