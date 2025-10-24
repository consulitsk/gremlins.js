import zkListbox from './zkListbox';

describe('zkListbox', () => {
    it('should find and click a ZK listbox item', (done) => {
        const listitem = {
            tagName: 'TR',
            classList: { contains: () => true },
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
                querySelectorAll: jest.fn().mockReturnValue([listitem]),
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

        const zkListboxGremlin = zkListbox({ log: true })({
            logger,
            randomizer,
            window: fakeWindow,
        });

        zkListboxGremlin();

        setTimeout(() => {
            expect(fakeWindow.document.querySelectorAll).toHaveBeenCalledWith(
                '.z-listitem'
            );
            expect(listitem.dispatchEvent).toHaveBeenCalled();
            expect(logger.log).toHaveBeenCalledWith(
                'gremlin',
                'zkListbox',
                'click',
                'at',
                15,
                15
            );
            done();
        }, 100);
    });
});
