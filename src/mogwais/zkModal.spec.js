import zkModal from './zkModal';

describe('zkModal', () => {
    it('should restrict actions to the modal window', () => {
        const modal = {
            getBoundingClientRect: () => ({
                top: 10,
                left: 10,
                width: 100,
                height: 100,
            }),
            querySelectorAll: jest.fn().mockReturnValue(['modal-element']),
        };

        const fakeWindow = {
            document: {
                querySelector: jest.fn().mockReturnValue(modal),
                elementFromPoint: jest.fn().mockReturnValue('inside-element'),
                querySelectorAll: jest.fn(),
            },
        };
        const originalElementFromPoint = fakeWindow.document.elementFromPoint;

        const zkModalMogwai = zkModal()({ window: fakeWindow });
        zkModalMogwai();

        // Test elementFromPoint restriction
        const outsideResult = fakeWindow.document.elementFromPoint(5, 5); // Outside
        expect(outsideResult).toBeNull();

        const insideResult = fakeWindow.document.elementFromPoint(50, 50); // Inside
        expect(originalElementFromPoint).toHaveBeenCalledWith(50, 50);
        expect(insideResult).toBe('inside-element');


        // Test querySelectorAll restriction
        const result = fakeWindow.document.querySelectorAll('.some-selector');
        expect(modal.querySelectorAll).toHaveBeenCalledWith('.some-selector');
        expect(result).toEqual(['modal-element']);

        // Test cleanup
        zkModalMogwai.cleanUp();
        fakeWindow.document.querySelectorAll('.another-selector');
        expect(fakeWindow.document.querySelectorAll).not.toHaveBeenCalledWith(modal);
    });

    it('should do nothing if no modal is found', () => {
        const fakeWindow = {
            document: {
                querySelector: jest.fn().mockReturnValue(null),
                elementFromPoint: jest.fn(),
                querySelectorAll: jest.fn(),
            },
        };

        const originalElementFromPoint = fakeWindow.document.elementFromPoint;
        const originalQuerySelectorAll = fakeWindow.document.querySelectorAll;

        const zkModalMogwai = zkModal()({ window: fakeWindow });
        zkModalMogwai();

        expect(fakeWindow.document.elementFromPoint).toBe(originalElementFromPoint);
        expect(fakeWindow.document.querySelectorAll).toBe(originalQuerySelectorAll);
    });
});
