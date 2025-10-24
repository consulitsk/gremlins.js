import zkComboBox from './zkComboBox';

describe('zkComboBox', () => {
    it('should find and click a ZK combobox, then select an item', (done) => {
        const comboItem = {
            getBoundingClientRect: () => ({
                top: 20,
                left: 20,
                width: 20,
                height: 20,
            }),
            dispatchEvent: jest.fn(),
            textContent: 'Item 1',
        };

        const popup = {
            querySelectorAll: jest.fn().mockReturnValue([comboItem]),
        };

        const comboboxButton = {
            tagName: 'I',
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
                querySelectorAll: jest.fn().mockReturnValue([comboboxButton]),
                querySelector: jest.fn(),
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

        // Initially, the popup is not visible
        fakeWindow.document.querySelector.mockReturnValueOnce(null);
        // After the click, it becomes visible
        fakeWindow.document.querySelector.mockReturnValueOnce(popup);


        const randomizer = {
            pick: (arr) => arr[0],
        };

        const logger = {
            log: jest.fn(),
        };

        const zkComboBoxGremlin = zkComboBox({ log: true })({
            logger,
            randomizer,
            window: fakeWindow,
        });

        zkComboBoxGremlin();

        // Let the gremlin run and the poller find the popup
        setTimeout(() => {
            expect(fakeWindow.document.querySelectorAll).toHaveBeenCalledWith(
                '.z-combobox-button'
            );
            expect(comboboxButton.dispatchEvent).toHaveBeenCalled();
            expect(fakeWindow.document.querySelector).toHaveBeenCalledWith(
                '.z-combobox-popup:not(.z-combobox-popup-hidden)'
            );
            expect(popup.querySelectorAll).toHaveBeenCalledWith('.z-comboitem');
            expect(comboItem.dispatchEvent).toHaveBeenCalled();
            expect(logger.log).toHaveBeenCalledWith(
                'gremlin',
                'zkComboBox',
                'click',
                'at',
                15,
                15,
                'and item',
                'Item 1'
            );
            done();
        }, 500); // give enough time for the poller
    });
});
